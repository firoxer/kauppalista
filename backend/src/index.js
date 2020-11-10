import WebSocket from 'ws';
import { apply } from "minimal-json-patch";
import { readdir, readFile, writeFile } from 'fs';
import { promisify } from 'util';

const readdirP = promisify(readdir);
const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);

const CONNECTION_TIMEOUT = 20000;
const PORT = process.env.PORT || 8080;
const DATA_PATH = 'data/';

function parseMessage(rawMessage) {
  let message;
  try {
    message = JSON.parse(rawMessage.toString());
  } catch (e) {
    throw new Error('invalid JSON');
  }

  if (!message.echo) {
    throw new Error('message lacks property "echo"');
  }
  if (typeof message.echo !== 'number' && typeof message.echo !== 'string') {
    throw new Error('message\'s "echo" property should be a string or a number');
  }

  if (!message.token) {
    throw new Error('message lacks property "token"');
  }
  if (typeof message.token !== 'string') {
    throw new Error('message\'s "token" property should be a string');
  }

  if (message.patch && !Array.isArray(message.patch)) {
    throw new Error('message\'s "patch" property should be an array');
  }

  if (message.doReplyWithData && typeof message.doReplyWithData !== 'boolean') {
    throw new Error('message\'s "doReplyWithData" property should be boolean');
  }

  return message;
}

async function readInitialData() {
  const dataByToken = new Map();

  const filenames = await readdirP(DATA_PATH);

  await Promise.all(filenames.map(async (filename) => {
    const data = await readFileP(DATA_PATH + filename, 'utf-8');

    const token = filename.replace(/\.json$/, '');

    dataByToken.set(token, JSON.parse(data));
  }));

  return dataByToken;
}

async function writeChangedData(token, data) {
  await writeFileP(DATA_PATH + token + '.json', JSON.stringify(data, null, 2));
}

async function main() {
  const dataByToken = await readInitialData();
  const lastRespondedAt = new Map();
  const socketsByToken = new Map();

  const server = new WebSocket.Server({ port: PORT });

  server.on('connection', (ws) => {
    lastRespondedAt.set(ws, new Date().valueOf());

    console.debug(`connections open: ${lastRespondedAt.size}`);

    ws.on('pong', () => {
      lastRespondedAt.set(ws, new Date().valueOf());
    });

    ws.on('message', (message) => {
      let echo, token, patch, doReplyWithData;
      try {
        ({ echo, token, patch, doReplyWithData } = parseMessage(message));

        let sockets = socketsByToken.get(token) || new Set([ws]);

        if (!sockets.has(ws)) {
          sockets.add(ws)
        }

        socketsByToken.set(token, sockets);

        if (patch) {
          const newData = apply(dataByToken.get(token) || {}, patch);
          dataByToken.set(token, newData);

          writeChangedData(token, newData);

          for (const socket of socketsByToken.get(token)) {
            if (socket === ws) {
              continue;
            }

            socket.send(JSON.stringify({ patch, status: 'success' }));
          }
        }

        const response = { echo, status: 'success' };

        if (doReplyWithData) {
          response.data = dataByToken.get(token);
        }

        ws.send(JSON.stringify(response));
      } catch (e) {
        ws.send(JSON.stringify({ echo, status: 'fail', reason: e.message }));
      }
    });

    ws.on('close', () => {
      lastRespondedAt.delete(ws);
      console.debug(`connections open: ${lastRespondedAt.size}`);
    });
  });

  setInterval(() => {
    const currentTime = new Date().valueOf();

    server.clients.forEach((ws) => {
      if (currentTime - CONNECTION_TIMEOUT > lastRespondedAt.get(ws)) {
        console.log(`killing ${ws._socket.remoteAddress}:${ws._socket.remotePort}`);

        ws.terminate();
        lastRespondedAt.delete(ws);

        console.debug(`connections open: ${lastRespondedAt.size}`);

        return;
      }

      lastRespondedAt.set(ws, false);
      ws.ping();
    });
  }, 1000);

  console.log(`server up at port ${PORT}`);
}

main();
