import Manifest from "./Manifest.js";

export default class IngressManifest extends Manifest {
  constructor(options = {}) {
    super(options)

    this.id = options.id;
    this.related = options.relatedPodId
  }

  static ingressName = `prismarine-client-ingress-${this.id}`
  static ingressHost = this.options.ingressHost ?? new Error('Ingress Host needs to be defined.');
  static serviceName = this.options.serviceName ?? `prismarine-client-service-${this.id}`;
  static servicePort = this.options.servicePort ?? 8080;

  get manifest() {
    return {
      apiVersions: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {
        name: this.ingressName,
        labels: {
          'client.kashalls.dev/ingress': this.id,
          'client.kashall.dev/belongs-to': this.related
        },
        annotations: {}
      },
      spec: {
        ingressClassName: 'nginx',
        rules: [
          {
            host: this.ingressHost,
            http: {
              paths: [
                {
                  path: `/${this.id}(/|$)(.*)`,
                  backend: {
                    serviceName: this.serviceName,
                    servicePort: this.servicePort
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }

  async create () {
    return await this.networkingApi.createNamespacedIngress(
      this.namespace,
      this.manifest
    )
  }

  async delete () {
    return await this.networkingApi.removeNamespacedIngress(
      this.ingressName,
      this.namespace
    )
  }

}
