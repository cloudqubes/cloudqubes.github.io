---
layout: post
title:  "VNF scaling operations with Heat"
date:   2019-11-22 09:00:00 +0530
categories: hands-on openstack heat 
---

VNF auto-scaling is a hot topic in the NFV industry. Auto-scaling is a term that loosely refers the process of dynamic capacity increase or decrease of a VNF according to its loading.

The capacity increase or scale-out is the process of adding more VMs to an already deployed VNF and capacity decrease or scale-in is removing VMs similarly. While developing an end to end automated scaling process requires a significant amount of integration work, we could do a simple manual scaling of a VNF with OpenStack Heat. Let's see how?

A VNF is essentially one or more Heat stacks. For simplicity let's assume our VNF consists of a single Heat stack with two VMs.

# Instantiating VNF

First create the HOT file, for instantiating the VNF, and save it in the working directory as `cirros_2_vm.yml`.

{% highlight yaml %} 
heat_template_version: 2018-08-31

description: stack update test
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
  network_port_1:
    type: OS::Neutron::Port
    properties:
      name: "port_1"
      network: { get_param: network_name }
      fixed_ips:
        - subnet: { get_param: subnet_name}
  network_port_2:
    type: OS::Neutron::Port
    properties:
      name: "port_2"
      network: { get_param: network_name }
      fixed_ips:
        - subnet: { get_param: subnet_name}
  vm_1:
    type: OS::Nova::Server
    properties:
      name: "cirros_1"
      image: { get_param: image_name }
      flavor: { get_param: flavor_name }
      networks:
        - port: { get_resource: network_port_1 }
  vm_2:
    type: OS::Nova::Server
    properties:
      name: "cirros_2"
      image: { get_param: image_name }
      flavor: { get_param: flavor_name }
      networks:
        - port: { get_resource: network_port_2 }
{% endhighlight %}

Create the stack using the HOT file.

{% highlight shell %} 
$ openstack stack create -t cirros_2_vm.yml vnf_1
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| id                  | de91d635-5f48-411e-a846-d67149007ac1 |
| stack_name          | vnf_1                                |
| description         | stack update test                    |
| creation_time       | 2019-11-21T19:57:56Z                 |
| updated_time        | None                                 |
| stack_status        | CREATE_IN_PROGRESS                   |
| stack_status_reason | Stack CREATE started                 |
+---------------------+--------------------------------------+
{% endhighlight %}

You can check the status and resources of the stack as below.

{% highlight shell %} 
$ openstack stack list
+--------------------------------------+-------------+-----------------+----------------------+--------------+
| ID                                   | Stack Name  | Stack Status    | Creation Time        | Updated Time |
+--------------------------------------+-------------+-----------------+----------------------+--------------+
| de91d635-5f48-411e-a846-d67149007ac1 | vnf_1       | CREATE_COMPLETE | 2019-11-21T19:57:56Z | None         |
+--------------------------------------+-------------+-----------------+----------------------+--------------+

$ openstack stack resource list vnf_1
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| resource_name  | physical_resource_id                 | resource_type     | resource_status | updated_time         |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| vm_2           | 2602a8da-a0c5-47d2-9331-32df3e3112c6 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| vm_1           | 75c3973d-4409-48d1-85db-223771aaf452 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_2 | b5f5610c-858d-4617-a5ae-cb3a1dd534a3 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_1 | e8c21b3b-9655-445e-8a19-7b6b22d4cff7 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
{% endhighlight %}

# Scaling-out

Our VNF currently has 2 VMs, and now we are going to add a 3rd VM to it. We will create a new HOT file `cirros_3_vm.yml` as below.

{% highlight yaml %} 
heat_template_version: 2018-08-31

description: stack update test
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
  network_port_1:
    type: OS::Neutron::Port
    properties:
      name: "port_1"
      network: { get_param: network_name }
      fixed_ips:
        - subnet: { get_param: subnet_name}
  network_port_2:
    type: OS::Neutron::Port
    properties:
      name: "port_2"
      network: { get_param: network_name }
      fixed_ips:
        - subnet: { get_param: subnet_name}
  network_port_3:
    type: OS::Neutron::Port
    properties:
      name: "port_3"
      network: { get_param: network_name }
      fixed_ips:
        - subnet: { get_param: subnet_name}
  vm_1:
    type: OS::Nova::Server
    properties:
      name: "cirros_1"
      image: { get_param: image_name }
      flavor: { get_param: flavor_name }
      networks:
        - port: { get_resource: network_port_1 }
  vm_2:
    type: OS::Nova::Server
    properties:
      name: "cirros_2"
      image: { get_param: image_name }
      flavor: { get_param: flavor_name }
      networks:
        - port: { get_resource: network_port_2 }
  vm_3:
    type: OS::Nova::Server
    properties:
      name: "cirros_3"
      image: { get_param: image_name }
      flavor: { get_param: flavor_name }
      networks:
        - port: { get_resource: network_port_3 }
{% endhighlight %}

