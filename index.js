import { WebSocketServer } from 'ws';
import pino from 'pino';
import fs from 'fs';

const logger = pino();
const server = new WebSocketServer({ port: 4000 });

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
      enter: [
        {
          id: '0',
          format: 'alloy',
          data: fs.readFileSync('./data/trace0.xml', 'utf-8')
        },
        {
          id: '1',
          format: 'alloy',
          data: fs.readFileSync('./data/trace1.xml', 'utf-8')
        },
        {
          id: '2',
          format: 'alloy',
          data: fs.readFileSync('./data/trace2.xml', 'utf-8')
        }
      ]
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