---
layout: post
title:  "Introduction to Heat"
date:   2019-09-22 04:00:00 +0530
categories: hands-on openstack heat
---

**Heat is the orchestration engine, and is one of the main projects in OpenStack. It manages OpenStack resources via human and machine readable template files, called HOT.** 

A HOT file allows you to define OpenStack infrastructure resources such as servers, network ports, security groups etc., and their runtime parameters. Once a HOT file is created, it can be used via Horizon GUI or OpenStack CLI to create a stack. The creation of a stack will instantiate all the resources such as VMs defined in the HOT file, and the deletion of the stack will delete all the associated resources. 

Heat is also capable of updating a stack so that it is possible to add more VMs to an already defined stack, without interrupting the running VMs. 

Heat has various advanced features such as ResourceGroup that make it easy to manage a large number of resources. While it would not be possible to cover all of these in a single post, we hope to explore them in future. 

Now let's write a simple HOT file for defining a single VM. For the OS of our VM we'll use CirrOS which comes with OpenStack by default.  

You can verify the image name and the available flavors as below. 

{% highlight shell %} 
$ source openrc 
$ openstack image list 
$ openstack flavor list 
{% endhighlight %} 
 

Create a HOT file with the following content and save it as `simple_hot.yaml` in the working directory. 

{% highlight YAML %} 
heat_template_version: 2018-08-31 
description: Ubuntu VM 
parameters: 
    network_name: 
        type: string 
        default: "v_net1" 
    subnet_name: 
        type: string 
        default: "v_net1_subnet" 
    image_name: 
        type: string 
        default: "cirros-0.4.0-x86_64-disk" 
    flavor_name: 
        type: string 
        default: "m1.tiny" 
resources: 
    network_port: 
        type: OS::Neutron::Port 
        properties: 
            name: "network_port_1" 
            network: { get_param: network_name } 
            fixed_ips: 
                - subnet: { get_param: subnet_name} 
    vm_1: 
        type: OS::Nova::Server 
        properties: 
            name: "vm_1" 
            image: { get_param: image_name } 
            flavor: { get_param: flavor_name } 
            networks: 
                - port: { get_resource: network_port } 
{% endhighlight %} 

# Understanding the HOT file 

Our HOT file has four main sections. 

## heat_template_version 

This defines the Heat version of the template. The value `2018-08-31` indicates that the template could contain features up to `rocky` release of OpenStack. 

## description 

This is intended to contain a description about the HOT template. While not mandatory, it is a good practice to include a meaningful description here. 

## parameters 

Defines a set of parameters that can be used multiple times over the template. We have defined four parameters here which we are referring in the following section. 

## resources 

This is a mandatory section, and contain the actual resource definitions. Here we are creating a VM and attaching a network port to it. Although we can create the network in the HOT file, in this case the network is precreated for simplicity. 

With our HOT file let's create the stack. 

{% highlight shell %} 
$openstack stack create -t /home/ubuntu/simple_hot.yml simple_stack 
{% endhighlight %} 

You can view the status of the stack with the list command. 

{% highlight shell %} 
$ openstack stack list 

+--------------------------------------+--------------+-----------------+----------------------+--------------+ 

| ID                                   | Stack Name   | Stack Status    | Creation Time        | Updated Time | 

+--------------------------------------+--------------+-----------------+----------------------+--------------+ 

| 0e16d6ad-bc02-4e60-b91f-2b3e55e1b7a5 | simple_stack | CREATE_COMPLETE | 2019-09-30T13:34:10Z | None         | 

+--------------------------------------+--------------+-----------------+----------------------+--------------+ 
{% endhighlight %} 
 

Also we can check that the VM is successfully created. 

{% highlight shell %} 
$ openstack server list 

+--------------------------------------+-----------------+--------+--------------------+--------------------------+---------+ 

| ID                                   | Name            | Status | Networks           | Image                    | Flavor  | 

+--------------------------------------+-----------------+--------+--------------------+--------------------------+---------+ 

| 5f63643b-eda7-4e70-a031-e4d115427eb4 | Ubuntu_bionic_1 | ACTIVE | v_net1=10.20.20.93 | cirros-0.4.0-x86_64-disk | m1.tiny | 

+--------------------------------------+-----------------+--------+--------------------+--------------------------+---------+ 
{% endhighlight %} 

The stack can be deleted as below. 

{% highlight shell %} 
$ openstack stack delete simple_stack 
{% endhighlight %} 

*[HOT]: Heat Orchestration Template 
*[VM]: Virtual Machine 

[openstack]: https://www.openstack.org/ 
