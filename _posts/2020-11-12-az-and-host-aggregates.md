---
layout: post
title:  "All about Availability Zones and Host Aggregates"
date:   2020-11-12 05:10:00 +0530
categories: [handson, OpenStack]
tags: [OpenStack, avaialbility zone, host aggregate]
---


The *availability zones* and *host aggregates* are familiar terms in OpenStack, but often lead to confusion and misuse. Rightly used, they can help efficient utilization of precious computing resources.

The concept of availability zones is implemented in three main OpenStack projects; Nova, Cinder, and Neutron, in entirely differnt ways specific to each project. The Nova availability zones, which will be our focus here, are more commonly used than the other two.

# Availability zones and host aggregates in Nova

Both availability zones and host aggregates are used to group compute hosts, and deploy VMs on target groups.


![Grouping computes with Avaialbility zones and host aggregates](/assets/images/host-grouping-with-az-and-ha.png)

An OpenStack deployment can have any number of availability zones. An availability zone can have multiple hosts, but a particular host can exist in only one availability zone. 

Each availability zone has one or more host aggregates. Each host aggregate can have multiple hosts, and a single host can belong to several host aggregates within the same avaialbility zone.

Host aggregates and availability zones are created by administrator, and are not project specific.

# Creating availability zones and host aggregates

Availability zones are not modeled in a database table in OpenStack, but are defined as metadata in host aggregates. Therefore, you can't directly create an avaialbility zone via OpenStack CLI. It always has to be created with a host aggregate.

Create host aggregate `hg1` which belongs to availability zone `az1`:
{% highlight shell %}
$ openstack aggregate create --zone az1 hg1
{% endhighlight %}

Create a second host aggregate in the same avaialbility zone:
{% highlight shell %}
$ openstack aggregate create --zone az1 hg2
{% endhighlight %}

Create a second availability zone:
{% highlight shell %}
$ openstack aggregate create --zone az2 hg3
{% endhighlight %}

List the host aggregates:
{% highlight shell %}
$ openstack aggregate list
{% endhighlight %}

List the availability zones:
{% highlight shell %}
$ openstack availability zone list
{% endhighlight %}
Dont't be surprised for not seeing the avialabiity zones that you just created. They will only be displayed here, if they have at leat one host compute.

# Managing hosts in avaialbility zones and host aggregates

Confusions may arise when assigning host computes to aggregates and avialability zones. Since availability zones are not modeled as a table in OpenStack databases, you cannot directly add a host to an availability zone, but has to do it via host aggregate. 

Now, let's add a host to our host aggregate `hg1`. By doing so, we automatically add the host to the `az1` availability zone as well.

{% highlight shell %}
$ openstack aggregate add host hg1 microstack-server
{% endhighlight %}

Add the host to hg2 in same avaialbility zone:
{% highlight shell %}
$ openstack aggregate add host hg2 microstack-server
{% endhighlight %}

List the hosts in host aggregate:
{% highlight shell %}
$ openstack aggregate show hg1
{% endhighlight %}

What if, we try to add the host to `hg3` which is in availability zone `az2`.
{% highlight shell %}
$ openstack aggregate add host hg3 microstack-server
Cannot add host to aggregate 3. Reason: One or more hosts already in availability zone(s) ['az1', 'az1']. (HTTP 409) (Request-ID: req-5894a97c-bdf2-4a2e-a786-7d06aacf0321)
{% endhighlight %}
We get an error saying our host already belong to `az1`.

If we are to add a host to a different avialability zone, we must first remove the host from the current availability zone, by removing it from all host aggregates that it currently belongs to.
{% highlight shell %}
$ openstack aggregate remove host hg1 microstack-server
$ openstack aggregate remove host hg2 microstack-server
{% endhighlight %}

Now, we can add our host to `hg3` and thus to avaialbility zone `az2`.
{% highlight shell %}
$ openstack aggregate add host hg3 microstack-server
{% endhighlight %}

# Selecting availability zones and host aggregates at VM creation

An availability zone can be directly specified at the VM creation, so that the VM would be deployed on a host belonging to the particular availability zone. On the other hand, the host aggregate cannot be directly specified at the VM creation. It is done by matching metadata in host aggregate with extra specifications of the VM flavor. 

## Selecting availability zone
We can direclty use the `avaialbility_zone` parameter in OpenStack CLI or Heat template for creating a VM in a particular avaialbility zone.

VM creation via CLI:
{% highlight shell %}
$ openstack server create --image Fedora-Cloud-Base-31-1.9.x86_64 --flavor m1.small --network private --availability-zone az2 fedora_vm2
{% endhighlight %}

VM creation via Heat (Note that only a part of the template is shown below):
{% highlight yaml %}
  ubuntu_vm:
    type: OS::Nova::Server
    properties:
      name: "ubuntu"
      image: bionic-server-cloudimg-amd64-v2
      flavor: { get_resource: flavor }
      availability_zone: "az2"
      networks:
        - port: { get_resource: oam_port }
      config_drive: true
      user_data_format: RAW
      user_data: |
        #cloud-config
        password: MyTestVm
        chpasswd: { expire: False }
        ssh_pwauth: True
{% endhighlight %}

