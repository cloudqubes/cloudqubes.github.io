---
layout: post
title:  "Building Blocks of The Cloud Telco"
date:   2019-11-04 19:00:00 +0530
categories: Telecom
---

**We are standing at the brink of a transformation in telcos. The telecommunication networks are undergoing a massive shift with virtualization, but your transformation journey should have a bigger goal - build a Cloud Telco.**

"NFV is all about that" you may say. But the Cloud Telco is not just NFV. It's a whole system that enables agile service delivery in the telco domain. 

<img src="{{ "/assets/images/cloud_telco.png" | absolute_url }}" alt="drawing" width="1500"/>

This is a high level architectural framework of the Cloud Telco. Now, let's look at its essential building blocks.

# NFV

NFV provides the foundation for the Cloud Telco. It enables virtualizing the network functions that traditionally have been hardware appliances, and brings in the dynamic nature of cloud computing to the telco world.

NFVO which plays a key role in NFV ecosystem, is responsible for VNF life cycle management across NFV infrastructure distributed across several data centers. 

# Service Orchestrator

Service Orchestrator is responsible for end to end orchestration of network services. A service could comprise of multiple VNFs and network connectivity, so orchestration of a service involves a sequence of activities such as instantiating VNFs, commissioning, setting up connectivity and testing etc.

A plethora of service orchestrators are available in the market, with widely variable scopes and features. Given the breadth of functionality that could be associated with service orchestration, evaluating them could be a daunting task. 

There are two major open source initiatives for developing fully fledged service orchestration solutions; [OSM] [osm] and [ONAP] [onap], which you could consider as reference implementations.

# Software Defined Transport Network

Today, the bulk of the transport network is not designed for automation. The Cloud Telco requires the transport network to be orchestrated and automated so that connectivity of the network services can be facilitated seamlessly.

Multiple transport SDN technologies have been developed aimed at fulfilling this requirement. Whatever the technology you choose to implement, you need to ensure that T-SDN controller sitting on top, has the capability to interwork with the Service Orchestrator so that transport network can be  provisioned without manual intervention.

# Service Monitoring

Traditional alarm monitoring, recording and displaying alarms sent from network nodes is not adequate in the cloud arena because of its multiple building blocks with their intertwined dependencies which will be generating an intimidating number of alarms at failure scenarios.

Correlation is the key to overcome this challenge. The service monitoring system should be able to correlate alarms from multiple sources and present concise notifications that enables monitoring personnel to take appropriate actions.

# Service Provisioning

Personalized service delivery is a key distinguisher of the Cloud Telco. Accordingly the service provisioning system should have the flexibility of working with the Service Orchestrator and multiple network nodes in order to provision these services. 

# Analytics

The Cloud Telco would be generating a vast amount of data continuously, and due to its variance of data sources you may require multiple data collecting and probing systems to handle it.

Then a centralized analytics system should be in place that can provide a holistic view, so useful insights can be derived.

# Automation

Automation was not part of the traditional telco, but the Cloud Telco cannot do without it due to the complexity and nature of activities involved. Ansible which is widely used in the IT world, could be a good candidate for automation, but there are other solutions too.

In this post we discussed about key components of the Cloud Telco. It should be noted that the placement of these would be implementation dependent since you could merge or split them according to your requirements and industry practices. However, we believe that all of them are essential ingredients that you will have to integrate on your cloudification journey.

In future let's dive down deep in to functions and features of these building blocks.


[osm]: https://osm.etsi.org/
[onap]: https://www.onap.org/

*[EPC]: Evolved Packet Core
*[SDO]: Standards Developing Organization
*[BAU]: Business as Usual
*[NFV]: Network Function Virtualization
*[NFVO]: NFV Orchestrator
*[VNF]: Virtual Network Function
*[OSS]: Operational Support System
*[SVNFM]: Specific VNF Manager
*[vnf]: Virtualized Network Function
