---
layout: post
title:  "The Automation Aspects of NFV"
date:   2019-10-12 06:24:00 +0530
categories: insights nfv automation
---

**The legacy telecom network with its physical network functions, has limited capabilities of automation. It demands a lot of manual work and hinders the development of agile practices.**

This inefficiency is one of the many reasons that fuels the NFV transformation, and a significant benefit of NFV is highlighted as automated life-cycle management of VNFs. The vendors are claiming that NFV is revamping the network because they can dynamically spin up new VNFs according to increasing capacity demands.

While automated deployment can yield some benefits, that still leaves out a lot more work in the total life-cycle management process of a VNF. The surprising truth is that most of the features required for automating this work resides in the VNF, and not in the NFV infrastructure.

So let's have a look at some of these important aspects of automation.

## Testing
Every event in life-cycle management of a network function is usually followed by a comprehensive list of test cases being executed to verify the service continuity, so automated VNF life-cycle management does not make sense without automated testing. Therefore, our NFV transformation journey should have serious considerations for investing on a robust application-testing solution.

## Provisioning the VNF
Provisioning is a crucial part of the life-cycle management. In the event a new VNF instance is spawned dynamically it has to be configured with instance specific parameters so that it can start processing services. 

At present most of these provisioning is done through an MML interface which is not quite machine friendly when it comes to automation. The future VNFs has to provide some mechanism such as REST API or Ansible support for automating these provisioning activities.

## Provisioning related network elements
Some life-cycle management activity may require provisioning other network elements such as STP, DRA, Firewall, Load balancer etc. Until all these elements provide a mechanism for programmatical provisioning we may not be able to implement end-to-end automation.

## Transport Network Provisioning
IP transport network provide the connectivity to VNFs. At present, setting up this connectivity involves manual configuration of routers and switches in the transport network. In an automated application deployment scenario this connectivity also needs to be automatically configured. 

## Soft inventory management
Deploying a new VNF instance requires assigning new IP addresses. It may also require some kind of licenses to be provisioned, before it can process services. This type of soft inventories has to be managed dynamically if we need to implement a smooth automation process.

## Closed-loop analytics
While may not be mandatory at the initial stages, a closed-loop analytics system is a must, when there are multiple parallel automated life-cycle management activities. Currently the practice of telecom engineers is to limit the parallel activities in the network so that a problem can be easily isolated.

But in future such practices has to be abandoned in favor of agility, so an analytics system should be in place to identify problems and feedback the VNF to take recovery actions - closing the loop without human intervention.

## Failure recovery
A running application may encounter failures. At present the applications are configured to notify a centralized OSS about these failures as alarms. When an alarm occurs a person would attempt to recover it by following a specific documented procedure. 

NFV enables automated failure recovery because new VMs can be programmatically created. However, the NFV infrastructure cannot make decisions on what particular recovery action should be taken because it is not aware of the inner working of the VNF. Instead the VNF should be capable of monitoring itself and take appropriate steps in case of a failure. A typical recovery action could be restarting the VM, or deleting a VM and starting a new one.

# Conclusion
This post introduces several conceptual aspects of automation that should be considered in  NFV transformation.  You will have to go into finer details on each, if you are going to actually ingrain them into your project.

But if you don't, your NFV transformation project will end up with VNFs just running on an NFV platform with all the previous inefficiencies still around. The good thing is that these concepts can be introduced in multiple phases, and at any stage of an NFV project.

In future posts let's dive in to more details about some of these concepts.

*[NFV]: Network Function Virtualization
*[VNF]: Virtual Network Function
*[VM]: Virtual Machine
*[STP]: Signalling Transfer Point
*[DRA]: Diameter Routing Agent
*[MML]: Man-Machine Language
