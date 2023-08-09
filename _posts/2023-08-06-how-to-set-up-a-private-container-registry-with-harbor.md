---
layout: post
title:  "How to set up a private container registry with Harbor"
description: >
  Harbor can store your container images inside your data center. It's secure and quick even for 10GB+ images.
image: "harbor/harbor-cover.png"
date:   2023-08-06 12:59:00 +0530
categories: [hands-on]
tags: [DevOps]
---

<div class="header-highlight">
A private container registry stores your container images within the premises of your data center. It's secure and quick even for 10GB+ images.
</div>

[Harbor] is an open-source registry for cloud-native platforms.

You can set up a fully-fledged private container registry with [Harbor]. 

A container registry is an essential part of your CI/CD pipeline. 

When deploying a Workload, the Kubernetes control plane schedules Pods into nodes in the cluster. Then, each node pulls the required container images from a container registry as specified by the Workload manifest. 

[DockerHub] is a well-known container registry available as a service via the Internet. While a container registry as-a-service is convenient, there are certain use cases for a private container registry.

## Why use a private container registry

* Security policies in some organizations mandate that container images must be stored within the boundaries of the organization. 

* Pulling large container images (10GB+) from the Internet could be time-consuming and inefficient.

* Allowing a production Kubernetes cluster to access a container registry on the Internet is a security threat.

A private container registry inside your data center is the best solution for these problems.

## Networking requirements for a private container registry

You can deploy a private container registry with Harbor in either an on-premise data center or a VPC in a public cloud.

To pull the container images, Harbor must be accessible via HTTPS to all nodes in your Kubernetes clusters. You may have to configure routing and firewall rules in your data center to allow access to Harbor from the nodes.

If a particular node cannot access Harbor, the Pods scheduled in that node will fail to start.

# What we are going to build

We are going to install Harbor on an Ubuntu 18.04 host. Then, we will build the [number-crunch] application on the development workstation, push the images to Harbor, and create a Kubernetes Deployment.

![Harbor registry and K8s cluster](/assets/images/harbor/harbor-setup.png){: width="100%" }
*Harbor registry and K8s cluster*

Harbor is a containerized application and can be installed either on Docker or Kubernetes. Let's use Docker for this setup.

To keep things simple we will not implement high availability here. But, you must definitely consider high availability in a production setup.

Here are the steps we have to go through.

1. Prerequisites
2. Create SSL certificates
3. Install Harbor
4. Create a project in Harbor
5. Push images to Harbor
6. Create Kubernetes Deployment

Let's get started.

# #1 Prerequisites

## Set up networking

Make sure all nodes in your Kubernetes cluster can reach the Harbor host via HTTPS by configuring routing and firewall rules.

## Install Docker

Install Docker and Docker Compose on Harbor host.

```shell
sudo apt update
sudo apt install docker
sudo apt install docker-compose
```

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on the Developer Workstation for building container images.

## Configure DNS

We use `registry.cloudqubes.com` as the FQDN of Harbor. The developer workstation as well as the Kubernetes nodes must resolve this FQDN to the IP address of the Harbor host.

So, configure `registry.cloudqubes.com` in your local DNS server.  

If you do not have a local DNS server, you can configure the `hosts` file in the developer workstation and in each node of the cluster to resolve `registry.cloudqubes.com` to the Harbor host IP address.

# #2 Create SSL certificates

We need an SSL certificate to enable HTTPS access to Harbor.

We can either get a signed certificate from a CA or create a self-signed certificate. Let's use a self-signed certificate for this setup.

We'll use `registry.cloudqubes.com` as the FQDN of our Harbor host.

You can create these certificates on any Linux host.

Create the private key for the CA certificate.
```shell
openssl genrsa -out ca.key 4096
```

Create the CA certificate - valid for 10 years.
If you continue to use this in production, make sure to renew it in 10 years from today.

```shell
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=US/ST=Delaware/L=Lewes/O=CloudQubes/OU=IT/CN=registry.cloudqubes.com" \
 -key ca.key \
 -out ca.crt
```

Create private key.
```shell
openssl genrsa -out registry.cloudqubes.com.key 4096
```

Create certificate signing request.
```shell
openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=registry.cloudqubes.com" \
    -key registry.cloudqubes.com.key \
    -out registry.cloudqubes.com.csr
```

Create X509 v3 extension file.
```shell
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=registry.cloudqubes.com
DNS.2=cloudqubes.com
DNS.3=registry
EOF
```

Create certificate for Harbor host.
```shell
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in registry.cloudqubes.com.csr \
    -out registry.cloudqubes.com.crt
```

## Copy the certificates to Harbor host

Copy the server certificate and key to the certificate folder in Harbor host.
```shell
sudo cp registry.cloudqubes.com.crt /data/cert/
sudo cp registry.cloudqubes.com.key /data/cert/
```

