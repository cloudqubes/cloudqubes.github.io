---
layout: post
title:  "A friendly introduction to Kubernetes"
subtitle: >
  This article will help you grasp the basic concepts of Kubernetes and will also make you familiar with the jargon .
date:   2022-11-26 07:00:00 +0530
categories: [devops, insights]
tags: ["Kubernetes"]
---

<div class="header-highlight">
You must understand these basic concepts in Kubernetes, before diving deeper down to anything.
</div>

Kubernetes is a platform for containerized applications.

Depending on complexity and scale a containerized application could be composed of hundreds or even thousands of containers. In a production setup, these numbers could pose a challenge. The individual containers need to be distributed across computing nodes in a cloud and if any container crashes while in operation it must be restored. This is too much work to do manually.

Kubernetes solves this problem by automating the life cycle of a containerized application from deployment to the termination. Kubernetes can schedule containers into computing nodes and it will ensure the crashed or failed containers are restored. Kubernetes can also scale an application based on parameters such as CPU utilization.

# Workloads

In Kubernetes jargon, containerized applications are called workloads.

A workload is a group of containers running inside a Kubernetes cluster. When you instruct Kubernetes to create a new workload, Kubernetes schedules the containers into the compute nodes in the cluster based on the availability of CPU and memory.

To manage containers in the compute nodes, Kubernetes used pods.

# Pod

A pod acts as a logical grouping of containers belonging to the same workload running inside the same compute node. Kubernetes creates a workload as a set of pods in the compute nodes in the cluster.

A compute node can host multiple pods. Each pod can have one or more containers.


![Workloads and pods in a Kubernetes cluster](/assets/images/kubernetes-pods.png){: width="100%" }
*Workloads and pods in a Kubernetes cluster*

This Kubernetes cluster has two workloads each with two pods. The orange workload has  three containers in the first pod and a single container in the second pod. The blue workload is created with two containers in each of the pods.

## Single vs multiple containers in a pod

When creating a workload, you can decide how many pods you need and how many containers should run in each pod.

Running one container inside a pod is the most common practice. If several containers need to share a common resource such as an IP address or a storage volume, those containers must be scheduled inside the same pod.

# Kubernetes cluster

To deploy a containerized application on Kubernetes, you need a Kubernetes cluster. You can create a Kubernetes cluster by installing Kubernetes on one or more computers.

If you intend to use Kubernetes for testing, you can create a Kubernetes cluster on your laptop or on a single server or VM. To run scalable applications in a production environment, you must install Kubernetes on a pool of servers to ensure redundancy for the control plane and computing capacity for the application.

A Kubernetes cluster consists of a control plane and one or more worker nodes. 

When you create a Kubernetes cluster in a single computer, there is only one worker node and the control plane will also reside on the same computer. But, in a scalable production environment, it’s the best practice to keep the control plane and worker nodes separated.

# Worker nodes

The worker nodes are responsible for running containers. The control plane schedules the pods in a workload to different worker nodes in a cluster.

The worker nodes must have a container runtime, kubelet, and optionally a kube-proxy.

## Container runtime

Container runtime is a software that is responsible for running the containers. Docker was the prominent container runtime at the early days of Kubernetes. However, most Kubernetes distributions tend to adopt Containerd as their preferred container runtime.

## kubelet

The Kubelet is an agent running in each worker node. 

Kubelet registers the worker node with the Kubernetes cluster control plane. The control plane instructs the kubelet about the pods and containers that should run in the node. Then, kubelet ensures those containers are running and healthy.


## kube-proxy

Kube-proxy is a simple network proxy that runs on each worker node and implement packet forwarding to implement certain services for workloads.

# Kubernetes control plane

The Kubernetes control plane is made up of several components.

## etcd
Etcd is a key-value database that Kubernetes uses to store all persistent data related to the cluster. 

## kube-apiserver
Kube-apiserver acts as an API frontend to the Kubernetes control plane. The CLI tools like kubectl communicate with the cluster via the kube-apiserver.

## kube-scheduler

Kube-scheduler is responsible for assigning Pods to nodes based on computing resource availability	. 

## kube-controller-manager

Kubernetes implements a set of controllers for managing workloads. The kube-controller-manager is responsible for running these controller processes.

## cloud-controller-manager

Cloud-controller-manager is an optional part of a Kubernetes cluster. Public cloud providers use it to integrate the Kubernetes cluster into their services portals and APIs, for offering Kubernetes as a service. Cloud-controller-manager is not required for an on-premise Kubernetes cluster.

# Kubernetes objects

Everything that needs to be stored with persistence is treated as an object in Kubernetes. 

Pods, containers, and workloads are example of some of the Kubernetes objects. Kubernetes uses etcd database to store these objects. 

When interacting with the Kubernetes API directly or via the kubectl tool, you are essentially working with Kubernetes objects.


# kubectl 

Kubectl is the command line tool for working with Kubernetes API.

You can install it on your local computer and issue commands to multiple Kubernetes clusters. Kubectl has commands that enable you to create, query, and delete Kubernetes objects.

# Deploying workloads to Kubernetes clusters

A workload is a group of containers running on Kubernetes. You can deploy a workload to a Kubernetes cluster by creating pods individually. But, it voids many of the benefits of Kubernetes.

The best approach for creating workloads is to use Kubernetes configuration files. You can declaratively define your workload in a configuration file using YAML syntax and use the `kubectl` to deploy this workload to a Kubernetes cluster.

Then, the Kubernetes control plane instructs the kubelets in worker nodes to run the containers as you have defined in the configuration file. If a pod crashes due to a failure of the worker node or a bug in your software Kubernetes will restore it in any of the available worker nodes.

In the next article, we will talk more about configuration files and managing workloads in Kubernetes.

