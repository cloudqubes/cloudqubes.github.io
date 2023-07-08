---
layout: post
title:  "What is Kubernetes Ingress"
description: > 
  What is the purpose of Kubernetes Ingress and how to use it to expose HTTP(S) workloads.
image: "k8s-ingress-cover.png"
date:   2023-06-23 15:10:00 +0530
categories: [hands-on]
tags: [Kubernetes]
---

<div class="header-highlight">
Ingress is a mechanism for exposing HTTP or HTTPS application running inside a Kubernetes cluster. 
</div>

An application running inside a Kubernetes cluster is not directly accessible from outside most of the time. For exposing such applications to outside clients, Kubernetes provides several methods.

Ingress is one such method and is better suited for exposing Kubernetes Workloads via HTTP or HTTP(S).

Kubernetes has other mechanisms such as NodePort and LoadBalancer for non-HTTP usecases. 

Unlike other mechanisms, ingress works in layer-7 of the OSI model. So, ingress supports SSL/TLS termination, and URL/subdomain based traffic routing and load balancing, so ingress provides a better mechanism that works only for HTTP(S) applications.

# Ingress and Ingress Controller

Ingress is an API object stored in the `etcd` data stoer in Kubernetes. Ingress defines the traffic routing rules. But ingress alone is not sufficient for routing traffic.

The ingress controller is responsible for routing the HTTP(S) traffic according ot the rules defined in ingress. Typically, Ingress controller is deployed inside the cluster. But, cloud providers like AWS where Pod IP addresses are reachable in the VPC, ingress controller can reside outside the cluster.

When the ingress controller is deployed inside the cluster, you need a load balancer to be deployed in front of the ingress controller. 

<div class="inline-highlight">
An Ingress object defines a set of rules for routing HTTP(S) traffic to Kubernetes Service(s).
</div>
An Ingress object defines how HTTP or HTTPS traffic must be routed to one or more Kubernetes Services.

![Ingress and Ingress Controller](/assets/images/k8s-ingress-api-object.png){: width="100%" }
*Ingress and Ingress Controller*

# Ingress controller implementation
An ingress controller has two parts.

It has a reverst proxy which is responsible for routing HTTP(S) requests to appropriate backends - Kubernetes Services.

The controller watches the Kubernetes API and configures the reverse proxy appropriately - when creating a new Ingress resource.

![Concept of an ingress controller](/assets/images/k8s-ingress-controller-how.png){: width="100%" }
*Concept of an ingress controller*


There are several ingress controller implementations - open-source and commercial, managed and self-managed.

## Open-source ingress controllers

[Ingrsss NGINX controller][ingress-nginx] is an open-source ingress controller that is supported and maintained by the Kubernetes project. It uses NGINX as a reverse proxy and load balancer. 

HA Proxy ingress, Istio Ingree Gateway, and [Traefik Kubernetes ingress provider][traefik] are other open-source ingress controller implementations.

## Commercial ingress controllers

NGINX Ingress Controller - not to be confused with the open-source Ingress Nginx Controller - is a commercial ingress controller offered by Nginx. [FortiADC] is an ingress controller from Fortinet.

## Managed ingress controllers 

Running Kubernetes on the public cloud, you can take the advantage of managed ingress controllers offered by the cloud providers. [AWS Load Balancer Controller][aws-lbc], [GKE Ingress from GCP][gke-ingress], and [Web application routing add-on from Azure][azure-ingress] are such managed ingress controllers.

These managed ingress controllers are offered as add-on to the managed Kubernetes distributions in the respective cloud providers. Once you enable the add-on, the cloud provider takes care of provisioning cloud resources like load balancers when you create ingress objects.

You can also use other ingress controllers like [Ingress Nginx controller][ingress-nginx] on public clouds. Then you need to provision a network load balancer to route traffic from exteranl applications to the Ingress controller inside the Kubernetes cluster.


# Working with ingress
Now that we are familiar with the working of ingress and ingress controller, let's use Kubernetes ingress to expose an application to outside.

We'll use MicroK8s from Canonical. It's easy to setup and porvides Ingress NGINX Controller as an add-on. Since Ingress NGINX Controller is installed inside the cluster, we also need a load balancer which MicroK8s provide ass another add-on.

Enable both add-ons.

```yaml
microk8s enable ingress
microk8s enable metallb
```

If you are working on a vanilla Kubernetes cluster, you can install Ingress NGINX controller with Helm charts or YAML manifests and `kubectl`.

Then you can install MetalLB by following the relevant installation instructions.

MicroK8s and the other installation methods deploys the Ingress NGINX controller as a Daemonset. 

You can run an ingress Controller as a Deploymet also. But, the Daemonset is preferred as it will be risielent agains failure of multiple nodes in the cluster.


## number-crunch application
The application we are going to use is [number-crunch](https://github.com/cloudqubes/number-crunch) which is a simple HTTP server with two endpoints.

![number-crunch application](/assets/images/k8s-ingress-number-crunch-app-only.png){: width="80%" }
*number-crunch application*

## Deploying number-crunch on Kubernetes

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
NAME                                READY   STATUS    RESTARTS       AGE    IP            NODE         NOMINATED NODE   READINESS GATES
number-crunch-app-dfc76fcf9-wz6sn   1/1     Running   0              21h    10.1.131.49   microk8s70   <none>           <none>
number-crunch-app-dfc76fcf9-bwpt6   1/1     Running   0              21h    10.1.209.44   microk8s60   <none>           <none>
ubuntu@microk8s40:~$ 
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
number-crunch-service   ClusterIP      10.152.183.242   <none>        3001/TCP         6s
```

## Creating an ingress
Ingress is an API object which we create by another YAML manifest.
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
              number: 8080
```

Copy this to `ingress.yml` and create the ingress resource.
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
curl http://127.0.0.1:80/square-root/4
```
```shell
{"InputNumber":4,"SquareRoot":2}
```


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


## Managed ingress controllers and your cloud bill
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
