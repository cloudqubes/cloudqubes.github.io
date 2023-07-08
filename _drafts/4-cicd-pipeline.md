



## Install Git server

### Install Git core

```shell
$ sudo apt-get install git-core
```

### Create user

```shell
$ sudo useradd git
$ sudo passwd git
```

Type in `git123` for the password.
Enable SSH key-based authentication for passwordless entry.


### Create a project directory

```shell
$ mkdir cloudqubes.git
```

### Install Jenkins

Install Java



Configure GPG key.

```shell
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee     /usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

Add Jenkin repos.
```shell
$  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Install Jenkins
```shell
$ sudo apt-get update
$ sudo apt-get install fontconfig openjdk-11-jre
$ sudo apt-get install jenkins
```

Run Jenkins
```shell
sysctl
```

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


Patch the argocd-server workload to expose the service
```shell
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```
