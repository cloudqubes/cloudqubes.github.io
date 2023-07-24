



## Install Git server




## Install ArgoCD

```yaml
$ kubectl create namespace argocd
$ kubectl apply -n argocd -f argocd.yml
```


Configure TLS
Create certificates
```shell
$ openssl req -new -x509 -nodes -out cert.pem -keyout key.pem -days 365
```

Create secret for argocd-server
```shell
$ kubectl create -n argocd secret tls argocd-server-tls --cert=./ssl/cert.pem --key=./ssl/key.pem
```

Create secret for argocd-repo-server
```shell
$ kubectl create -n argocd secret tls argocd-repo-server-tls --cert=./ssl/cert.pem --key=./ssl/key.pem
```

Create secret for argocd-dex-server
```yaml
$ kubectl create -n argocd secret tls argocd-dex-server-tls --cert=./ssl/cert.pem --key=./ssl/key.pem

```

Since argocd-sex-server cannot automarically pick the screte, restart the pod.

```shell
kubectl delete pod argocd-dex-server-74968b5fdc-lc8k6 -n argocd
```

### Install ArgoCD client

```shell
curl -s SL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```
@todo: client is giving error segmentation fault

### Login to ArgoCD UI

Patch the argocd-server workload to expose the service
```shell
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```
Get the argocd initial admin password. It is stored in Kubernetes secret `argocd-initial-admin-secret` base64 encoded.
```shell
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d
```

Login to the ArgoCD UI from the node running MicroK8s. in a production cluster you would get a public IP address to access the ArgoCD UI.


