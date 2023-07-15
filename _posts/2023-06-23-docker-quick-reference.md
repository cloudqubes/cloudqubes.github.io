---
layout: post
title:  "Docker CLI quick reference"
description: > 
  A quick reference of commonly used docker commands.
image: "docker-cli.png"
date:   2023-06-23 15:10:00 +0530
categories: [hands-on]
tags: [Linux]
---

<div class="header-highlight">
A quick reference of commonly used docker commands.
</div>

# The top five

### Pull container image from Docker Hub

```shell
docker pull <image-name>:latest
```
This pulls the latest version of the image from [Docker Hub](https://hub.docker.com).

### Build container image
```shell
docker build .
```
The `Dockerfile` must exist in the path from where you are running this command.

### List container images
```shell
docker image ls
```

### Run container 
```shell
docker run <image-name>:<tag>
```
`docker run` is an alias for `docke container run`.

### List running containers
```shell
docker conatiner ls
```

# Manage container images

### Pull specific version of a container image from docker hub
```shell
docker pull <image>:<tag>
```

### List all images
```shell
docker image ls
```

### Build image with name and tag
```shell
docker build -t <image-name>:<tag> .
```
The `Dockerfile` must exist in the path from where you are running this command.

## Build container image for x86 from M1 Macbook
```shell
docker buildx build --platform linux/amd64 .
```
The `Dockerfile` must exist in the path from where you are running this command.

Check Buildx availability in your Docker CLI
```shell
docker buildx version
```
The Buildx plugin is included in Docker Desktop on Windows, Mac, and Linux (if installed from a DEB or RPM package). If you are on any of the above platforms and if Buildx is still not available, try updating Docker to the latest version.

Or install Buildx manually by following [the instructions here](https://github.com/docker/buildx#installing).

### Push image to Docker Hub

Before pushing an image to Docker Hub, you must [create a Docker Hub repository](https://docs.docker.com/docker-hub/repos/create/).

```yaml
docker tag <image-name>:<tag> <docker-hub-username>/<repo-name>:<tag>
docker push <docker-hub-username>/<repo-name>:<tag>
```

`image-name` and `tag` could be any image that you have built locally with `docker build`. 

`docker-hub-username` is your username at Docker Hub.

`repo-name` is the name of the repository that you have created at Docker Hub.


### Verify image architecture
```shell
docker image inspect <image-id> | grep -i architecture
```

### Delete image
```shell
docker image rm <image-id>
```

# Manage containers

### Run container
```shell
docker run <image-name>:<tag>
```

Or 

```yaml
docker container run <image-name>:<tag>
```
This runs the container in a interactive session. (The shell does not return).
Run in the `detached` mode for the shell to return.

### Run container in detached mode

```shell
docker run -d <image-name>:<tag>
```

Or
```shell
docker container run -d <image-name>:<tag>
```

### Publish container port to localhost port

```shell
docker run -p <localhost port>:<container-port> <image-name>:<tag>
```
The host will forward all traffic destined to `localhost-port` to the `container-port` in the running container.

**Example**:

We are running NGNIX web server on port 8080 in the container. 
```shell
docker run -p 80:8080 nginx
```
Now, we can reach the HTTP server running in port 8080 on `nginx` via:
```shell
curl http://127.0.0.1/xyz...
```


### List running containers
```shell
docker container ls
```

### Stop container
```yaml
docker container stop <container-id>
```

### Delete container
```shell
docker container rm <container-id>
```
You must stop the container before deleting.

### List all containers (including stopped)
```shell
docker container ls --all
```

### List running containers where name contains a specific string
```shell
docker container ls -f "name=squid"
```

### List all containers where name contains a specific string
```shell
docker container ls -f "name=squid" --all
```

# Getting help

Get help about all available commands.
```shell
docker --help
```

Get specific details about a command.
```shell
docker <command> --help
```

Example: Getting help for `container` command.
```shell
docker container --help
```

Example: Getting help for `container ls` command.
```shell
docker container ls --help
```