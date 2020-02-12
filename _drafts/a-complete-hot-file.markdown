---
layout: post
title:  "A Real World HOT File"
date:   2020-02-11 05:56:00 +0530
categories: [hands-on, openstack]
tags: [openstack, heat, orchestration]
---

**Heat is a template based resource orchestration service for OpenStack. It can be used to deploy cloud applications of any complexity.**

In a previous [post] we introduced the basic usage of [Heat], with a simplified template. Today, we will build on the foundation by creating and deploying a more advanced Heat stack.

Here is a real world Heat template.
{% highlight YAML %} 

{% endhighlight %}

Let's go through this template to see what each part is actually doing. 
Since we are familiar with [heat_template_version], [description], and [parameters] sections we will go straight to the resources section.

## proxy_server_flavor

{% highlight YAML %} 

{% endhighlight %}

Nova [flavor] defines how much vCPUs, memory (MB), and disk (GB) is allocated to the VM. 

`extra_specs` is used to define a [list of key-value pairs][extra_specs], which can control some features in VM and scheduling behaviors in OpenStack. `hw:cpu_policy` defines CPU pinning policy 


[post]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat%}
[Heat]: https://docs.openstack.org/heat/latest/
[flavor]: https://docs.openstack.org/nova/latest/user/flavors.html
[extra_specs]: https://docs.openstack.org/nova/latest/user/flavors.html#extra-specs
