---
layout: post
title:  "Functions of NFVO"
date:   2019-11-18 04:00:00 +0530
categories: Telecom
---

**NFVO is a key component in the NFV ecosystem. It provides a unified interface for managing virtual resources across multiple data centers, and acts as the single point of integration for external applications.**

We have introduced NFVO in a [previous post]({% post_url 2019-09-04-introduction-to-nfv %}), where we discussed the ETSI NFV architectural framework. However, you may find that the actual implementation of NFVO in the industry, is slightly different to what is prescribed by ETSI.

<img src="{{ "/assets/images/nfvo.png" | absolute_url }}" alt="NFVO" width="1500"/>

While NFVO and VNFM are defined as two different entities in ETSI framework, most vendors bundle them together as NFVO. The VNFM that is inside the NFVO is named Generic VNFM or G-VNFM, and you could integrate Specific VNFMs or S-VNFMs via Or-Vnfm interface. 

Therefore, the VNF vendors have flexibility such that, they could either build their own VNFM or use the NFVO + G-VNFM combination to deploy VNFs.

Now let's explore the functions and responsibilities of NFVO.

# VNF life-cycle management

The prime responsibility of NFVO is the life-cycle management of VNFs. The life-cycle management process essentially consists of VNF modeling, deployment and termination. Optionally it could involve VNF scaling, healing, and VNF configuration.

The VNF model is the definition of virtual resources such as virtual networks, virtual storage, virtual machines, etc., that would be consumed by the VNF. ETSI names this model as the VNFD, and the specifications NFV-SOL 001 and NFV-SOL 006 defines how the VNFD should be composed using TOSCA and YANG modeling languages respectively. 

However, most commercial NFVOs rely on OpenStack Heat as the primary VNF modeling mechanism, and has only limited support for NFV-SOL 001 and NFV SOL-006. The major reason for using Heat is, its ability to be deployed directly on OpenStack using Heat APIs. While Heat is quite adequate for defining the virtual resources, it has limited support for VNF scaling and healing. Even though ETSI has provisions for VNF scaling in its VNFD specifications, scaling and healing are non trivial activities that require support from VNF as well.

Once VNF model is provided, NFVO can use that to create the virtual resources on VIM, via the Vi-Vnfm interface. This creation process is known as VNF instantiation. Using the same APIs NFVO can terminate the VNF and release the allocated virtual resources. NFVO has to provide a GUI for initiating these life-cycle events.

Configuring VNFs is an important part of the life-cycle management. Most VNF vendors still rely on manual MML or CLI methods for VNF configuration, and some have adapted solutions like Ansible. With the wide variety of options used for VNF configuration, standardization of a single protocol is unlikely to happen in near future. So NFVO should implement the flexibility to hook up any configuration mechanism as required by 3rd party VNF vendors.

# User/Tenant management

The NFVO needs to accommodate multiple VNFs, belonging to multiple users. Therefore, NFVO logically separates the virtual resources by assigning quotas to its users. However, actual separation of virtual resources lies on the underlying VIM, and if OpenStack is used it is achieved via OpenStack projects.

# Single Point of Integration for Upper Layers

The NFVO exposes northbound APIs for upper layer service orchestrators, OSS or any other function that needs to be a part of VNF life-cycle management. While ETSI defines SOL-005 as the northbound interface, it would be an added advantage if NFVO can expose all its GUI actions as APIs, so that any of its workflows can be executed via APIs.

We have discussed the functionality of NFVO in detail in this post. The most important part of NFVO is the life-cycle management of VNFs, and the process of implementing this for a VNF is known as VNF onboarding in industry terms. In a future post we will explore about the process of VNF onboarding in detail.

*[VNFD]: VNF Definition.
*[NFV]: Network Function Virtualization
*[NFVO]: NFV Orchestrator
*[VNF]: Virtual Network Function
*[OSS]: Operational Support System
*[VNFM]: VNF Manager
