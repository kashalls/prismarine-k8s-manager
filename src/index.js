import Fastify from 'fastify'
import fwebsocket from '@fastify/websocket'

import uuid from 'uuid'
import k8s from '@kubernetes/client-node'

const runId = uuid.v4()

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const fastify = Fastify({ logger: true })
fastify.register(fwebsocket)

fastify.get('/socket', { websocket: true }, (conn, req) => {
  connection.socket.on('message', message => {
    // message.toString() === 'hi from client'
    connection.socket.send('hi from server')
  })
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
