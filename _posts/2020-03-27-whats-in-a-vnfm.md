---
layout: post
comments: true
title:  "What's in a VNFM?"
date:   2020-03-27 06:35:00 +0530
categories: [insights, NFV]
tags: [nfv, vnfm, life-cycle-management, orchestration]
---

**VNFM and NFVO are two key components in NFV architecture. While having different responsibilities, they could be quite discernible.**

![NFV Architecture](/assets/images/nfv_architecture.png)

The MANO in NFV architecture, consists of VIM, VNFM and NFVO. 

The VIM has been in use before NFV, even though it was not called by that name, and its functon is clear; provide an interface to manage the virtual resources in multiple compute, storage and network nodes.

The function of two components; NFVO and VNFM, could be a bit confusing. It could be even more complicated by NFV suppliers, who amalgamate both of them in to one, and call it XYZ Orchestrator. So. let's get them clarified.

According to [ETSI GS NFV-IFA 009] [ifa-009] which clearly splits their functionality, NFVO is responsible for resource and service orchestration, while VNFM is responsible for lifecycle management of VNFs.

# What is VNF Lifecycle management?

The VNF lifecyle management is the total process of getting a VNF running on an NFV platform, and operating it until it's terminated. The first part of the process; getting the VNF running on a particular NFV platform, is also known as VNF onboarding.

![Functions of VNFM](/assets/images/functions_of_vnfm.png)

The VNF lifecyle management is also at the core of automation, which is one of the key drivers of NFV transformation.

## Resource Modeling

The first step of onboarding a VNF is modeling its virtual resource. The goal of resource modeling is to create a template, which is known as VNFD, that the VNFM can use for instantiating the VNF via VIM. In it's simplest form, this template should include the vCPU, memory, and storage allocation for each VM of the VNF, and virtual network ports that should be attached to each VM.

HOT is the widely used template format for resource modeling. However, ETSI defines another [template format][sol-001] based on TOSCA. 

The inputs for the resource model has to be extrated from VNF LLD, which should be prepared before starting this step. While being a part of the VNF lifecycle management, resource modeling is more human work than a function of the VNFM. 

Once the resource model is compiled, it has to be uploaded to NFVO, together with VM images of the VNF.

## VNF Instantiation

According to [ETSI GS NFV-SOL 003] [sol-003], VNF can either be initiated from NFVO or VNFM.

Then, VNFM is responsible for instructing VIM to create virtual resources according to the VNFD, that was created in the previous step.

## VNF Commissioning

After a VNF is instantiated, it has to be commissioned before it can deliver services. While ETSI defines a RESTful interface, [ETSI GS NFV-SOL 002][sol-002] that suppports VNF configuration, its adaptation in the industry is very low. However, a VNFM can use other methods such as Ansible playbooks, shell scripts, SSH terminals, etc., to configure a VNF.

## VNF Monitoring

Monitoring alarms and performance of a VNF, is a prerequisite for implementing auto scaling and healing functions. While [ETSI GS NFV-SOL 002][sol-002] defines RESTful operations for monitoring alarms and performance, most VNF vendors still use SNMP for this purpose.

Accordingly the VNFM has to support SNMP trap receiving to monitor the VNF.

## Auto-Scaling

Auto-scaling is a process that elatically expands or contracts a VNF according to the capacity demand. This is often a misused term in NFV. While some VNF suppliers tick off auto scaling in a single line, as a supported feature, that's not the whole story.

For auto-scaling to be successfully executed the VNFM has to continousely monitor the VNF, and determine that the VNF needs to be scaled up or down. 

If the VNF needs scaling-up additional resources needs to be provisioned via VIM, and the VNF needs to disrtibute its traffic load across the newly provisioned VMs. Similarly, in a scale down operation, traffic has to be offloaded from particular VMs before they can be deprovisioned. The VNFM should be able to handle these scenarios for successful auto-scaling.

According to the architecture of the VNF, it may be possible to configure other VNFs such as STP, firewall, loadbalancers, etc., for the auto-scaling to be effective. However, they could be outside the scope of the VNFM.

## Auto-healing

Auto-healing process enables the VNF to recover from failures, without manual operations. Similar to the scaling operation, it involves provisioing virtual resources, synchronizing configuration data, and transforming traffic to newly provisioned resources, while taking out the faulty ones.

It should be noted that some of these operations such as data synchronization are not covered by ETSI specifications, and may not be supported by VNFMs.

## VNF Termination

After a certain period of time, the VNF will have to be terminated. Although legacy telco applications had their life time measured in years, VNFs are likely to have much shorter life spans. Therefore, it's important to have a proper termination process that removes the VNF and releases the virtual resources.

Similar to the VNF instantiation process, [ETSI GS NFV-SOL 003] [sol-003] specifies the flow for terminating a VNF. Following that flow VNFM can delete the VNF and it's associated resources in VIM.

This post introduced the core function of VNFM; VNF life cycle management. In future we will dig deeper in to the subject of VNF orchestration, and how NFVO fits in to this puzzle.

*[HOT]: Heat Orchestration Template
*[TOSCA]: Topology and Orchestration Specification for Cloud Applications
*[VNF]: Virtual Network Function
*[VNFM]: VNF Manager
*[NFVO]: NFV Orchestrator
*[STP]: Signaling Transfer Point

[ifa-009]: https://www.etsi.org/deliver/etsi_gs/NFV-IFA/001_099/009/01.01.01_60/gs_NFV-IFA009v010101p.pdf
[sol-001]: https://www.etsi.org/deliver/etsi_gs/NFV-SOL/001_099/001/02.07.01_60/gs_NFV-SOL001v020701p.pdf
[sol-003]: https://www.etsi.org/deliver/etsi_gs/NFV-SOL/001_099/003/02.07.01_60/gs_NFV-SOL003v020701p.pdf
[sol-002]: https://www.etsi.org/deliver/etsi_gs/NFV-SOL/001_099/002/02.07.01_60/gs_NFV-SOL002v020701p.pdf


