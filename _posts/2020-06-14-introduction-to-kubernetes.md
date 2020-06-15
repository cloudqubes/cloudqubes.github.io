---
layout: post
title:  "Introduction to Kubernetes"
date:   2020-06-14 03:30:00 +0530
categories: [hands-on, containers]
tags: [kubernetes, docker, containerization, CNF]
---

[Kubernetes] is a hot topic in cloud computing. While telcos are yet to adapt it, [Kubernetes] is the choice for most enterprise application developers. It has enabled small to hyperscale technology companies to deliver services, following an agile methodology.

If you haven't still had a taste of this amazing technology of containerized applications and [Kubernetes], now is the time to do so.

# Why Kubernetes

In a [previous post][docker-post] we installed [Docker] on Ubuntu, and manually created a container running [NGINX]. In production systems hundreds and thousands of such containers would be running in multiple host machines, making the **container management** an immensely challenging task.

Here comes [Kubernetes] to the rescue. [Kubernetes] can manage the entire life cycle of containerized applications by, settig up containers according to user defined templates, implementing diagnostic tests and recovery, and terminating containers when no longer required. In fact, the diagnostics machanisms in [Kubernetes] takes the containerised applications to a whole new level, when compaerd with virtualized applications running on VMs. 

# Install Kubernetes

In order to get some hands on experience, let's try out Kubernetes on a single VM. Installing a production ready Kubernets system requuires multiple servers. But for learning purpuse, several options exists for installing Kubernetes on a single VM. We will use [MicroK8s], which is an implementation from [Canonical].

MicroK8s is available as a [snap] package, so we will be using Ubuntu 18.04 LTS, which supports `snapd`.

### Setup proxy server for `snapd'
Since our VM is behind a web proxy, we have to configure the proxy infromation for `snapd`. If you have direct Internet for your VM, you can skip this step.

{% highlight shell %}
$ sudo snap set system proxy.http="http://<proxy-ip>:<port>"
$ sudo snap set system proxy.https="http://<proxy-ip>:<port>"
{% endhighlight %} 

### Install MicroK8s

Install current stable MicroK8s version, which is 1.18:
{% highlight shell %}
$ sudo snap install microk8s --classic --channel=1.18/stable
{% endhighlight %} 

### Set user priviledges

Add the current user to group `microk8s` for assigning prilviledges for managing Kubernetes. And give access to the .kube directory.

{% highlight shell %}
$ sudo usermod -a -G microk8s $USER
$ sudo chown -f -R $USER ~/.kube
$ su - $USER
{% endhighlight %} 

### Check status

Check the status of Microk8s:
{% highlight shell %}
$ microk8s status
{% endhighlight %}
If you get `microk8s is running` in the output, the Kubernetes cluster is installed.

### Troubleshooting

If MicroK8s is not running, `inspect` can give you more details on what's wrong:
{% highlight shell %}
$ microk8s inspect
{% endhighlight %}

# Working with a proxy

Earlier, we configured proxy for `snapd`. Now, we have to configure proxy information for MicroK8s, so that images can be fetched from a public registry such as [Docker Hub].

Edit `/var/snap/microk8s/current/args/containerd-env` to add this line:
{% highlight shell %}
HTTPS_PROXY=http://<proxy-ip>:<port>
{% endhighlight %} 

# Using kubectl

`kubectl` is the command line tool for Kubernetes. It is used for all management tasks such as managing resources in the cluster and deploying applications. While it is directly installed in a production Kubernetes depoyment, MicroK8s bundles `kubectl` inside it. In order to avoid namespace conflict `kubectl` bundled with MicroK8s has to be executed as `microk8s kubectl <command>`. 

Running `microk8s kubectl help` will display the list of commands available in `kubectl`. Further help on each command can be obtained by `microk8s kubectl <command> --help`.

# Nodes, Pods and Services

Every Kubernetes cluster has one or more nodes. A node is a worker machine (either physical or VM) that runs containerized applications.

A pod is one or more containers that run on a single node, and share some resources such as an IP address or a storage volume. The pod representa a logical unit a containerized application, and consists of tightly coupled containers that are deployed and scaled together.

A service represent an application end point (a URL or IP address) that can be accessed by another service or application. Multiple pods can be exposed by a single service, and Kubernetes handles the loadbalancing function between the pods.

List nodes, pods and services:
{% highlight shell %}
$ microk8s kubectl get nodes
$ microk8s kubectl get pods
$ microk8s kubectl get services
{% endhighlight %} 

Currently our MicroK8s has only a single node, no pods and one service named kubernetes.

# Deployments

A deployment is used to create a set of pods, for running an application. As opposed to manually creating containers, (as we did in our [previous post][docker-post] on Docker) deployments can be used automate the application life cycle management. 

A deployment is defined in a yaml file, and describes the desired state of the application. Let's create a deployment to run three [NGINX] pods.

Create `nginx.yaml` in working directory with below contents.

{% highlight yaml %}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.18.0
        ports:
        - containerPort: 80
{% endhighlight %}

Kubernetes deployments has may parameters for defining application state. 

The main parameters we are using here are:

* `replicas: 3` which means we need to run three identical pods.

* `image: nginx:1.18.0` which defines the image and the version.

Create the deployment:
{% highlight shell %}
$ microk8s kubectl apply -f ./nginx.yaml
{% endhighlight %}

Check the status of the deployment:
{% highlight shell %}
$ microk8s kubectl get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/3     3            0           7s
$ microk8s kubectl get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/3     3            2           13s
$ microk8s kubectl get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           16s
{% endhighlight %}
We can see that 3 pods are brought up incrementally.

Check the pods:
{% highlight shell %}
$ microk8s kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-6d8cb79fb7-79jxl   1/1     Running   0          4m13s
nginx-deployment-6d8cb79fb7-qblk2   1/1     Running   0          4m13s
nginx-deployment-6d8cb79fb7-sfh5n   1/1     Running   0          4m13s
{% endhighlight %}

We have gained some hands on experience with Kubernets now. In an upcoming post we will dive in to the topic of why telcos need to shift more focus on CNFs (Containerized telco applications) from VNFs.

*[CNFs]: Cloud-native Network Functions
*[VNFs]: Virtualized Network Functions

[Kubernetes]: https://kubernetes.io/
[Docker]: https://www.docker.com/
[MicroK8s]: https://microk8s.io/
[Canonical]: https://canonical.com/
[Docker Hub]: https://hub.docker.com/ 
[snap]: https://snapcraft.io/
[docker-post]: {% post_url 2020-06-08-getting-started-with-docker %}
[NGINX]: https://www.nginx.com/