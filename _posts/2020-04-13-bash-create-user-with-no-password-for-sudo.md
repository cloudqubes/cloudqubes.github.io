---
layout: post
title:  "Create user with no password prompt for sudo"
date:   2020-04-13 06:20:00 +0530
categories: [bash]
tags: [Linux]
my_categories: [sub]
---

Sometimes we want to create non-root users, such that no password is prompted when executing commands with sudo. This is useful when we have to automate tasks via Ansible or shell scripts.

Create user `cloudqubes` with home directory `/home/cloudqubes`:

{% highlight shell %}
$ sudo useradd -s /bin/bash -d /home/cloudqubes -m cloudqubes
$ echo "cloudqubes ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/cloudqubes 
{% endhighlight %} 

Switch to newly created user:
{% highlight shell %}
$ sudo su - cloudqubes
{% endhighlight %} 

Now, we can execute `sudo` commands, without being prompted to enter password.

With key based authentication for SSH, `cloudqubes` user can also be used to execute `sudo` commands remotely with same behavior.