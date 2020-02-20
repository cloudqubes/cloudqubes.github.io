---
layout: post
title:  "Install DevStack via a Proxy"
date:   2020-02-20 06:20:00 +0530
categories: [qubefix]
tags: [devstack, proxy, linux, openstack]
---

We have installed [DevStack on a VM]({% post_url 2019-09-16-getting-started-with-devstack %}), assuming that the VM has direct Internet connectivity. But, most of the time, Internet would be available only via a proxy. 

## Problem Description

In such situations we can use environment variables, to configure proxy.

{% highlight shell %}
$ export http_proxy=http://<proxy_ip>:<proxy_port>
$ export https_proxy=http://<proxy_ip>:<proxy_port>
{% endhighlight %} 

During the installation, [DevStack] will first setup [Keystone] end point at `http://<host_ip>/identity`. For installing the rest of the services such as [Nova] and [Neutron] the [Keystone] URL should be accessible from the host machine for authentication, for creating users and registering end points.

Due to our proxy configurations, all HTTP requests would be directed to the proxy, so the [Keystone] end point cannot be accessed from host machine, resulting in failure of [DevStack] installation.

## Solution

We have to set the no_proxy varaible before the installation, so that proxy would be bypassed for IP address of the host.

{% highlight shell %}
$ export no_proxy="<host_ip>
{% endhighlight %} 

[DevStack]: https://docs.openstack.org/devstack/latest/
[Nova]: https://docs.openstack.org/nova/latest/
[Keystone]: https://docs.openstack.org/keystone/latest/
[Neutron]: https://docs.openstack.org/neutron/latest/
