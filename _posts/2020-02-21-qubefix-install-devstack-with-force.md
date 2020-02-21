---
layout: post
title:  "Install DevStack on an uncertified Linux distribution"
date:   2020-02-21 18:00:00 +0530
categories: [qubefix]
tags: [devstack, openstack]
---

## Problem Description
Installation of DevStack Pike version on Ubuntu 18.04, fails with error:

{% highlight shell %}
[ERROR] ./stack.sh:227 If you wish to run this script anyway run with FORCE=yes
{% endhighlight %} 

## Solution
Each version of DevStack is certified on a particular set of Linux ditributions. As for Pike, it is certified on Ubuntu 16.04, but not on Ubuntu 18.04. However, the DevStack installation script allows multiple customizations via environment variables. 

So, by setting variable `FORCE`, we can continue the installation on an uncertified distribution.

{% highlight shell %}
$ export FORCE="yes"
$ ./stack.sh
{% endhighlight %} 