This file contains two more resources, `vm_3` and `network_port_3` in addition to what was included in `cirros_2_vm.yml`. Then we use the `stack update` command to scale out the VNF. 

{% highlight shell %} 
$ openstack stack update -t /home/ubuntu/cirros_3_vm.yml vnf_1
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| id                  | de91d635-5f48-411e-a846-d67149007ac1 |
| stack_name          | vnf_1                                |
| description         | stack update test                    |
| creation_time       | 2019-11-21T19:57:56Z                 |
| updated_time        | 2019-11-21T20:00:59Z                 |
| stack_status        | UPDATE_IN_PROGRESS                   |
| stack_status_reason | Stack UPDATE started                 |
+---------------------+--------------------------------------+

$ openstack stack list
+--------------------------------------+-------------+-----------------+----------------------+----------------------+
| ID                                   | Stack Name  | Stack Status    | Creation Time        | Updated Time         |
+--------------------------------------+-------------+-----------------+----------------------+----------------------+
| de91d635-5f48-411e-a846-d67149007ac1 | vnf_1       | UPDATE_COMPLETE | 2019-11-21T19:57:56Z | 2019-11-21T20:00:59Z |
+--------------------------------------+-------------+-----------------+----------------------+----------------------+

$ openstack stack resource list vnf_1
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| resource_name  | physical_resource_id                 | resource_type     | resource_status | updated_time         |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| vm_2           | 2602a8da-a0c5-47d2-9331-32df3e3112c6 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| vm_3           | b614f04f-a580-47f0-88de-5275c3afb306 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T20:00:59Z |
| vm_1           | 75c3973d-4409-48d1-85db-223771aaf452 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_3 | ea400a6e-b826-45cf-87a6-14f4431ccd1a | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T20:00:59Z |
| network_port_2 | b5f5610c-858d-4617-a5ae-cb3a1dd534a3 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_1 | e8c21b3b-9655-445e-8a19-7b6b22d4cff7 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
{% endhighlight %}

OpenStack has kept our previously created VMs intact, and has added the `vm_3` and `network_port_3`.

# Scaling-in

We can scale in our application, by updating again with the previous template.

{% highlight shell %} 
$ openstack stack update -t /home/ubuntu/cirros_2_vm.yml vnf_1
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| id                  | de91d635-5f48-411e-a846-d67149007ac1 |
| stack_name          | vnf_1                                |
| description         | stack update test                    |
| creation_time       | 2019-11-21T19:57:56Z                 |
| updated_time        | 2019-11-21T20:06:52Z                 |
| stack_status        | UPDATE_IN_PROGRESS                   |
| stack_status_reason | Stack UPDATE started                 |
+---------------------+--------------------------------------+

$ openstack stack resource list vnf_1
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| resource_name  | physical_resource_id                 | resource_type     | resource_status | updated_time         |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
| vm_2           | 2602a8da-a0c5-47d2-9331-32df3e3112c6 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| vm_1           | 75c3973d-4409-48d1-85db-223771aaf452 | OS::Nova::Server  | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_2 | b5f5610c-858d-4617-a5ae-cb3a1dd534a3 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
| network_port_1 | e8c21b3b-9655-445e-8a19-7b6b22d4cff7 | OS::Neutron::Port | CREATE_COMPLETE | 2019-11-21T19:57:56Z |
+----------------+--------------------------------------+-------------------+-----------------+----------------------+
{% endhighlight %}

Now our stack has only `vm_1` and `vm_2`,and `vm_3` is removed. 

Based on this stack update process we could develop sophisticated automated scaling mechanisms for VNFs. We will explore more on this in future posts.

*[HOT]: Heat Orchestration Template 
*[VM]: Virtual Machine 
*[VNF]: Virtualized Network Function