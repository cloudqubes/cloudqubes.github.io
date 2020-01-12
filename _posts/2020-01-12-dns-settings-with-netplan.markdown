---
layout: post
title:  "DNS Settings with Netplan"
date:   2020-01-12 14:15:00 +0530
categories: hands-on linux 
---

**Configuring DNS server IP address in Ubuntu is quick and easy with Netplan.**

Netplan is the way to configure network interfaces in newer versions of Ubuntu (after 16.04). This replaces the older method of configuring interfaces using the `/etc/network/interfaces` file.

We are going to use Netplan to configure the DNS IP address in our Ubuntu 18.04 server.
Netplan uses the `/etc/netplan/50-cloud-init.yaml` file to store its configurations. After the initial boot this file looks like below.

{% highlight shell %} 
$ cat /etc/netplan/50-cloud-init.yaml
# This file is generated from information provided by
# the datasource.  Changes to it will not persist across an instance.
# To disable cloud-init's network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    version: 2
    ethernets:
        ens3:
            addresses:
            - 10.0.0.2/29
            match:
                macaddress: fa:16:3e:23:6c:84
            mtu: 1450
            routes:
            -   to: 0.0.0.0/0
                via: 10.0.0.1
            set-name: ens3
{% endhighlight %} 

We will edit this file with vim.

{% highlight shell %} 
$ sudo vim /etc/netplan/50-cloud-init.yaml
{% endhighlight %} 

Insert below lines after `mtu` parameter

{% highlight shell %} 
            nameservers:
                addresses: [8.8.8.8]
{% endhighlight %} 

Although we are adding only one nameserver here, you can add multiple DNS server addresses using commas.

{% highlight shell %} 
            nameservers:
                addresses: [8.8.8.8, 1.1.1.1]
{% endhighlight %} 

Then apply the changes.

{% highlight shell %} 
$ sudo netplan apply
{% endhighlight %} 

If everything goes well, now you will be able to resolve URLs.

{% highlight shell %} 
$ nslookup google.lk
{% endhighlight %} 

The complete file is below as a reference.

{% highlight shell %} 
$ cat /etc/netplan/50-cloud-init.yaml
# This file is generated from information provided by
# the datasource.  Changes to it will not persist across an instance.
# To disable cloud-init's network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    version: 2
    ethernets:
        ens3:
            addresses:
            - 10.0.0.2/29
            match:
                macaddress: fa:16:3e:23:6c:84
            mtu: 1450
            nameservers:
                addresses: [8.8.8.8]
            routes:
            -   to: 0.0.0.0/0
                via: 10.0.0.1
            set-name: ens3
{% endhighlight %} 


