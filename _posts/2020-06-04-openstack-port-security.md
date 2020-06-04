---
layout: post
title:  "OpenStack port security"
date:   2020-06-04 03:30:00 +0530
categories: [hands-on, openstack]
tags: [openstack, security, security-group, port security]
---

**IP level access control of VMs in OpenStack is implemented via Security Groups. A firm grip on the fundamentals of this security feature, is essental for working with VMs.**

OpenStack security groups are IP filters assigned to virtual ports. 

A security group contains a named list of rules, which defines the traffic that is permitted to pass. It adapts a default deny policy, so traffic that do not match any of the the rules is dropped. One or more security groups can be assigned to each virtual port of a VM.

Each OpenStack project has a security group named default, which allows all outgoing traffic, while blocking all incoming traffic. Any port that does not specify a security group at the time of creation, is assigned with this default security group. 

Since the default security group is project specific, the project owner can customize it according to their requirement. 

Using OpenStack Pike version, let's see how to use security groups.

# Create security groups

Create a security group named `oam`:
{% highlight shell %}
$ openstack security group create oam
{% endhighlight %} 

By default, OpenStack adds two rules to the security group to allow all outgoing IPv4 and IPv6 traffic.

{% highlight shell %}
$ openstack security group rule list oam
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
| ID                                   | IP Protocol | Ethertype | IP Range  | Port Range | Remote Security Group |
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
| 2f7216d9-cf49-4f5f-8c70-7271e2ddca26 | None        | IPv6      | ::/0      |            | None                  |
| 622c3b4c-9cd1-4bd9-afcf-7138f57de3bb | None        | IPv4      | 0.0.0.0/0 |            | None                  |
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
{% endhighlight %} 

# Add rules to security group

Let's add a security rule to allow SSH access to our VMs from any source IP.
{% highlight shell %}
$ openstack security group rule create --prefix 0.0.0.0/0 --dst-port 22 --protocol tcp --ingress --ethertype ipv4 oam
{% endhighlight %}

We can use protocol and port parameters further limit the permitted traffic. Let's add a rule to allow UDP traffic for port 5000 to 10000.
{% highlight shell %}
$ openstack security group rule create --prefix 0.0.0.0/0 --dst-port 5000:10000 --protocol udp --ingress --ethertype ipv4 oam
{% endhighlight %} 

Allow incoming ICMP traffic:

{% highlight shell %}
$ openstack security group rule create --prefix 0.0.0.0/0 --protocol icmp --ingress --ethertype ipv4 oam
{% endhighlight %} 

The `ingress` parameter means, the rule is applied on traffic coming in to the VM. To match traffic in opposite direction (traffic going out from the VM), parameter `egress` can be used. While it's possible to create multiple rules to match outgoing traffic, it's usually sufficient to keep one rule that passes all outgoing traffic.

# List rules in security group
{% highlight shell %}
$ openstack security group rule list oam
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
| ID                                   | IP Protocol | Ethertype | IP Range  | Port Range | Remote Security Group |
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
| 2f7216d9-cf49-4f5f-8c70-7271e2ddca26 | None        | IPv6      | ::/0      |            | None                  |
| 3a72a802-568f-4b73-95ce-83c595e87645 | udp         | IPv4      | 0.0.0.0/0 | 5000:10000 | None                  |
| 5ac92a1d-98ed-44d4-abb0-f3d5a0d62ee8 | icmp        | IPv4      | 0.0.0.0/0 |            | None                  |
| 622c3b4c-9cd1-4bd9-afcf-7138f57de3bb | None        | IPv4      | 0.0.0.0/0 |            | None                  |
| d098ad31-0dd4-4f23-8354-2834aa0fdd67 | tcp         | IPv4      | 0.0.0.0/0 | 22:100     | None                  |
+--------------------------------------+-------------+-----------+-----------+------------+-----------------------+
{% endhighlight %}

# Delete rule in security group

Let's delete the rule for IPv6 traffic. Ee have to use ID, since the rule does not have a name.

{% highlight shell %}
$ openstack security group rule delete 2f7216d9-cf49-4f5f-8c70-7271e2ddca26
{% endhighlight %} 

# Assign security group to ports

Security groups have to be assigned to each port of the VM.

Assign security group to a port that is already created:

{% highlight shell %}
$ openstack port set --security-group oam oam_port
{% endhighlight %} 

Delete the already assigned default security group from port:
{% highlight shell %}
$ openstack port unset --security-group default test
{% endhighlight %} 

When creating a VM with HOT, a list of secutiry groups can be assigned to each port with the `security_groups` parameter. (only a part of the full template displayed here.)
{% highlight yaml %}
  vm1_test_port:
    type: OS::Neutron::Port
    properties:
      name: vm1_test_port
      network: { get_param: test_network } 
      fixed_ips:
        - ip_address: "10.10.1.3"
      security_groups: [sg_1, sg_2]
{% endhighlight %} 

# Disable Port Security in Port

By default, OpenStack enables security for all new ports, and if no security group is specified at port creation the default security group is set. If it's not required to apply any packet filtering rules to a port, we can disable port security. 

Before disabling port security in an existing port, the assigned security groups should be removed. 

{% highlight shell %}
$ openstack port set --no-security-group oam_port
$ openstack port set --disable-port-security oam_port
{% endhighlight %} 

At the time of creation, port security can be disabled with `disable-port-security` CLI parameter.

{% highlight shell %}
openstack port create --network shared --disable-port-security oam_port
{% endhighlight %} 

When using HOT, setting 'port_security_enabled' to false, will disable port security for the particular port (Only partial HOT file displayed).

{% highlight yaml %}
  vm1_test_port:
    type: OS::Neutron::Port
    properties:
      name: vm1_test_port
      network: { get_param: test_network } 
      fixed_ips:
        - ip_address: "10.10.1.3"
      port_security_enabled: false
{% endhighlight %} 

Once port security is disabled no packet filtering will be appied on the incoming or outgoing traffic the particular port.

# Disable port security for network

Port security can be disabled in the virtual network, such that all ports associated with the network will have port security disabled by default.

{% highlight shell %}
$ openstack network create --disable-port-security oam_network
{% endhighlight %} 

If any particular port in this network needs to have port security enabled, it can be done with `enable-port-security` parameter when creating the port.

{% highlight shell %}
openstack port create --network oam_network --enable-port-security oam_port_2
{% endhighlight %} 


# Best Practices for using security groups

Now that we know how to use security groups, it's good to know some best practices too.

### Best Practice 01:
Port Security can provide a basic firewall function for VMs but, it should not be considered as a replacement for the function of a fully fledged data center firewall.

### Best Practice 02:
Using a large number of security group rules could impact performance negatively. Therefore it is advisable to limit the number of security rules that are applied to a particular port.

### Best Practice 03:
Using more than one security group for a port would make troubleshooting cumbersome, so it's best to stick with the limit of one security group per port.

### Best Practice 04:
If it's required to pass all incoming and outgoing traffic without filtering, disable port security rather that creating a security group with rules to allow all.

# Limitations for SR-IOV

The newer OpenStack versions uses flow tables in OVS to implement security groups. Since SR-IOV ports bypass OVS, security groups cannot be used to restrict traffic on such ports.

# References

1. [Manage Project Security][security-groups] 
2. [Native Open vSwitch firewall driver][ovsfwdriver] 


*[OVS]: Open vSwitch
*[HOT]: Heat Orchestration Template

[security-groups]: https://docs.openstack.org/nova/queens/admin/security-groups.html
[ovsfwdriver]: https://docs.openstack.org/neutron/pike/admin/config-ovsfwdriver.html
