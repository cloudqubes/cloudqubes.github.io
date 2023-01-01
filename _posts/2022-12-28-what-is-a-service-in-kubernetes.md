---
layout: post
title:  "What is a Service in Kubernetes"
subtitle: > 
  Introduce the concept of Kubernetes Services with a hands-on tutorial.
date:   2022-12-28 11:00:00 +0530
categories: [devops, tutorial]
tags: [Kubernetes]
---

<div class="header-highlight">
A Kubernetes Service exposes an application running in Kubernetes to clients inside or outside the Kubernetes cluster.
</div>

Applications running in Kubernetes generally follow the microservices architectural pattern and are composed of lightweight services known as microservices.

![An ecommerce application that follows the microservices architectural pattern](/assets/images/ecommerce-microservices-app.png){: width="100%" }
*An ecommerce application that follows the microservices architectural pattern*

This e-commerce application consists of four microservices and an API Gateway which routes the client requests to individual microservices. The API Gateway also runs as a an application in the same Kubernetes cluster. To serve the requests from the clients, the API Gateway must talk to each of the microservices and the microservices must also talk to one other.

<div class="inline-highlight">
An application running in Kubernetes is a collection of Pods.
</div>

Running this application in Kubernetes, we create a Kubernetes Deployment for each microservice and define how many Pods should be created for each Deployment.

![Running the ecommerce application in a Kubernetes cluster](/assets/images/ecommerce-deployments.png){: width="100%" }
*Running the ecommerce application in a K8s cluster*

# Pod Networking

A Pod in a Kubernetes cluster gets a cluster-unique IP address. Since Kubernetes has a flat networking model, any Pod can communicate with any other Pod via this IP.

<div class="inline-highlight">
With multiple Pods in each microservice, how does any client know which IP to talk to?
</div>

A Pod is an ephemeral object in Kubernetes. Kubernetes continuously monitors Pods in the running applications, deletes unhealthy Pods and recreate new ones. Kubernetes also implements several mechanisms to increase or decrease the number of available Pods according to the load conditions. Therefore, even though a Pod has a unique IP address, the clients cannot track which IPs are alive at any moment.

<div class="inline-highlight">
Pods get added or deleted dynamically in running applications. How can clients track which Pods are alive at the moment?
</div>

# Use Kubernetes Services

A Kubernetes Service implements a single IP address for a collection of Pods. The clients of the microservices do not need to track the individual Pod IP addresses but can use the Service IP to talk to the microservices. Kubernetes takes care of distributing the incoming requests among the available Pods belonging to the Service. 

# Internal vs external clients

By default, Kubernetes will assign a cluster-internal IP address to a Service. Only the clients inside the cluster can use this IP to communicate with the Service.

To expose an application to the outside world, you must use a load balancer and create a special kind of a Service using that load balancer. In an on-premises Kubernetes cluster, you could use MetalLB as the load balancer. When using Kubernetes Services in a public cloud, you can use the cloud provider's load balancer service.

# Service discovery

A complex application may consist of hundreds of microservices so it is not practical to track the Services by IP Addresses. Kubernetes implements a service discovery mechanism via a cluster-aware DNS service which is provided as an add-on. 

When you create a new Kubernetes Service, Kubernetes also creates a DNS record that maps the Service name to its IP address. The clients can then use the Service name to access the service.

<div class="inline-highlight">
A Kubernetes Service allows clients to access any microservice via the Service name.
</div>

Now that we know the basics of Kubernetes Services, we are going to deploy an application in a Kubernetes cluster and crate Kubernetes Services to expose it to its clients.

# Prerequisites

