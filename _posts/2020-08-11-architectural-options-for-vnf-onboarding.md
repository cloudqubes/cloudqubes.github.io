---
layout: post
title:  "Architectural options for VNF onboarding"
date:   2020-08-13 06:20:00 +0530
categories: [insights, openstack]
tags: [Telecom]
---

Onboarding is the process of getting a VNF up and running on NFV infrastructure. The process of onboarding consists of three phases; design, modeling and deployment. 

A crucial decision at the early stage of the design phase, is the onboarding architecture - how the VNF is going to be onboarded. There are several architectural options for onboarding, and the most suitable option depends on the capabilities of NFV infrastructure as well as the VNF. 

Each of these options enable different automation capabilities. That also has to be considered in the selection process.

ETSI does not mandate how, a VNF should be onboarded. However, based on ETSI NFV architectural framework we can derive these options for onboarding a VNF.

1. VNF onboarding without NFVO/VNFM
2. Standalone GVNFM
3. Integrated GVNFM
4. Standalone SVNFM
5. Integrated SVNFM

Let's go into details on each of these.

# VNF Onboarding without NFVO/VNFM

![VNF Onboarding without NFVO/VNFM](/assets/images/onboarding_architecture_no_vnfm_nfvo.png)

Neither NFVO nor VNFM are mandatory elements in an NFV ecosystem. If your NFV setup consists only of OpenStack (VIM) but not NFVO or VNFM - that is perfectly fine, and you can onboard multiple VNFs in a simple onboarding mechanism; Heat Orchestration Templates.

Heat is the orchestration service of OpenStack. Heat templates are definitions of OpenStack resources such as VMs, virtual networks and virtual block storages, and their relationships in YAML. In addition to virtual resource definitions, Heat templates can refer binaries and configuration files as [MultipartMime], which are used in conjunction with cloud-init for doing boot time configurations in VMs.

The OpenStack CLI or Heat API can be used to create a Heat stack with a Heat template. The stack is essentially the group of resources defined in the template.

As a rule of thumb, a VNF can be onboarded as one Heat stack. However, it's perfectly possible to split a complex VNF in to multiple Heat stacks, for simplifying the VNF onboarding and operation processes.

## Pros

Heat has an easy learning curve, and allows modeling VNFs of any complexity. So, onboarding a VNF with Heat is a relatively easy process. 

## Cons

Once a stack is created with a template. it's diffucult to make changes in individual resources. As an example if a VM crashes, you would like to delete it and recreate a new VM without touching other VMs. Heat does not provide a straight forward way of doing this. All you can do is an update operation on the stack to delete the specifica VM and recreate, taking extra precautions to ensure other resources in the stack are not affected.

Heat does not support modeling resources external to OpenStack. This poses a challenge, if you want to automate the configurations of a DCGW that is connecting your OpenStack to the outside world.

# Standalone GVNFM

![Standalone GVNFM](/assets/images/standalone_gvnfm.png)

The suppliers who provide NFVO solutions tend to create their product as a combination of NFVO and VNFM. This VNFM embedded with NFVO, is known as GVNFM since it is not intended for a particular VNF only.

While Standalone GVNFM could use either TOSCA or Heat for modeling the VNF, if you have plans to evolve in to an integrateed GVNFM, support for ETSI compatible TOSCA based VNF modeling would be an advantage.

## Pros

Since GVNFM is embedded in to NFVO, there are no any API integrations to be done when onboarding the VNFs, so time and effort would be relatively less than the integrated GVNFM scenario.

## Cons

Unlike an SVNFM which is developed by the VNF supplier, GVNFM has limited awareness about the VNF. Since the standalone GVNFM does not have an external API for receiving status information about the VNF, this GVNFM has limited capabilities for executing auto-scaling/healing operations.

# Integrated GVNFM

![Integrated GVNFM](/assets/images/integrated_gvnfm.png)

The integrated GVNFM overcomes the limitations of the standalone GVNFM by talking to an EM and VNF over the Ve-Vnfm interface. While ETSI identifies two separate interfaces Ve-Vnfm-Em and Ve-Vnfm-Vnf for EM and VNF, both are described in [IFA008] and [SOL002] specifications.


## Pros

With the support of Ve-Vnfm interface, the Integrated GVNFM can take care of all automation requirements of the VNF life cycle managment, including instantiation, auto-scaling/healing, termination and VNF configuration managememt.

## Cons

While Ve-Vnfm reference point enables a fully fledged automation, it actually depends on VNF, EM and VNFM implementing all capabilities described in ETSI. Still there are very few VNF suppliers who could support all these capabilities to there fullest potential.

