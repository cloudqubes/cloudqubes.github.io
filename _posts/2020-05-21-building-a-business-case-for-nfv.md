---
layout: post
title:  "Building the Business Case for NFV"
date:   2020-05-21 04:00:00 +0530
categories: [insights, nfv]
tags: [nfv, business-case]
---


You are all set for developing a new NFV data center. You have completed an arduous amount of work writing RFPs and evaluating technical proposals from suppliers. You have selected the best feature packed NFV platform on the planet. Then comes the time for the commercial evaluation. You follow a tedious process of comparing the costs, license models etc., of each solution and do several rounds of negotitaions. But, still your business case is far from being positive.

You are not alone. 

The initial cost of NFV makes it almost impossible to justify a business case, unless you have at least a 3-year roadmap of high-revenue-growth VNFs. NFV being a novel technology, it is nearly impossible to have such a roadmap at the initial stage.

Now is the time to do some serious analysis on the cost structure of NFV. It consists of two components; fixed and incremental.

### Fixed Cost

This is the part of the cost that does not depend on the capacity of the platform, which means that downsizing won't reduce these costs.

1. NFVO
: The NFVO will most likey have a base cost - both in hardware and software, which will not depend on the number of servers you install in the DC.
2. OpenStack
: A production OpenStack deployment requires at least three controller nodes. Most OpenStack distributions are licensed per CPU socket, so that you will have the cost of 6 CPU sockets plus the hardware cost of the three servers used for controller nodes, as the fixed cost.
3. SDN
: At minimum a data center network requires a pair of spine switches, border leaf switches, and DC gateways. Each data center requires an instance of the SDN controller which may also have an intial fixed cost for the software.
4. Storage
: A centralized storage requires a pair of storage controllers and chassis to hold hard disks. The storage software also has a base cost.
5. Management Tools
: NFV is usually accompanied with some modules for managing hardware and alarm monitoring etc. These modules will cost both in hardware and software.
6. Service cost
: A part of the service cost would be for installing these fixed components, and will not depend on the amount of servers you install

### Incremental Cost

This is part of the cost that depends on the number of servers you have in the DC. Incremental cost mainly consists of hardware and software cost for servers, leaf switches and hard disks that get installed in the centralized storage. 

## NFV Business Case

A traditional business case is developed considering the cash flow statement, which evaluates the amount you spend on an application with the revenue that particular application brings in.

NFV being a platform, is not going to bring revenue itself, unless you are going to proivde NFV-as-a-service to other telcos,which is something not yet widely adapted. Therefore, you have to develop a business case for NFV based on the revenue of VNFs that you plan to run on top of it. 

The problem with this approach is that the fixed costs of NFV, makes the business case negative for the few inital VNFs that you plan to onboard. Therefore you need to take a different approach.

Instead of evaluating the cashflow of VNFs, we can compare the TCO (or NPV) of NFV with other options available, if we do not choose to build a horizontal NFV platform.

These are the other options:

1. Continue with legacy applications (PNFs)
: This will be infeasible since vendors are now moving away fom legacy applications, so PNFs will not be available for purchase in future.
2. VNFs with vertical NFVs
: This is what will happen if you do not build a horizontal NFV platform, with a clear strategy. Each vendor will bring their own virtualization platforms to run thir VNFs, resulting in a set of siloed vertical NFVs. Ultimately you would have incurred all costs of NFV, without getting the benefits of synergy.
3. Public Cloud
: Public cloud has very low starting cost, compared with NFV, but considering the bandwidth intensive telco applications, public cloud alone will not suffice for telcos. However, you could adapt a hybrid cloud model with part of the VNFs running in on on-premise NFV while other VNFs are running on public cloud.
4. Bare metal servers
: Using bare metal servers may not be technically viable at higher scales, due to manageability. You should also note that the baremetal option will need more number of servers than NFV, due to practical limitation of utlizing a bare metal server to its maximum, which according to industry studies, could be as low as 10%[^1].

We can rule out option 1 & 2, and use 3 & 4 to do a TCO comparison with NFV.

In order to do that, we calculate the cost of computing resources required in each option, for running the same workload, for a period of 3 years, as per below methodology.

1. NFV
: Consider the cost of hardware and software (compute, networking, storage) infrastrucutre require for yielding a specific amount of vCPUs, memory, and storage for an assumed workload.

2. Public Cloud
: Calculate the cost of VMs and virtual storage required on public cloud for delivering the same amount of vCPUs, memory and storage resources considered in NFV option. Most public cloud providers charge for network bandwidth, which should also be taken in to account.

3. Bare metal servers
: Esitmate the cost of the number of servers, network, and storage devices required in bare metal, if you are to run the same workload considered in NFV. You can use a utilization factor either estimated based on past experience, or taken from an industry reference.

If your NPV is not lowest for horizontal NFV option, you may have to do some serious negotiations with the supplier.

## Building a decoupled NFV platform

You could get the lowest NPV for the horizontal NFV option, but still be challenged by budget availability. What could you do? 

Build a decoupled NFV platform.

Most NFV solutions from mainstream telco vendors are bundled with virtualization software, SDN hardware and software, orchestration etc., as a complete product, so that you will incurr a considerable fixed cost, from day-1.

Alternatively, you could build an NFV platform by installing an OpenStack distribution such as [Ubuntu] or [RedHat] on COTS hardware, and introduce SDN and orchestration at a later stage, so that a significant portion of the fixed cost would be eliminated in day-1.

While this option has commercial advantage, it may be more technically challenging than getting the complete solution from a single vendor. However, you get the opportunity of building an NFV platform without any vendor lock-in.

NFV is a transfromation that is challenging both in technical and commercial aspects. We hope that the information shared here, will help you kick-start your NFV journey, successfully. 

Good luck...

## References
[^1]:[The Business Case for Virtualization][hp-business-case]


[hp-business-case]: http://www.hp.com/canada/promotions/midmarket/virtualization/resources/The_business_case_for_virtualization.pdf
[ubuntu]: https://ubuntu.com/openstack
[RedHat]: https://www.redhat.com/en/technologies/linux-platforms/openstack-platform

*[NPV]: Net Percent Value
*[TCO]: Total Cost of Ownership
*[horizontal NFV platform]: NFV platform that is built independent of any particular VNF.
*[SDN]: Software Defined Networking