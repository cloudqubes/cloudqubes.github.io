---
layout: post
title:  "The cloud-native telco transformation - Disaggregation is the key"
date:   2022-09-17 06:00:00 +0530
categories: [insights, telecom]
tags: ["telecom", "cloud-native"]
---


Telecom networks have undergone several big transformations in the past few decades. Yet, another, more compelling one is just coming - the cloud-native transformation - which is closely associated with 5G. While the telecom network operators are keen on 5G, the purpose of cloud-native and how to adopt it are still obscure. 

# Why cloud-native for 5G
In 2020, 3GPP release16 introduced the new 5G service-based architecture (SBA) where the network functions expose their services to other network functions via HTTP interfaces. This is in stark contrast to the long-standing telecom network architecture based on session-oriented signaling protocols like Diameter. 

The introduction of SBA pushed the industry to adopt a containerized architectural model for the 5G Core network creating all this hype on cloud-native.

# Cloud-native is not just containerization
The popular belief in the telecom domain is that cloud-native is all about running containerized applications on Kubernetes. But, this is only partially correct.  

Cloud-native is a broad concept that takes advantage of cloud computing technologies such as Kubernetes, microservices, automation tools, etc., to develop and run scalable applications efficiently in cloud platforms. 
Running containerized applications on Kubernetes is just one approach of cloud-native. It is also the best fit for telecom applications and is adopted by almost every 5G core network solution in the market.

# Cloud-native transformation
Most of the 4G telecom applications are currently deployed on NFV which does not support containerization. To host the containerized 5G core network, telecom operators must build Kubernetes-based cloud platforms. In other words, they must transform their cloud infrastructure from NFV to Kubernetes. The momentum of this transformation is the cause of the current cloud-native hype.

The telecom operators had a bad experience with NFV. It failed to deliver the initial expectations. However, with the lessons learned from NFV, telecom operators are now in an excellent position to exploit the maximum potential from the cloud-native transformation.

# Kubernetes cloud platforms - disaggregation is the key
The big telecom suppliers have now included Kubernetes cloud platforms in their product portfolios. They are now pushing the telecom operators to upgrade the siloed NFV stacks to siloed Kubernetes platforms.

![The telecom vendors are pushing the operators to upgrade NFV to Kubernetes](/assets/images/silo-nfv-to-silo-cni.png)
*The telecom vendors are pushing the operators to upgrade NFV to Kubernetes*

This kind of siloed Kubernetes cloud infrastructure will prevent the operators from reaping the real benefits of cloud-native architecture and 5G. So, they must strive to disaggregate the cloud from the applications. 

![Siloed vs disaggregated cloud architecture](/assets/images/siloed-vs-dsaggregated-cloud.png)
*Siloed vs disaggregated cloud architecture*


# Why disaggregation matters
In a disaggregated cloud architecture, the network operator builds the cloud stack from an independent software vendor. All the application vendors deploy their workloads on this cloud infrastructure. Disaggregation enables telecom operators to take full advantage of the cloud-native architecture. 

## Automate network operations
Automation was one of the major selling points in NFV. But, that potential was never fully realized because of the siloed NFV stacks. When the VNF vendors own the entire NFV stack, they can continue managing the VNFs with the same old practices of the pre-NFV era. Therefore, the big vendors did not make the effort to integrate the automation capabilities into their VNFs. Eventually, the telecom operators had to give up hopes in automation. 

In a disaggregated cloud environment, telecom operators are in a better position to enforce how the applications should be deployed and managed in the cloud. Then, the operators can impose automation requirements and the application vendors have to comply since they do not own the cloud infrastructure.

The cloud-native transformation is a good opportunity for the aspiring telecom operators to build a fully autonomous network and disaggregation is the key enabler for that.

## Exploit the 5G potential
5G is bringing some radical changes to the telecom domain. The earlier telecom networks were designed to deliver voice and broadband services with a set of predefined features. They offered no opportunity for the telecom operators to develop differentiating value-adding services on top. Therefore, the operators always lost the competition with the small-scale and more agile over-the-top services companies. 

