
We discussed about Kubernetes networking and how to expose an application running inside Kubernetes. 
There's another method that we can expose a Service to external world - Kubernetes Ingress.

Kubernetes Ingress expose an application via an Nginx which acts as a reverse prox. So, ngress works onl for HTTP or HTTPS based applications. 

You may wander why there are two ways of exposing Kubernetes services. 
They have slight differences.

A load balancer routes traffic directly to Pods. It works in layer 4 and distribut traffic to pods.

An Ingress routes trafffic through an Ingress controller which itself is a Pod within the cluster. The Pods need not be exposed to outside. 
An ingress is in  Layer-7. It can handle URL or subdomain based routing. All traffi goes through the ingress controller Pod. It works only for HTTP or HTTPs protocols only.

A rule of thumb is if your application uses HTTP or HTTPS only, use ingress. Otherwise go for a loadbalancer service.

# Ingress and Ingress Controller
Kubernetes Ingress is an API object in Kubernetes. It stores a certain set of parameters regarding how traffic should be routes to services.

The ingress controller is a piece of software that runs in one or more Pods withing the kubernetes cluster. Ithe Ingress Controller implement the kogic defined in the Ingress Object and takes care of routing te traffic to destined services.

# Ingress controller implementations
There are several implementations of ingress controller, commercial or open-source, managed or self-managed.

## Open-source ingress controllers

Ingrsss NGINX controller is an open-source ingress controller that is supported and maintained by Kubernetes project. It uses NGINX as a reverse proxy and load balancer. 

HA Proxy ingress, Istio Ingree Gateway, and [Traefik Kubernetes ingress provider][traefik] are other open-source ingress controller implementations.

## Commercial ingress controllers

NGINX Ingress Controller - not to be confused with the open-source Ingress Nginx Controller - is a commercial ingress controller offered by Nginx. [FortiADC] is an ingress controller from Fortinet.

## Managed ingress controllers 

Running Kubernetes on public clouds you can take the advantage of managed ingress controllers offered by the cloud providers. AWS Application Load Balancer from AWS, GKE Ingress from GCP, and Web application routing add-on from Azure are such managed ingress controllers.

Once you enable these ingress controllers, the cloud provider will take care of provisioning and configuring the ingress controller when you create/delete ingress objects.

You can also use other ingress controllers like Ingress Nginx controller on public clouds. Most of the time you will need a network load balancer in front of the ingress controller for these deployments.


# Deploying an ingress NGINX controller
To get some hands-on experience with ingress controller, the best option is the Ingress NGINX controller, which is also maintained by the Kubernetes project.

If you are running microK8s, Ingress NGINX is available as an add-on that you can simply enable.
```yaml
microk8s enable ingress
```

If not, you can install Ingress NGINX controllers using Kubernetes manifests
```yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
```

This deploys the Ingress controller as a Daemonset in Kubernetes. You can run the Ingress Controller as a Deploymet. But, the Daemonset is preferred as it will be risielent agains failure of multiple nodes in the cluster.

## Loadbalancer for Ingress controller

An ingress controller is located inside the cluster. For external client to reach the Ingress Controller, yoi need to a load balancer sitting infront of the Ingress Controller.

# Creating an ingress
Ingress is an API object. We create an Ingress by cerating a Service of type ingress.



[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[traefik]: https://doc.traefik.io/traefik/providers/kubernetes-ingress/
[nginx-ingress]: https://www.nginx.com/products/nginx-ingress-controller/
[FortiADC]: https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller-1-0/742835/fortiadc-ingress-controller-overview
[ha-proxy]: https://haproxy-ingress.github.io

