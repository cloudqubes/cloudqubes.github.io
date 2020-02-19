---
layout: post
title:  "OpenStack in a snap"
date:   2020-02-19 17:30:00 +0530
categories: [hands-on, openstack]
tags: [linux, openstack, Ubuntu, microstack]
---

If you've ever tried to setup [devstack], it's highly likey that you ran in to problems, several times during the installation process. With MicroStack, Ubuntu provides a better way to setup OpenStack on a single machine.

So, if you want to have OpenStack on a single Ubuntu VM, follow on.

# Environment

You will need a server (or a VM) with Ubuntu 18.04. Ubuntu recommends 16GB RAM and 50GB hard disk at minimum.

# Configure Proxy

MicroStack is available as a snap. If the server (or VM) has access to Internet via a proxy, that needs to be configured in snap. (Setting the `http_proxy` environment variable will not work with versions of snap after 2.28)

{% highlight shell %}
$ sudo snap set system proxy.http="http://<proxy_ip>:<proxy_port>"
$ sudo snap set system proxy.https="http://<proxy_ip>:<proxy_port>""
{% endhighlight %} 


# Install

Install MicroStack:

{% highlight shell %}
$ sudo snap install microstack --classic --edge
{% endhighlight %}

# Initialize

Initialization will create the required databases and networks for MicroStack.
{% highlight shell %}
$ sudo microstack.init --auto
{% endhighlight %} 

# Unset Proxy

MicroStack CLI will not work if you have set `http_proxy`, and `https_proxy` environment variables, so unset them.
{% highlight shell %}
$ unset http_proxy
$ unset https_proxy
{% endhighlight %}

# Verify

verify tha OpenStack services are running.
{% highlight shell %}
$ microstack.openstack catalog list
$ microstack.openstack service list
{% endhighlight %}

MicroStack will be installed at location `/snap/microstack`, and the OpenStack services will be installed at `/snap/microstack/196/lib/python3.6/site-packages/`.

# Dashboard

Horizon GUI can be accessed via `http://10.20.20.1/`. If this interface is not directly accessible you would be able to access the GUI via port forwarding.

# Launch VM

You can quickly launch a VM with `openstack.launch`.

{% highlight shell %}
microstack.launch cirros --name test
{% endhighlight %}





{% highlight shell %}

{% endhighlight %} 

[devstack]: ({% post_url 2019-09-16-getting-started-with-devstack %})