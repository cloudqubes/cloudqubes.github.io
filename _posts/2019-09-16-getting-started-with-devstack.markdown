---
layout: post
title:  "Getting Started with DevStack"
date:   2019-09-16 04:20:00 +0530
categories: hands-on devstack
---

**Setting up a minimum OpenStack installation just to get your hands dirty, requires at least two high-end computers. But there is an easier way - DevStack.**

DevStack is a collection of scripts that can setup a fully functional OpenStack environment in a single server. It will install the latest versions of OpenStack components directly from their master git branches. While not meant to be used for a production system, it's great for experimenting with OpenStack. 

We will install DevStack on a VM instead of a physical machine, because DevStack will make many changes to the operating system. If something goes wrong, we can easily recreate a new VM. If you have a server running Ubuntu you could setup KVM and quickly get a VM running by following our previous [post][virtualization_w].  

We will use Ubuntu 16.04 LTS as the OS of out VM. While you may be tempted to use the latest version, a mature OS version is likely to give you less trouble during installation. You need to have Internet connectivity from the VM, because multiple packages need to be downloaded during the installation. 

## Step 1: Create a user 

DevStack needs to be run as a non-root user with sudo privileges enabled. So we will create a user named `stack` and add sudo privileges. 
{% highlight shell %} 
$ sudo useradd -s /bin/bash -d /opt/stack -m stack 
$ echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack 
{% endhighlight %} 

Then we switch to the newly created user. 
{% highlight shell %} 
$ sudo su - stack 
{% endhighlight %} 
 
## Step 2: Download DevStack 
{% highlight shell %} 
$ git clone https://opendev.org/openstack/devstack 
$ cd devstack 
{% endhighlight %} 

## Step 3: Update the local.conf 

DevStack configurations are managed by the local.conf file. Create this file in the `devstack` folder and update with below content.  
{% highlight shell %} 
[[local|localrc]] 
ADMIN_PASSWORD=secret 
DATABASE_PASSWORD=$ADMIN_PASSWORD 
RABBIT_PASSWORD=$ADMIN_PASSWORD 
SERVICE_PASSWORD=$ADMIN_PASSWORD 
enable_plugin heat https://opendev.org/openstack/heat 
{% endhighlight %} 

Heat is not installed with DevStack by default, so we have included the configurations to install it specifically.  

## Step 4: Install  

Installation script should not be run as sudo, or it will fail. 
{% highlight shell %} 
$ ./stack.sh 
{% endhighlight %} 

If  errors are encountered during installation, the they would be logged in `/opt/stack/logs/`. If you wish, you can always rollback and start over. It is important to remove and purge MySQL, because `unstack` will not remove it. 
{% highlight shell %} 
$ ./unstack.sh 
$ sudo apt-get remove --purge mysql* 
{% endhighlight %} 
 

## Step5: Verification 

Once the installation script is completed, we have a working OpenStack setup. We can verify the installed OpenStack components using the OpenStack CLI.
{% highlight shell %} 
$ source openrc admin 
$ openstack service list 

+----------------------------------+-------------+----------------+ 
| ID                               | Name        | Type           | 
+----------------------------------+-------------+----------------+ 
| 2091dde895aa4a0eab3c12907262781f | nova        | compute        | 
| 68431d3de2fc4127bef369eb96573d82 | heat-cfn    | cloudformation | 
| 6b4430581cc649acabde79a6a208a681 | neutron     | network        | 
| 7edcff68a971419f8ad079667a66cc12 | cinder      | block-storage  | 
| 8a0e8faf26f44f618dd5983f1d31be06 | heat        | orchestration  | 
| 99413a9a18834d508d57bf104ea12207 | keystone    | identity       | 
| a1d2ad467eec46b99f8e4459d7b8fd24 | glance      | image          | 
| b29a495953384e0aa5bab27e3190e918 | placement   | placement      | 
| b65fe76eff38494bb87e21796a1a89b3 | nova_legacy | compute_legacy | 
| c4883fdadf584150a49f8f79a6b65770 | cinderv3    | volumev3       | 
| d789e2a296eb4ac0a1e0f039c4af6e79 | cinderv2    | volumev2       | 
+----------------------------------+-------------+----------------+ 
{% endhighlight %} 

[devstack]: https://docs.openstack.org/devstack/latest/ 
[virtualization_w]: {{site.baseurl}}{% post_url  2019-09-13-virtualization-without-openstack%}