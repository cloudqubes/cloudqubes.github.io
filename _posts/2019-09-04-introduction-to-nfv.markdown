---
layout: post
title:  "Introduction to NFV"
date:   2019-09-04 18:30:00 +0530
categories: insights nfv telco cloud
---

Network Function Virtualization is not just a magazine headline today. From its beginning in 2012, NFV has rapidly evolved through multiple standard revisions, PoCs, field trials and has entered large scale deployments in some tier-1 telecom service providers.

# Traditional Telecom Applications
Due to their nature of intensive reliability and real-time performance requirements, conventional telecom applications such as MSC server, MGW, MME, S/PGW etc. were designed to run on proprietary and vendor specific hardware. These equipment were built by a few large companies who could afford millions of dollar investments for designing and building this type of high end hardware and software. With the advent of NFV these applications have been labelled as Physical Network Applications.

# So what really is NFV?
 It is about virtualizing these conventional PNFs and migrating them to data centers equipped with commodity computing hardware. 

<img src="{{ "/assets/images/virtualizing_pnfs.png" | absolute_url }}" alt="drawing" width="1000"/>

Virtualization is nothing new to the IT industry which has been using it in various forms since 1960s. Today considerable amount of IT workloads are running on both public and private virtualized infrastructure. However telecom applications have some inherent feature differences from their IT counterparts that makes it particularly challenging to run them on virtualized infrastructure. Higher demand on network bandwidth, lower latency requirements, fault tolerance and resiliency are some of them.

# The driving factors
In 2012 an [ETSI] [etsi_nfv] specification group consisting of representatives from leading telecommunication service providers published a [white paper] [nfv_white_paper] that started the journey of NFV. The motivation for the NFV architectural approach was that these telecommunication companies had realized that the conventional telecom applications were slowing down the pace of evolution of the industry and they were unable to face the competition created by the emerging new players such as [WhatsApp] [whatsapp], [Skype] [skype], [Netflix] [netflix] etc. who are utilizing Internet as the medium to deliver their services. 

These new players were mostly software centric with their core product being developed internally and evolving rapidly according to the customer requirements. So if the telecom industry needed to evolve at a comparable phase the they need to get rid of the PNFs and implement a software centric platform that allows rapid evolution.

# The NFV architecture

Motivated by these industry requirements the ETSI NFV ISG defined a conceptual architecture for realizing NFV.

![NFV Architecture]({{ "/assets/images/nfv_architecture.png" | absolute_url }})

The ETSI architecture consists of:

1. Hardware

   The hardware consists of compute, network and storage nodes. All these are the standard, off the shelf hardware that are used in IT data centers. Compute nodes contain standard x86 architecture CPUs running standard Linux based Operating Systems while the network nodes consists of switches and routers that facilitates the interconnection between the compute nodes. The inbuilt hard disks of compute nodes or separate disk arrays can implement the function of the storage nodes.

2. Hypervisor

   Hypervisor is the main software component that runs on the compute nodes and provide virtual compute resources: vCPU, vMemory and vNIC,  that is used to build virtual machines which can run an operating system.

3. Virtual Infrastructure Manager (VIM)

    VIM is responsible for managing virtual resources and VMs. VIM can instantiate VMs, allocate resources to the VM and terminate the VM thus reclaiming the virtual resources. It is also responsible for creating the netwok connectivity between the VMs. Before the concept of NFV was born, [OpenStack] [openstack] has been widely used in IT virtualization to implement a similar functionality. Once the NFV implementation gathered momentum the telecom industry also adapted [OpenStack] [openstack] for VIM.
	
4. VNF Manager (VNFM)

   VNFM as the name explains itself, is responsible for managing the VNFs. A VNF consists of a set of interconnected VMs that provide a specific service to the outside world, ex- vHLR. The VNFM interworks with the VNF and enable some dynamic functions such as auto scaling. There could be multiple VNFMs for multiple VNFs.
	
5. NFV orchestrator (NFVO)

   NFVO handles the ultimate orchestration function. It is responsible for maintaining a catalog of VNFs and instantiating them according to requests from external parties such as a human operator. Collectively VIM, VNFM and NFVO is called MANO. 

   ETSI has identified the interfaces among these different components and is actively working on defining and maintaining the interface specifications.

We will discuss more about NFV and related technologies in upcoming posts.

## References

1. [Network Functions Virtualisation – Introductory White Paper ] [nfv_white_paper]

[nfv_white_paper]: https://portal.etsi.org/NFV/NFV_White_Paper.pdf
[etsi_nfv]: https://www.etsi.org/technologies/nfv
[whatsapp]: https://www.whatsapp.com
[skype]: https://www.skype.com/en
[netflix]: https://www.netflix.com/
[openstack]: https://www.openstack.org

*[VIM]: Virtual Infrastructure Manager
*[VM]: Virtual Machine
*[PoC]: Proof of Concept
*[PoCs]: Proof of Concept
*[PNFs]: Physical Network Functions
*[VNFM]: VNF Manager
*[NFVO]: NFV Orchestrator
*[MANO]: Management and Orchestration
*[NFV]: Network Function Virtualization