---
layout: post
title:  "Introduction to cloud-init"
date:   2020-09-23 04:20:00 +0530
categories: [handson, OpenStack]
tags: [OpenStack]
---

Cloud OS images from [Ubuntu], [Fedora], [Centos] and most other Linux distributions have their password authentication disabled by default. So, every time when creating a VM instance on OpenStack with a Heat template, I have been using `user_data` directive to set the default password, without really understanding what's going on inside. 

{% highlight yaml %}
vm_1:
  type: OS::Nova::Server
  properties:
    name: "my_vm"
    image: "bionic-server-cloudimg-amd64-v2"
    flavor: "my_flavor"
    networks:
      - port: { get_resource: oam_port }
    config_drive: true
    user_data_format: RAW
    user_data: |
      #cloud-config
      password: mypassword123
      chpasswd: { expire: False }
      ssh_pwauth: True
{% endhighlight %} 

If you are like me, read on. You'd be surprised how much more you can achieve with this `user_data`.

# So, what really is user_data?

The `user_data` property in OpenStack resource type `OS::Nova::Server`, accepts a multiline string. 

In the example above I have included this string inline in the Heat template. But, you could place this content in a separate file and use the `get_file` directive to assign it to `user_data`.

{% highlight yaml %}
user_data_format: RAW
user_data: {get_file: /home/ubuntu/my_user_data.txt}
{% endhighlight %} 

This string of data assigned to `user_data` property is made available to the VM at instantiation time, via OpenStack config-drive. 

The config-drive is a special disk drive that gets attached to the VM at boot. The VM can mount this disk, and read its data. You could implement your own mechanism to read data from the config-drive and take actions, but [cloud-init] provides an industry-standard approach for doing same.

# Cloud-init

[Cloud-init] is a software package that is included in cloud OS images of [all major linux distributions][availability]. When a VM is instantiated, cloud-init can read data from a data source such as config-drive, and apply configurations or execute tasks on the VM based on that data. 

Config-drive is an OpenStack specific implementation, but you will find that other private and public cloud services also implement similar [data sources] [data-sources].

# What is cloud-config

Cloud-init accepts data in multiple formats. The most common and the simplest format is cloud-config, which is indicated by #cloud-config at the beginning of the user data string. Cloud-config has a rich syntax for executing many of the common tasks in setting up a new VM instance.

These tasks are implemented in a set of [modules]. Let's explore what we can achieve with some of them.

## Set passwords

As I mentined earlier, all the Linux cloud images have their password authentication of the default user disabled for security reasons.

We can use cloud-init `Set Passwords` module to enable password authentication.

{% highlight yaml %}
#cloud-config
password: mypassword123
chpasswd: { expire: False }
ssh_pwauth: True
{% endhighlight %} 

This cloud-config does three things. 

`password` set the password of the default user. In Ubuntu this user is `ubuntu`, and in Centos the defaut user is `centos`.

By default this password is set to expired, so that the user has to reset the password at the first login.
`chpasswd  { expire: False }` disables this behavior, so password need not be reset.

`ssh_pwauth: True` enables password authentication for SSH login.

## Configure key based authentication

If you need more security, you could set the authentication keys instead of enabling password authentication.

{% highlight yaml %}
#cloud-config
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDMXxvEtXqvqVJkYsJAhyppj5ZTStp0DEbeHWioziTlaZ0aTi0JHW9L3xDESyzPcmLxkGoGxXT6Tmx9AwUbhG4N1LrQw+8M96ZNj5e+repOUxR+ly+xl3UqxeVp46fllvSFnvXBwJCkyWR67Mbb/As9rVhld9SqzBmUriWtIhgJHv9MKqxT9Y4xxFyHGsg75WREtvzSA97QA9hHzfb86dn+t6Ir+hOvtVMq/V9og2CSbVqgPIElz0FxznpdhMPDGTRBZ/FL3XrSufQN+Ft9fqz78iskxv5AwmApmjT8mnoDBY+WDdnjJutkV/cwkBpF83nWdTEmXl2lDV5B1IBOTS1x ubuntu@my-server
{% endhighlight %} 

`ssh-authorized-keys` accepts a list of public keys which get added to the authkeys file of the default user, so that we can use SSH key based authentication. 

## Creating Users

Cloud-init can create users and groups and assign users to groups.

{% highlight yaml %}
#cloud-config
groups:
  - cloud
  - qubes
users:
  - default
  - name: cloudqubes
    shell: /bin/bash
    groups: cloud
    lock_passwd: false
    passwd: $6$rounds=4096$pd39WNugExZ2wI$LdHyr9jpullz7pmjl5WwEAULp5FK20BZLYg4N5YCUvX8QfS1depsNNh9RA7gNBIn0Vs5O4DzL4RM/jp5dMrwe1
  - name: indika
    shell: /bin/bash
    groups: [cloud, qubes]
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDEWi+eymLXDclcjc+ycQUm+mDmCw+yrE2D+EBKg+5Z2ugkMZ5ZrQHS4rWsEb9VorYcRJjJfC56u/gpooKRWzwqJtYjLMjxwHphc/+sCjwINMOuSOGLXksToRZPhSjTz5YjdajVdgacBjn/Pe5lU8HYfZxMeWx/thzpPUscJLiLXnlxKoQHm2urWyWbmvXxg4y1TYbeFUN8xH/2S9UFjm4QDAPNdsR3u7TYDJaGTTEoWz/l8n3qNnefZycWGnKihhobGOXsbNOf8Gb52J7kBmGfDgoRU8q9LMaiPPeXwTvdvhdLio4ce1tUb8CF3mFYwcszXiYPS+7SlhX0jzmP8DXZ ubuntu@palo-alto-jumpserver
{% endhighlight %} 