Convert `registry.cloudqubes.com.crt` to `.cert` file.

```shell
openssl x509 -inform PEM -in registry.cloudqubes.com.crt -out registry.cloudqubes.com.cert
```

Copy the certificate file to Docker certificates folder.
```shell
cp registry.cloudqubes.com.cert /etc/docker/certs.d/registry.cloudqubes.com/
cp registry.cloudqubes.com.key /etc/docker/certs.d/registry.cloudqubes.com/
cp ca.crt /etc/docker/certs.d/registry.cloudqubes.com/
```

Restart Docker.
```shell
sudo systemctl restart docker
```

## Copy the CA certificate to all Kubernetes nodes

Since we are using a self-signed certificate in Harbor we need to _tell_ each node in the Kubernetes cluster to trust it.
Copy the CA certificate `ca.crt` from the Harbor host to all nodes in the Kubernetes cluster.

Login to each node and run the following commands.

```shell
sudo cp ca.crt /usr/local/share/ca-certificates
sudo update-ca-certificates
sudo systemctl restart containerd.service
```

Remember to do the same for any new nodes you add to the cluster. If not, the Pods scheduled on the particular nodes will fail.

# #3 Install Harbor

Harbor has two installation methods.
* **Online installer** downloads the Harbor container images from [DockerHub] during the installation. The Harbor host must have Internet access for this to work.

* **Offline installer** bundles everything you need so we do not need to connect to the Internet while installing.

Download the offline installer to the development workstation from the [Harbor releases][harbor-releases] page and copy it to the Harbor host.

Extract the installer.
```shell
tar xzvf harbor-offline-installer-v2.8.3.tgz 
```
The installer will be extracted to `harbor` directory in the current path. 
Go in and create `harbor.yml` by making a copy of `harbor.yml.tmpl`.

```shell
cd harbor
cp harbor.yml.tmpl harbor.yml
```

The `harbor.yml` sets the initial parameters for the Harbor installation.

Let's update the `certificate` and `private_key` parameters to set the path to the certificate and key files we created.

```yaml
# https related config
https:
  # https port for harbor, default is 443
  port: 443
  # The path of cert and key files for nginx
  certificate: /etc/docker/certs.d/registry.cloudqubes.com/registry.cloudqubes.com.cert
  private_key: /etc/docker/certs.d/registry.cloudqubes.com/registry.cloudqubes.com.key

```
Run the installation script.

```shell
sudo ./install.sh 
```

Check the running containers.
```shell
sudo docker container ls
```

Make sure all containers are up and running.
```shell
CONTAINER ID   IMAGE                                COMMAND                  CREATED      STATUS                             PORTS                                                                            NAMES
1f54cb0ae6d2   goharbor/nginx-photon:v2.8.3         "nginx -g 'daemon of…"   4 days ago   Up 10 seconds (health: starting)   0.0.0.0:80->8080/tcp, :::80->8080/tcp, 0.0.0.0:443->8443/tcp, :::443->8443/tcp   nginx
fa40611eb108   goharbor/harbor-jobservice:v2.8.3    "/harbor/entrypoint.…"   4 days ago   Restarting (2) 48 seconds ago                                                                                       harbor-jobservice
f7bd16f4d374   goharbor/harbor-core:v2.8.3          "/harbor/entrypoint.…"   4 days ago   Up 33 seconds (healthy)                                                                                             harbor-core
bc44f1a8f744   goharbor/harbor-registryctl:v2.8.3   "/home/harbor/start.…"   4 days ago   Up 10 seconds (health: starting)                                                                                    registryctl
7657237ed9e7   goharbor/harbor-db:v2.8.3            "/docker-entrypoint.…"   4 days ago   Up 10 seconds (health: starting)                                                                                    harbor-db
f2e8f5b6a88f   goharbor/harbor-portal:v2.8.3        "nginx -g 'daemon of…"   4 days ago   Up 11 minutes (healthy)                                                                                             harbor-portal
3ce34722713b   goharbor/registry-photon:v2.8.3      "/home/harbor/entryp…"   4 days ago   Up 10 seconds (health: starting)                                                                                    registry
d0980474a980   goharbor/redis-photon:v2.8.3         "redis-server /etc/r…"   4 days ago   Up 11 minutes (healthy)                                                                                             redis
303bd115d130   goharbor/harbor-log:v2.8.3           "/bin/sh -c /usr/loc…"   4 days ago   Up 11 minutes (healthy)            127.0.0.1:1514->10514/tcp                                                        harbor-log
ubuntu@k8s1:~/harbor$ history
```

If you happen to restart Docker Service for some reason, all the containers belonging to Harbor may not start. In such situations go to the installation directory and use `docker-compose` to start the containers again.

