import crypto from 'crypto'
import uuid from 'uuid'
import Manifest from "./Manifest.js";

export default class PodManifest extends Manifest {
  constructor(options = {}) {
    super(options)

    this.image = options.image ?? process.env.RUNNER_IMAGE ?? 'ghcr.io/kashalls/prismarine-k8s-runner:v1'
  }

  static id = crypto.randomBytes(4).toString('hex')
  static name = `prismarine-client-${this.id}`

  get manifest () {
    return {
      metadata: {
        name: this.name,
        namespace: this.namespace,
        labels: {
          'k8s.kashall.dev/client': this.id
        }
      },
      spec: {
        automountServiceAccountToken: false,
        containers: [
          {
            name: this.namespace,
            image: this.image,
            env: [
              {
                name: 'MINEFLAYER_CONFIG',
                value: JSON.stringify(this.options)
              },
              {
                name: 'CONTROLLER_HOST',
                value: process.env.PRISMARINE_CONTROLLER_SERVICE_HOST
              },
              {
                name: 'CONTROLLER_PORT',
                value: process.env.PRISMARINE_CONTROLLER_SERVICE_PORT
              },
              {
                name: 'SHARED_KEY',
                value: uuid.v4()
              },
              {
                name: 'MONGO_CONNECTION_STRING',
                value: process.env.MONGO_CONNECTION_STRING
              }
            ]
          },
        ]
      }
    }
  }

  async create() {
    return await this.coreApi.createNamespacedPod(this.namespace, this.manifest)
  }

  async remove() {
    return await this.coreApi.removeNamespacedPod(this.name, this.namespace)
  }
}
