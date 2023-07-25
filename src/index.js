import 'dotenv/config'

import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io'
import helmet from 'helmet'

import ClientPod from "./ClientPod.js";
import mongodb from './mongodb.js';
import jwtCheck from './Authentication.js';
import PodManifest from './manifests/Pod.js';

// enforce on all endpoints
// app.use(jwtCheck);

const app = express();
const server = http.createServer(app);
const wss = new SocketServer(server, { path: '/' })

app.use(helmet())
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

app.all('/health', (req, res) => {
  return res.status(200).send('OK')
})

app.post('/create', async (req, res) => {
  console.log(req.body)
  try {
    const pod = new PodManifest(req.body)
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
