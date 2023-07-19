---
layout: post
title:  "How to use Kubernetes ingress for routing HTTP traffic"
description: > 
  Ingress is the preferred way of exposing HTTP applications in Kubernetes. It can manipulate HTTP requests and route traffic to multiple applications inside the cluster.
image: "k8s-ingress-cover.png"
date:   2023-07-13 15:10:00 +0530
categories: [hands-on]
tags: [Kubernetes]
---

<div class="header-highlight">
Ingress is the preferred way of exposing HTTP applications in Kubernetes. It can manipulate HTTP requests and route traffic to multiple applications inside the cluster.
</div>

[Kubernetes ingress] is a mechanism for exposing applications running inside a Kubernetes cluster via HTTP or HTTPS.

![Kubernetes ingress - simplified](/assets/images/k8s-ingress-simplified.png){: width="100%" }
*Kubernetes ingress - simplified*

This is a simple representation of Kubernetes ingress. To learn how ingress works, you can read the post on [Kubenetes ingress vs ingress controller]({% post_url 2023-07-09-ingress-vs-ingress-controller %}).


[NodePort] or [LoadBalancer] Services also can expose an application running inside a cluster. But, both [NodePort] and [LoadBalancer] Services work in layer-3 in OSI model.

Ingress works with HTTP protocol in layer-7 so offers more flexibility for HTTP-based applications. Also, ingress does not have some of the limitations in [NodePort] or [LoadBalancer] Services. 

So, ingress should be your preferred way for exposing HTTP applications inside a Kubernetes cluster to external clients.

An ingress defines a set of rules for routing HTTP traffic. You can use these rules to manipulate HTTP requests. 

Let's check out three such usecases of ingress rules.


# Kubernetes cluster setup

We are using [MicroK8s] from Canonical as our Kubernetes platform for this demonstration.

[MicroK8s] includes [Ingress NGINX Controller] as an add-on. Since [Ingress NGINX controller] is deployed inside the cluster, we need to place a load balancer in front of the ingress controller. So we'll use [MetalLB] load balancer which comes as another add-on in [MicroK8s].

Let's enable both add-ons in our cluster.

```yaml
microk8s enable ingress
microk8s enable metallb
```

![Microk8s cluster](/assets/images/k8s-ingress-microk8s.png){: width="100%" }
*MicroK8s cluster*

Since this entire setup is installed in a single virtual machine, our application will be accessible only via localhost (127.0.0.1). But in a production Kubernetes cluster the application will be avialble from a public IP in load balancer.


Check the status of Ingress NGINX Controller.
```shell
kubectl get pods -n ingress
```

```shell
NAME                                      READY   STATUS    RESTARTS   AGE
nginx-ingress-microk8s-controller-8672t   1/1     Running   0          2m10s
nginx-ingress-microk8s-controller-rdmtb   1/1     Running   0          2m10s
nginx-ingress-microk8s-controller-lm6l4   1/1     Running   0          2m10s
```

Check the status of MetalLB
```shell
kubectl get pods -n metallb-system
```

```shell
NAME                         READY   STATUS    RESTARTS      AGE
speaker-xfbbt                1/1     Running   6 (72d ago)   14m
controller-9556c586f-g9r7w   1/1     Running   3 (72d ago)   14m
speaker-flkmb                1/1     Running   6 (72d ago)   14m
speaker-h9972                1/1     Running   3 (72d ago)   14m
```

If all Pods are in `Running ` status, you can proceed to the next step.


# The number-crunch application

