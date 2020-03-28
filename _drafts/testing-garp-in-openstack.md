---
layout: post
title:  "Testing Gratuitous ARP in OpenStack"
date:   2020-02-19 17:30:00 +0530
categories: [hands-on, openstack]
tags: [linux, openstack, Ubuntu, opendaylight]
---

**Gratuitous ARP is a commonly used mechanism in telco systems to implement resiliency. Does it work on NFV as well?**

Gratuitous ARP is an ARP request broadcast, intended to update MAC/IP Address mapping on other devices in a LAN. This is used in telco systems to implement resiliency where an IP address is shared by two nodes working in active/standby. In case of a failure in active node, the standby node assumes the IP address, and sends a gratuitous ARP so that traffic from peer device will be received without service interruption.

So, does this work in NFV with SDN?

The question is important because gratuitous ARP is a broadcast packet. SDN controllers has to implement special mechanisms to pass such broadcast packets due to the nature of SDN. Reserving that discussion about internals of SDN controllers to separate post, let's test this in an NFV setup with OpenStack and OpenDayLight, which is an open source SDN controller project hosted by Linux Foundation.

Our test setup consists of a VNF with two VMs; VM-A and VM-S. VM1 which is the peer device (this could be the DC-GW router in a production setup) sends traffic to 10.10.10.3, which is the IP address of VM-A. 

VM-A and VM-S uses Ubuntu 18.04 OS and we have installed [arping], which is a tool that can send gratuitous ARP requests.

<picture>

Here is the HOT file for our VNF.

{% highlight yaml %}

{% endhighlight %}



[arping]: http://manpages.ubuntu.com/manpages/xenial/man8/arping.8.html

fib
openflow entries