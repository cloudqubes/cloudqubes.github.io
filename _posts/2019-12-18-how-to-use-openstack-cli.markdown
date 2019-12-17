---
layout: post
title:  "How to Use OpenStack CLI"
date:   2019-12-18 04:39:00 +0530
categories: hands-on openstack
---

**OpenStack has a GUI named Horizon, but if you are in to serious administrative work on OpenStack, the CLI is the way to go.**

The OpenStack CLI which is provided by OpenStackClient project, implements a comprehensive set of commands utilizing the OpenStack APIs, for managing the resources in OpenStack. Before the OpenStackClient project, separate CLIs had been developed for each project, but these did not provide a consistent interface, so were complicated to use.  

In a previous [post][devstack] we installed OpenStack in a single server. Let's use the same setup and create a VM using the CLI.

OpenStack CLI requires certain environment variables to be set, and most OpenStack installations will create a file `openrc` for this purpose. In our DevStack installation this file is located in the `/opt/stack/devstack` folder.

We will use the `source` command to set the environment variables.

{% highlight shell %}
$ source openrc
{% endhighlight %} 

All the commands in OpenStackClient are structured in the same consistent format.

{% highlight shell %}
$ openstack <resource> <action> <optional parameters> <name>
{% endhighlight %} 

Resource can be any of the OpenStack resources such as flavor, server, network, port, security group etc. The action can be any one of create, delete, list, show, set and unset. It should be noted that set and unset is applicable for specific resources only.

Most of the commands accept a set of optional parameters which are command specific. The `name` parameter identifies the name of the specific OpenStack resource, and is mandatory for all actions other than `list`.

Now, let's use the CLI to create a VM.

Before creating the VM we need to know the flavor, image and the network we are going to use.

List available flavors

{% highlight shell %}
$ openstack flavor list
+--------------------------------------+-----------+-------+------+-----------+-------+-----------+
| ID                                   | Name      |   RAM | Disk | Ephemeral | VCPUs | Is Public |
+--------------------------------------+-----------+-------+------+-----------+-------+-----------+
| 0edd6b52-1b7f-419a-87f6-9e1dd53303d0 | vm_test   |  1024 |    1 |         0 |     1 | True      |
| 1                                    | m1.tiny   |   512 |    1 |         0 |     1 | True      |
| 2                                    | m1.small  |  2048 |   20 |         0 |     1 | True      |
| 3                                    | m1.medium |  4096 |   40 |         0 |     2 | True      |
| 4                                    | m1.large  |  8192 |   80 |         0 |     4 | True      |
| 42                                   | m1.nano   |    64 |    1 |         0 |     1 | True      |
| 5                                    | m1.xlarge | 16384 |  160 |         0 |     8 | True      |
| 84                                   | m1.micro  |   128 |    1 |         0 |     1 | True      |
| c1                                   | cirros256 |   256 |    1 |         0 |     1 | True      |
+--------------------------------------+-----------+-------+------+-----------+-------+-----------+
{% endhighlight %} 

List available images

{% highlight shell %}
$ openstack image list
+--------------------------------------+--------------------------+--------+
| ID                                   | Name                     | Status |
+--------------------------------------+--------------------------+--------+
| 236fe75e-a5b7-45bd-b1f9-d391bc7750a2 | cirros-0.4.0-x86_64-disk | active |
| f058210e-5169-469a-80d8-96b79b630103 | ubuntu_bionic            | active |
+--------------------------------------+--------------------------+--------+
{% endhighlight %} 

List available networks.

{% highlight shell %}
$ openstack network list
+--------------------------------------+----------+----------------------------------------------------------------------------+
| ID                                   | Name     | Subnets                                                                    |
+--------------------------------------+----------+----------------------------------------------------------------------------+
| 4233826e-34b5-4c86-af2d-14f1f82feb9c | public   | 85354960-f365-4421-a6c9-aeef06203888, e029dc85-fc45-44f9-9395-2b081daf81da |
| 730e0605-118e-4cc4-9f8f-c4130bbaabc4 | shared   | bd5fe8cd-6bb9-476c-869e-2d354ef6a8a2                                       |
| a4437e75-3f3f-4e59-95b5-35b976aa13f8 | private  | 2da6b36f-3904-4088-ba00-17fe97b78e31, 5151dc5b-3aed-4bfa-bd0c-15692e81921a |
+--------------------------------------+----------+----------------------------------------------------------------------------+
{% endhighlight %} 

Now, let's create the VM, using selected flavor, image and the network.

{% highlight shell %}
$ openstack server create --flavor m1.tiny --image cirros-0.4.0-x86_64-disk --network private test_vm_4
{% endhighlight %} 

This command will output a long table consisting of the details of the VM, which I have not included. But we can get the same information by using the `show` command for server.

