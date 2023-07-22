---
layout: post
title:  "How to set up a private Git server"
description: > 
  Start committing code to your private Git server in just 4 steps.
image: "git-cover.png"
date:   2023-07-22 07:10:00 +0530
categories: [hands-on]
tags: [DevOps]
---

Setting up a private Git repository server is easy.

Follow these four steps and you can start committing code to your Git Server.

![Git server and developer workstation](/assets/images/git-server-and-workstation.png){: width="100%" }
*Git server and developer workstation*

Note that the first three steps must be carried out in the `Git Server` and the fourth on the `Developer Workstation`.

# #1 Install Git server

We are using an Ubuntu VM as our Git Server so will use `apt` for installing Git. If you are using a different Linux distribution, use the appropriate package manager.

Login to the `Git Server` and install Git.

```shell
sudo apt update
sudo apt-get install git-core
```

# #2 Create git user

Create `git` user in the `Git Server`.
```shell
sudo adduser git
```

Type in a password when prompted.

This will create the `git` user and home directory `/home/git` for the user.

# #3 Create the repository on the server

Do NOT switch to the `git` user yet. We'll do it shortly afterwords.

Create a directory for storing git repos on the server and give permission to `git` user.

```shell
sudo mkdir /srv/git
sudo chown git /srv/git/
sudo chgrp git /srv/git
```

Create a repository in the `/srv/git/` path.
Take note that we are switching to the `git` user at this point.

```shell
su git
cd /srv/git
mkdir coffee-app.git
git init --bare
```

We are using `coffee-app.git` as our repository name. You can use a name you like.

# #4 Start commiting from the development machine

This step must be done from the `Developer Workstation`.
We assume that Git client is already installed in the `Developer Workststion`.

Configure the global email and username for Git if you haven't done it yet.

```shell
git config --global user.email "cloud@cloudqubes.com"
git config --global user.name "cloudqubes"
```
Create the `coffee-app` (or your preferred app-name.)

```shell
mikdir coffee-app
cd coffee-app
echo "coffee" > README.md
git init
git add .
git commit -m "initial commit"
git remote add origin git@10.212.251.186:/srv/git/number-crunch.git
git push -u origin master
```

Note that we are using the IP address of the `Git Server`. Use the correct IP address of your server.

You will be asked to enter the password of the git user.
And, that's it.

You have successfully made the first code commit to your Git Server.

If you think that it's too much work to enter the password everytime you are pushing code, proceed to the next step.

# Configure SSH keys (optional)

This step is optional and must be carried out in the `Developer Workstation`.

It frees you from having to type in the password every time you push code to the server.

Create new SSH keys.
```shell
ssh-keygen -f ~/.ssh/git_server
ssh-copy-id -i ~/.ssh/git_server git@10.212.251.186
```

Add the following lines to `~/.ssh/config`.

```shell
Host git_server
  User git
  Hostname 10.212.251.186
  IdentityFile ~/.ssh/git_server 
```

Make sure to use the correct IP address or the host name in your context.

Update the remote URL in the Git repository.

```shell
git remote set-url origin git_server:/srv/git/coffee-app.git
```

Take note of the `git_server` in the URL. It's the value we used for the `Host` parameter in the `~/.ssh/config` file.

Now, you can continue committing without having to enter the password everytime.
