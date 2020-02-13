---
layout: post
title:  "A Real World HOT File"
date:   2020-02-13 04:56:00 +0530
categories: [hands-on, openstack]
tags: [openstack, heat, orchestration]
---

**Heat is a template based resource orchestration service for OpenStack. It can be used to deploy cloud applications of any complexity.**

In a previous [post] we introduced the basic usage of [Heat], with a simplified HOT file. Today, we will build on that foundation by creating and deploying a more advanced Heat stack.

This is a real world [Heat template][app_server], which creates a single VM. Let's go through its each section to see what is happenning. 

Since we are familiar with [heat_template_version], [description], and [parameters] sections we will go straight to the `resources` section, which creates the virtual resources.

## flavor

{% highlight YAML %} 
#flavor
app_server_flavor:
type: OS::Nova::Flavor
properties:
    name: "app_server"
    vcpus: 2
    ram: 4096
    disk: 100
    extra_specs: { "hw:cpu_policy" : "dedicated", "hw:mem_page_size": "1048576" }
 
{% endhighlight %}

Nova [flavor] defines how much vCPUs, memory (MB), and disk (GB) is allocated to the VM. 

`extra_specs` is used to define a [list of key-value pairs][extra_specs], which can control some features in VM and scheduling behaviors in OpenStack. `hw:cpu_policy`, and `hw:mem_page_size` are two of the most common parameters related to CPU pinning and huge page allocation in VMs.

## security groups

Security groups act as a basic firewall in controlling access to a VM. Each virtual port should be associated with at least one security group, or OpenStack will apply the `default` security group in that particular project. Unless you have changed this default security group, all incoming traffic will be denied, and only outgoing traffic will be allowed.

{% highlight YAML %}
  #security groups
  oam_security_group:
    type: OS::Neutron::SecurityGroup
    properties:
      name: "app_server_oam"
      rules:
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "tcp"
          port_range_min: 22
          port_range_max: 22
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "tcp"
          direction: "egress"
          port_range_min: 22
          port_range_max: 22
  service_security_group:
    type: OS::Neutron::SecurityGroup
    properties:
      name: "app_server_service"
      rules:
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "tcp"
          port_range_min: 1
          port_range_max: 65534
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "tcp"
          direction: "egress"
          port_range_min: 1
          port_range_max: 65534
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "icmp"
        - remote_ip_prefix: "0.0.0.0/0"
          protocol: "icmp"
          direction: "egress"
{% endhighlight %}

This template is creating two security groups; `oam_security_group`, and `service_security_group`. Each security group contains a list of security rules, which defines the IP, port details that are allowed to and from the VM. 

A security rule rule applies to a single direction, so separate rules must be created for incoming and outgoing traffic. Security rules with `direction` set to `egress` applies to traffic going out from the VM, while `ingress` rules applies to traffic coming in to the VM.

As you may observe, `oam_security_group` is allowing only TCP port 22 (ssh), and `app_server_service` is allowing all TCP and ICMP traffic in both directions.

The protocols and ports not specified by security rules will be denied, so both security groups will not allow UDP in either direction.. 

## ports

`app_server` has two virtual ports. The `get_resource` parameter in Heat is used to refer to a virtual `resource` created in the same HOT file. Both ports use this to specify the securiy groups that we described above.


{% highlight YAML %}
  #ports
  oam_port:
    type: OS::Neutron::Port
    properties:
      name: "app_server_oam"
      network: { get_param: oam_net } 
      fixed_ips:
        - ip_address: "10.10.10.5"
      security_groups:
        - { get_resource: oam_security_group}
  service_port:
    type: OS::Neutron::Port
    properties:
      name: "app_server_service"
      network: { get_param: service_net } 
      fixed_ips:
        - ip_address: "10.10.20.5"
      security_groups:
        - { get_resource: service_security_group}
{% endhighlight %}


## virtual machine

{% highlight YAML %}
  #virtual machine       
  app_server:
    type: OS::Nova::Server
    properties:
      config_drive: "true"
      name: { get_param: app_server_name }
      flavor: { get_resource: app_server_flavor }
      image: { get_param: app_server_image_name }
      availability_zone: "zone-a"
      networks:
      - port: { get_resource: oam_port }
      - port: { get_resource: service_port }
      user_data_format: RAW
      user_data: |
        #cloud-config
        password: app_server_password
        chpasswd: { expire: False }
        ssh_pwauth: True
{% endhighlight %}

Our HOT package creates only one VM. We are using the `get_resource` to refer to the flavor and virtual ports. The `get_param` is used to refer to values defined in `parameters` section.

Most of the cloud images provided by major linux distributioins such as [Centos] and [Ubuntu], do not allow password based authentication by default. We are using `user_data` to set the password of the default user, and enable password authentication for SSH. Alternatively you can use key based authentication by creaitng a key pair.

You could use the same method we described in previous [post] to create a Heat stack with this template. When we delete this stack, all the resources including security groups, and flavor created by the stack would be deleted. 

*[HOT]: Heat Orchestration Template

[post]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat%}
[heat_template_version]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat%}
[description]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat%}
[parameters]: {{site.baseurl}}{% post_url 2019-09-22-getting-started-with-heat%}
[Heat]: https://docs.openstack.org/heat/latest/
[flavor]: https://docs.openstack.org/nova/latest/user/flavors.html
[extra_specs]: https://docs.openstack.org/nova/latest/user/flavors.html#extra-specs
[app_server]: https://gist.github.com/cloudqubes/059a7fd93546a437fd7784839000cec0
[Ubuntu]: https://cloud-images.ubuntu.com/
[Centos]: https://cloud.centos.org/centos/7/images/