{% highlight shell %}
$ openstack server show test_vm_4
+-----------------------------+-----------------------------------------------------------------+
| Field                       | Value                                                           |
+-----------------------------+-----------------------------------------------------------------+
| OS-DCF:diskConfig           | MANUAL                                                          |
| OS-EXT-AZ:availability_zone | nova                                                            |
| OS-EXT-STS:power_state      | Running                                                         |
| OS-EXT-STS:task_state       | None                                                            |
| OS-EXT-STS:vm_state         | active                                                          |
| OS-SRV-USG:launched_at      | 2019-12-17T10:33:29.000000                                      |
| OS-SRV-USG:terminated_at    | None                                                            |
| accessIPv4                  |                                                                 |
| accessIPv6                  |                                                                 |
| addresses                   | private=10.0.0.6, fd97:7e0d:5eab:0:f816:3eff:fef5:d3f1          |
| config_drive                |                                                                 |
| created                     | 2019-12-17T10:33:20Z                                            |
| flavor                      | m1.tiny (1)                                                     |
| hostId                      | 43f5b3220c33c48d153836f7fc9a73f4365f3b199c238041f43e4632        |
| id                          | 01d26420-d69e-4897-8a63-6e8a23593b79                            |
| image                       | cirros-0.4.0-x86_64-disk (236fe75e-a5b7-45bd-b1f9-d391bc7750a2) |
| key_name                    | None                                                            |
| name                        | test_vm_4                                                       |
| progress                    | 0                                                               |
| project_id                  | da29d96acef14f9ab0fcc3b8b4da0e7c                                |
| properties                  |                                                                 |
| security_groups             | name='default'                                                  |
| status                      | ACTIVE                                                          |
| updated                     | 2019-12-17T10:33:30Z                                            |
| user_id                     | 346ca7869452426facb2b41e6f70bf02                                |
| volumes_attached            |                                                                 |
+-----------------------------+-----------------------------------------------------------------+
{% endhighlight %} 

If we want to get a list of VMs currently available in the system, we can use the `list` command as below.

{% highlight shell %}
$ openstack server list
+--------------------------------------+-----------+--------+--------------------------------------------------------+--------------------------+---------+
| ID                                   | Name      | Status | Networks                                               | Image                    | Flavor  |
+--------------------------------------+-----------+--------+--------------------------------------------------------+--------------------------+---------+
| 01d26420-d69e-4897-8a63-6e8a23593b79 | test_vm_4 | ACTIVE | private=10.0.0.6, fd97:7e0d:5eab:0:f816:3eff:fef5:d3f1 | cirros-0.4.0-x86_64-disk | m1.tiny |
| 0057e5dd-4639-4f6c-b833-bddfe0307ada | cirros_2  | ACTIVE | v_net1=10.20.20.128                                    | cirros-0.4.0-x86_64-disk | m1.tiny |
| 2d3c738a-2d88-4678-a813-22372a2aa424 | cirros_1  | ACTIVE | v_net1=10.20.20.184                                    | cirros-0.4.0-x86_64-disk | m1.tiny |
| 55fa056f-b2ae-42b7-85cb-9a6caa5e9089 | cirros_1  | ACTIVE | v_net1=10.20.20.26                                     | cirros-0.4.0-x86_64-disk | m1.tiny |
+--------------------------------------+-----------+--------+--------------------------------------------------------+--------------------------+---------+
{% endhighlight %} 

When creating the server, OpenStack will implicitly create the associated virtual network ports. We can get a list of available ports in the system using `list` command on network ports.

{% highlight shell %}
$ openstack port list
{% endhighlight %} 

This will output all ports that are in the system, but we can use the optional parameter `server` to get the ports attached to the VM, we just created.

{% highlight shell %}
$ openstack port list --server test_vm_4

+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------------------------------+--------+
| ID                                   | Name | MAC Address       | Fixed IP Addresses                                                                                  | Status |
+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------------------------------+--------+
| 66ee2025-e6e7-4a30-af92-264f67831f3a |      | fa:16:3e:f5:d3:f1 | ip_address='10.0.0.6', subnet_id='2da6b36f-3904-4088-ba00-17fe97b78e31'                             | ACTIVE |
|                                      |      |                   | ip_address='fd97:7e0d:5eab:0:f816:3eff:fef5:d3f1', subnet_id='5151dc5b-3aed-4bfa-bd0c-15692e81921a' |        |
+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------------------------------+--------+
{% endhighlight %} 

## Getting Further Help
If you are not sure what parameters are available for a particular command, help can be obtained by appending `-h`.

{% highlight shell %}
$ openstack port list -h
{% endhighlight %} 

All actions available for a resource can be obtained by typing the command with `-h` option and without the action.

{% highlight shell %}
$ openstack port -h
{% endhighlight %} 

An exhaustive list of available commands can be obtained by simply using `-h` option without resource or action.

{% highlight shell %}
$ openstack -h
{% endhighlight %} 

In this post we explored about some basic administrative tasks that can be executed with OpenStack CLI.  Due to its consistent interface, the CLI provides an easy learning curve, and we will be using it frequently in our future projects.

*[VM]: Virtual Machine
*[CLI]: Command-Line Interface

[devstack]: {{site.baseurl}}{% post_url 2019-09-16-getting-started-with-devstack%}