```shell
sudo docker-compose up -d
```

## Login to Harbor web UI

Configure the `hosts` file in the development workstation to resolve `registry.cloudqubes.com` to the IP address of the Harbor host and go to `https://registry.cloudqubes.com` to log in to the Harbor UI.

Harbor creates an `admin` account at the installation with the password set in the `harbor_admin_password` directive in `harbor.yml`. Login to Harbor UI with this password.

# #4 Create a project in Harbor

On the Harbor web UI home page, click on `New Project`.

Enter the name `number-crunch`, tick the checkbox `Public`, and click `OK` to create the project.

![Harbor Web UI - Project list](/assets/images/harbor/harbor-webui-projects.png){: width="100%" }
*Harbor Web UI - Project list*

Click on the project name `number-crunch` to access the project details.

![number-crunch repositories](/assets/images/harbor/harbor-web-ui-counter-app-repos.png){: width="100%" }
*number-crunch repositories*

There are no repositories, as we have not yet published any container images to this project.

# #5 Push images to Harbor

In the developer workstation, clone the repository [number-crunch] and build container images.
```shell
git clone git@github.com:cloudqubes/number-crunch.git
docker build -t registry.cloudqubes.com/number-crunch/number-crunch-app:1.0.0 .
```

Our image name is starting with `registry.cloudqubes.com`. This is the FQDN of the Harbor host. This name is required for Kubernetes to locate the container registry.

Login to Harbor container registry from Docker CLI in the developer workstation.
```shell
sudo docker login -u admin registry.cloudqubes.com
```
When prompted, type in the password of the Harbor `admin` user. Since we have not changed it, the password is the same as we used to login to the Harbor UI.

Push the image to Harbor.
```shell
sudo docker push registry.cloudqubes.com/number-crunch/number-crunch-app:1.0.0
```

# #6 Create Kubernetes Deployment

Create a Kubernetes secret to store Harbor login information.

```shell
kubectl create secret docker-registry harbor-registry-secret --docker-server="https://registry.cloudqubes.com" --docker-username="admin" --docker-password="Harbor12345"
```

Create the manifest `number-crunch.yml`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: number-crunch-app
spec:
  selector:
    matchLabels:
      app: number-crunch
  replicas: 2 
  template:
    metadata:
      labels:
        app: number-crunch
    spec:
      containers:
      - name: number-crunch
        image: registry.cloudqubes.com/number-crunch/number-crunch-app:1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
      imagePullSecrets:
      - name: harbor-registry

```

Note the image name starting with `registry.cloudqubes.com` which is the FQDN of our container registry.

Use `kubectl` to create the Deployment.
```shell
kubectl apply -f number-crunch.yml
```

Check whether all Pods are running.
```shell
kubectl get pods
```

```shell
NAME                                READY   STATUS    RESTARTS       AGE
number-crunch-app-5dc7b48bb-4pw7r   1/1     Running   0              118m
number-crunch-app-5dc7b48bb-85xql   1/1     Running   0              118m
```

If any node cannot pull images from Harbor, the Pods scheduled on that node will fail to start. You can use `kubectl describe pod` to check the reason for failure.

```shell
kubectl describe pod <pod-name>
```

If any Pod fails to start, one of these are likely to be the reason.

* No IP network connectivity from the node to Harbor host.

* The node fails to resolve the Harbor DNS name to IP address.

* A firewall is blocking HTTPS port from the node to Harbor host.

* SSL certificates are not properly configured either on Harbor host or the node.

Troubleshooting along these points will lead you to a solution.

Harbor shows you the number of pulls for each image. This is also useful to ascertain whether Kubernetes can successfully pull images from this registry.

![Number of pulls for a repository in Harbor project](/assets/images/harbor/harbor-image-pulls.png){: width="100%" }
*Number of Pulls*

## Wrapping up

If you have [a good reason](#why-use-a-private-container-registry) for a private container registry, [Harbor] is definitely for you. 

It's a [CNCF graduated](https://www.cncf.io/projects/harbor/), open-source project. It's easy to get started and includes all the features for a [secure private registry](https://goharbor.io/docs/2.8.0/administration/).

So, give it a try in your VPC or data center. 

And let me know if something goes wrong while you are setting up Harbor.

Post your problem in comments here or reach me via Twitter [@cloudqubes] for any help.

[DockerHub]: https://hub.docker.com/
[harbor-releases]: https://github.com/goharbor/harbor/releases
[gcp-vpc]: https://cloud.google.com/vpc
[number-crunch]: https://github.com/cloudqubes/number-crunch
[Harbor]: https://goharbor.io/
[@cloudqubes]: https://twitter.com/cloudqubes

*[VPC]: Virtual Private Cloud

