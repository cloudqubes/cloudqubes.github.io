---
layout: post
title:  "Kubernetes ingress vs ingress controller"
description: > 
  Ingress and ingress controller are two frequently-used terms. Are you sure that you know all about them?
image: "k8s-ingress-cover.png"
date:   2023-07-06 15:10:00 +0530
categories: [insights]
tags: [Kubernetes]
---

<div class="header-highlight">
Kubernetes ingress and ingress controller are two frequently-used terms. When you are starting with Kubernetes networking, they are an important thing that you must get clarified
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


[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[traefik]: https://doc.traefik.io/traefik/providers/kubernetes-ingress/
[nginx-ingress]: https://www.nginx.com/products/nginx-ingress-controller/
[FortiADC]: https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller-1-0/742835/fortiadc-ingress-controller-overview
[ha-proxy]: https://haproxy-ingress.github.io
[aws-lbc]: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
[aws-alb]: https://aws.amazon.com/elasticloadbalancing/application-load-balancer/
[gke-ingress]: https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
[azure-ingress]: https://learn.microsoft.com/en-us/azure/aks/web-app-routing?tabs=without-osm
