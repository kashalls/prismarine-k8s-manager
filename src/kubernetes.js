import * as k8s from '@kubernetes/client-node'

export const config = new k8s.KubeConfig();
config.loadFromCluster()

export const Apps = config.makeApiClient(k8s.AppsV1Api);
export const CoreApi = config.makeApiClient(k8s.CoreV1Api);
export const Custom = config.makeApiClient(k8s.CustomObjectsApi);
export const Core = config.makeApiClient(k8s.CoreApi);

export const Watcher = new k8s.Watch(config);

