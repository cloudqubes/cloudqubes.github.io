---
layout: post
title:  "Introduction to VNF Onboarding"
date:   2019-12-02 19:15:00 +0530
categories: insights NFV VNF onboarding
---

**If you are just starting your NFV journey, VNF onboarding may feel like an overwhelming task. Adapting a structured approach can definitely save you from a lot of frustrations.**

There are several different mechanisms of onboarding VNFs. Heat template based VNF onboarding via NFVO is the simplest of them, and will be the focus in this post. However, you may find that most of what we discuss here are applicable for other onboarding methods as well.

This VNF onboarding process has four main phases.

<img src="{{ "/assets/images/vnf_onboarding_process.png" | absolute_url }}" alt="VNF Onboarding Process" width="1500"/>

# Requirement Gathering

The VNF onboarding process involves three parties; VNF developer, NFV platform supplier, and the Telco who operates the NFV platform. The objective of the requirement gathering is to analyze and document all the virtual resource and networking requirements of the VNF. This document will serve as a design document during the rest of the onboarding process.

The requirement gathering phase should clarify all concerns and eliminate ambiguities between the parties involved in the onboarding process. The final document of the requirement gathering phase should essentially include below information.

## VM flavors and number of VMs 

The OpenStack flavor defines three key parameters related to VM capacity; number of vCPUs, memory and disk. This information also helps you estimate the total virtual resource requirement of the VNF.

The flavors can also include extra specifications as key-value pairs. These are used for advanced VM configurations, and need to be set based on the requirements of the VNF developers. CPU pinning policy, NUMA topology and large page allocation are the most commonly used such extra specifications.

## Virtual networks

Virtual networking and their IP assignment is a critical part of the VNF design. Depending on its architecture, a VNF may consists of multiple internal and external networks. While internal networks reside within the data center, external networks extend to the IP transport network for connecting with other nodes.

VNFs that have high bandwidth requirements may need SR-IOV supported vNICs. This is an important requirement that should be identified since the corresponding networks have to be created with SR-IOV support.

Depending on the networking architecture implemented in your NFV infrastructure, you may also have to allocate VLAN IDs for virtual networks. All these information should be captured and organized under virtual networking requirements.

## Security Groups

Security groups in OpenStack provides a basic access control mechanism based on TCP/UDP ports. While not mandatory, it would be a good practice to configure them to allow communication with required ports only.

## Availability Zones and Host Aggregates

Availability zones and host aggregates enable placing VMs in to designated groups of host compute nodes. This can be used to implement a resilient architecture by placing VMs that perform similar functions in to different host machines. 

Typically a datacenter will have the availability zones pre configured, so that the VNF instance should be designed according to that.

# Virtual Infrastructure Resource Creation

Based on the information compiled during the requirement gathering phase, you can create virtual infrastructure resources such as flavors, networks and security groups before the VNF instantiation. While you could use OpenStack GUI or CLI for creating them, most NFVOs provide their own interfaces for such tasks.

It is possible to create these via the same HOT template that instantiates the VNF. But it would be advisable to create them separately, and use the final HOT template to create only the virtual machines.

# Preparing the Artifacts

The main artifacts required for onboarding the VNF are the HOT package and the VM image files. These should be uploaded to the NFVO before the VNF can be instantiated.

While a simple VNF could be defined in a single Heat template, it would be a good practice to structure a complex VNF in to multiple files and packaged. Heat can accept deployment time parameters via an environment file, so that same HOT package with different environment files can be used to instantiate multiple VNFs instances. This is useful when implementing geo-redundancy where two instances of same VNF needs to be deployed in two different data centers.

QCOW2 is the most widely adapted image format in OpenStack, so the VNF developer has to provide all images in that format.

Depending on the NFV architecture, the NFVO and OpenStack may not reside in same datacenter, so transferring large files such as the QCOW2 images from NFVO to OpenStack could take considerable time. Therefore, the NFVO should provide an option to transfer the images to the intended OpenStack instance beforehand.

# Instantiation

Once all artifacts are in place you can instantiate the VNF via the NFVO. The NFVO uses the Heat API to create a stack with the provided HOT package.

Be prepared to do edit the HOT package multiple times and re-instantiate in order to handle the deployment time errors. Practically you will not get it all correct the very first time.

# Summary

Essentially this VNF onboarding method creates a Heat stack in OpenStack via NFVO. The NFVO is actually providing a thin layer of functionality sitting above OpenStack. While you could execute this onboarding process solely from OpenStack, NFVO could make the task easier when there are multiple datacenters with separate OpenStack instances.

As already mentioned, this is the simplest VNF onboarding method. In future we will explore more sophisticated approaches of onboarding VNFs.

*[NFV]: Network Function Virtualization
*[NFVO]: NFV Orchestrator
*[VNF]: Virtual Network Function
*[HOT]: Heat Orchestration Template
