import { WebSocketServer } from 'ws';
import pino from 'pino';
import mockIndex, {validateMockIndex} from './mocks.js';

const logger = pino();
const server = new WebSocketServer({ port: 4000 });

validateMockIndex();

function parseMessage (ws, message) {
  if (message === 'ping') {
    ws.send('pong');
  } else {
    const data = JSON.parse(message);
    logger.info(`Received ${data.type} message from Sterling. request: ${JSON.stringify(data)}.`);
    switch(data.type) {
      case 'data':
        handleDataRequest(ws);
        break;
      case 'meta':
        handleMetaRequest(ws);
        break;
      case 'eval':
        handleEvalRequest(ws, data);
        break;
      case 'click':
        handleClickRequest(ws);
        break;
    }
  }
}

function handleDataRequest (ws) {
  const response = {
    type: 'data',
    version: 1,
    payload: {
      enter: mockIndex
    }
  };
  ws.send(JSON.stringify(response));
  logger.info('Sent initial "data" response');
}

function handleClickRequest (ws) {
  const response = {
    type: 'data',
    version: 1,
    payload: {
      enter: []
    }
  };
  ws.send(JSON.stringify(response));
  logger.info('Sent "click" response');
}


function handleEvalRequest(ws, request) {
  const response = {
    "type": "eval",
    "version": 1,
    "payload": {
      "id": request.payload.id,
      "result": "{}"
    }
  }
  ws.send(JSON.stringify(response));
  logger.info('Sent "eval" response.')
}

function handleMetaRequest (ws) {
  const response = {
    type: 'meta',
    version: 1,
    payload: {
      name: "Alloy [mock]",
      // The evaluator is present, but still must be enabled on a per-datum basis
      evaluator: true,
      views: ['graph', 'table', 'script'],
      // Two additional data elements have an empty generator name, to check robustness. 
      generators: ['traces', 'ttt_game', 'schedule', 'subduction', 'LTLf']
    }
  }
  ws.send(JSON.stringify(response));
  logger.info('Sent "meta" response.')
}

server.on('connection', (ws) => {
  logger.info('Connected.')
  ws.on('message', data => parseMessage(ws, `${data}`));
});

server.on('close', () => {
  logger.info('Disconnected.')
});