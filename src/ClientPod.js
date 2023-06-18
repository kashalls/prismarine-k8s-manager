import { CoreApi } from './kubernetes.js'

export default class ClientPod {
  constructor(options) {
    if (!options) throw Error('ClientPod has no options.')
    this.options = options

    this.namespace = 'prismarine-client'
  }

  get manifest() {
    return {
      metadata: {
        generateName: 'pc-',
        namespace: this.namespace.toLowerCase(),
        annotations: {},
        labels: {
          "k8s.kashall.dev/client": this.options.username.toLowerCase(),
        }
      },
      spec: {
        automountServiceAccountToken: false,
        containers: [
          {
            name: this.namespace,
            image: "ghcr.io/kashalls/prismarine-k8s-runner:main-3c551441-1687064536",
            env: [
              {
                name: 'MINEFLAYER_CONFIG',
                value: JSON.stringify(this.options)
              }
            ]
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
