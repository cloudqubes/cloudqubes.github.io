---
layout: post
title:  "Introduction to the concept of SR-IOV"
date:   2020-10-20 05:10:00 +0530
categories: [handson, OpenStack]
tags: [automation, cloud-init, NFV, OpenStack]
---

Virtualization enables sharing of physical resources in a host compute, with multiple virtual machines. The 
**physical resources** includes CPU, memory, storage, and IO devices connected via PCI-e bus. 

NIC is the most commonly used IO device, and is an essential hardware component that has to be shared in virtualization. There are three approaches of virtualizing a NIC:

1. Software based sharing
2. Direct assignment
3. SR-IOV

While focus of this post is SR-IOV, it won't be complete without a brief introduction of the other two approaches. 

# Software based sharing

In software based sharing, `vhost-net` kernel module running on the host machine creates a path for the `virtio-net` kernel module running on the guest machine to send/receive data from NIC. A virtual switch (OVS) running on the host machine is responsible for switching packets between multiple VMs.

This method is also known as [virtio networking][virtio].

The software based sharing has limitations in maximum throughput, since the data has to traverse two software stacks in both the host machine and the virtual machine.

# Direct assignment

Direct assignment requires CPUs with IOMMU. In Intel CPUs IOMMU is named [VT-d], while AMD calls their implementation as [AMD-Vi].

Direct assignment enables the virtual machine to direcly access the IO device on the host, so data coming to and from IO device does not have to go throgh the software stack at host. Therefore, direct assignment eliminates the performance limitations in software based NIC sharing.

However, direct assignment requires an IO device to be dedicated to a single VM, so in this mode the IO device cannot be shared across multiple VMs.

Direct assignment method is also known as PCI-passthrough. 

# SR-IOV

Direct assignment overcomes the throughput limitations of software based sharing, but restricts the sharing of an IO device across multiple VMs.

SR-IOV, developed by [PCI-SIG] is a technology that overcome both these problems. It enables an IO device to be shared between VMs, while bypassing the involvement of the host kernel modules for data transfer.

SR-IOV is an enabler for NFV, where workloads are more bandwidth intensive than in IT. The core telco application such as EPC and IMS rely on SR-IOV, for delivering their high throughputs.

# How SR-IOV works?

![SR-IOV Implementation](/assets/images/sr-iov.png)

SR-IOV requires support from PCIe device as well as CPU. An SR-IOV capable PCIe device has two types of functions.

1. Physical Function

    Physical funtion (PF) is a fully fledged PCIe function, and inlcudes SR-IOV Extended Capability which is responsible for exposing Virtual Functions (VFs). 

2. Virtual Function

    A Virtual FUnction (VF) is a lightweight PCIe function, that is responsible only for processing IO. A single PF can have multiple VFs. Hypervisor can assign one or more VFs to each virtual machine. Once a VF is assigned to a VM, the hypervisor does not need to be involved in data movement between VM and the PCIe deivce.

In a NIC, each Ethernet port has one PF, and multiple VFs. While one VM can have multiple VFs, each VF can be assigned to only one VM.

The hypervisor configures the SR-IOV device such that the VFs appear as multiple functions in [PCI configuration space][pci-config-spce]. Then the hypervisor assigns each VF to a VM by mapping this configuration space to the configuration space of the VM.

## Virtual Function and Physical Function drivers

SR-IOV function requires two kernel modules; PF driver and VF driver in host compute and VM respectively.

PF driver kernel module is responsible for global functions in the IO device, and configuring shared resources. 

VF driver is a PCIe function with limited capabilities. It's main responsibility is sending and receiving data. VF driver can also execute a reset operation that affects the particular VF assigned to the VM where VF driver resides. VF driver depends on the PF driver, for any other action related to the device.

Both PF and VF drivers are provided by the IO device hardware supplier. For the same IO device there could be multiple PF and VF driver versions. Since these two functions should work in harmony, the device manufacturers publish a compatibility matrix for their PF and VF driver versions. 

When hosting SR-IOV supported applications in OpenStack cloud, you have to ensure that VMs are using a VF driver version that is compatible with the PF driver in the host compute. Otherwise you may get unexpected outcomes.

## Throughput improvement in SR-IOV

SR-IOV overcome the limitations of software based sharing, by using DMA transactions aided by IOMMU (VT-d in Intel and AMD-Vi in AMD) in CPU, for transferring data between PCIe device and VM. The data packets to and from IO device completely bypass the software stack of host compute, enabling SR-IOV to deliver line-rate throughputs to VM.

NICs are the most common IO device, that has been virtualized with SR-IOV. However, it is not limited to NICs and can be implemented on any PCIe hardware. GPUs, a recent addition to cloud computing resources, are also made available to the VMs with SR-IOV function.

In a future post, we will benchmark `virtio` and SR-IOV, using open source software tools.

*[IOMMU]: Input/output memory management unit
*[SR-IOV]: Single Root IO Virtualization
*[NIC]: Network Interface Card
*[EPC]: Evolved Packet Core
*[IMS]: IP Multimedia Subsystem
*[DMA]: Direct Memory Access
*[VF]: Virtual Function
*[PF]: Physical Function
*[VM]: Virtual Machine
*[GPUs]: Graphic Processing Units

[pci-id-repo]: https://pci-ids.ucw.cz/
[pci-id-file]: https://pci-ids.ucw.cz/v2.2/pci.ids
[PCI-SIG]: https://pcisig.com/
[pci-config-spce]: https://en.wikipedia.org/wiki/PCI_configuration_space
[virtio]: https://www.linux-kvm.org/page/Virtio
[VT-d]: https://software.intel.com/content/www/us/en/develop/articles/intel-virtualization-technology-for-directed-io-vt-d-enhancing-intel-platforms-for-efficient-virtualization-of-io-devices.html
[AMD-Vi]: http://developer.amd.com/wordpress/media/2013/12/48882_IOMMU.pdf
