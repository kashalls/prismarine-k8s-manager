import 'dotenv/config'

import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import ClientPod from "./ClientPod.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import mongodb from './mongodb.js';

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

wss.on('connection', (ws) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {

    //log the received message and send it back to the client
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
});

app.get('/health', (req, res) => {
  return res.status(200).send('OK')
})

app.post('/create', async (req, res) => {
  try {
    const pod = new ClientPod({ username: 'test', host: '10.0.0.10', auth: 'offline' })
    const thing = await pod.create()
    console.log(thing)
    return res.status(200).send('OK')
  } catch (err) {
    console.log(err)
    return res.status(200).send('OK')
  }
})

async function start() {
  console.log('Starting up...')
  await mongodb.connect();
  console.log('Connected to mongodb...')

  server.listen(process.env.PORT || 8999, async () => {
    console.log(`Server started on port ${server.address().port} :)`);
  });
}

start()
