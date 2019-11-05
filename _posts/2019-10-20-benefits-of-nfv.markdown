---
layout: post
title:  "Benefits of NFV"
date:   2019-10-20 19:30:00 +0530
categories: NFV cloud telco
---
NFV, currently in its 3rd release as of 2018 is at the center of attraction of telecom operators all over the world. While some telcos are still cautiously observing this, the high-tech front-runners have already moved a long way on their transformation journeys.

They are all driven by the benefits that NFV brings in to the telco world. So, let's have a look at what these benefits are.

Before continuing we need to be aware of the fact that NFV will transform the operations model of telecom operators to a software centric one from the traditional model centered on hardware boxes. It is this software centric nature that brings in all these benefits to the telecom networks.

# Improved time-to-market 
Legacy telecom services have roll out times measured in months. Typically this involves tedious paper based evaluations, hardware shipment, installation and integration. NFV can cut down this to days or weeks since a new application can be deployed on existing NFV infrastructure for evaluation purpose and if the evaluation is successful can be immediately moved to production environment.
This was simply not possible with previous hardware based applications.

# CapEX Saving
The legacy hardware based applications had to be deployed at a fixed initial capacity that was large enough to handle a forecasted traffic growth. On the contrary the VNFs being purely software can be deployed at a small scale and gradually expanded depending on market demands thus saving large CapEx investments.

# Software Version Management (Software Upgrades)
Software Version Management (or more commonly refereed as software upgrades) is an important part of operating a telecom network. Multiple types of software release upgrades and patch upgrades has to be performed on telecom nodes for fixing bugs, fixing security issues, implementing new features or purely as a requirement of product life cycle management.

A traditional software upgrade process is a tedious task which involves allocating service outage windows, executing the upgrade during low traffic hours, and rigorous manual testing after the upgrade to ensure the services are working properly. If an issue is discovered after the upgrade the system has to be reverted back to the previous version which aging could be a more daunting task than the upgrade.  

In NFV environment the software upgrade process is quite different. You can deploy the new version as a new VNF instance, test and then migrate the traffic in incremental stages. Once the total service is migrated to the new instance the old instance can be shutdown. If the VNFs are designed as cloud native applications it should also be possible to automate most of these activities.

# Simple inventory management
Each of the traditional PNFs utilized custom hardware of their own thus accumulating a massive inventory of different hardware types with their own life cycles. The unified nature of COTS hardware simplifies this inventory.

# Capacity planning and capacity management
Capacity planning is an integral part of managing a telecommunication network. Each PNF requires separate dimensioning of hardware in addition to software dimensioning. Then you have to order the required hardware from the each vendor for each PNF and install the hardware during low traffic hours such that live traffic is not affected. Since the lead time for hardware is much greater than that of software the hardware capacity should be planned accordingly. 

Due to this lead time in hardware shipment and the work involved in hardware installations it is a usual practice in the industry to do hardware expansions in annual time windows, that is at one time you would bring in hardware enough to handle traffic, forecasted for one year.
In the NFV arena hardware capacity planning is centralized: much simpler. Then each VNF capacity can be increased in small incremental steps without worrying about the hardware.

# Knowledge and expertise
When operating PNFs the telecommunication application engineers had to master the hardware platforms in addition to the service delivered on top of it. The virtualization eliminates the burden of hardware related management from the application engineers so they can focus more on the services delivered.

# Improved hardware utilization
Unlike traditional PNFs the VNFs are utilizing a common pool of hardware. A PNF may only utilize a certain portion of the hardware at a given time but the remaining hardware cannot be allocated for another purpose. But VNF will be occupying just the required amount of hardware and can be scaled gradually according to the demand.

# Automation
Automation is a key aspect of NFV. The software centric NFV model allows automating many repetitive operation and maintenance tasks such as VNF deployment, scaling, testing, VNF configuration and fault recovery etc.

NFV can facilitate automation opportunities where VNFs can be deployed and scaled without human intervention. As an example an enterprise customer can set up a VPN to a branch office via a web portal without manual intervention of technicians at the service provider or a virtual firewall can be scaled up by allocating more compute resources during peak hours. The NFVO plays a key role in facilitating automation in the NFV environment.

# OpEx Saving
NFV will reudce OpEx in the long run. There could be several factors that will contribute to this saving such as efficient hardware utilization, simplified organizational structure etc.

In conclusion it should be noted that some of these benefits will not be available from day-1 and there may be additional work for yielding those. So, it is important that telcos consider NFV transofrmation as not a destination, but a continuous journey.

[VNF]: Virtualized Network Function
[PNF]: Physcal Network Function
[NFV]: Network Function Virtualization
[NFVO]: NFV Orchstrator
[VPN]: Virtual Private Network