import Manifest from "./Manifest.js";

export default class ServiceManifest extends Manifest {
  constructor(options = {}) {
    super(options)

    this.name = options.name;
    this.targetPort = options.targetPort ?? 8080
  }

  get manifest () {
    return {
      metadata: {
        name: this.name,
        namespace: this.namespace
      },
      spec: {
        selector: {
          'app.kubernetes.io/name': this.name
        },
        ports: [
          {
            protocol: 'TCP',
            port: 80,
            targetPort: this.targetPort
          }
        ]
      }
    }
  }

  async create () {
    return await this.coreApi.createNamespacedService(this.namespace, this.manifest)
  }

  async remove () {
    return await this.coreApi.deleteNamespacedService(this.name, this.namespace)
  }
}
