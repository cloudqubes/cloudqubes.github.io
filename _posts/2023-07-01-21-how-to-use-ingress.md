---
layout: post
title:  "How to use Kubernetes ingress for routing HTTP traffic"
description: > 
  Ingress is the preferred way of exposing HTTP applications in Kubernetes. It can manipulate HTTP requests and route traffic to multiple applications inside the cluster.
image: "k8s-ingress-cover.png"
date:   2023-07-21 07:10:00 +0530
categories: [hands-on]
tags: [Kubernetes]
---

<div class="header-highlight">
Ingress is the preferred way of exposing HTTP applications in Kubernetes. It can manipulate HTTP requests and route traffic to multiple applications inside the cluster.
</div>

[Kubernetes ingress] is a mechanism for exposing applications running inside a Kubernetes cluster via HTTP or HTTPS.

![Kubernetes ingress - simplified](/assets/images/k8s-ingress-simplified.png){: width="100%" }
*Kubernetes ingress - simplified*

This is a simple representation of Kubernetes ingress. To learn how ingress works, you can read up on [Kubenetes ingress vs ingress controller]({% post_url 2023-07-09-ingress-vs-ingress-controller %}).


[NodePort] or [LoadBalancer] Services also can expose an application running inside a cluster. But, both [NodePort] and [LoadBalancer] Services work in layer-3 in the OSI model.

Ingress works with HTTP protocol in layer-7 so offers more flexibility for HTTP-based applications. Also, ingress does not have some of the limitations in [NodePort] or [LoadBalancer] Services. 

So, ingress should be your preferred way for exposing HTTP applications inside a Kubernetes cluster to external clients.

An ingress defines a set of rules for routing HTTP traffic. You can use these rules to manipulate HTTP requests. 

Let's check out three such usecases of ingress rules for handling HTTP traffic.


# Kubernetes cluster setup

We are using [MicroK8s] from Canonical as our Kubernetes platform for this demonstration.

[MicroK8s] includes [Ingress NGINX Controller] as an add-on. Since [Ingress NGINX controller] is deployed inside the cluster, we need to place a load balancer in front of the ingress controller. So we'll use [MetalLB] load balancer which also comes as an add-on in [MicroK8s].

![Microk8s cluster](/assets/images/k8s-ingress-microk8s.png){: width="100%" }
*MicroK8s cluster*

Since this MicroK8s cluster is installed in a single virtual machine, our application will be accessible only via localhost (127.0.0.1). But in a production Kubernetes cluster the application will be avialble from one of the public IPs in the load balancer.

Let's enable both add-ons in the cluster.

```yaml
microk8s enable ingress
microk8s enable metallb
```

Check the status of Ingress NGINX Controller.
```shell
kubectl get pods -n ingress
```

```shell
NAME                                      READY   STATUS    RESTARTS   AGE
nginx-ingress-microk8s-controller-8672t   1/1     Running   0          2m10s
```

Check the status of MetalLB
```shell
kubectl get pods -n metallb-system
```

```shell
NAME                         READY   STATUS    RESTARTS      AGE
speaker-xfbbt                1/1     Running   6 (72d ago)   14m
controller-9556c586f-g9r7w   1/1     Running   3 (72d ago)   14m
```

If all Pods are in `Running ` status, you can proceed to the next step.


# The number-crunch application

