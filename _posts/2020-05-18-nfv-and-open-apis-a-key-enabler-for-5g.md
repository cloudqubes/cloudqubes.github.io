---
layout: post
title:  "NFV and APIs - enablers for 5G"
date:   2020-05-18 04:30:00 +0530
categories: [insights, nfv]
tags: [nfv, 5G]
---

**If the telcos are to reap the real beneifts of 5G, NFV is a must. But, it's not enough. It has to be programmable too.**

NFV can deliver [several benefits]({% post_url 2019-10-20-benefits-of-nfv %}) on existing 3G and 4G networks, by improving agility and time to market. However, NFV is more of a nice-to-have than a necessity for these networks, which are designed to deliver a limited set of predefined services.

## The advent of 5G

In contrast, 5G inherits more programmability. 5G system - yes, unlike 3G or 4G, it's a system - exposes multiple integration points via HTTP APIs, which are called service based interfaces. This architecture enables 3rd party applications to utilize the telcom network as a platform, and has the potential to disrupt the whole telcom industry. 

Back in 2007, the introduction of the smart phone triggered a similar disruption. It opened up the mobile phone to the world to develop and run applications. Since then, individual developers and companies have come up with countless use cases for mobile applications, that original creators of the smart phone had never even imagined.

With the service based architecture, 5G system has similar potential, but it will essentailly depend on a robust infrastructure that allows dynamic deployment of applications. NFV is the perfect answer for this. 

## Programmability comes with APIs

However, in order to realize a fully programmable 5G system, programmability has to be there in NFV too. This would be pivotal for serving enterprise customer segment, where more number of usecases for 5G exists than consumer market. 

APIs are the key enabler for programmability. In order to be programmable, an NFV platform must expose all its capabilities via APIs, so that an upper layer orchestrator could create virtual infrastructure and deploy applications without any manual intervention. Virtualization combined with a robust set of APIs, is capable of implementing a programmable NFV platform for running telecom applications of any complexity, across data centers from network edge to the core.

## Approach matters

However, some telcos approach NFV, just from the aspect of virtualizing their legacy hardware based applications. Such an approach places little focus on programmability and orchestration features, and resulting NFV infrastructure would be incapable of realizing benefits in 5G.

## API Economy for Telcos

5G system coupled with NFV, has the capability to automate much of the routine work in telco networks. But, that's only a fraction of the potential of 5G.  It enables the telcos to create digital service platforms with [open APIs][open-api] and be a part of API economy.

If the telcos intend to pursue such goals of automation and digitalization, they have to put some real efforts to build robust NFV infrastructure with APIs in mind. That efforts will start paying off once 5G becomes mainstream, and will help the telcos gain competitive edge.

However, the APIs are only a part of the story of digital transformation and 5G, which also involve other non technical aspects related to organizational structures and skill of the people. We will discuss more about them in upcoming posts.


## References

1. [View on 5G Architecture][5g-architecture]
2. [Open API][open-api]
3. [API Economy: Is It The Next Big Thing?][api-economy]

[5g-architecture]: https://5g-ppp.eu/wp-content/uploads/2020/02/5G-PPP-5G-Architecture-White-Paper_final.pdf
[open-api]: https://en.wikipedia.org/wiki/Open_API
[api-economy]: https://www.forbes.com/sites/tomtaulli/2020/01/18/api-economy--is-it-the-next-big-thing/#6226191642ff

