---
layout: post
title:  "A hands-on guide to containers with Docker"
date:   2021-06-24 06:10:00 +0530
categories: [handson, Containers]
tags: [containers, docker]
---

[Docker] is a platform for software containerization. The [Docker] platform includes all the tools that you need to build and run containerized software applications. While there are several such container platforms, [Docker] is the pioneer of them all. So, let’s get some hands-on experience with [Docker].

# What is a container?
Before getting into hands-on work, we must know what is a container. A container is a runnable software package. It bundles together the executable application code, the software libraries to run this code, and any other configuration parameters required.

Let’s consider an example. A container of a Node.js application will include the JavaScript code, the Node.js version required to execute the code, the dependent NPM packages, the configuration files that specify the parameters used by the code. This software package is usually called the container image.

[Docker] implements a container runtime, which is software responsible for running containers. From a container image, the container runtime can create a container instance which will run the application software included in the image.

## Containers vs Virtual Machines
If you are familiar with virtualization, which runs VMs on a hypervisor, you may identify some similarities between VMs and containers. However, what differentiates a container from a VM is the lack of a separate OS kernel. All containers within a host share the same host kernel, and are isolated by Linux namespaces. By contrast, a VM has its own OS, which runs in the hypervisor.

This lack of separate OS is also the main reason for the great agility of containerized software. Compared to VM images, container images are smaller in size. Containers are also quicker to start than VMs. Operational activities such as build, deploy, scaling, and failure recovery of containerized applications can be automated and orchestrated in a more uniform and agile way, compared to VMs.

# Getting started with Docker

As we mentioned, [Docker] is the pioneer of containerization and is also responsible for most of the initial hype around containerization. 
Docker consists of several components. The Docker daemon which is named `dockerd` is responsible for building container images and running containers in a host machine. The Docker client talks to the Docker daemon via a REST API, and instructs the daemon to execute the actions. The container registry is a server for storing and distributing container images. It can be on the public Internet or in a private server.

![Docker Architecture](/assets/images/docker-architecture.png)

## Install Docker Engine
Docker Engine is the software package that bundles Docker daemon and the Docker client. It’s available for most popular Linux distributions. We are going to use Ubuntu server 21.04 for this demonstration.

First, update the package repository and install the supporting packages.
{% highlight shell %}
$ sudo apt update
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
{% endhighlight %} 

Add the GPG key and setup the stable repository for Docker. 

{% highlight shell %}
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
$ echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
{% endhighlight %} 

Install the Docker Engine.

{% highlight shell %}
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli
{% endhighlight %} 

Test the setup.

{% highlight shell %}
$ sudo docker run hello-world
{% endhighlight %} 

If you get `Hello from Docker` output, it means the installation is successful.
Note that you have to use `sudo` for running the Docker CLI commands since Docker daemon is running as the `root` user.

## Container Images
If you carefully examin the output of `docker run hello-world` you will note this part.

{% highlight shell %}
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
b8dfde127a29: Pull complete 
Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a4
{% endhighlight %} 

Let’s examine what’s going on here.
Docker is looking for a container image named `hello-world`. Since it is unable to find the image locally, Docker is downloading the image from a container registry in the Internet. 
Let’s use the Docker CLI command `image` to check the downloaded image.

{% highlight shell %}
ubuntu@docker:~$ sudo docker image ls
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d1165f221234   2 months ago   13.3kB
{% endhighlight %} 

These container images are used to create container instances. As already mentioned, a container image contains all the executable software code, binaries, runtime environment for the software, and other dependencies and configurations required to run a container. 

# Docker Hub
We mentioned that Docker downloaded the `hello-world` image from a container registry on the Internet. This registry is called the [Docker Hub][docker-hub].

[Docker Hub][docker-hub] is a service provided by [Docker] for sharing container images. It has millions of container images. Many of the popular open-source projects such as NGINX, Node.js, Python, etc., have their images on [Docker Hub][docker-hub]. 

The `hello-world` is a container image, that is downloaded from [Docker Hub][docker-hub] for verifying the functionality of Docker Engine. The `hello-world` container does not provide any useful function other than printing a stream of characters to the `stdout`.
So, let’s do something more useful.

# Nginx web server in a container
[NGINX] is a popular web server and a reverse proxy. Search for `Nginx` in [Docker Hub][docker-hub] and you will find the NGINX official images.

![Docker Hub - NGINX](/assets/images/docker-hub-nginx.png){: width="1024"}

Let’s download Nginx version 1.21.0, using docker pull. It accepts the image name and optionally a tag to denote the image version in [Docker Hub][docker-hub].

{% highlight shell %}
$ sudo docker image pull nginx:1.21.0
{% endhighlight %} 

Once downloading is completed, check the docker images in the localhost.
{% highlight shell %}
$ sudo docker image ls
{% endhighlight %} 

The `run` command in Docker can run a container instance from an image.

{% highlight shell %}
$ sudo docker run nginx:1.21.0
{% endhighlight %} 

