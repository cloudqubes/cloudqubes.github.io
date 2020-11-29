---
layout: post
comments: true
title:  "Public cloud is all you need, or is it?"
date:   2020-03-05 04:35:00 +0530
categories: [insights, NFV]
tags: [public-cloud, hybrid-cloud, NFV]
---

**Getting up and running with NFV is a costly affair. Is public cloud a better option?**

Despite the market hype, NFV is not an easy technology to get started on. It requires millions of dollars in cash, as well as comparable amounts of time and effort which again boils down to money. So, is NFV really worth the investment? 

Since cloudification cannot be avoided, and implementing the on premise NFV seems like an overwhelmingly complex project, the telcos may believe that the public cloud is a better option. It is easy to get started with, available on demand, and seems cheap.  

But, that thinking could be deceptive. Let's see why? 

## VNF compatibility 

From a theoretical point of view, any VNF should be able to run on any cloud. But in the real world, that assumption could be a vast underestimation. Being similar in their basic function of spinning up VMs, inner working of cloud platforms could be quite different.  

Though this may be acceptable for most IT applications such as web servers and databases, the Telco VNFs may demand specific features such as layer-2 networking, [multiqueue], [DPDK], NIC driver compatibility, etc., that may not be readily available on public cloud. 

Many commercial VNFs are still not fully tested on public cloud, so the impact of such missing features would only be revealed at the onboarding time, or in worse situations at run time; after crossing certain load thresholds in VNF.  

## Latency 

Since the connectivity to public cloud would be via Internet, a higher latency of several magnitudes, should be expected. While this could impact only certain use cases, they are definitely not going to be edge cases for a telco. 

## Security 

The public cloud is usually connected via networks belonging to 3rd parties. Also the host infrastructure in public cloud is not open for security hardening for the clients. These could hamper some stringent security practices for telcos. 

## Regulatory policies 

Regulatory policies could restrict telcos from storing certain types of data such as CDRs, location information of subscribers, etc., outside the territory of their home countries, or even outside own premises. 

Even though some of these restrictions could be unacceptable, not all telcos will be able to negotiate with their regulatory bodies and get those restrictions relieved. 

## Cost 

The public cloud is cheaper to start, since it does not require any CapEx. However at a large scale it's going to be extremely expensive in OpEx. Giving a final verdict on cost would require doing a detailed cost comparison with NFV and public cloud. Also it may depends on your license models and specific pricing figures. 

However beyond a certain capacity scale, an on premise NFV will always be cheaper. 

## Redundancy 

Even with their hyperscale datacenters, public clouds are susceptible to failures. There has been multiple major outages in [AWS] and [GCP], so relying on a single public cloud could be a risk on business continuity. 

## Troubleshooting and root cause analysis 

A smooth operation of a VNF demands quality collaboration between the VNF owner and the NFV platform support team. This is especially important when isolating technical faults, since the root cause of a problem in a VNF could possibly reside on the platform. 

In a technical fault or misbehavior in a VNF on public cloud, you would be entirely at the mercy of the cloud vendor's support team for isolating the problem. 

# Best of both worlds 

Considering all above, the public cloud is not a replacement for on-premise NFV, but could be a smart supplement. This concept of using both on premise and public cloud in a hybrid mode could help telcos operate at an optimum cost while reaping more benefits. 

We will discuss more about hybrid cloud, in upcoming posts.

[GCP]: https://status.cloud.google.com/summary 
[AWS]: https://aws.amazon.com/premiumsupport/technology/pes/
[multiqueue]:  https://www.linux-kvm.org/page/Multiqueue 
[DPDK]: https://www.dpdk.org/
 