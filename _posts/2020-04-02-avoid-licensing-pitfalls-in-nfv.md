---
layout: post
comments: true
title:  "Avoid licensing pitfalls in NFV"
date:   2020-04-02 06:35:00 +0530
categories: [insights, nfv]
tags: [nfv, licensing, model, tco]
---

**NFV is not an easy technology to get started with. Its licensing model can be even more complicated.**

We all know that NFV has a steep learning curve at the initial stage of implementation. An NFV project could easily take 12 to 18 months from start to completion, due to its technical complexity. Its commercial considerations can be even more complicated, because NFV is not a single product.

In traditional telco functions such as HLR or EPC, the commercial evaluation would be based on TCO or NPV, for a specific capacity. The licensing models of such products are practically unified across most vendors and could be boiled down to parameters such as number of subscribers or number of sessions, which are directly related to business values. 

In contrast, NFV consists of multiple hardware and software components such as servers, storage, VIM, NFVO, and SDN etc., which are licensed separately. In addition to these fundamental components there could be additional systems for equipment management, alarm monitoring, and analytics which have distinct software licenses.

NFV has another notable difference. Unlike traditional telco products which have largely CapEx licenses, most NFV solutions have OpEx licensing models, and some could have a combination of OpEx and CapEx licensing.

Considering all these here are few tips on avoiding common pitfalls in NFV licensing.

### Avoid software licensing that is bundled to memory capacity

Some NFV platforms have software licensing on memory capcity of VMs. Due to the nature of telco applications, their memory demand will definitely increase exponentially in future, so that any licensing model with memory as a parameter is likely to give you a lot of headache in future.

### Avoid licensing each VNF

Some NFVO and VNFMs have a license per VNF or VNF instance. This license will make it hard to estimate the TCO, since you will not have the slightest notion of how many VNFs you are going to onboard in future.

It will give you more trouble if you are to provide enterprise services on NFV platform, where you would allow enterprise customers to run their applications such as firewalls as VNFs on NFV. 

Alos the future 5G networks will have features like network slicing, where niche customer segements would be provided with separate slices of the network with separate VNF instances. Such service delivery models will be exorbitantly costly, if you are to pay a license fee per VNF.

### Avoid licensing vCPUs

With the rational that you would be paying for only what you use, some NFV suppliers promote licensing each vCPU. The drawback of vCPU licesing is that your NFV cost is going to increase linearly with compute capacity. 

Instead insist on licensing per CPU socket. The number of CPU cores per socket is likely to increase in future, so that you will be able to push down the cost per vCPU by using CPU sockets with higher number of cores.

### Be cautious on OpEx and PAYG licenses

OpEx or PAYG license models could look appealing at the beginning because your starting cost is lower. But, in the long run OpEx is going to be a huge burden, specially if the NFV capcity demand increase exponentialy. 

However, most OpenStack ditributions are licensed in an OpEx model, so it may be unavoidable. In such cases always push for pricing slabs, where the unit price come down as capcity increase. (Ex- First 1000 CPU sockets are liecesed 100 USD per year, from 1000 to 2000 CPUs are licensed 60 USD per year.)

### Ensure that software upgrades are covered in OpEx licenses or AMC

NFV is evolving at a rapid rate, so frequent software upgrades are not going to be uncommon. A new version of OpenStack is released twice a year, and each version has a maintenance life cycle of 18 months. Therefore, you need to keep upgrading the system at least every two years, if you are to stay ahead of the curve.

Also the ETSI standards of NFV are evolving fast and new feature are coming up with new capabilities. Accordingly NFVO and VNFM will also have to be upgraded to newer versions.

Therefore it is important that software upgrade costs are also covered in some form of OpEx costs.

### VNF onboarding service

Speciall attention is required on VNF onboarding since it is going to be the mainstream activity in NFV. While it may be required to get vendor support for some complex VNF onboarding cases, always ensure that the telco engineers can execute a VNF onboarding end to end without getting any support from the VNF platform supplier. Make sure that there are no blocking points in any action in the onboarding process that require sgetting paid support from the VNF platform supplier.

### TCO comparison

Considering the differences in scalability and capacity, a TCO comparison can be done only with a very large capacity forecast involving multiple data centers. Be preapred for deviations since a capcity forecast will be tricky, when involving multiple parameters such as vCPUs, memory, storage, and network throughput. 

While this post discussed some common pitfalls in NFV licensing, this by no means is an exhaustive list. But, we hope this information would help you avoid common mistakes, which in tern will make your NFV journey easier.