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
        name: this.podName,
        namespace: this.namespace,
        annotations: {},
        labels: {
          "k8s.kashall.dev/client": this.env.username,
        },
      },
      spec: {
        automountServiceAccountToken: false,
        dnsPolicy: "None",
        dnsConfig: {
          nameservers: ["1.1.1.1", "9.9.9.9", "8.8.8.8"],
        },
        containers: [
          {
            name: this.namespace,
            image:
              "ghcr.io/kashalls/prismarine-k8s-runner:main-d046213a-1684172042",
            env: this.env,
          },
        ],
      },
    }
  }

  create() {
    const pod = CoreApi.createNamespacedPod(this.namespace, this.manifest);
    console.log(pod)
    return pod
  }

  remove() {
    try {
      const pod = CoreApi.removeNamespacedPod(this.podName, this.namespace)
      return pod
    } catch (error) {
      console.log(error)
    }
  }
}
