import 'dotenv/config'

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import uuid from "uuid";
import ClientPod from "./ClientPod.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import * as k8s from './kubernetes.js'

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

app.post('/create', (req, res) => {
  const pod = new ClientPod({ env: { username: 'Test' }})
  console.log(pod)
  return res.status(200).send('OK')
})

async function start() {
  await client.connect();

  server.listen(process.env.PORT || 8999, async () => {
    console.log(`Server started on port ${server.address().port} :)`);
  });
}

start()