In contrast to the previous generations, the 5G Core network has more potential for extensibility since it is built on SBA. The operators can create value-adding services on top of 5G by using HTTP APIs in SBA. To facilitate that, the APIs should be available in an easy-to-consume model and the ecosystem must be open and enabling. 
 
To create such an ecosystem, telecom operators must transform their operational model by adopting DevOps practices which can only be successfully done with a disaggregated cloud architecture. In a siloed cloud where the vendor dominates, there is no drive to adopt DevOps. 

Therefore, telecom operators must strive to build a disaggregated cloud and start the 5G transformation journey to exploit the full potential of 5G. The operators who start early will be able to gain a competitive advantage over the others who are late to the party.

## Lead the architectural evolution
The telecom operators - not the vendors - must lead the technology evolution. Then, the operators will be able to optimize the operations model, build an efficient network, and deliver more value to their customers. But, the current telecom industry is dominated by a few big vendors who drive the evolution according to their best interests. 

The disaggregated cloud would open the telecom market to new vendors, who will come up with novel applications. The adaptation of DevOps practices will upskill the engineering teams at telecom operators to confidently integrate and run these applications.

Therefore, a disaggregated cloud platform will enable the operators to gain an upper hand in leading the technology evolution suppressing the power of the big players.

# It could be challenging
The adaptation of the disaggregated cloud will be challenging, so the operators must be prepared for the journey ahead.

## Get out of the comfort zone
In the siloed cloud architecture, the vendor takes care of the end-to-end delivery. If something goes wrong, there is only one throat to choke, and the engineering teams at the operators are more than comfortable in this operational model. 

The disaggregation requires the operator to take more responsibilities in the application deployment process. Also, the engineering teams at the operator must be more involved in troubleshooting if something goes wrong. These could be big hurdles as the engineers must move away from their comfort zone. 

Solutions to these challenges are in the cloud-native world itself. Automation which is a key feature in the cloud-native architecture can ease the burden on the engineering teams by taking care of the routine tasks. Observability, which is another key feature enables them to locate problems quickly and proactively.

By developing the ecosystem on these two key features, the operators can confidently move out of their comfort zone and build a disaggregated cloud confidently.

## Swap the existing network
Moving to a disaggregated cloud architecture requires the operators to swap the existing infrastructure with new cloud platforms and applications. 

Doing this swap in a single sweep could be prohibitively CapEx intensive. So, the operators would prefer to distribute this CapEx investment over a 3-5 year time span by incrementally upgrading the network. The downside of this approach is that the operators must maintain a set of legacy network nodes alongside their new cloud-native systems until the legacy nodes become EoS. 

The overhead of the swap is unavoidable in a transformation. Fortunately, telecom operators are in no shortage of experience with transformations. They handled the transformation like TDM to IP, voice-centric network to data-centric network, etc., quite well. With the past experience, the operators will be able to work out a transformation plan based on individual requirements and context.

## Head into unchartered territory 

Telecom operators often look for industry references when evaluating new technologies for procuring products and solutions. As of 2022, most operators are still using NFV and the penetration of cloud-native systems in the telecom domain is fairly low. So, cloud-native applications especially in disaggregated cloud environments are still unproven in the industry.

In such situations, validating industry references and evaluating technical compliances on paper offer little help for selecting products and solutions. So, the operators must build pilot systems and test them thoroughly under field conditions for at least one year for a decent evaluation. A pilot setup should not be confused with a PoC. In a PoC, only a limited number of test cases can be executed in a test environment. On the other hand, a pilot setup serving a subset of the subscriber base allows the engineering teams to get the real-world experience of the technology with minimum risks.

# Build a sustainable technology platform
The operators adopting the disaggregated cloud architecture will be able to design a technology platform including the cloud infra, application software, tools, etc. They will be in control of their platform and will have the capability to evolve it in the direction they choose. On the contrary, the operators who opt for the siloed approach will have to accept what is offered by a dominating vendor.

The cloud-native transformation is not meant to be the end of the road for telecom operators. Surprising opportunities as well as unforeseen challenges are yet to come in the future. When they come, who  will be in a better position to harness those opportunities or tackle the challenges?





