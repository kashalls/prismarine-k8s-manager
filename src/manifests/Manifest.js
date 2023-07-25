import { CoreApi, NetworkingApi } from "../kubernetes.js";

export default class Manifest {
  constructor(options = {}) {
    this.options = {}
    this.namespace = options.namespace ?? 'prismarine-client'
  }

  get coreApi () {
    return CoreApi;
  }

  get networkingApi () {
    return NetworkingApi;
  }

  get manifest() {
    throw new Error('Manifest has not been implemented')
  }

  async create () {
    throw new Error('Create function has not been implemented.')
  }
}
