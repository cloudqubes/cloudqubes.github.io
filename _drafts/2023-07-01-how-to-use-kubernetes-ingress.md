---
layout: post
title:  "How to use Kubernetes ingress"
description: > 
  X usecases of using ingress for exposing HTTP applications inside the cluster
image: "k8s-ingress-cover.png"
date:   2023-07-13 15:10:00 +0530
categories: [hands-on]
tags: [Kubernetes]
---

<div class="header-highlight">
Ingress is a mechanism for exposing HTTP or HTTPS application running inside a Kubernetes cluster. 
</div>

Kubernetes ingress is a mechanism for exposing applications running inside the Kubernetes cluster via HTTP or HTTPS.

While there are several methods for exposing an application like NodePort or LoadBalancer, ingress is the best option for HTTP applications.

We are going to check out x usecases of ingress.


# Kubernetes cluster setup

We'll be using MicroK8s from Canonical as our Kubernetes platform.

It has Ingress NGINX Controller and MetalLB load balancer ass add-ons.

Enable both add-ons.

```yaml
microk8s enable ingress
microk8s enable metallb
```

Check the status of the Ingress NGINX.
```shell
kubectl get pods -n ingress
```

```shell
NAME                                      READY   STATUS    RESTARTS   AGE
nginx-ingress-microk8s-controller-8672t   1/1     Running   0          71d
nginx-ingress-microk8s-controller-rdmtb   1/1     Running   0          71d
nginx-ingress-microk8s-controller-lm6l4   1/1     Running   0          71d
```

Check the status of MetalLB
```shell
kubectl get pods -n metallb-system
```

```shell
NAME                         READY   STATUS    RESTARTS      AGE
speaker-xfbbt                1/1     Running   6 (72d ago)   99d
controller-9556c586f-g9r7w   1/1     Running   3 (72d ago)   99d
speaker-flkmb                1/1     Running   6 (72d ago)   99d
speaker-h9972                1/1     Running   3 (72d ago)   99d
```

If all Pods are in `Running ` status, you can proceed to the next step.



# number-crunch application
The application we are going to use is [number-crunch](https://github.com/cloudqubes/number-crunch) which is a simple HTTP server with two endpoints.

![number-crunch application](/assets/images/k8s-ingress-number-crunch-app-only.png){: width="80%" }
*number-crunch application*

## Deploying number-crunch on Kubernetes

We are going to deploy this application with two replicas in to the Kubernetes cluster and expose to the outside world via ingress.

![number-crunch application deployment](/assets/images/k8s-ingress-number-crunch-1-without-prefix.png){: width="100%" }
*number-crunch application deployment*

We will use `kubectl` to deploy the application to the Kubernetes cluster.

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

Create the deployment
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
We need a Kubernetes Service to use as the backend of the ingress.

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

# Usecace #1: Basic use of Kubernetes ingress

Let's create an ingress which allows us to connect to `number-crunch` API endpoints via HTTP.

The `ingress.yml`.

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

Test the `number-crunch` application.
```shell
curl http://127.0.0.1/square-root/4
```
```shell
{"InputNumber":4,"SquareRoot":2}
```

# Usecase #2: Adding a URL prefix

To avoid any possible URL duplications, we shall add the prefix `number-crunch` to both URL endpoints.

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

The URL prefix is handled by `annotations` in @todo

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

# Usecase #3: 

![number-crunch-2 application deployment](/assets/images/k8s-ingress-number-crunch-2.png){: width="100%" }
*number-crunch-2 application deployment*

## IngressClassName

`ingressClassName` identifies the Ingress Controller we wish to use. When there are multiple ingress controllers in a cluster, we can choose the desired ingress controller by specifying this parameter.

If we omit this parameter, Kubernetes will assign the default ingressClass to our ingress. But, if we specify a non-existing ingressClass name, our ingress would still be created, but Kubernetes will not assign an ingress controller for our ingress. So, traffic cannot be routed.

If you find the your ingress is not getting assigned an address, most probably you may have specified a non-existent IngressClass.

You can check the available IngressClasses in your cluster
```shell
kubectl get ingressclasses
```

Here's the output in our MicroK8s cluster.
```shell
NAME     CONTROLLER             PARAMETERS   AGE
public   k8s.io/ingress-nginx   <none>       66d
nginx    k8s.io/ingress-nginx   <none>       66d
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
[traefik]: https://doc.traefik.io/traefik/providers/kubernetes-ingress/
[nginx-ingress]: https://www.nginx.com/products/nginx-ingress-controller/
[FortiADC]: https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller-1-0/742835/fortiadc-ingress-controller-overview
[ha-proxy]: https://haproxy-ingress.github.io
[aws-lbc]: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
[aws-alb]: https://aws.amazon.com/elasticloadbalancing/application-load-balancer/
[gke-ingress]: https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
[azure-ingress]: https://learn.microsoft.com/en-us/azure/aks/web-app-routing?tabs=without-osm