## Selecting host aggregagte

Selecting an availability zone is straightforward, but selecting a host aggregate isn't. They are selected by matching their extra properties with that of flavors.

Host aggregates have a set of extra properties that take arbitrary key value pairs.

{% highlight shell %}
$ openstack aggregate set --property hg3_host=true hg3
{% endhighlight %}

Then, this key value pair can be refered within the scope `aggregate_instance_extra_specs` in VM flavor.
{% highlight shell %}
openstack flavor create --property "aggregate_instance_extra_specs:hg3_host"="true" --vcpus 2 --ram 1024 --disk 2 flavor_1
{% endhighlight %}

Create a VM with `flavor_1` in availability zone `az2`, and it will be instantiated in a host within aggregate `hg3`.

{% highlight shell %}
$ openstack server create --image Fedora-Cloud-Base-31-1.9.x86_64 --flavor flavor_1 --network private --availability-zone az2 fedora_vm2
{% endhighlight %}

## Same flavor, different availability zones

It's possible to configure same key value pair in multiple host aggregates, so that we can use same flavor to select host aggregates in different availability zones.

{% highlight shell %}
$ openstack aggregate set --property web_app=true hg2
$ openstack aggregate set --property web_app=true hg3
{% endhighlight %}
Note that `hg2` is in zone `az1`, and `hg3` is in `az2`.

Create the flavor:
{% highlight shell %}
openstack flavor create --property "aggregate_instance_extra_specs:web_app"="true" --vcpus 2 --ram 1024 --disk 2 web_app_flavor
{% endhighlight %}

Create two VMs in different zones:
{% highlight shell %}
$ openstack server create --image Fedora-Cloud-Base-31-1.9.x86_64 --flavor web_app_flavor --network private --availability-zone az1 web_app_vm1
$ openstack server create --image Fedora-Cloud-Base-31-1.9.x86_64 --flavor web_app_flavor --network private --availability-zone az2 web_app_vm2
{% endhighlight %}

The `web_app_vm1` will be created in a host under `hg2` in zone `az1`, and `web_app_vm2` will be created in a host belonging to `hg3` in `az2`.

# Why do we need availability zones and host aggregates? 

Grouping hosts is required for operational best practices in OpenStack. 

## Separating hosts based on computing capabilities

In some OpenStack deployments, computing capability of host computes may differ. Here are some examples.

* SR-IOV - a feature used by high-throughput applications - could be enabled only in a set of computes equipped with high bandwidth NICs. 

* A set of computes optimized for machine learning applications, have GPU cards. 

Grouping these computes to separate availability zones, enables us to effectively utilize their capabilities by deploying only specific applications in to those zones.

## Achieving redundancy

In leaf-spine networking architecture leaf switches are deployed in pairs. 

![Using availability zones for redundancy.](/assets/images/leaf-spine-az.png)

Using availability zones to segregate host computes based on the leaf pairs they are connected, and distributing  applications to both zones, can help achieve a certain level of redundancy. If any problem occurs in the first leaf pair (Leaf-1 & Leaf-2), the applications would still be able to perform with VMs in zone `AZ2`.

## Optimizing application performance

Some applications have lofty demands for internal data transfers. Placing such applications within a single leaf pair can help internal traffic, avoid traversing the spine switch. It will increase application performance as well as reduce strain on the data center network fabric.

However, such an approach can negatively impact redundancy, since a problem in the leaf pair would yield the application out of service. You may circumvent the problem by deploying two instances of the application under different leaf pairs, working in load sharing mode.

## Efficient compute resource utilization

Above use-cases primarily take advantage of availability zones for placing VMs. Now, we will look at a usecase that make use of host aggregates within availability zones.

Your company has deployed OpenStack in its new data center, for hosting applications on VMs instead of bare-metal. You keep on migrating exisiting applications to new OpenStack, and at some point realize that your applications are distributed across all computes randomly. Now, if you want to create a big size VM, it may be impossible because all computes are partially utilized.

Is there a better way?

![Using availability zones with host aggregates.](/assets/images/leaf-spine-az-hg.png)

Using host aggregates in combination with avaialbility zones, we can effectively prevent VMs being distributed randomly. As shown in the figure we use `ha-az1-app1` and `ha-az2-app1` aggregates for deploying `application-1`. Then VMs of `application-1` would be confined to compute 1,2,9 and 10. Similarly, `application-2` deployed with `ha-az1-app2` and `ha-az2-app2` will utilize computes 1-4 and 9-12. Following this method, we keep on adding two host aggregates in the two zones for each application, ensuring that the new applications are deployed to computes which are already partially utilized.

This type of controlled VM placement can effectively utilize compute resources incrementally, leaving out some computes totally free for deploying large capacity VMs, should a need arise.

There is no single best way for grouping computes with avaialbility zones and host aggregates. Feel free to share how, you are using them.

*[VM]: Virtual Machine
*[VMs]: Virtual Machines



