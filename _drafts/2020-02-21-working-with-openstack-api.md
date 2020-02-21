---
layout: post
title:  "Working with OpenStack API"
date:   2020-02-21 19:00:00 +0530
categories: [hands-on, openstack]
tags: [linux, openstack, API, curl]
---

**OpenStack API could be a bit intimidating at the beginning. So, let's get's our hands dirty.**

All OpenStack services expose their capabilities via RESTful APIs. In fact the OpenStack CLI and Horizon GUI are also client applications that rely on OpenStack APIs.

When onboarding a VNF with a VNFM, the VNFM has to use OpenStack APIs to execute lifecycle management activities for VNF. So, when onboarding a VNF, proficiency of OpenStack API could be useful.

So, we will explore the OpenStack API, using [curl] which is a tool available on Linux that allows us to interact with HTTP APIs.

# Endpoint

The URL of a webservice, is called its endpoint. It's the URL used by client applications to send API requests. The endpoints of OpenStack services can be listed in [CLI].

{% highlight shell %}
$ openstack endpoint list
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
| ID                               | Region    | Service Name | Service Type   | Enabled | Interface | URL                                             |
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
| 03fd6f94e5494775a131fa20d8a6bcce | RegionOne | cinder       | block-storage  | True    | public    | http://10.199.254.221/volume/v3/$(project_id)s  |
| 24ee3add77f84c70957a898c14cb8211 | RegionOne | nova_legacy  | compute_legacy | True    | public    | http://10.199.254.221/compute/v2/$(project_id)s |
| 28ec759c82914be4962ec8bc41de311c | RegionOne | nova         | compute        | True    | public    | http://10.199.254.221/compute/v2.1              |
| 2968d593668b4fe7a781e86b82c388c1 | RegionOne | neutron      | network        | True    | public    | http://10.199.254.221:9696/                     |
| 33fefc7fd11c4c998cda9259c9fe854e | RegionOne | keystone     | identity       | True    | public    | http://10.199.254.221/identity                  |
| b5d01570efd249ae9118853f1ef008aa | RegionOne | cinderv3     | volumev3       | True    | public    | http://10.199.254.221/volume/v3/$(project_id)s  |
| d3bdbe66cf0f4019a0f4d1fdbc7e359c | RegionOne | keystone     | identity       | True    | admin     | http://10.199.254.221/identity                  |
| db5af25d61c443e2b0f06652b4563f7c | RegionOne | placement    | placement      | True    | public    | http://10.199.254.221/placement                 |
| ddc7d363959b4eaa836d91e650a52dae | RegionOne | cinderv2     | volumev2       | True    | public    | http://10.199.254.221/volume/v2/$(project_id)s  |
| f6b7ae1203e74ffca3bac6efbdaed8eb | RegionOne | glance       | image          | True    | public    | http://10.199.254.221/image                     |
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
{% endhighlight %} 

Above is the endpoints listing in a DevStack installation, and in a production OpenStack deployment the endpoints could vary significantly from this. Most of the time each service in a production setup would be running on its own dedicated port. 

# Keystone

Keystone, which impelements the authentication and service discvery should be the first point of contact when working with OpenStack API. First we have to get an authentication token by prviding username and password.

{% highlight shell %}
curl -i -X POST http://10.199.254.221/identity/v3/auth/tokens -H "Accept:application/json" -H "Content-Type:application/json" -d '
{
    "auth": {
        "identity": {
            "methods": [
                "password"
            ],
            "password": {
                "user": {
                    "name": "demo",
                    "domain": {
                        "name": "default"
                    },
                    "password": "secret"
                }
            }
        }
    }
}
'
{% endhighlight %} 

The `-i` option print the response headers to the output, and `-X` specify the HTTP command.

The response of the above request contains the authentication token in header parameter `X-Subject-Token`. This token has to be provided in almost all other API requests.

## Service catalog

{% highlight shell %}

{% endhighlight %} 

[CLI]: post_url 2019-12-18-how-to-use-openstack-cli
[curl]: https://en.wikipedia.org/wiki/CURL