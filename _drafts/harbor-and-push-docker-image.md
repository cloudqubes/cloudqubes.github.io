---
layout: post
title:  "How to set up a private container registry with Harbor"
description: > 
  Harbor is an open-source container registry. You can 
image: "harbor/harbor-cover.png"
date:   2023-07-30 05:50:00 +0530
categories: [hands-on]
tags: [DevOps]
---

Harbor can be deployed on either Kubernetes or Docker. 

We are going to use an Ubunut 18.04 VM for this project.

# #1 Install Docker and Docker Compose

```shell
sudo apt update
sudo apt install docker
sudo apt install docker-compose
```


# #3 configure SSL certificates

To enable HTTPS access to Harbor, we will use  a self-signed certificate.

Create the private key for the CA certificate.
```shell
openssl genrsa -out ca.key 4096
```

Create the CA certificate. Note that this is valid for 10 years.
If you contnue to use it in production, make sure to renew in 10 years from today.
```shell
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=US/ST=Delaware/L=Lewes/O=CloudQubes/OU=IT/CN=registry.cloudqubes.com" \
 -key ca.key \
 -out ca.crt
```

Next is to create the server certificates
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

Create certificate for Harbor host
```shell
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in registry.cloudqubes.com.csr \
    -out registry.cloudqubes.com.crt
```

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

# #4 Install Harbor

Download the installer.

Harbor provides two installation methods.
* Online installer downloads the Harbor container images from DockerHub during the installation. Our Docker cluster nedd to have Internet access for this to work.

* Offline installer bundles everything you need so we do not need to connect to Internet while installing.

Download the offline installer to our laptop from the [Harbor releases][harbor-releases] page and copy it to the VM.

Extract the installer.
```shell
tar xzvf harbor-offline-installer-v2.8.3.tgz 
```

Update the `harbor.yml`.
Switch to the extracted folder. Copy `harbor.yml.tmpl` to `harbor.yml` and update the `certificate` and `private_key` parameters under `https` directive. 

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

# Verify access to Harbor

Point your browser to `https://registry.cloudqubes.com` and you will get the Harbor portal. You will have to confirm the browsert to trust as this is a self-signed certificate. Get the password of `admin` user from `harbor_admin_password` directive in `harbor.yml` and login to the portal.

Add a new project.

In the portal home clikc on `New Project`.

Enter name `counter-app`, tick the checkbox `Public` and click OK to create the project.

In the home page clikc on the project page to access the project details.

There are no repositories yet, as we have not published any container image to this repository.

In the Harbor portal click on the project `number-crunch` we just created.
Clikc on the `PUSH COMMAND` link in the right side to get the Docker and Helm commands for this repository.


# Building Number-crunch app

Clone the repository number-crunch and build container images.
```shell
git clone git@github.com:cloudqubes/number-crunch.git
docker build -t registry.cloudqubes.com/number-crunch/number-crunch-app:1.0.0 .
```

Login to the Harbor registry
```shell
docker login -u admin registry.cloudqubes.com
```
Provide the password when prompted. If you haven't chaged the it would be the default admin password.

Push image to Harbor
```shell
sudo docker push registry.cloudqubes.com/number-crunch/number-crunch-app:1.0.0
```

# Pulling images from Harbor to Kubernetes

Create Kubernetes secret.
```shell
kubectl create secret docker-registry harbor-registry-secret --docker-server="https://harbor.example.com" --docker-username="admin" --docker-password="Harbor12345"
```

Create the Deploment manifest.
```yaml

```

[harbor-releases]: https://github.com/goharbor/harbor/releases


