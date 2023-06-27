---
layout: post
title:  "What went wrong with NFV?"
date:   2022-04-20 06:00:00 +0530
categories: [insights, telecom]
tags: [Telecom]
---

The advent of NFV in 2012 created hype in the telecom industry as it promised to revolutionize the network architecture. A decade after, most of its promises are still unfulfilled. So, what really went wrong?

Before NFV, the telecom networks comprised purpose-built hardware appliances manufactured by a few big vendors. These appliances were expensive and had long life spans ranging from 5 to 10 years. This was hindering the pace of innovation and technology evolution of telecom networks. NFV ignited a hope to reshape this network architecture and eliminate these hindrances. 

NFV defines a framework for running VNFs (Virtualized Network Functions) in a cloud environment on industry-standard x86 hardware. By separating software from hardware, the creators of NFV intended to enable the network operators to procure software applications (VNFs) from multiple vendors and deploy them on a unified NFV Infrastructure. They hoped that it would reduce the dominance of the big telecommunication equipment vendors and lower the barrier for new entrants.

# The architectural transformation - disaggregated vs siloed
The telecom network operators ventured into a cloudification journey with NFV, hoping to build a telecom network architecture that disaggregates the software from hardware. They expected to build a unified NFV Infrastructure and deploy VNFs from multiple suppliers on it.

![The expected disaggregated architecture](/assets/images/nfv-disaggregated.png)
*The expected disaggregated architecture*

However, many big telecom vendors continuously opposed deploying their applications on 3rd party NFV infrastructure. Eventually, the network operators had to build siloed NFV stacks where each vendor had VNFs deployed on their own NFV infrastructure.


![Siloed NFV stacks](/assets/images/nfv-vertical.png)
*Siloed NFV stacks*

# Impact on the operational transformation
In addition to its intended architectural transformation, NFV was also meant to automate telecom network operations which have remained manual for decades. However, the vertically integrated NFV stacks hampered the expected NFV operational transformation.

In the siloed NFV architecture, the VNF vendors had no incentive to automate. Before NFV, these vendors were responsible for a major portion of the life cycle operations which was billed to the network operators as a services cost. Automation will significantly impact this cash flow Also, in the siloed NFV the VNF supplier could continue his manual procedures since the same supplier owned the entire NFV stack. So, the big vendors refrained from implementing automation capabilities in their VNFs. 

There was another problem that impacted the operational transformation. The NFV architectural framework defined detailed workflows for lifecycle management operations of the VNFs. However, these workflows proved to be quite complicated and interworking was challenging.  

Ultimately, the manual workload for the operations teams at the network operators further increased because they now had to manage an additional layer of NFV Infrastructure in addition to the VNFs.

![NFV Operational Transformation](/assets/images/nfv-operational-transformation.png)
*NFV Operational Transformation*

# Was it a total failure?
While most of its promises are not fulfilled, NFV was widely adopted by telecom network operators. This movement phased out most of the purpose-built hardware from the telecom core networks. 

The Radio Access Network (RAN) and the IP transport networks are still dominated by purpose-built hardware. However, the wide adoption of NFV fueled the growth of concepts such as Open-RAN which aims to reduce the usage of purpose-built hardware in the RAN. 

Automation was one of the key selling points of NFV, but it was never fully realized in the telecom networks. But, NFV created great momentum for automation. While the NFV hype has subdued as of 2022, this momentum for automation is accelerating with another key milestone in telecom networks - the cloud-native transformation.



