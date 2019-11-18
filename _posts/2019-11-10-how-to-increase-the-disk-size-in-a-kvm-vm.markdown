---
layout: post
title:  "How to increase the disk size in a KVM VM"
date:   2019-11-04 19:00:00 +0530
categories: hands-on KVM disk
---

In a [previous post]({% post_url 2019-09-13-virtualization-without-openstack %}) we created a VM on KVM without the support of OpenStack. In this post let's increase its disk size.

First we have to shutdown the VM.

{% highlight shell %} 
$ virsh list --all
 Id    Name                           State
----------------------------------------------------
 47    ubuntu                       running

$ virsh shutdown ubuntu

$ virsh list --all
 Id    Name                           State
----------------------------------------------------
 47    ubuntu                       shut off
{% endhighlight %}

Please note that it will take a few minutes for the VM to enter `shut off` state.

Now locate the disk image of the VM,  and use `qemu-img` to increase the disk size by 10GB.

{% highlight shell %} 
$ virsh domblklist ubuntuD
 Target     Source
 ------------------------------------------------
 vda        /disk/vm-disk/ubuntu.qcow2
 hda        /disk/cloud_init/ubuntu.iso

$ sudo qemu-img resize /disk/vm-disk/ubuntu.qcow2 +10G
{% endhighlight %}

Then start the VM.

{% highlight shell %} 
$ virsh start ubuntu
{% endhighlight %}

