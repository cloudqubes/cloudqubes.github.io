--- 
layout: post 
title:  "OpenStack for NFV" 
date:   2019-09-10 04:18:00 +0530 
categories: NFV cloud telco OpenStack 
--- 

In 2013 ETSI published their [second white paper] [white_paper] on NFV, introducing the NFV architectural framework. This framework focused on defining the NFV building blocks and their interaction in an architectural context. The VIM which was identified as one of the components within the Management and Orchestration, was intended to manage the virtual resources in NFV. While not explicitly mentioned OpenStack must have been a candidate for VIM since the white paper mentions the intention of using existing "cloud management systems".  

Following year ETSI released the first version of specification for MANO [ETSI GS NFV-MAN 001] [mano] defining the scope of VIM as responsible for controlling and managing NFVi compute, storage and network resources.  

![NFV Architecture]({{ "/assets/images/nfv_architecture.png" | absolute_url }}) 

In order to accelerate the adaptation of NFV the Linux Foundation founded the projet [OPNFV] [opnfv] in 2014, with initial focus of providing a reference platform for the NFVi part of the NFV architectural framework. The OPNFV project adapted an "upstream" approach to leverage a number of opensource projects including OpenStack, which at the time was in its release Icehouse. 

Before NFV came along, OpenStack has been successfully used in IT industry for managing large scale cloud deployments. Therefore this selection would have been quite obvious. Since then industry has widely adapted OpenStack as the de facto for the VIM. Today, from Icehouse to [Stein] [stein], OpenStack has evolved through ten release upgrades adapting multiple features required for NFV. The focus of NFV in OpenStack project has intesefied to such a level that the OpenStack summit now includes a separate track for Telcom and NFV. 

OpenStack is a huge software system with a collection of components also known as projects.  Now we shall look at the some of the key projects and their significance for NFV. 

# Nova 

Nova which is the compute service, is one of the fundamental components of OpenStack and is a mandatory component for NFV. Nova allows provisioning [VMs] consisting of virtual CPU and memory on top of the Operating System running on bare metal servers. NFV as of today primarily focus on VMs instead of containers so Nova remains the most important component for NFV. 

Unlike typical IT workloads NFV demands stringent bare metal like performance from VMs. Nova provides two very important features: CPU pinning and IO based [NUMA] scheduling for supporting such performance demands. 

# Neutron 

Next to computing the most important functionality in OpenStack is networking, which is provided by Neutron. Primarily Neutron consists of a northbound API, a datastore and a set of plugins and agents. While the northbound API provides a unified interface for accepting client requests for creating and managing virtual networks, different plugins and agents are employed according to the underlying networking technology. These plugins and agents executes the actual configurations on underlying networking services for implementing the virtual network according to the client requests. While OpenStack is shipped with the plugins for interworking with Linux bridging and Open vSwitch networking services, a multitude of network equipment vendors provide their own plugins for interworking with their own networking technologies. 

 Comparative to general purpose cloud, NFV has more complex networking requirements. Therefore [SDN], which implements an advanced networking architecture with centralized control and programmability, has become an integral part of NFV. [SDN] overcome some of the deficiencies in Neutron by separating the control and forwarding planes of networking services. [SDN] controllers also integrate with Neutron via the above mentioned plugin architecture. 

Networking in NFV has another tough challenge, that is to achieve line-rate performance in network interfaces. DPDK has enhanced the throughput of vNICs by about tenfold, but is far from reaching the line-rate performance in 25G and above network interfaces . For such high throughput requirements [SR-IOV] needs to be employed. 

# Cinder 

Cinder provides block storage service and can work with multiple centralized storage solutions available in industry.  The storage requirement of most VNFs may not be very high. However some telcos may need to run non VNF applications such as analytic tools on the NFV platform. Careful consideration is needed when dimensioning a centralized storage as different applications demand varying resiliency and [IOPS] requirements. So we may have to maintain separate storage pools for different applications in order to balance the performance with cost. 

There is also an emerging trend of using software defined storage solutions which, implement a distributed and high available storage using the local storage devices of compute nodes. Use of software defined storage should be considered as an architectural decision in an NFV deployment. Another option that needs to be considered is whether to use local storage or centralized storage for VM root disks. If local storage is going to be used for VM root disks live migration of VMs may not be possible. 

# Keystone 

Keystone which provides authentication for the OpenStack services and users is a mandatory requirement in any OpenStack deployment.  External users when connecting to OpenStack are also authenticated by Keystone. While the security provided by Keystone may be adequate for some enterprises, telcos with stricter security policies should consider integrating LDAP authentication for the users of NFV system. 

# Heat 

Heat provides a template based orchestration for cloud applications. While NFV architecture defines  separate component named [NFVO] and [VNFM] for the orchestration function, Heat is a mandatory component for an OpenStack deployment for NFV. Under the hood the NFVO and VNFM  utilize Heat APIs for deploying VNFs and expose a richer set of functionalities to NFV users for managing the complete life cycle of VNFs.  

# Horizon 

While not mandatory it's always good to have a GUI for managing an OpenStack deployment. In a vanilla OpenStack deployment Horizon provides a dashboard for easy management. However most OpenStack vendors tend to provide their own version of the dashboard which are mostly some extended versions of vanilla Horizon. 

# CLI 

Who will want to use CLIs in the todays world of GUIs?. The truth is you will need to access the OpenStack CLI. The main requirement for CLI could be troubleshooting. Technically it is possible to deploy a complete VNF from the OpenStack CLI alone. But you need to be cautious of one thing. If the NFVO is equipped with resource management function whatever changes done via CLI or Horizon will not be synchronized with NFVO. Therefore most vendors recommend provisioning VNFs only via NFVO. 

In this post we have described the fundamental components of OpenStack and also touched upon some topics about performance enhancements in OpenStack. In future let's dig deeper in to some of these topics. 

## References 

[OPNFV Announcement] [announcement1] 

*[ETSI]: European Telecommunications Standards Institute 
*[IOPS]: Input-Output Operations per Second 
*[S-VNFM]: Specific VNF Manager 
*[NFV]: Network Function Virtualization 
*[NFVO]: NFV Orchestrator 
*[NUMA]: Non Uniform Memory Architecture 
*[NFVi]: NFV Infrastructure 
*[VMs]: Virtual Machines 
*[VIM]: Virtualised Infrastructure Manager 
*[SDN]: Software Defined Networking 
*[SR-IOV]: Single Root IO Virtualization 

[white_paper]: https://portal.etsi.org/NFV/NFV_White_Paper2.pdf 
[mano]: https://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf 
[announcement1]: https://www.opnfv.org/announcements/2014/09/30/telecom-industry-and-vendors-unite-to-build-common-open-platform-to-accelerate-network-functions-virtualization 
[opnfv]: https://www.opnfv.org/ 
[stein]: https://releases.openstack.org/stein/index.html