We are going to use a MicroK8s as our Kubernetes cluster. 
You can install MicroK8s on a server, a VM, or even on your laptop computer by following the [installation guide](https://microk8s.io/docs/getting-started).

### Enable MicroK8s add-ons

Enable the DNS add-on.

```shell
$ microk8s enable dns
```

Enable MetalLB

```shell
$ microk8s enable metallb
```
You will be asked to input an IP address pool to be used by the load balancer. Since we are working within a single host machine, any private IP range that does not conflict with the host network interfaces will suffice.

### Install Docker

We need Docker to build the container images, so install Docker by following the [installation instructions](https://docs.docker.com/get-docker/) for your platform.

Instead of MicroK8s, you should be able to use a Kubernetes cluster in any public cloud. You do not need to enable DNS in the public cloud Kubernetes cluster as it will be enabled by default. 
The public cloud providers have also integrated their load balancer services with their Kubernetes services so you do not need to install MetalLB either. You must use the load balancer service from the cloud provider instead.						

# The Number-crunch application

Our application consists of a microservice - number-crunch which can calculate the square-root of a given number. The Number-crunch microservice is exposed to the outside world via an Nginx reverse proxy according to the best practices in the cloud-native domain. 

![The Number-crunch application](/assets/images/number-crunch.png){: width="100%" }
*The Number-crunch application*


We deploy 2 Pods for the number-crunch service and one Pod for the reverse proxy.

The reverse proxy is exposed to the clients outside of the K8s cluster via the load balancer. Internally, the reverse proxy uses a Kubernetes Service to communicate with the number-crunch service.

# Building the container images

Login to the machine where MicroK8s and Docker are installed.

### Build the number-crunch image and import to MicroK8s.

```shell
$ git clone https://github.com/cloudqubes/number-crunch.git
$ cd number-crunch
$ docker build . -t number-crunch:local
$ docker save number-crunch > number-crunch.tar
$ microk8s ctr image import number-crunch.tar
```
The last two commands will make the image locally available to the MicroK8s cluster. If on public cloud, you can upload the image to [Docker Hub] or the cloud provider’s registry service.

### Create the Number-crunch Deployment

Create `number-crunch-deployment.yml` with the definition for the Kubernetes Deployment
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
        image: number-crunch:local
        imagePullPolicy: Never # Remove this line if using Kubernetes in public cloud.
        ports:
        - containerPort: 8080
```

Note that we are using `imagePullPolicy: Never` since the image is locally available. Remove that line, if you intend to download the image from [Docker Hub] or other image registry.

Create the deployment.

```shell
$ microk8s kubectl apply -f number-crunch-deployment.yml 
```

Check the status of the Pods.
```shell
$ microk8s kubectl get pods -o wide
NAME                                 READY   STATUS    RESTARTS   AGE   IP             NODE   NOMINATED NODE   READINESS GATES
number-crunch-app-7b9d574b47-4j9tc   1/1     Running   0          54s   10.1.109.100   k8s2   <none>           <none>
number-crunch-app-7b9d574b47-smkp9   1/1     Running   0          54s   10.1.109.101   k8s2   <none>           <none>
```
We use the `-o wide` to print additional details such as the Pod IP address.


### Create the Number-crunch service.

Create `number-crunch-service.yml` with the definitions for the Kubernetes Service.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: number-crunch-service
spec:
  selector:
    app: number-crunch
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 8080
    targetPort: 8080
```

Create the Service.

```shell
$ microk8s kubectl apply -f number-crunch-service.yml 
service/number-crunch-service created
$ kubectl get services
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes              ClusterIP   10.152.183.1     <none>        443/TCP    9d
number-crunch-service   ClusterIP   10.152.183.187   <none>        8080/TCP   6s
```

Since we are creating the service in the `default` namespace the DNS name of this Service will be `number-crunch-service.default`. If you choose a different namespace you must substitute `default` with the name of that namespace when building the reverse proxy in the next step.

### Create the Nginx Reverse Proxy

Clone the git repo.
```shell
$ git clone https://github.com:cloudqubes/nginx-number-crunch.git
$ cd nginx-number-crunch
```

The `nginx.conf` file in the downloaded repository contains the configuration for the Nginx reverse proxy. 

```shell
server { 
 listen 8080;
 location / {
    proxy_pass http://number-crunch-service.default:8080;
 }
} 
```

Note that we are using the FQDN of the Kubernetes Service `number-crunch-service.default` as a parameter in the `proxy_pass` directive. 

The DNS name of the Kubernetes Service is created according to `service-name:namespace` format. If you use a namespace other than `default` change the value to `number-crunch-service.your-namespace`.

Build the Nginx image and import to MicroK8s.

```shell
$ docker build . -t nginx:local
$ docker save nginx > nginx.tar
$ microk8s ctr image import nginx.tar
```

The last two commads will not be required, if you are working in a Kubernetes cluster in a public cloud. Instead, upload the image to [Docker Hub] or another container registry.

Create the Nginx Deployment.

Create new file `number-crunch-nginx.yml` for creating a new Deployment for Nginx reverse proxy.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: number-crunch-nginx
spec:
  selector:
    matchLabels:
      app: number-crunch-nginx
  replicas: 1 
  template:
    metadata:
      labels:
        app: number-crunch-nginx
    spec:
      containers:
      - name: number-crunch-nginx
        image: nginx:local
        imagePullPolicy: Never
        ports:
        - containerPort: 8080
```

Create the Deployment and check the status.

```shell
$ kubectl apply -f number-crunch-nginx.yml

$ kubectl get deployment
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
number-crunch-app     2/2     2            2           114m
number-crunch-nginx   1/1     1            1           8s
```

### Create the reverse proxy service of type Load Balancer.

We are going to create a Service to expose the Nginx reverse proxy. This time we must set the `type: LoadBalancer` so that our service is exposed to the outside via the MetalLB load balancer.

Create the manifest file `number-crunch-nginx-service.yml`.

```yaml
Kubernetes manifest for the Service.
apiVersion: v1
kind: Service
metadata:
  name: number-crunch-service
spec:
  type: LoadBalancer
  selector:
    app: number-crunch-nginx
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 8080
    targetPort: 8080
```

Create the service.

```shell
$ kubectl apply -f number-crunch-nginx-service.yml 
```

Check the Load Balancer IP.

```shell
$ kubectl get services
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)          AGE
kubernetes              ClusterIP      10.152.183.1     <none>         443/TCP          9d
number-crunch-service   LoadBalancer   10.152.183.187   10.100.10.10   8080:31749/TCP   115m
```

Connect to the Number-crunch app from the host machine.
```shell
$ curl http://10.100.10.10:8080/square-root/4
```

Since we have been working in a single server with MicroK8s, we used a private IP address pool for the load balancer. So, our application is reachable only within a private network.

If our load balancer is exposed to the Internet we could have assigned a public IP address and make our service available from the Internet. However, exposing an application to the public Internet requires some more security considerations which we will discuss in an upcoming article.



[Docker Hub]: https://hub.docker.com/