This will run the container in interactive mode, so the terminal will not return to the command prompt. You must press Ctrl+C to exit the container.

For our NGINX container to be useful, it must be able to accept incoming HTTP requests. So we use the `-p` (—publish) option to bind the port 80 on the container to the port 8080 on the host machine. The `-d`  will run the container as a daemon, so bash will return to the command prompt.

{% highlight shell %}
$ sudo docker run -d -p 8080:80 nginx:1.21.0
{% endhighlight %} 

Let’s check our web server with `curl`.

{% highlight shell %}
$ curl localhost:8080
{% endhighlight %} 

It will respond with the default Nginx webpage.

List the running containers with the `ls` command.

{% highlight shell %}
ubuntu@docker:~$ sudo docker container ls 
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                                   NAMES
e6ffe10db020   nginx:1.21.0   "/docker-entrypoint.…"   7 seconds ago   Up 5 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   hungry_goodall
{% endhighlight %} 

Note the port binding in the `PORTS` column which defines the port 8080 on the host machine is bound to 80 on the container. So, any TCP request to port 8080 on the host will be sent to port 80 on the container.
Use the `stop` command to stop a running container.

{% highlight shell %}
$ sudo docker container stop e6ffe10db020
{% endhighlight %} 

We have used the `CONTAINER ID` as the parameter in the `stop` command. But, we can also use the container name. Since we have not provided a name when running the container, Docker has auto-generated a name `hungry_goodall`.
Let’s create a new container and give it a name by specifying the `—name` parameter.

{% highlight shell %}
ubuntu@docker:~$ sudo docker run -d -p 8080:80 --name mynginx nginx:1.21.0
4b44ec856153ebc182ebeff5b29cefe445ba59d5ee52ea89a867db327f52d903
ubuntu@docker:~$ sudo docker container ls 
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                                   NAMES
4b44ec856153   nginx:1.21.0   "/docker-entrypoint.…"   5 seconds ago   Up 3 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   mynginx
{% endhighlight %} 

Stop the container using the name instead of ID.

{% highlight shell %}
$ sudo docker container stop mynginx
{% endhighlight %} 

The `stop` command stops the running container but preserves it so we can start later. Using the `-a` option we can list all the containers in either running or stopped state.

{% highlight shell %}
ubuntu@docker:~$ sudo docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
ubuntu@docker:~$ sudo docker container ls -a
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                      PORTS     NAMES
4b44ec856153   nginx:1.21.0   "/docker-entrypoint.…"   3 minutes ago    Exited (0) 6 seconds ago              mynginx
e6ffe10db020   nginx:1.21.0   "/docker-entrypoint.…"   13 minutes ago   Exited (0) 4 minutes ago              hungry_goodall
{% endhighlight %} 

We can remove a stopped container with the `rm` command.

{% highlight shell %}
ubuntu@docker:~$ sudo docker container rm mynginx
mynginx
ubuntu@docker:~$ sudo docker container ls -a
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                      PORTS     NAMES
e6ffe10db020   nginx:1.21.0   "/docker-entrypoint.…"   13 minutes ago   Exited (0) 4 minutes ago              hungry_goodall
{% endhighlight %} 

Start a container in stopped sate.

{% highlight shell %}
ubuntu@docker:~$ sudo docker container start e6ffe10db020
e6ffe10db020
ubuntu@docker:~$ sudo docker container ls 
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS         PORTS                                   NAMES
e6ffe10db020   nginx:1.21.0   "/docker-entrypoint.…"   19 minutes ago   Up 4 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   hungry_goodall
{% endhighlight %} 


# Using Dockerfile
We need our Nginx webserver to serve a static web application. Let’s create that.
In a text editor, create `index.html` with this simple web page.

{% highlight html %}
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>

        <h1>Simple Container app</h1>
        <p>Serving static files with Nginx</p>
    </body>
</html>
{% endhighlight %} 

We must copy this file to the `/www/data` path in the container.
We will also change the Nginx configurations to serve the static we site. So, create new file `default.conf` with this content.

{% highlight shell %}
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        # root   /usr/share/nginx/html;
        root   /www/data;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
{% endhighlight %} 

You may note that we have changed the `root` directive inside `location` so, Nginx will serve the static files from `/www/data`. The `default.conf` must be copied to `/etc/nginx/conf.d` in the container.

It’s possible to copy these files to the container after it’s instantiated. But, that is not the best practice. The best practice is to create a new image with all our files included so that we can directly instantiate the website with this new image.

Docker has a command `build` for building new images. When building a new image, we must specify certain parameters including which files must be copied into the image. So, we use a `Dockerfile`.

A Dockerfile is a text file. It contains a series of commands for building a new container image. 
In the same path we created the `index.html`, create a new file and name it `Dockerfile`. Make sure that there is no extension for the `Dockerfile`.

{% highlight shell %}
FROM nginx:1.21.0

COPY index.html /www/data/index.html

