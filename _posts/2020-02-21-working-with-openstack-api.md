---
layout: post
title:  "Working with OpenStack API"
date:   2020-02-26 19:00:00 +0530
categories: [hands-on, openstack]
tags: [linux, openstack, API, curl]
---

**OpenStack API could be a bit daunting at the beginning. So, let's deal with that.**

All OpenStack services expose their capabilities via RESTful APIs. The OpenStack CLI and Horizon GUI are also client applications that rely on these OpenStack APIs.

Integration with OpenStack API is an important part of onboarding a VNF, which is accompanied by a S-VNFM, so that awareness of this API could ensure a smooth onboarding process.

So, let's explore the OpenStack API, using [curl] which is a useful tool for interacting with HTTP APIs. While `curl` has a multitude of options, we will be using only two of them during this exercise; the `-i` option to print the response headers to the output, and `-X` to specify the HTTP command such as `GET` or `POST`.

Before proceeding further, we have to be familiar with OpenStack service endpoints.

# Endpoint

The URL of a webservice, is called its endpoint. The endpoints of OpenStack services can be listed in [CLI]. 

{% highlight shell %}
$ openstack endpoint list
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
| ID                               | Region    | Service Name | Service Type   | Enabled | Interface | URL                                             |
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
| 03fd6f94e5494775a131fa20d8a6bcce | RegionOne | cinder       | block-storage  | True    | public    | http://10.10.10.5/volume/v3/$(project_id)s  |
| 24ee3add77f84c70957a898c14cb8211 | RegionOne | nova_legacy  | compute_legacy | True    | public    | http://10.10.10.5/compute/v2/$(project_id)s |
| 28ec759c82914be4962ec8bc41de311c | RegionOne | nova         | compute        | True    | public    | http://10.10.10.5/compute/v2.1              |
| 2968d593668b4fe7a781e86b82c388c1 | RegionOne | neutron      | network        | True    | public    | http://10.10.10.5:9696/                     |
| 33fefc7fd11c4c998cda9259c9fe854e | RegionOne | keystone     | identity       | True    | public    | http://10.10.10.5/identity                  |
| b5d01570efd249ae9118853f1ef008aa | RegionOne | cinderv3     | volumev3       | True    | public    | http://10.10.10.5/volume/v3/$(project_id)s  |
| d3bdbe66cf0f4019a0f4d1fdbc7e359c | RegionOne | keystone     | identity       | True    | admin     | http://10.10.10.5/identity                  |
| db5af25d61c443e2b0f06652b4563f7c | RegionOne | placement    | placement      | True    | public    | http://10.10.10.5/placement                 |
| ddc7d363959b4eaa836d91e650a52dae | RegionOne | cinderv2     | volumev2       | True    | public    | http://10.10.10.5/volume/v2/$(project_id)s  |
| f6b7ae1203e74ffca3bac6efbdaed8eb | RegionOne | glance       | image          | True    | public    | http://10.10.10.5/image                     |
+----------------------------------+-----------+--------------+----------------+---------+-----------+-------------------------------------------------+
{% endhighlight %} 

Above is the endpoints listing in a DevStack installation, and could be different from that of a production deployment where each endpoint will have a dedicated port.

The endpoint is the root URL of the service, and the complete URL for sending API requests could be formed by concatenating it with the path in [API specs][api_spec].


# Keystone

[Keystone], which impelements the authentication and service discvery, should be the first point of contact when working with OpenStack API. Keystone has two API versions; v2 and v3. It is recommended to use v3 version for all new deployments, since v2 would be [deprecated and may be dropped eventually][keystone_v2].

Keystone supports multiple authentication mechanisms such as username/password, LDAP, and OAuth. Saving other authentication methods to a later discussion, let's stick to username/password authentication.

{% highlight shell %}
curl -i -X POST http://10.10.10.5/identity/v3/auth/tokens -H "Accept:application/json" -H "Content-Type:application/json" -d '
{
    "auth": {
        "identity": {
            "methods": [
                "password"
            ],
            "password": {
                "user": {
                    "domain": {
                        "id": "default"
                    },
                    "name": "admin",
                    "password": "secret"
                }
            }
        },
        "scope": {
            "project": {
                "domain": {
                    "id": "default"
                },
                "name": "demo"
            }
        }
    }
}
'
{% endhighlight %} 

This is the authentication with scoped authorization, which means that authorizatoin is scoped to the project named `demo`.

Upon successfull authentication Keystone responds with a token in header parameter `X-Subject-Token`. This token has to be provided in 'X-Auth-Token' header parameter of subsequent API requests.

Since the authentication token is very long and incovenient to copy/paste around, let's set an environment variable, and refer that variable in next request.

{% highlight shell %}
export OS_TOKEN="<authentication token>"
{% endhighlight %} 


## Service catalog
The response for the above request, includes a 
The above respone also contains a list of endpoints in the response body. This is the service catalog for the user, which contains the URLs of services the user is authorized to call.


# Nova

[Nova API] can be used to execute all activities related to VMs. 

List VMs:
{% highlight shell %}
curl -i -X GET http://10.10.10.5/compute/v2.1/servers -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Auth-Token: $OS_TOKEN"
{% endhighlight %} 

Create VM:
{% highlight shell %}
curl -i -X POST http://10.10.10.5/compute/v2.1/servers -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Auth-Token: $OS_TOKEN" -d '
{
    "server": {
        "name": "vm_1",
        "imageRef": "5f1c338f-5b36-4dc7-b035-64210f427fa9",
        "flavorRef": "1",
        "networks": [{
            "uuid": "2520ceab-b3d5-4ee9-873a-cbc40f84aaa5"
        }]
    }
}'

{% endhighlight %} 


# Neutron

Neutron API provides options for managing networks.

List networks
{% highlight shell %}
curl -i -X GET http://10.10.10.5:9696/v2.0/networks -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Auth-Token: $OS_TOKEN"
{% endhighlight %} 

Create network:
{% highlight shell %}
curl -i -X POST http://10.10.10.5:9696/v2.0/networks -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Auth-Token: $OS_TOKEN" -d '
{
    "network": {
        "name": "sample_network",
        "admin_state_up": true,
        "mtu": 1400
    }
}'
{% endhighlight %} 


*[S-VNFM]: Specific VNFM
*[VNF]: Virtual Network Function
[CLI]: {% post_url 2019-12-18-how-to-use-openstack-cli %}
[curl]: https://en.wikipedia.org/wiki/CURL
[Keystone]: https://docs.openstack.org/keystone/latest/
[api_spec]: https://docs.openstack.org/api-quick-start/
[Nova API]: https://docs.openstack.org/api-ref/compute/
[keystone_v2]: https://docs.openstack.org/keystone/pike/contributor/http-api.html