We will use [number-crunch](https://github.com/cloudqubes/number-crunch) application for this ingress use cases demonstration. 

The `number-crunch` is a simple HTTP server with two API endpoints that calculate the square root and the cube root of a number.

![number-crunch application](/assets/images/k8s-ingress-number-crunch-app-only.png){: width="80%" }
*number-crunch application*

## Creating the Deployment

We will deploy `number-crunch` with two replicas in our MicroK8s cluster.

![number-crunch application deployment](/assets/images/k8s-ingress-number-crunch-1-without-prefix.png){: width="100%" }
*number-crunch application deployment*

Copy and paste this YAML manifest into `number-crunch-deployment.yml`.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: number-crunch-app
spec:
  selector:
    matchLabels:
      app: number-crunch-app
  replicas: 2 
  template:
    metadata:
      labels:
        app: number-crunch-app
    spec:
      containers:
      - name: number-crunch-app
        image: cloudqubes/number-crunch:1.0.1
        ports:
        - containerPort: 8080
```

Create the deployment.
```shell
kubectl apply -f number-crunch-deployment.yml
```

Check the status of the pods.
```shell
kubectl get pods
```

```shell
NAME                                 READY   STATUS    RESTARTS       AGE     
number-crunch-app-5866dd4d7f-zslzf   1/1     Running   0              3m33s
number-crunch-app-5866dd4d7f-74w9v   1/1     Running   0              3m33s
```

Since both pods are running, let's create the Service,

## Creating the Service
We need a Kubernetes Service to be used as the backend for the ingress.

Copy and paste this YMAL manifest into `number-crunch-service.yml`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: number-crunch-service
spec:
  selector:
    app: number-crunch-app
  ports:
  - name: number-crunch-service-port
    protocol: TCP
    port: 3001
    targetPort: 8080
```

Create `number-crunch-service`.
```shell
kubectl apply -f number-crunch-service.yml 
```

Check the `number-crunch-service`.
```shell
kubectl get services
```

```shell
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
number-crunch-service   ClusterIP      10.152.183.17    <none>        3001/TCP         5m10s
```

# Use case #1: Exposing an application via HTTP

As out first use case, we wil simply expose the `number-crunch` API endpoints via ingress.

Create `ingress.yml` with this YAML manifest.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: number-crunch-ingress
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: number-crunch-service
            port:
              number: 3001
```

Take note of these key parameters in `ingress.yml`.

- **ingressClassName** identifies the Ingress Controller we wish to use. 

  When there are multiple ingress controllers in a cluster, we can choose the desired ingress controller by specifying this parameter.

  If we omit this parameter, Kubernetes will assign the default `IngressClass` to our ingress. If we specify a non-existing ingress controller, our ingress would still be created, but Kubernetes will not assign an ingress controller for our ingress. So, traffic cannot be routed.

  If you find the your ingress is not being assigned an address, most probably you may have specified a non-existent ingress controller.

  You can check the available IngressClasses in your cluster.
  ```shell
  kubectl get ingressclasses
  ```

  Here's what we got in MicroK8s.
  ```shell
  NAME     CONTROLLER             PARAMETERS   AGE
  public   k8s.io/ingress-nginx   <none>       1d
  nginx    k8s.io/ingress-nginx   <none>       1d
  ```

- **rules** define how to route HTTP traffic to the back-end Kubernetes Services. This ingress has just one rule which sends all traffic to `number-crunch` Service on port 3001.

- **path** defines the URL to be matched. `/` denotes the root and matches all HTTP requests.

Create the ingress resource.
```shell
kubectl apply -f ingress.yml
```

Check the ingress resource.
```shell
 kubectl get ingress
```

```shell
NAME                    CLASS    HOSTS   ADDRESS     PORTS   AGE
number-crunch-ingress   public   *       127.0.0.1   80      175m
```

Note the `ADDRESS` and the `PORTS` fields. Our application will be available on http://127.0.0.1/xyz.

If the `ADDRESS` field is blank, please check the ingress agian in a few minutes. 
Sometimes, Kubernetes may take about one minute to assign the `ADDRESS` to a newly-created ingress resource. 

Test the `number-crunch` application.
```shell
curl http://127.0.0.1/square-root/4
```
```shell
{"InputNumber":4,"SquareRoot":2}
```

```shell
curl http://127.0.0.1/cube-root/8
```
```shell
{"InputNumber":4,"CubeRoot":2}
```

# Use case #2: Adding a URL prefix

To avoid URL duplications, we shall add the prefix `number-crunch` to all URLs in the `number-crunch` application.

![number-crunch application deployment](/assets/images/k8s-ingress-number-crunch-1.png){: width="100%" }
*number-crunch application deployment*

Update the `ingress.yml` as below.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: number-crunch-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /number-crunch/(.*)
        pathType: Prefix
        backend:
          service:
            name: number-crunch-service
            port:
              number: 3001
```

In this manifest, we are using ingress `annotations` to manipulate the URLs using regular expressions.

We define the new `path` as `/number-crunch/(.*)`. 

The string inside paranthesis is called a Capturing Group in a regular expression. We define one capturing group `(.*)` which captures all characters after `/number-crunch/` in the URL.

The characters matching a capturing group is copied to numbered placeholders like $1, $2, $n. Since we have only one capture group, all characters after the `/number-crunch/` in the URL is copied to `$1`.

As an example, if the URL in the HTTP request is `number-crunch/square-root/4`, the characters `square-root/4` will be available in `$1`. 

Then, we use `$1` as the `rewrite-target`. This effectively truncates the string `number-crunch/` from the incoming HTTP requests and the traffic to the `number-crunch-service`.

Let's update the ingress resource.

```shell
kubectl apply -f ingress.yml
```

Test the updated URL endpoints.

```shell
curl http://127.0.0.1:80/number-crunch/square-root/16
```

```shell
{"InputNumber":16,"SquareRoot":4}
```

You may appreciate that we did not have to change anything in our application for this change of the URLs.


# Use case #3: number-crunch-2

![number-crunch-2](/assets/images/k8s-ingress-number-crunch-2.png){: width="100%" }
*number-crunch-2*

`number-crunch` is gaining popularity. We are getting millions of requests everyday. 
<span>
&#128512;
</span>

We want to make `number-crunch` more scalable. So, we split the `square-root` and `cube-root` API end-points to two different micro-services and create [number-crunch-2].

We want to upgrade to `number-crucnch-2` without disturbing our clients.

We can easily achieve this by manipulating URLs in ingress.

Let's deploy the two microservices.

Create `square-root.yml` manifest.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: square-root-app
spec:
  selector:
    matchLabels:
      app: square-root-app
  replicas: 2 
  template:
    metadata:
      labels:
        app: square-root-app
    spec:
      containers:
      - name: square-root-app
        image: cloudqubes/square-root:2.0.1
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: square-root-service
spec:
  selector:
    app: square-root-app
  ports:
  - name: square-root-service-port
    protocol: TCP
    port: 3001
    targetPort: 8080

```

Deploy `square-root` micro-service.

```shell
kubectl apply -f square-root.yml
```

Create `cube-root.yml` manifest.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cube-root-app
spec:
  selector:
    matchLabels:
      app: cube-root-app
  replicas: 2 
  template:
    metadata:
      labels:
        app: cube-root-app
    spec:
      containers:
      - name: cube-root-app
        image: cloudqubes/cube-root:2.0.1
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: cube-root-service
spec:
  selector:
    app: cube-root-app
  ports:
  - name: cube-root-service-port
    protocol: TCP
    port: 3001
    targetPort: 8080
```

Deploy `cube-root` micro-service.

```shell
kubectl apply -f cube-root.yml
```

Check the deployments and the Services.
```shell
kubectl get deployments
```

```shell
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
square-root-app    2/2     2            2           10m
cube-root-app      2/2     2            2           10m
```

```shell
kubectl get services
```

```shell
NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
square-root-service   ClusterIP      10.152.183.195   <none>        3001/TCP         12m
cube-root-service     ClusterIP      10.152.183.104   <none>        3001/TCP         12m
```

Update `ingress.yml`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: number-crunch-2-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1/$2
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /number-crunch/(square-root)/(.*)?$
        pathType: Prefix
        backend:
          service:
            name: square-root-service
            port:
              number: 3001
      - path: /number-crunch/(cube-root)/(.*)?$
        pathType: Prefix
        backend:
          service:
            name: cube-root-service
            port:
              number: 3001
```

We have added two rules - one for each micro-service. The `path` in each rule defines two capturing groups, which copy the matching characters to `$1` and `$2` respectively.

In the annotation `rewrite-target` we use `/$1/$2` so effectively removing the `number-crunch/` part in the URL.

![Capturing groups for number-crunch-2](/assets/images/k8s-ingress-capturing-group.png){: width="100%" }
*Capturing groups for number-crunch-2*

Let's update the ingress.

```shell
kubectl apply -f ingress.yml
```

Test the API end-points with `curl`.
```shell
curl http://127.0.0.1:80/number-crunch/square-root/16
```

```shell
{"InputNumber":16,"SquareRoot":4}
```

```shell
curl http://127.0.0.1:80/number-crunch/cube-root/16
```

```shell
{"InputNumber":16,"CubeRoot":2.5198420997897464}
```

# Ingress in production

Ingress is the preferred method for routing external HTTP and HTTPS traffic to applications inside a Kubernetes cluster. 

We demonstrated three HTTP routing use cases with [Ingress NGINX Controller][ingress-nginx] in a [MicroK8s] cluster.

If you are using a different ingress controller, please refer the relevant documentation as the features and functions may vary across different ingress controller implementations.

[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[number-crunch-2]: https://github.com/cloudqubes/number-crunch-2
[Kubernetes ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[NodePort]: https://cloudqubes.substack.com/i/106867327/nodeport
[LoadBalancer]: https://cloudqubes.substack.com/i/111987521/loadbalancer-services
[MicroK8s]: https://microk8s.io
[Ingress NGINX controller]: https://github.com/kubernetes/ingress-nginx
[MetalLB]: https://metallb.universe.tf
[annotations]: https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/