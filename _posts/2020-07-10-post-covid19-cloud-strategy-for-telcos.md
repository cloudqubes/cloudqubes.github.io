---
layout: post
title:  "Post COVID-19 Telco Cloud Strategy"
date:   2020-07-20 03:30:00 +0530
categories: [insights, nfv]
tags: [nfv, covid-19, strategy, cloud]
---

The world is still recovering from the impact of the COVID-19 pandemic. While some countries have successfully curbed the threat, a complete eradication of coronavirus is not yet in sight. Worse still, anytime a second wave of the pandemic could hit more devastatingly, so it would be a massive understatement to say that danger is over.

# Why should telcos care?

When a lockdown is triggered, and everybody stuck at home, the telcos are one of the first to get impacted. On one hand, both data and voice traffic surge, while on the other hand, the cash-flow gets hit due to delays in bill payments. Enterprise sales plummets during a lockdonw, and may take some time to recover, due to the limited spending capacity of the clients.

Even after the lockdown, the increased traffic may persist due to more people opting for WFH, and schools continuing online classes and lectures.

## The situation poses a challenge

While the cash flow is impacted, the demand for quality broadband services is growing, forcing the telcos to defer all other investments, and focus only on network expansions. In such circumstances, strategic projects like **cloud transformation** tend to get pushed back.

But, slowing down the cloud transformation could cause a loss of competitive advantage in future.

# So, what should telcos do?

Telcos have to adapt a transformtion strategy which is cost optimized, and that can deliver incremental benefits both in short and long terms.

## How to optimise cost?

First, let's explore some methods that can help push the cloud transformation forward, while keeping the costs under control.

### Build incementally

Instead of going for a fully fledged NFV system, complete with NFVO and SDN from day-1, introduce them in multiple phases. The first phase has to be the bare minimum requirement for running VNFs - OpenStack in a single DC, with a manually provisioned DCN without SDN. 

This option could deffer a significant portion of the NFV investment. Don't be mislead by suppliers who oppose this approach. Technically, OpenStack without NFVO can support multiple VNF onboarding, even with S-VNFM.

At a later stage, armed with the tacit knowledge gained by oprating this system, we can introduce robust orchestration and SDN solutions, which will also help build a fully decoupled NFV platform.

### Look beyond incumbent suppliers

Licensing costs of OpenStack and NFVO contribute to a significant portion of the overall cost, in NFV solutions from incumbent telco suppliers. But, there are other OpenStack distributions with more favourable licensing options. Some, even bundle open source NFVO implementations such as OSM in to their offerings, and are superior in features and functions to that of the solutions from the incumbents.

It may require a bold decision to select a supplier other than the incumbents, but the beneifts could be well worth. 

### Build a single cloud

Telcos tend to build separate clouds for enterprise, internal IT and VNFs.

While some suppliers bring up fluffy reasons to support this, the same cloud platform should be able to host all of those application types. The attempt to build a single cloud by amalgamating these isolated clouds, is more challenged by organizational structure than by technology, but is immensely beneficial financially.

With the challenges created by pandemic this is the perfect time to strive against the bias, and build a single cloud to satisfy all internal and external stakeholders.

### Use public cloud as DR
Public clouds tend to be expensive at higher scale, but turns out to be an efficient option for DR.

The resources in public clouds can be obtained instantly on demand, so can be provisioned only for the duration of recovering the main system from a failure. With DR in public cloud, the on-premise cloud can be fully utilized without keeping computing resources reserved for DR.

Therefore, we can drastically slash the expenses, by adapting public cloud for DR. 

## Look for short term benefits

While keeping focus on the long term objectives, we should also strive to earn short term benefits, so that investements on NFV can be justified.

### Implement auto-scaling VNFs
VNF auto-scaling was a hot topic with the advent of NFV. However, it was not widely adapted, and there was no big requirement to make the effort worth it.

However, the pandemic prooved that dynamic scaling has its applications, where VNFs could be scaled-out to cater a traffic surge.

### Solve the immediate problems for enterprises

While their spending power impacted by the pandemic, enterprises are also challenged with immediate problems in connectivity and security for accommodating work from home employees.

Telcos can help solve these problems by offering virtualized firewalls, security and VPN solutions on NFV. With the ability to be provisioned instantly, it could serve the immediate market needs while earning healthy returns on NFV investments for telcos.

### Optimize VNF service cost

The service components, including design, implementation and commissioning add up to form a high service costs, for telco applications. In hardware based PNFs this can be justified since the supplier has to install the hardware, and be physically present for the initial commissioning. 

The time has come to challenge this cost structure with NFV. Once the initial work for onboarding a VNF is completed, capacity expansions become either scaling-out operations or redeployment in a different data center, which could be executed by the telco engineers with minimum support from supplier.

While gaining the benefits in time to market of VNFs, we also have to strive for financial benefits accompanied.

## Look for the long term perspective

The short term benefits should aspire to justify investments. The long term perspective should strive to build competitve advantage, leveraging NFV.

Here are two approaches that can build such competitive advantage in the long run. However, there are myriad of other approaches that are dependent on the particular environment each telco is operating.

### Be a system integrator to serve new enterprise markets

The pandemic and the lockdown bear witness the need of industrial automation unlike any other time in history, and will create new business opportunities as enterprises start seeking automation solutions. IoT and 5G campus networks coupled with NFV can help the telcos in serving these emerging enterprise business requirements. 

But, there's a caveat. These technologies tend to be a part of a complete solution, so that the traditional approach of selling products will no longer suffice. The telco has to be a **system integrator** who can develop customized solutions based on requirement analysis for each enterprise. 

### Automate every possible thing

Automation is often an afterthouhgt in telco NFV projects - which should not be. With the tendency of WFH, now is a good time to analyse the existing tools and processes to identify the automation opportunities created by NFV.

It does not need big investments in order to get started with automation. In some cases, it would be possible by proper application of existing tools. 

It's almost impossible to build **automation** in one giant step. It has to be introduced gradually, with incremental benefits achieved in each step. Once these incremental steps accumulate to build a fully automated network, it will be an invaluable competitive advantage, since competitors would find it hard to replicate in a short duration.

*[NFV]: Network Functions Virtualization
*[WFH]: Work From Home
*[PNF]: Physical Network Function
*[NFVO]: NFV Orchestrator
*[DC]: Data Center
*[SDN]: Software Defined Networking
*[DCN]: Data Center Network
*[VNF]: Virtual Network Function
*[VNFs]: Virtual Network Functions
*[S-VNFM]: Specific VNF Manager
*[OSM]: OpenSource MANO
*[DR]: Disaster Recovery

