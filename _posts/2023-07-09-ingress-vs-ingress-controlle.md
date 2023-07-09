---
layout: post
title:  "Kubernetes ingress vs ingress controller"
description: > 
  The complete guide to understand what is Kubernetes ingress, what is ingress controller, and why we need them.
image: "k8s-ingress-vs-ingress-controller.png"
date:   2023-07-09 15:10:00 +0530
categories: [insights]
tags: [Kubernetes]
---

<div class="header-highlight">
Kubernetes ingress and ingress controller are two frequently-used terms. When you are getting starting with Kubernetes, these terms may seem confusing. But, don't worry. Here's all you need to know.
</div>

An application running inside a Kubernetes cluster is not practically accessible directly from outside.

Kubernetes ingress together with ingress controller implements a mechanism for exposing such applications to the outside world via HTTP or HTTPS protocols. 

# Ingress and Ingress Controller

Ingress is an API object stored in the `etcd` data store in Kubernetes. Ingress defines traffic routing rules - how HTTP or HTTPS traffic must be routed to applications inside the cluster. 

But, ingress alone is not sufficient for routing traffic. You need an ingress controller too.

The ingress controller is responsible for routing HTTP or HTTPS traffic according ot the rules defined in ingress. 

The rules typically use a Kubernetes Service as the backend for receiving traffic.

![Ingress and Ingress Controller](/assets/images/k8s-ingress-api-object.png){: width="100%" }
*Ingress and Ingress Controller*

An ingress controller has two parts:

- A **reverse proxy** which is responsible for routing HTTP(S) traffic.

- A **controller** watches the Kubernetes API for routing rule changes and configures the reverse proxy appropriately.

![Concept of an ingress controller](/assets/images/k8s-ingress-controller-how.png){: width="100%" }
*Concept of an ingress controller*

# Ingress controllers

There are several ingress controller implementations that you can choose from - open-source or commercial, managed or self-managed.

## Open-source ingress controllers

[Ingress NGINX controller][ingress-nginx] is an open-source ingress controller that is supported and maintained by the Kubernetes project. It uses NGINX as a reverse proxy and load balancer. 

[HA Proxy ingress][ha-proxy], [Istio Ingress Gateway][istio-ingress], and [Traefik Kubernetes ingress provider][traefik] are other open-source ingress controllers.

## Commercial ingress controllers

[NGINX Ingress Controller][nginx-ingress] is a commercial ingress controller offered by NGINX. Don't get it confused with the open-source [Ingress NGINX controller][ingress-nginx].

## Managed ingress controllers 

Running Kubernetes on public cloud, you can take the advantage of the managed ingress controllers offered by the cloud providers.

[AWS Load Balancer Controller][aws-lbc], [GKE Ingress from GCP][gke-ingress], and [Web application routing add-on from Azure][azure-ingress] are such managed ingress controllers.

These managed ingress controllers are available as add-ons of the managed Kubernetes distributions offered by the cloud providers. Once you enable the add-on, the cloud provider takes care of provisioning all cloud resources such as load balancers required for routing traffic to your Kubernetes Workloads.

You can also use other ingress controllers like [Ingress Nginx controller][ingress-nginx] on public clouds. Then, you are responsible for provisioning a load balancer to route traffic from exteranl world to the Ingress controller inside your Kubernetes cluster.

# Ingress controller deployment architecture
An Ingress controller can be deployed inside or outside the Kubernetes cluster.

Inside the cluster, an ingress controller is usually deployed as a Kubernetes DaemonSet. You can deploy an ingress controller as a Deployment too. But a DaemonSet will give you better rsiliency against node failures.

When the ingress controller is inside the cluster, you need a load balancer to route traffic from external clients to the ingress controller.

![Ingress controller inside the cluster](/assets/images/k8s-ingress-with-loadbalancer.png){: width="100%" }
*Ingress controller inside the cluster*

The load balancer adds an extra hop to the traffic path. You can avoid it by deploying an ingress controller outside the cluster. But, it requires the Pod IP addresses to be reachable to the ingress controller.

![Ingress controller outside the cluster](/assets/images/k8s-ingress-outside-the-cluster.png){: width="100%" }
*Ingress controller outside the cluster*

HAProxy Kubernetes ingress controller supports this [outside-the-cluster model via BGP peering with Pod IPs](https://www.haproxy.com/blog/run-the-haproxy-kubernetes-ingress-controller-outside-of-your-kubernetes-cluster).

[AWS Load Balancer Controller][aws-lbc] also adopts the outside-the-cluster model. It reaches Pod IPs via [ENI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html).

# Usecases of Kubernetes ingress

Kubernetes Ingress supports exposing Workloads via HTTP or HTTTPS protocols only. 

For Workloads that need to be exposed via any other protocol, you must use NodePort or LoadBalancer services.

NodePort and LoadBalancer Services support any TCP or UDP protocol including HTTP. But, for HTTP usecases ingress offers more features.

Unlike the NodePort or LoadBalancer, ingress works in layer-7 of the OSI model. So, ingress supports SSL/TLS termination, URL/subdomain based traffic routing, etc.

So, ingress must be your go-to method for exposing HTTP(S) Workloads in Kubernetes clusters.

# The easiest ingress controller
If you want to get your hands dirty, [MicroK8s](https://microk8s.io/) from Canonical is the easiset to get started with ingress controller.

Just enable these two add-ons in your MicroK8s cluster and you are good to go.

```yaml
microk8s enable ingress
microk8s enable metallb
```

## Wrapping up

<div class="inline-highlight">
Ingress is an API object. Ingress controller is a software application that routes HTTP(s) traffic.
</div>

We have clarified the difference of ingress and ingress controller. Together ingress and ingress controller implements a mechanism for routing HTTP or HTTPS traffic from outside to Workloads inside the cluster.

[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[traefik]: https://doc.traefik.io/traefik/providers/kubernetes-ingress/
[nginx-ingress]: https://www.nginx.com/products/nginx-ingress-controller/
[FortiADC]: https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller-1-0/742835/fortiadc-ingress-controller-overview
[ha-proxy]: https://haproxy-ingress.github.io
[aws-lbc]: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
[aws-alb]: https://aws.amazon.com/elasticloadbalancing/application-load-balancer/
[gke-ingress]: https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
[azure-ingress]: https://learn.microsoft.com/en-us/azure/aks/web-app-routing?tabs=without-osm
[istio-ingress]: https://istio.io/latest/docs/tasks/traffic-management/ingress/ingress-control/