`groups` key accepts a list of groups to be created.

`users` accepts an array of user objects.

The user is created with password authentication disabled by default, so you need set `lock_passwd: false` to enable password authentication.

The `passwd` within `users` key is a hash, and not the plain text password. This hash can be generated using `mkpasswd` utility which should be available in most Linux distributions.

{% highlight bash %}
$ mkpasswd --method=SHA-512 --rounds=4096 "mypassword"
{% endhighlight %} 

Instead of password authentication, we can set the authentication keys for user with `ssh_authorized_keys`, which accepts a list of public keys for SSH authentication.

The `groups` key inside `user` object accepts a list of groups which the user belong to. These groups must either already exist in the system, or must be created with `groups` key in cloud-init.

The `default` directive under `users` instruct the system to leave the default user account intact. If omitted the system will make the first user under the `users`, the default user.

## Package management

Different linux distributions use different package management software such as apt in Ubuntu, yum in RHEL/Centos, yast in Suste etc. Encapsulating these underlying variances, cloud-init implements a unified interface for package management, on [all its supported Linux distributions][availability].

Updating the package repository - the list of available packages and their versions - is a common requirement of a new VM. This is done via `package_update` directive in cloud-init.

{% highlight yaml %}
#cloud-config
package_update: true
{% endhighlight %} 

Cloud-init can upgrade installed packages as well. After upgrading some packages it may be required to reboot the system, which is handled by `package_reboot_if_required` directive. When set to `true` it reboots the system.

{% highlight yaml %}
#cloud-config
package_upgrade: true
package_reboot_if_required: true
{% endhighlight %} 

Package installation is handled by `package` directive, which accepts a list of packages. It is a good practice to update the repository before installing new packages
{% highlight yaml %}
#cloud-config
package_update: true
packages:
  - squid
  - unrar
{% endhighlight %} 

### Additional support for APT

Sometimes, package manager needs additional configurations. Cloud-init has a module `Apt Configure` which supports user specific configurations for APT pacakge manager. 

Using this module let's configure proxy server for apt.

{% highlight yaml %}
#cloud-config
package_update: true
apt:
  http_proxy: http://10.30.30.10:8080 
  https_proxy: https://10.30.30.10:8080
{% endhighlight %} 

You need not be dissapointed for cloud-init not having such modules for other package managers, because you could implement a work-around with `Write Files` module.

## Writing to files

The `write_files` directive can wirte to an array of arbitrary files.
{% highlight yaml %}
#cloud-config
write_files:
  - content: |
      # My config file
      param1="xyz"
      parma2=50
    path: /etc/my-config
    permissions: '0644'
  - encoding: base64
    content: bXkgbXVsdGkgbGluZQpiYXNlIDY0IHN0cmluZw==
    path: /etc/my-base64-config
    permissions: '0755'
  - content: |
      10.199.254.115 ftp-server
    path: /etc/hosts
    append: true
{% endhighlight %} 

The `path` specifies the destination of the file.
The optional parameter `encoding` is set to  `text/plain` by default, but can accepts a range of formats such as `base64`, `gzip` etc. In such cases content is decoded with the specified encoding format, prior to writing. 

The `content` kay accepts a multiline string, which will be written to the file.
Optionally, the permission of the file can be set, with `permissions` key.

There's another optional key `append` which can be used to append the content to an existing file.

## Run commands on first boot

Cloud config has modules to accomplish most common tasks reqiured for setting up a new instance. However, if you find any specific taks that cannot be achieved with one of those modules you can use `runcmd` module to run arbitrary commands at the first boot.
`runcmd` accepts an array of strings as commands.

{% highlight yaml %}
runcmd:
  - mkdir /disks
  - mkdir /disks/b
{% endhighlight %} 


# Cloud-init log files

When things go wrong, log files are your friend.

Config file `/etc/cloud/cloud.cfg.d/05_logging.cfg` specifies the logging configurations of cloud-init. It has two main log files.

The console output is logged at `/var/log/cloud-init-output.log`. This would be the first place to look, when troubleshooting. 

Cloud-init debug log is written to `/var/log/cloud-init.log`. It can help you for more advanced troubleshooting.

# Why use cloud-init?

Automation is a key aspect of cloud computing and NFV. Cloud-init provides a robust solution, for automating most of the deployment time configurations in VMs, also known as day-0 configurations. 

*[VM]: Virtual Machine

[Ubuntu]: https://cloud-images.ubuntu.com/
[Fedora]: https://alt.fedoraproject.org/cloud/
[Centos]: https://cloud.centos.org/
[availability]: https://cloudinit.readthedocs.io/en/latest/topics/availability.html
[cloud-init]: https://cloudinit.readthedocs.io/en/latest/index.html
[data-sources]: https://cloudinit.readthedocs.io/en/latest/topics/datasources.html
[modules]: https://cloudinit.readthedocs.io/en/latest/topics/modules.html
