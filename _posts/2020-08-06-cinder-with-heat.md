---
layout: post
title:  "Cinder with Heat"
date:   2020-08-05 18:20:00 +0530
categories: [hands-on, openstack]
tags: [cinder, block-storage, openstack, persistant, heat]
---

[Nova] adapts ephemeral storage for VMs by default. The ephemeral storage resides on the local hard disks of the host computes and present a virtual disk for each VM. These virtual disks are created at the time of the VM creation, and are deleted with the VM, so are called ephemeral. If the host machine crashes, you lose the VM with all its data stored in disk.

This is not a good situation to be in. You want your data to retain even if the VM is lost, so that a new VM can be created in a different host. How do we do that in OpenStack? Answer is [Cinder].

OpenStack [Cinder] is block storage service which manage storage volumes independet from VMs. Unlike [Nova] ephemeral storage, [Cinder] uses centralized storage solutions as its storage back end, so the storage is decoupled from the host machine running the VM. These back end storage systems uses redundancy mechanisms like multiple disk arrays with RAID configurations so that Cinder can provide a fault tolerant storage solution for VMs.

Reserving the discussion of the functionality of [Cinder] to another day, let's focus on using the [Cinder] block storage in [Heat] templates.

# Creating a VM with a block storage volume

Most of the time, we create applications with [Heat], rather than creating individual VMs. Here's a part of a Heat template that creates the block storage for a VM running Ansible.

{% highlight yaml %}
  #Cinder volume
  ansible_volume:
    type: OS::Cinder::Volume
    properties:
      name: "ansible_vda"
      image: { get_param: image }
      size: 10
    deletion_policy: Retain
{% endhighlight %} 

It is creating a 10GB volume using a QCOW2 `image` which means we are creating a bootable volume, to be used as the primary disk of a VM.

An importat attribute in this resource is the `deletion_policy: Retain`. If this is ommited, the volume would be deleted whenever the Heat stack is deleted. When `deletion_policy` is set to `Retain`, the volume is preserved even when the stack is deleted, so that you could reuse the voluem to create the application again. 

The `deletion_policy` parameter should be set based on the requirement of the application. If you want to delete and recreate the application multiple times, then it's best to set this option, so that you don't have to recreate your VMs from scratch everytime.

Now, let's assign this volume to a VM.

{% highlight yaml %}
  #VM      
  ansible_server:
    type: OS::Nova::Server
    properties:
      config_drive: "true"
      name: { get_param: stack_name }
      flavor: { get_resource: flavor }
      availability_zone: "zone-A"
      block_device_mapping_v2:
        - device_name: vda
          boot_index: 0
          delete_on_termination: False
          volume_id : { get_resource : ansible_volume }
{% endhighlight %} 

For clarity, we have eliminated some parts of the resource. 

The property `block_device_mapping_v2` is used to attach the volume to a VM. It accepts a list of volumes, but we have provided only one in this template. 

The `boot_index` refers the order of boot disks. Since we have only one disk we are setting it to `0`. 

`delete_on_termination: False` means that the volume will not be deleted even if the individual VM is terminated. 

`volume_id` refers to the volume we have created earlier.

The `device_name` property matches to the device name in `/dev/device_name` in the created VM, and we have set it as `vda`.

The complete HOT file can be found [here][ansible-hot].

# Attaching Multiple Volumes

This is a part of a Heat template which creates two storage volumes, and attach them to a single VM.

{% highlight yaml %}
  #Cinder volume
  vm_volume_1:
    type: OS::Cinder::Volume
    properties:
      name:
        list_join: ['_', [{get_param: stack_name}, 'vda']]
      image: { get_param: Image }
      size: 85
  vm_volume_2:
    type: OS::Cinder::Volume
    properties:
      name:
        list_join: ['_', [{get_param: stack_name}, 'vda2']]
      size: 5
{% endhighlight %} 

The first volume is of 85 GB, and is created from a QCOW2 image. The second one is a 5GB volume that does not have an image, so will not be a bootable disk.

{% highlight yaml %}
  vm_test_1:
    type: OS::Nova::Server
    properties:
      name: 
        list_join: ['-', [{get_param: vapp_name}, '1']]
      #image: { get_param: Image }
      block_device_mapping_v2:
        - device_name: vda
          boot_index: 0
          delete_on_termination: False
          volume_id : { get_resource : vm_volume_1 }
        - device_name: vdb
          boot_index: 1
          delete_on_termination: False
          volume_id : { get_resource : vm_volume_2 }
{% endhighlight %} 

When assigning the two volumes, we are setting `boot_index: 0` in the `vm_volume_1` which is created based on an image, and which is going to be the boot disk. The first volume will be mapped to `/dev/vda` and the second to `/dev/vdb` in the VM

The complete HOT file can be found [here][two-volumes]

# Reusing a Cinder Volume

Once we set the `deletion_policy: Retain` the volume will not be deleted, when the stack is deleted. We can reuse this volume to create a new VM.

{% highlight yaml %}
  vm_test_1:
    type: OS::Nova::Server
    properties:
      name: 
        list_join: ['-', [{get_param: stack_name}, '1']]
      block_device_mapping_v2:
        - device_name: vda
          boot_index: 0
          delete_on_termination: False
          volume_id : "c9c44eae-b5b2-43dd-92c8-47e53eb8bff0"
{% endhighlight %} 

The `volume_id` refers to the `ID` of the volume and not the name. Therefore, we have to get it using CLI command `openstack volume show <volume_name>`

The complete template can be found [here][reuse].

In this brief post, we have described how to use [Cinder] in [Heat] templates. In future, let's dig deeper in to the architecture and functions of [Cinder].


[ansible-hot]: https://gist.github.com/cloudqubes/7bd71a741750f18d2d27db0a95407694
[two-volumes]: https://gist.github.com/cloudqubes/907cabbd0958e8e59674910201cce950
[reuse]: https://gist.github.com/0e68b93d294d01aed950eaac1230877c.git
[Cinder]: https://docs.openstack.org/cinder/rocky/
[Heat]: https://docs.openstack.org/heat/latest/
[Nova]: https://docs.openstack.org/nova/latest/