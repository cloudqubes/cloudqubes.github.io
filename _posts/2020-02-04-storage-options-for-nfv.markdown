---
layout: post
title:  "Storage Options for NFV"
date:   2020-02-04 05:56:00 +0530
categories: [insights, NFV]
tags: [storage, SAN, NAS, NFV, Software Defined Storage]
---

**Storage is a less-discussed topic in NFV forums. But, it is an important part of NFV because resiliency and scalability of VNFs could depend on the type of storage architecture.**

There are several options for storage in NFV. In this post we will discuss about storage that would be attached to VMs as block devices. There are two major categories in this type of storage; ephemeral and persistent.

# Ephemeral Storage
Ephemeral or non-persistent storage is available in any OpenStack deployment. It is implemented in the compute service [Nova], which works with the hypervisor to allocate virtual disks for the root or secondary volume of a VM, using the local storage available in the compute running the VM. Such virtual disks are created and terminated with the VM, so that data stored is not persistent.

While ephemeral storage can utilize any storage accessible to the hypervisor, it is generally used with local hard disks where no centralized storage is available. A certain level of redundancy can be achieved for ephemeral storage, with RAID configurations in local disks of the compute, but a failure in the compute itself will not be recoverable. OpenStack live migration of VMs rely on centralized storage, and cannot be achieved using ephemeral storage.

These are the biggest drawbacks of ephemeral storage, but it is possible to architect a VNF such that a failure in a single compute could be recoverable. However, most VNFs in the market, especially the data centric applications such as HLR or PCRF, will not have this level of resiliency, so implementing some form of persistent storage becomes essential. 

# Persistent storage

Persistent block storage service in OpenStack, is provided by [Cinder]. It creates storage volumes independent from the VM, so the storage is not deleted even if the VM is terminated – so is persistent.

[Cinder] depends on a back-end storage devices to provide the storage. By default it adapts Linux LVM, but can work with a range of storage appliances.

These storage appliances, designed by 3rd party vendors provide drivers to work with [Cinder]. As of Rocky release the supported drivers are listed in [Cinder Driver Support Matrix] [cinder_driver].

Persistent storage in data centers, is implemented using centralized storage or (SDS) Software Defined Storage. The two main centralized storage architectures are NAS (Network Attached Storage) and SAN (Storage Area Network).


## Network Attached Storage

![Network Attached Storage](/assets/images/nas.png)

NAS is a centralized storage solution, which uses the data center Ethernet network to deliver storage to VMs. 

A NAS solution consists of storage controllers and storage nodes. The storage controller is a server equipped with a RAID controller and SAS interface cards to connect the storage nodes. The storage nodes hold the physical HDD or SSD disk drives and connect with the storage controller via the SAS interface., which can go up to 24Gb/s according to the latest standards.

Since the same data center physical network is used for interconnecting VMs, and provide storage service, NAS is an economical storage service for NFV. However, the same fact could be a bottle-neck for applications that required large amounts of disk read-writes.

Typical NFV workloads do not demand extensive disk read-write activities, so NAS could be considered as an appropriate storage solution for NFV.

## Storage Area Network

![Storage Area Network](/assets/images/san.png)

SAN overcomes the limitations of NAS by using a completely separate network of fiber channel and SAN switches, which can provide up to 128 Gb/s dedicated throughput for storage.

This performance gain comes at the additional cost of SAN switches, and a separate fiber-channel network just for the storage service. Unless you have a specific requirement, using SAN would be an overkill for NFV.

## Software Defined Storage

![Software Defined Storage](/assets/images/sds.png)

Software Defined Storage is a new type of storage architecture, where the storage is decoupled from the underlying hardware. While SDS can use any type of physical storage available in computes, it is generally implemented using the local hard disks for economy and scalability.

An important part of any SDS solution is the SDS software which runs on the computes, and is responsible for pooling the underlying storage resources and presenting it to the upper layer application ([Cinder], in the case of [OpenStack]).

SDS software takes care of writing data to disks with redundancy, so that failure in any single compute is not going to affect the data, and can be recovered. Due to this data replication between computes, SDS will increase the utilization of the network fabric. In an NFV environment with SDS, it is recommended to use 100G NICs in computes, to ensure performance.

In this post we discussed the three main storage architectures in data centers. Storage should be considered a critical part of NFV, since the VNF performance may depend on it. We hope this will help you in choosing a proper architecture that balances business and technical aspects.

Although we mainly focused on ephemeral storage (provided as a part of [nova]), and block storage ([cinder]) in OpenStack, there are two other storage services in OpenStack: object storage ([swift]), and shared file system storage ([manila]). We will discuss about these services also in upcoming posts.

*[NAS]: Network Attached Storage
*[SAN]: Storage Area Network
*[SDS]: Software Defined Storage
*[LVM]: Logical Volume Manager
*[SAS]: Serial Attached SCSI
*[NFV]: Network Attached Storage
*[VM]: Virtual Machine
*[VNF]: Virtual Network Function
*[NICs]: Network Interface Cards

[cinder_driver]: https://docs.openstack.org/cinder/rocky/reference/support-matrix.html
[cinder]: https://docs.openstack.org/cinder/rocky/
[nova]: https://docs.openstack.org/nova/latest/
[swift]: https://docs.openstack.org/swift/pike/admin/objectstorage-intro.html
[manila]: https://docs.openstack.org/manila/latest/
[openstack]: https://www.openstack.org/