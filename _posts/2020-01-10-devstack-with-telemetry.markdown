---
layout: post
title:  "DevStack with Telemetry"
date:   2020-01-10 03:00:00 +0530
categories: hands-on devstack openstack telemetry
---

**OpenStack telemetry depends on two major components: ceilometer and aodh which are not installed by DevStack default configuration.**

In a previous post we installed OpenStack in a single VM with DevStack. In its default settings DevStack installs only a minimum number of OpenStack components: keystone, nova, neutron, glance, cinder and horizon. So, in that DevStack installation we explicitly included `heat`, which is the orchestration service in OpenStack.

For the purpose of implementing telemetry, we will add two more componenets in this DevStack installation.

## Ceilometer

Ceilometer is a data collection service that can collect and normalize data across multiple OpenStack components.

## Aodh

Aodh works with Ceilometer to trigger actions based on based on predefined rules.

Combined with [heat] these two components can implement application auto-scaling in OpenStack. Since auto-scaling is a separate discussion, now we will focus on installing OpenStack with all these components.

We are using a VM running Ubuntu 18.04, which is the most tested OS for DevStack today.

# Step 1: Create User
DevStack needs to be run as a non-root user with sudo privileges enabled. So, create a user named `stack` and add sudo privileges. 
{% highlight shell %} 
$ sudo useradd -s /bin/bash -d /opt/stack -m stack 
$ echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack 
{% endhighlight %} 

Now, switch to the newly created user. 
{% highlight shell %} 
$ sudo su - stack 
{% endhighlight %} 

# Step2: Download DevStack 
{% highlight shell %} 
$ git clone https://opendev.org/openstack/devstack 
$ cd devstack 
{% endhighlight %} 

# Step3: Update the local.conf

DevStack installation configurations are managed by the `lcoal.conf` file. Create this file in the `devstack` folder.

{% highlight shell %} 
[[local|localrc]]
ADMIN_PASSWORD=secret
DATABASE_PASSWORD=$ADMIN_PASSWORD
RABBIT_PASSWORD=$ADMIN_PASSWORD
SERVICE_PASSWORD=$ADMIN_PASSWORD
enable_plugin heat https://opendev.org/openstack/heat
CEILOMETER_BACKEND=mongodb
enable_plugin ceilometer https://opendev.org/openstack/ceilometer
enable_plugin aodh https://opendev.org/openstack/aodh
CEILOMETER_NOTIFICATION_TOPICS=notifications,profiler
{% endhighlight %}

Since DevStack does not include heat, ceilometer and aodh, we have explicitly included them using the `enable_plugin` parameter.

The parameter, `CEILOMETER_NOTIFICATION_TOPICS` enables [OSProfiler] [os_profiler] in ceilometer.

# Step 4: Install

Now run the installation script.
{% highlight shell %} 
$ ./stack.sh 
{% endhighlight %} 

Now we have installed OpenStack with heat, ceilometer and aodh. In a future post we will explore more about ceilometer and configure other nodes to send data to it.


*[VM]: Virtual Machine

[devstack]: {{site.baseurl}}{% post_url 2019-09-16-getting-started-with-devstack%}
[heat]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat %}
[os_profiler]: https://docs.openstack.org/osprofiler/latest/index.html