COPY default.conf /etc/nginx/conf.d/default.conf
{% endhighlight %} 

Our `Dockerfile` contains three commands. The format of the command is:

INSTRUCTION arguments

Docker instructions are case insensitive. The convention is to write the instructions in uppercase to distinguish them from the arguments.

The first instruction `FROM` is mandatory. It specifies the source image that should be used to build the new image. Next, we are using `COPY` to copy the `index.html` and `default.conf` to the intended location in the image.

## Build the image
We use `build` command to create the new image.

{% highlight shell %}
ubuntu@docker:~/nginx$ sudo docker build -t myweb .
Sending build context to Docker daemon  22.02kB
Step 1/3 : FROM nginx:1.21.0
 ---> d1a364dc548d
Step 2/3 : COPY index.html /www/data/index.html
 ---> Using cache
 ---> b2648844bfd2
Step 3/3 : COPY default.conf /etc/nginx/conf.d/default.conf
 ---> f11bf9e3b904
Successfully built f11bf9e3b904
Successfully tagged mywebb:latest
{% endhighlight %} 

The `-t` parameter can specify the name and a tag list for the image. We are using only the name here. The last parameter `.` specifies the path to the Dockerfile. We have it on the local computer. It’s also possible to build a new image from a Git repository by specifying the Git repository URL here. 

The `build` command prints an output for each instruction that it executes. Finally, we get that our new image is successfully built.
We can check the newly built image.
{% highlight shell %}
ubuntu@docker:~/nginx$ sudo docker image ls
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
myweb         latest    f11bf9e3b904   8 minutes ago   133MB
nginx         1.21.0    d1a364dc548d   3 weeks ago     133MB
hello-world   latest    d1165f221234   3 months ago    13.3kB
{% endhighlight %} 

## Run container
Let’s run a container with the new image.

{% highlight shell %}
$ sudo docker run -d -p 8080:80 --name mystaticweb myweb
{% endhighlight %} 
List the running containers.

{% highlight shell %}
ubuntu@docker:~/nginx$ sudo docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS        PORTS                                   NAMES
8b303d268dd0   myweb     "/docker-entrypoint.…"   16 hours ago   Up 16 hours   0.0.0.0:8080->80/tcp, :::8080->80/tcp   mystaticweb
{% endhighlight %} 

We will test our website with curl.

{% highlight shell %}
ubuntu@docker:~/nginx$ curl localhost:8080
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>

        <h1>Simple Container app</h1>
        <p>Serving static files with Nginx</p>

    </body>
</html>
{% endhighlight %} 

We have successfully built a new container image and run a container with it. 

## Update the application

Now, we shall update the `index.html` to release a new version of our website. Insert this after the closing `</p>` tag.

{% highlight html %}
<p>version 2.0</p>
{% endhighlight %} 

Let’s create a new container image using `-t` to tag our image with a new version.

{% highlight shell %}
$ sudo docker build -t myweb:2.0.0 .
{% endhighlight %}

Check the images.

{% highlight shell %}
ubuntu@docker:~/nginx$ sudo docker image ls
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
myweb         2.0.0     b40ab18f1a88   5 seconds ago   133MB
myweb         latest    f11bf9e3b904   16 hours ago    133MB
nginx         1.21.0    d1a364dc548d   3 weeks ago     133MB
nginx         latest    d1a364dc548d   3 weeks ago     133MB
hello-world   latest    d1165f221234   3 months ago    13.3kB
{% endhighlight %}

Let’s stop and remove the running container and then run the updated version.

{% highlight shell %}
$ sudo docker container stop mystaticweb
$ sudo docker container rm mystaticweb
$ sudo docker run -d -p 8080:80 --name mystaticweb mywebb:2.0.0
{% endhighlight %} 

Check the status of the new container.

{% highlight shell %}
ubuntu@docker:~/nginx$ sudo docker container ls 
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                                   NAMES
a5086e6e6099   myweb:2.0.0    "/docker-entrypoint.…"   22 seconds ago   Up 21 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   mystaticweb
{% endhighlight %} 

Check our static web site.

{% highlight shell %}
ubuntu@docker:~/nginx$ curl localhost:8080
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>

        <h1>Simple Container app</h1>
        <p>Serving static files with Nginx</p>
        <p>version 2.0</p>
    </body>
</html>
{% endhighlight %} 


# Conclusion
This completes our demonstration with Docker. We built and deployed a simple containerized application which is a static web page served by NGINX.
One of the advantages of containerization is the ability to frequently deploy new releases. We also creates two releases of our application by building new images. However, there is a small problem with our development and release process. When releasing a new version, we deleted the old container first and then created the new container with the new image. In a production setup this would cause a small outage.

In upcoming articles, we will dive deeper into this area of DevOps with containers and explore how we can deploy new releases with zero outage.


*[VM]: Virtual Machine
*[VMs]: Virtual Machines

[docker-hub]: https://hub.docker.com
[Docker]: https://www.docker.com
[nginx]: http://nginx.org