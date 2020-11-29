---
layout: post
title:  "Happy Virtualizing with Multipass"
date:   2020-01-18 05:48:00 +0530
categories: [hands-on, Linux]
tags: [multipass, VM]
---

**Did you imagine that setting up VMs in your Ubuntu workstation is this easy?**

Had you ever tried to setup KVM, and launch VMs using `virt-install` on Ubuntu Desktop? Then, you will definitely appreciate [Multipass] [multipass]. Launching a VM with [Multipass] [multipass] is so easy and straightforward that you will be up and running within minutes.

While being a product of [Canonical] [canonical]; the company behind [Ubuntu] [ubuntu], [Multipass] [multipass] runs not only on Linux but also on Windows and Mac. 

So, let's get started.

# Installation 

[Multipass] [multipass] is available as a snap package. While we used the latest version of [Ubuntu] [ubuntu] (19.10), this will work on most newer versions of Linux.

{% highlight shell %}
$ snap install multipass --classic
{% endhighlight %} 

Then, check that you have write access to the `multipass_socket`.

{% highlight shell %}
$ ls -l /var/snap/multipass/common/
total 16
drwxr-xr-x 3 root root 4096 ජන   15 07:02 apparmor.d
drwxr-xr-x 3 root root 4096 ජන   15 07:02 cache
drwxr-xr-x 3 root root 4096 ජන   15 07:02 data
srw-rw---- 1 root sudo    0 ජන   15 07:02 multipass_socket
-rw-r--r-- 1 root root   51 ජන   15 07:02 snap_config
 {% endhighlight %} 

`multiplass_socket` is a socket file used by multipass. Socket files are a type of file used by Linux systems to facilitate interprocess network communication. You could write to it similar to a TCP/IP port, but since it is a file, you could also apply the write protection capabilities that are available to a file.

As per the above, the `sudo` group has write access to `multipass_socket`. Let's check what groups do we belong to:

{% highlight shell %}
$ groups
cloudqubes adm cdrom sudo dip plugdev lpadmin lxd sambashare
{% endhighlight %}

If `sudo` group is there in the output, you have write permission to the `multipass_socket`. If not you have to add your user to the `sudo` group:

{% highlight shell %}
$ usermod -aG sudo <username>
{% endhighlight %}

# Launch the first VM

Multipass is configured with some defaults, so you can get started quite easily.

{% highlight shell %}
$ multipass launch --name my_first_vm
{% endhighlight %} 

This will launch a VM using Ubuntu 18.04 LTS os the OS. The VM will be configured with 1 vCPU, 1GB memory, and 5GB harddisk. Since this is the first time, multipass will download the image, so will take some time to launch the VM. But if you use the same image the second time, [Multipass] [multipass] will reuse the image without donwloading.

Once the VM is ready, you can query its information.

{% highlight shell %}
$ multipass list
Name                    State             IPv4             Image
my_first_vm             Running           10.124.70.145    Ubuntu 18.04 LTS

$ multipass info my_first_vm
Name:           my_first_vm
State:          Running
IPv4:           10.124.70.145
Release:        Ubuntu 18.04.3 LTS
Image hash:     a720c34066dc (Ubuntu 18.04 LTS)
Load:           0.64 0.23 0.08
Disk usage:     1.1G out of 4.7G
Memory usage:   100.8M out of 985.1M

{% endhighlight %} 

A VM can be stopped, to free up its CPU and memory. Then, can be started again when youu want.

{% highlight shell %}
$ multipass stop my_first_vm
$ multipass list                                  
Name                    State             IPv4             Image
my_first_vm             Stopped           --               Ubuntu 18.04 LTS

$ multipass start my_first_vm
{% endhighlight %} 

# Working on the VM

You can execute any command on a VM.

{% highlight shell %}
$ multipass exec my_first_vm -- ls -la
total 32
drwxr-xr-x 5 ubuntu ubuntu 4096 Jan 17 06:19 .
drwxr-xr-x 3 root   root   4096 Jan 17 06:18 ..
-rw-r--r-- 1 ubuntu ubuntu  220 Apr  5  2018 .bash_logout
-rw-r--r-- 1 ubuntu ubuntu 3771 Apr  5  2018 .bashrc
drwx------ 2 ubuntu ubuntu 4096 Jan 17 06:19 .cache
drwx------ 3 ubuntu ubuntu 4096 Jan 17 06:19 .gnupg
-rw-r--r-- 1 ubuntu ubuntu  807 Apr  5  2018 .profile
drwx------ 2 ubuntu ubuntu 4096 Jan 17 06:18 .ssh
{% endhighlight %}

You can also directly access the shell.

{% highlight shell %}
$ multipass shell my_first_vm
{% endhighlight %}


# Delete VM

When no longer needed the VM can be deleted. But deleting will not remove its disk image, so you can always recover it.

{% highlight shell %}
$ multipass delete my_first_vm
$ multipass list
Name                    State             IPv4             Image
my_first_vm             Deleted           --               Not Available
$ multipass recover my_first_vm
$ multipass list
Name                    State             IPv4             Image
my_first_vm             Stopped           --               Ubuntu 18.04 LTS
{% endhighlight %}

If you need to permanently delete a VM and remove the data, you have to delete and purge. But this will purge all deleted images, since `purge` does not accept any other parameters.

{% highlight shell %}
$ multipass purge
{% endhighlight %}

# Launch VM with a specific OS version

You can get a list of available images, and use one one of those to launch a VM. Let's launch a VM running Ubuntu 19.04.

{% highlight shell %}
$ multipass find
Image                   Aliases           Version          Description
snapcraft:core          core16            20200115         Snapcraft builder for Core 16
snapcraft:core18                          20200115         Snapcraft builder for Core 18
core                    core16            20190806         Ubuntu Core 16
core18                                    20190806         Ubuntu Core 18
16.04                   xenial            20200108         Ubuntu 16.04 LTS
18.04                   bionic,lts        20200107         Ubuntu 18.04 LTS
19.04                   disco             20200109         Ubuntu 19.04
19.10                   eoan              20200107         Ubuntu 19.10
daily:20.04             devel,focal       20200116         Ubuntu 20.04 LTS
$ multipass launch --name cloudqubes 19.10
{% endhighlight %}

# Customize VM capacity

Launch a VM with 2 vCPUs and 4G memory:

{% highlight shell %}
$ multipass launch --cpus 2 --mem 4G --name devstack 18.04
{% endhighlight %}

# Sharing files between host and guest

You can easily share files between the host and VM with [Multipass] [multipass]. Just mount any local directory in the host machine at a directory in VM with `mount`. Let's mount the local directory `/home/cloudqubes/data` in our host machine, at `/home/ubuntu/devstack_data` in the newly created devstack VM.

{% highlight shell %}
multipass mount /home/cloudqubes/data devstack:/home/ubuntu/devstack_data
{% endhighlight %}

Unmounting is also easy.

{% highlight shell %}
$ multipass unmount cloudqubes
{% endhighlight %}

# Getting help

`multipass -h` will list the available commands with a brief explanation. If you need more information on specific command, `multipass <command_name> -h` will give information on parameter usage of that specific command.

## References

1. [Multipass Documentation] [multipass_docs]

[multipass]: https://multipass.run/
[ubuntu]: https://ubuntu.com/
[canonical]: https://canonical.com/
[multipass_docs]: https://multipass.run/docs