Even though it has all capabilities for automation, the integration of Ve-Vnfm reference point is a complex task and will take a considerable time and effort. However, the you could choose to do the initial onboarding with the standalone GVNFM and evolve to an integrated GVNFM at a later stage.

# Standalone SVNFM

![Standalone SVNFM](/assets/images/standalone_svnfm.png)

The ETSI architectural framework allows existance of multiple VNFMs, so that each VNF supplier can introduce their own VNFM. Since this type of VNFM is intended to manage one or more VNFs from the same supplier it is known as SVNFM. This convention of naming VNFM as GVNFM and SVNFM is created by the industry, so you will not find the ETSI specifications referencing to these names.

The standalone SVNFM talks to VIM (OpenStack) via OpenStack APIs, which is essential for provisioning virtual resources, but has no interworking with the NFVO. While this would be the only option if you do not have an NFVO, it is a viable option even when NFVO is present. 

## Pros

Standalone SVNFM has access to the VIM, via Vi-Vnfm reference point, so it can directly manage the virtual resources of the VNF. This architecture makes it easier for the VNF supplier to implement VNF life cycle management procedures, so most suppliers prefer this onboarding option.

Since it eliminates the complex API integration of Or-Vnfm reference point, the standalone SVNFM can cut down the time to market for onboarding a new VNF.

If integration with NFVO is essential, the standalone SVNFM can be evolved to an integrated SVNFM at a later stage where the integration does not affect the go-live time plan of the VNF.

The standalone SVNFM is free to choose either Heat or TOSCA as its VNF modeling method. However, if you plan to evolve this to an integrated SVNFM at a later stage support for ETSI compliant VNF Packaging with TOSCA VNFD is

## Cons

Since standalone SVNFM has no communication with NFVO, the NFVO will have no visibility of the VNFs onboarded from SVNFM. This could be a constraint when implementing a higher level, service orchestration.


# Integrated SVNFM

![Integrated SVNFM](/assets/images/integrated_svnfm.png)

The standalone SVNFM, limits the ability of NFVO to act as a single integration point for an upper level service orchestrator. This limitation can be subdued by integrating the SVNFM with NFVO via Or-Vnfm reference point, which is described in ETSI specifications [IFA007] and [SOL003].

ETSI functional requirements document IFA010 defines two modes for a VNFM to manage virtual resources; direct mode and indirect mode. In the direct mode the VNFM will be responsible for managing virtual resources in VIM, while in the indirect mode the NFVO will take care of provisioning the virtual resources in VIM according to the requirements from VNFM. However, current [SOL003] specification defines only the direct mode of resource management.

The integrated SVNFM requires the VNF to be modeled in TOSCA, complying to ETSI defined [SOL001] VNFD specifictions. The VNFD also needs to be packaged according to the VNF packaging specification in [SOL004].

## Pros

The integrated SVNFM enables the NFVO to manage the life cycle of the VNF, so it creates an architecture with more support for automation.

In this architecture the NFVO is responsible for allocating resources to each VNFM. Therefore, the NFVO can support VNF auto-scaling by orchestrating dynamic resource allocation among multiple VNFs. 

## Cons

Similar to the integration over Ve-Vnfm interface in the integrated GVNFM scenario, the integration of Or-Vnfm interface could be challenging, especially if it's between two rival suppliers. This is a non-trivial work that will include service costs as well. 

# The significance of VNF onboarding

The benefits of NFV relies on being able to onboard VNFs from multiple suppliers on a generic NFV infrastructure. While the big telco suppliers still insists on going with a vertical VNF solution with VNF and NFV infrastructure from the same supplier, that kind of isolated NFV islands are not going to bring the expected agility of cloud architecture. Therefore, the telcos should strive to build a genric, horizontal NFV infrastructure which can support any VNF. 

There's no best way to onboard any VNF. The best option for onboarding should be a design-time decision that takes requirements of the telco, and capablities of the NFV and the VNF as inputs. 

*[NFVO]: NFV Orchestrator
*[VNFM]: VNF Manager
*[SVNFM]: Specific VNF Manager
*[GVNFM]: Generic VNF Manager
*[VNF]: Virtualized Network Function
*[VIM]: Virtualized Infrastructure Manager
*[DCGW]: Data Center Gateway
*[EM]: Element Manager
*[VNFD]: VNF Descriptor

[SOL003]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-SOL+003&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
[SOL001]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-SOL+001&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
[SOL002]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-SOL+002&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
[SOL004]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-SOL+004&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
[MultipartMime]: https://docs.openstack.org/heat/pike/template_guide/openstack.html#OS::Heat::MultipartMime
[IFA008]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-IFA+008&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
[IFA007]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-IFA+007&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all