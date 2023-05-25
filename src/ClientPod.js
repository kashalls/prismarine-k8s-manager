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
        name: this.podName.toLowerCase(),
        namespace: this.namespace.toLowerCase(),
        annotations: {},
        labels: {
          "k8s.kashall.dev/client": this.env.username,
        },
      },
      spec: {
        automountServiceAccountToken: false,
        containers: [
          {
            name: this.namespace,
            image:
              "ghcr.io/kashalls/prismarine-k8s-runner:main-a719a149-1685054477",
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
