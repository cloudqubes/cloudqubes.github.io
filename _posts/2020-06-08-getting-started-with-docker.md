---
layout: post
title:  "Getting started with Docker"
date:   2020-06-08 01:30:00 +0530
categories: [hands-on, containers]
tags: [docker, containerization, CNF]
---

[Docker][docker] is an open source **containerization platform** - a collection of software which supports the process of packaging applications in to logical entities called containers and deploying them at target host machines. A container is an ultra portable deployment entity. It includes application software, runtime libraries and all configuration files for running an application, enabling agile lifecycle management.

# Why does it matter

It's exactly this agility that matters in the telco space. Right now the telcos are working hard at adapting NFV. The VNFs running on NFV platforms are supposed to bring agility by decoupling the hardware and software. 

Still, the VNFs inherit some inefficiencies from VMs. Containerized telco applications (aka CNF) can help overcome some of these challenges so, containerization has become a fundamental requirement for emerging 5G systems.

Saving the comparison of VNFs with CNFs for later, let's get some hands-on experience with containers by installing [Docker][docker] on [Ubuntu Server 18.04][ubuntu].

You could install [Docker][docker] either on bare-metal or VM. While gaining true benefits of containerization require running containers on bare-metal, let's stick to a VM for this hands-on excercise.

# Setup repositories

The recommended approach for installing docker is to use Docker repositories.

prerequisites - update `apt` package index, and allow `apt` to use a repository over HTTPs:
{% highlight shell %}
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
{% endhighlight %} 

Configure Docker GPG keys:
{% highlight shell %}
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
{% endhighlight %} 

Verify fingerprint:
{% highlight shell %}
$ sudo apt-key fingerprint 0EBFCD88
{% endhighlight %} 
If the output matches `9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88`, it's correct.

Setup stable Docker repository:
{% highlight shell %}
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
{% endhighlight %} 

Upate apt package index and install Docker:
{% highlight shell %}
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io
{% endhighlight %} 

This installs the Docker Engine and Containered. Docker engine is responsible for building and containerizing applications, while Containered is the runtime that manage the entire lifecycle of a container.

# Verify installation

Downloads a test docker image and run.
{% highlight shell %}
$ sudo docker run hello-world
{% endhighlight %}

List the containers. The option `all` prints the containers that have already exited.
{% highlight shell %}
$ sudo docker ps --all
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
7ff0f8965e94        hello-world         "/hello"            11 minutes ago      Exited (0) 11 minutes ago                       confident_pascal
{% endhighlight %} 


List the available docker images.
{% highlight shell %}
$ sudo docker image ls
{% endhighlight %} 

# Working behind a proxy

If you are behind a proxy, you have to provide proxy information to the dcoker daemon.

Create a drop-in directory for docker daemon:
{% highlight shell %}
$ sudo mkdir -p /etc/systemd/system/docker.service.d
{% endhighlight %}

Create a file `/etc/systemd/system/docker.service.d/http-proxy.conf` and add the proxy configuration.
{% highlight shell %}
[Service]
Environment="HTTP_PROXY=http://<proxy-ip>:<proxy-port>/"
Environment="NO_PROXY=docker-registry.local"
{% endhighlight %} 
Replace `<proxy-ip>` and `<proxy-port>` with your proxy server information.
`NO_PROXY` is an optional configuration, which can be used to add internal docker registries that you want to access without going through proxy.

Flush the changes and restart docker service.
{% highlight shell %}
$ systemctl daemon-reload
$ systemctl restart docker.service
{% endhighlight %} 

Verify the configuration:
{% highlight shell %}
$ systemctl show docker.service --property Environment
{% endhighlight %} 
This will print the proxy details, you have just configured.

Now, we have a working containerization platform. In upcoming posts, let's explore more CNFs, and using containers in production.

*[CNF]: Cloud-native Network Function

[docker]: https://www.docker.com/
[ubuntu]: https://ubuntu.com/