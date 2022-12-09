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
    switch(data.type) {
      case 'data':
        logger.info('Received "data" request.');
        handleDataRequest(ws);
        break;
      case 'meta':
        logger.info('Received "meta" request.')
        handleMetaRequest(ws);
        break;
      case 'eval':
        logger.info('Received "eval" request.')
        handleEvalRequest(ws, data);
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
  logger.info('Sent "data" response');
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
      views: ['graph', 'table', 'script']
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