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

function handleMetaRequest (ws) {
  const response = {
    type: 'meta',
    version: 1,
    payload: {
      name: "Alloy [mock]",
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