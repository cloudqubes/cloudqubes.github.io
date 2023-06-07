---
layout: post
title:  "Functions of NFVO"
date:   2020-05-25 04:00:00 +0530
categories: [insights NFV NFVO]
---

NFVO is a key component of NFV. We have introduced it in a previous post, where we discussed on ETSI architecutral framework. The ETSI framework defines a multiple API integration points and functionalities of NFVO. However the adaptation among the products in industry is variable.

ETSI framework identifies NFVO and VNFM as two different components. It also facilitated methods to connect multiple VNFMs to NFVO via SOL 003 interface. The products in the industry from leading telco vendors concatenate NFVO and VNFM in to a single product and name it as xyz orchestrator. The vnfm included in NFVO is termed as G_VNFM while other VNFMs connected via SO 003 is termed as S-VNFM.

This amalgamation of NFVO wiht a G_VNFM has make it a bit hard to distinguish the responsibilities of NFVO. 

ETSI IFA 010 defines a broad set of functionalities of MANO. According to that NFVO has a log list of responsibilities, however the products in the industry has adapted very few of them.

1. Virtualized Resource management



Referencs

https://www.etsi.org/deliver/etsi_gs/NFV-IFA/001_099/010/03.03.01_60/gs_NFV-IFA010v030301p.pdf