import Fastify from "fastify";
import fwebsocket from "@fastify/websocket";

import uuid from "uuid";
import K8S from "./kubernetes.js";
import ClientPod from "./ClientPod.js";
import Prisma from "./Prisma.js";

const defaultManagerNamespace = "prismarine-controller";
const defaultClientNamespace = "prismarine-client";

const runId = uuid.v4();
const fastify = Fastify({ logger: true });
fastify.register(fwebsocket);

fastify.get("/socket", { websocket: true }, (conn, req) => {
  connection.socket.on("message", (message) => {
    // message.toString() === 'hi from client'
    connection.socket.send("hi from server");
  });
});

// https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.get("/create", async (request, reply) => {

  const apples = Prisma.user.findOne(request.body.user)
  console.log(apples)

});

const start = async () => {
  try {
    await initialize();
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start()

async function initialize() {
  try {
    const result = await K8S.CoreApi.listNamespacedNetworkPolicy(defaultClientNamespace);
    console.log(result);

    const NPResult = await K8S.CoreApi.createNamespacedNetworkPolicy(defaultClientNamespace,
      {
        metadata: {
          name: "default",
          namespace: defaultClientNamespace,
        },
        spec: {
          podSelector: {},
          egress: [
            {
              to: [
                {
                  podSelector: {
                    matchLabels: ["k8s.kashall.dev/controller=true"],
                  },
                },
                {
                  ipBlock: {
                    cidr: "0.0.0.0/0",
                    except: ["10.0.0.0/8"],
                  },
                },
              ],
            },
          ],
          ingress: [
            {
              from: [
                {
                  podSelector: {},
                },
                {
                  ipBlock: {
                    cidr: "0.0.0.0/0",
                  },
                },
              ],
            },
          ],
          policyTypes: ["Ingress", "Egress"],
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
