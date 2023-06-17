import { CoreApi } from './kubernetes.js'

export default class ClientPod {
  constructor(options) {
    if (!options) throw Error('ClientPod has no options.')
    if (!options.env) throw Error('ClientPod must have environment variables to pass.')

    this.namespace = options.namespace ?? 'prismarine-client'
    this.env = options.env

    this.podName = `${this.namespace}-${this.env.username}`
  }

  get manifest() {
    return {
      metadata: {
        generateName: 'client-',
        namespace: this.namespace.toLowerCase(),
        annotations: {},
        labels: {
          "k8s.kashall.dev/client": this.env.username.toLowerCase(),
        }
      },
      spec: {
        automountServiceAccountToken: false,
        containers: [
          {
            name: this.namespace,
            image:
              "docker pull ghcr.io/kashalls/prismarine-k8s-runner:main-ed9d0408-1687033039",
            env: this.env,
          },
        ],
      },
    }
  }

  async create() {
    const pod = await CoreApi.createNamespacedPod(this.namespace, this.manifest);
    console.log(pod)
    return pod
  }

  async remove() {
    try {
      const pod = await CoreApi.removeNamespacedPod(this.podName, this.namespace)
      return pod
    } catch (error) {
      console.log(error)
    }
  }
}