We will use [number-crunch](https://github.com/cloudqubes/number-crunch) application for this ingress use cases demonstration. 

The `number-crunch` is a simple HTTP server with two API endpoints.

![number-crunch application](/assets/images/k8s-ingress-number-crunch-app-only.png){: width="80%" }
*number-crunch application*

## Deploying number-crunch on Kubernetes

We will deploy `number-crunch` with two replicas in our MicroK8s cluster.

![number-crunch application deployment](/assets/images/k8s-ingress-number-crunch-1-without-prefix.png){: width="100%" }
*number-crunch application deployment*

We will use `kubectl` to manage the Kubernetes resources.

Copy this YAML manifest and paste it to `number-crunch-deployment.yml`.
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

In the manifest note the parameter `replicas: 2`. It instructts Kubernetes to create two Pods.
Check the status of the pods.
```shell
kubectl get pods -o wide
```
If both Pods are `running`, the deployment is successful. 

```shell
NAME                                 READY   STATUS    RESTARTS       AGE     IP            NODE         NOMINATED NODE   READINESS GATES
number-crunch-app-5866dd4d7f-zslzf   1/1     Running   0              3m33s   10.1.209.48   microk8s60   <none>           <none>
number-crunch-app-5866dd4d7f-74w9v   1/1     Running   0              3m33s   10.1.131.52   microk8s70   <none>           <none>
```
If you get the `ImagePullBackOff` error, wait a while for the node to retry.

## Creating the Service
We need a Kubernetes Service to be used as the backend for the ingress.

Copy this YAML manifest and paste it to `number-crunch-service.yml`.

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

As out first use case, we wil simply expose the API endpoints as they are.

Create `ingress.yml` by copy-pasting this YAML.

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

Note these two important parameters in `ingress.yml`.

## IngressClassName

`ingressClassName` identifies the Ingress Controller we wish to use. 

When there are multiple ingress controllers in a cluster, we can choose the desired ingress controller by specifying this parameter.

If we omit this parameter, Kubernetes will assign the default ingressClass to our ingress. If we specify a non-existing ingress controlle, our ingress would still be created, but Kubernetes will not assign an ingress controller for our ingress. So, traffic cannot be routed.

If you find the your ingress is not getting assigned an address, most probably you may have specified a non-existent ingress controller.

You can check the available IngressClasses in your cluster
```shell
kubectl get ingressclasses
```

Here's what we got in our MicroK8s cluster.
```shell
NAME     CONTROLLER             PARAMETERS   AGE
public   k8s.io/ingress-nginx   <none>       1d
nginx    k8s.io/ingress-nginx   <none>       1d
```

## rules

An ingress defines a set of rules for routing HTTP traffic to the back-end Kubernetes Services. The ingress we are going to create has just one rule which forwards all traffic to `number-crunch` Service on port 3001.



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
Sometimes, Kubernetes may take about 30 seconds to assign the `ADDRESS` to a newly-created ingress resource. 

Test the `number-crunch` application.
```shell
curl http://127.0.0.1/square-root/4
```
```shell
{"InputNumber":4,"SquareRoot":2}
```


# Use case #2: Adding a URL prefix

To avoid URL duplications, we shall add the prefix `number-crunch` to both URL endpoints.

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

Create the ingress resource.
```shell
kubectl apply -f ingress.yml
```

Test the URL endpoint application with the prefix.

```shell
curl http://127.0.0.1:80/number-crunch/square-root/16
```

```shell
{"InputNumber":16,"SquareRoot":4}
```

We have used ingress `annotations` to manipulate the URLs. The `rewrite-target` replaces the URI according to regex. 
In the `path` parameter, we sepcufy `number-crunch/(.*)`. The characters inside the braces is a regex Capture Group and will be copied to numbered placeholders like $1, $2, $n. Since we have only one capture group, it will be available in $1. 

So `/number-crunch/(.*)` will copy the string after `/number-crunch/` to $1. As an example, the of the HTTP request has URI `/number-crunch/square-root/4`, `square-root/4` will be available in $1. 

Then, we are using `rewrite-target` to instruct the ingress controller to replace the URL with the string available in $1. So, effectively we are deleting `/number-crunch` from the URL and our microservice will recieve URI as `/square-root/<numer>` or `/cube-root/<numner>`

# Use case #3: 

![number-crunch-2 application deployment](/assets/images/k8s-ingress-number-crunch-2.png){: width="100%" }
*number-crunch-2 application deployment*

`number-crunch` is gaining popularity so is getting millions of requests everyday. 
<span>
&#128512;
</span>

We want to make `number-crunch` more scalable. So, we split the `square-root` and `cube-root` API end-points to two different micro-services and create [number-crunch-2].

We want to deploy `number-crucnch-2` while ensuring our clients do not have to change their URLs. 

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

Since all Pods are running and the Service is configured, we'll create the ingress.

ingress.yml
It's also possible to create two separate ingresses but, we are creating only one here.

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

This ingress has two rules. Each path has two regex capturing groups, which copy the string to `$1` and `$2` respectively.

In the annotation `rewrite-target` we use `/$1/$2` so effectively removing the `number-crunch/` part in the URL.

Each http rule route the traffic to backend `square-root-service` and `cube-root-service`.

Create the ingress.

```shell
kubectl apply -f ingress.yml
```

Check the ingress status.
```shell
kubectl get ingress
```

```shell
NAME                      CLASS   HOSTS   ADDRESS     PORTS   AGE
number-crunch-2-ingress   nginx   *       127.0.0.1   80      4m20s
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






# Manipulating URLs

You can use Kubernetes ingress to manipulate URLs.
Here's a typical usecase.

We need to prefix the exposed URLs of the `number-crunch` with `number-crunch` to avoid any URL duplicates.
But, we do not want to do any modifications to the `number-crunch` application so its API endpoints are still `/square-root` and `/cube-root`.

![number-crunch app exposed with a URL prefix](/assets/images/k8s-ingress-number-crunch-1.png){: width="100%" }
*number-crunch app exposed with a URL prefix*

We can use `rewrite annotations` to implement this.

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

Update the `ingress.yml` with the above and update the ingress.

```shell
kubectl apply -f ingress.yml
```

Test the new URL with `number-crunch` prefix.
```shell
curl http://127.0.0.1:80/number-crunch/square-root/16
```
```shell
{"InputNumber":16,"SquareRoot":4}
```

Let's scrutinize what's happening here.
In the `ingress.yml` manifest we define the URL path:
```yaml
 - path: /number-crunch/(.*)
```

This is a regular expression with a [capturing group] (https://www.regular-expressions.info/refcapture.html). `.*` within the paranthesis, captures any string after `number-crunch/` and store the captured value in `$1`. Then, we use `$1` in the rewrite target.
```yaml
    nginx.ingress.kubernetes.io/rewrite-target: /$1
```
Effectively, we are tellting ingress controller to remove the part `number-crunch/` from the URL and keep the rest.

But, our annotations is not quite right. The `number-crunch` root URL returns a list of API end points currently available.

```shell
curl http://127.0.0.1:80/number-crunch/
```

```shell
404 page not found
```



If there was a subsequent capturing group, it would be stored in the var

# Managed ingress controllers and your cloud bill
The implementation architecture of ingress controllers are different from one another. So, when using managed ingress controllers from cloud providers, read the documentation to be familiar with its architecture. 

In AWS, the [AWS Load Balancer Controller][aws-lbc] is responsible only for the `controller` function of the ingress controller. It provisions an [AWS Application Load Balancer] [aws-alb] to handle the HTTP(S) routing. The AWS Application Load Balancer is charged pe hour. When you create a new ingress respource, AWS Application Load Balancer provsiions a new instance of the the AWS Application Load Balancer. But, if you add multiple rules to the same ingress resource, you will need only a single AWS Application Load Balancer. S

You need to understadn such nuances when using managed ingress controllers from cloud providers.

 The Ingress NGINX 

As an example, [AWS Load Balancer Controller][aws-lbc]
When you enable a managed ingress con


[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[number-crunch-2]: https://github.com/cloudqubes/number-crunch-2
[Kubernetes ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[NodePort]: https://cloudqubes.substack.com/i/106867327/nodeport
[LoadBalancer]: https://cloudqubes.substack.com/i/111987521/loadbalancer-services
[MicroK8s]: https://microk8s.io
[Ingress NGINX controller]:
[MetalLB]:
