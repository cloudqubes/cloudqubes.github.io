



## Install Git server

### Install Git core

```shell
$ sudo apt-get install git-core
```

### Create user and enable SSH key authentication

```shell
sudo adduser git
```

Type in `git123` for the password.
This will create the `git` user and home directory `/home/git` for the user.

<!-- Switch to `git` user and change to home directory.
```shell
su git
cd 
```

Create `.ssh/authorized_keys` and limit read/write permission only to `git` user.

```shell
mkdir .ssh
chmod 700 .ssh
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
``` -->

Create an SSH key in the developer machine.
```shell
ssh-keygen -f .ssh/git_server
```

Copy the public key to git server
```shell
ssh-copy-id -i .ssh/git_server git@740-1-cicd
```

Create a directory for storing git repos on git server and give permission to `git user`
Execute from `ubuntu` user.
```shell
sudo mkdir /srv/git
sudo chown git /srv/git/
sudo chgrp git /srv/git
```

### Create a project directory and initialize an empty git repo

```shell
mkdir number-crunch.git
cd number-crunch.git
git init --bare
```
Note the parametet `--bare` which we use in the git server to create a repository.

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


