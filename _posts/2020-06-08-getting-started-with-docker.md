---
layout: post
title:  "Getting started with Docker"
date:   2020-06-08 01:30:00 +0530
categories: [hands-on, containers]
tags: [docker, containerization, CNF]
---

[Docker] is an open source **containerization platform** - a collection of software which supports the process of packaging applications in to logical entities called containers, and deploying them at target host machines.

A container is an ultra portable deployment entity. It's instantiated from an image, which inlcudes all application software, runtime libraries and configurations files for running a particular application. 

However, unlike a VM image, a container image does not include a guest OS, so it's much smaller in size, and can be efficiently moved to the deployment target. The absence of the guest OS makes container instantiation blazingly fast. A container can be set up and runnng within a few seconds, in contrast to a VM which takes several minutes to boot up.

Therefore, containerized applications are more agile, than virtualized applications running on VMs.

# Why does it matter

It's exactly this agility that matters in the telco space. Right now the telcos are working hard at adapting NFV. The VNFs running on NFV platforms are supposed to bring agility by decoupling the hardware and software. 

Still, the VNFs inherit some inefficiencies from VMs. Containerized telco applications (aka CNF) can help overcome some of these challenges, so containerization has become a fundamental requirement for new 5G system.

Saving the comparison of VNFs with CNFs for later, let's get some hands-on experience with containers by installing [Docker] on [Ubuntu 18.04][ubuntu].

You could install [Docker] either on bare-metal or VM. While gaining true benefits of containerization require running containers on bare-metal, let's stick to a VM for this learning excercise.

# Setup repositories

The recommended approach for installing docker is to use Docker repositories.

### Prerequisites
Update `apt` package index, and allow `apt` to use a repository over HTTPs:
{% highlight shell %}
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
{% endhighlight %} 

### Configure Docker GPG keys
{% highlight shell %}
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
{% endhighlight %} 

### Verify fingerprint
{% highlight shell %}
$ sudo apt-key fingerprint 0EBFCD88
{% endhighlight %} 
If the output matches `9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88`, it's correct.

### Setup stable Docker repository
{% highlight shell %}
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
{% endhighlight %} 

### Upate apt package index and install Docker:
{% highlight shell %}
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io
{% endhighlight %} 

This installs the Docker Engine and [Containered]. Docker engine is responsible for building and containerizing applications, while [Containered] is the runtime that manage the entire lifecycle of a container.

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
Environment="HTTPS_PROXY=http://<proxy-ip>:<proxy-port>/"
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

Now, we have a working containerization platform. 

# Working with images

[Docker Hub][docker-hub] is a service by [Docker] for finding and sharing Docker images. At the time of this writing, it hosts more than 3.5 million public docker images.

Let's download an [NGINX] image:
{% highlight shell %}
$ sudo docker pull nginx
{% endhighlight %} 

List images:
{% highlight shell %}
$ sudo docker image ls
{% endhighlight %} 

# Runing a container

Run container named `docker-nginx` from `nginx` image:
{% highlight shell %}
$ sudo docker run --name docker-nginx -p 80:80 nginx
{% endhighlight %}
This shell session does not return, but halt at `/docker-entrypoint.sh: Configuration complete; ready for start up`. Open up another shell and use `$ sudo docker ps` to list running containers.

You will get below output, indicating that our container is running and listening on port 80.
{% highlight shell %}
$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
c072dcff561d        nginx               "/docker-entrypoint.…"   3 minutes ago       Up 3 minutes        0.0.0.0:80->80/tcp   docker-nginx
{% endhighlight %}

Use curl to send an HTTP request `curl http://127.0.0.1` to the container, and our shell session running the container will be updated with the information of the request.

{% highlight shell %}
172.17.0.1 - - [11/Jun/2020:01:00:09 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.58.0" "-"
{% endhighlight %}

Terminate the container with `CTRL+C` at this shell, which will also stop the container. Use `sudo docker ps --all` to list all containers including the ones that are stopped.

### Start container
{% highlight shell %}
$ sudo docker start docker-nginx
{% endhighlight %}
Unlike `docker run`, the `start` command does not attach the shell session to the running container, by default. You can use `-a` option to do that with the `start` command.

### Stop container
{% highlight shell %}
$ sudo docker stop docker-nginx
{% endhighlight %}

This completes our hands on exercise with containers, where we installed [Docker] and manually setup a single container. However, a containerized application in a production environment requires setting up thousands of containers across hundreds of host machines. In the [next post] we will explore on [Kubernetes], which is a system for managing containerised applications at that scale.

*[CNF]: Cloud-native Network Function
*[VNF]: Virtualized Network Function
*[VM]: Virtual Machine

[Docker]: https://www.docker.com/
[ubuntu]: https://ubuntu.com/
[docker-hub]: https://hub.docker.com/
[NGINX]: https://hub.docker.com/_/nginx
[Containered]: https://containerd.io/
[Kubernetes]: https://kubernetes.io/
[next post]: {% post_url 2020-06-14-introduction-to-kubernetes %}