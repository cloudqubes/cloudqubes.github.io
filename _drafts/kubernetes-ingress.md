
We discussed about Kubernetes networking and how to expose an application running inside Kubernetes. 
There's another method that we can expose a Service to external world - Kubernetes Ingress.

Kubernetes Ingress expose an application via an Nginx which acts as a reverse prox. So, ngress works onl for HTTP or HTTPS based applications. 

You may wander why there are two ways of exposing Kubernetes services. 
They have slight differences.

A load balancer routes traffic directly to Pods. It works in layer 4 and distribut traffic to pods.

An Ingress routes trafffic through an Ingress controller which itself is a Pod within the cluster. The Pods need not be exposed to outside. 
An ingress is in  Layer-7. It can handle URL or subdomain based routing. All traffi goes through the ingress controller Pod. It works only for HTTP or HTTPs protocols only.

A rule of thumb is if your application uses HTTP or HTTPS only, use ingress. Otherwise go for a loadbalancer service.

# Ingress controller implementations
There are multiple implementations of ingress controller.


# Deploying an ingr

# Creating an ingress
Ingress is an API object. We create an Ingress by cerating a Service of type ingress.
