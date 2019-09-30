---
layout: post
title:  "Virtualization without OpenStack"
date:   2019-09-13 05:10:00 +0530
categories: hands-on kvm virtualization
---

**OpenStack makes it easy to manage a large number of virtual machines, across multiple physical hosts. But you can create VMs without it. In this hands-on exercise we will create a VM on a server running Ubuntu 16.04, without using OpenStack.**

Essentially OpenStack is a controller which interworks with the hypervisor software running on multiple host computes, and fascilitates the management of virtual machines . The hypervisor is responsible for emulating virtual CPU resources, and allocating memory and disk space for the VMs to function. 

OpenStack supports a range of hypervisors including KVM, LXC and Xen. For this exercise we will use KVM.  

## Step 1: Install KVM 

Let's install KVM and other required packages with apt. 
{% highlight shell %} 
$ sudo apt-get install virtinst  uvtool  qemu-kvm libvirt-bin ubuntu-vm-builder bridge-utils 
{% endhighlight %} 

## Step 2: Download the OS for VM 

Download the bionic-server-cloudimg-amd64.img from Ubuntu [Cloud Images] [cloud_images] We will be using this for the OS of our VM. 

## Step 3: Prepare the cloud-init config file 

Ubuntu cloud images come with a default username `ubuntu`, with SSH login disabled. We wll enable it and create a new password in the config file. 

{% highlight shell %} 
$ echo '#cloud-config 
password: Password1 
chpasswd: { expire: False } 
ssh_pwauth: True 
hostname: ubuntuA' >> ubuntu_a.txt 
{% endhighlight %} 
 

Once the text file is created we will convert it to ISO format, so that it can be read by our VM while starting.  

{% highlight shell %} 
$ cloud-localds ubuntu_a.iso ubuntu_a.txt 
{% endhighlight %} 

## Step 4: Launch VM 

Now we can launch our VM with the following command. I have create a directory `disk` under root of the host machine, but you can use any directory you want. 

{% highlight shell %} 
$ sudo virt-install \ 
            --name ubuntuA\ 
            --vcpus 4\ 
            --memory 4096 \ 
            --disk /disk/vm-disk/bionic-server-cloudimg-amd64.img,device=disk,bus=virtio \ 
            --disk /disk/cloud_init/ubuntu_a.iso,device=cdrom \ 
            --os-type linux \ 
            --os-variant ubuntu16.04 \ 
            --virt-type kvm \ 
            --graphics none \ 
            --network network=default \ 
            --import 
{% endhighlight %} 

At this stage let's not worry about each and every parameter here. We are naming our VM as 'UbuntuA', and allocating 4 vPCUs and 4096MB of memory. The virtual network name 'default' is created when KVM is installed and we are connecting our VM to that. 

If all goes well you would be connected to the console of the VM and something like this would be prompted. 

{% highlight shell %} 
WARNING  CDROM media does not print to the text console by default, so you likely will not see text install output. You might want to use --location. See the man page for examples of using --location with CDROM media 

Starting install... 
Creating domain...                                                                                                                               |    0 B  00:00:01 
Connected to domain ubuntuA 
Escape character is ^] 
{% endhighlight %} 

 

A long list of information will follow as the VM boots, and then login prompt will appear. Now you will be able to login to the VM with the username ubuntu and the password `Password1`. You can use Ctl+] to exit from the console. 

We can view the staus of the VM using `virsh`.  
{% highlight shell %} 
$ virsh list 
 Id    Name                           State 

---------------------------------------------------- 
 35    ubuntuA                        running 
{% endhighlight %} 

Now our VM is ready, but to login via SSH we need to find the IP address assigned to it. 

{% highlight shell %} 
$ virsh net-dhcp-leases default 
{% endhighlight %} 

This will list all IP addresses that are assigned from the virtual network `default`, but in our case there would be only one. If everything is working fine, you should be able to login via SSH. 

{% highlight shell %} 
ssh ubuntu@X.X.X.X 
{% endhighlight %} 

Alternatively we can login to the VM via console. 
{% highlight shell %} 
virsh console ubuntuA 
{% endhighlight %} 

Now we will shutdown the VM gracefully. 
{% highlight shell %} 
$ virsh shutdown ubuntuA 
{% endhighlight %} 

Shutting down the VM will retain all files related to the VM, and we would be able to start the VM again. 

{% highlight shell %} 
$ virsh start ubuntuA 
{% endhighlight %} 

If we need to delete the VM and its configuration from KVM we can do it with `virsh undefine`. 
{% highlight shell %} 
$ virsh undefine ubuntuA 
{% endhighlight %}



*[VM]: Virtual Machine 
*[VMs]: Virtual Machines 
*[OS]: Operating System 



[cloud_images]: https://cloud-images.ubuntu.com/ 