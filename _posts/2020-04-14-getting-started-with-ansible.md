---
layout: post
title:  "Getting Started with Ansible"
date:   2020-04-14 06:30:00 +0530
categories: [hands-on, ansible]
tags: [linux, ansible, automation]
---

**Ansible is a popular tool among IT and network admins. With NFV and digital transformation, it's going to be useful for the Telcos as well.**

Ansible is an agentless automation platform. It can automate a wide range of tasks such as software deployment, provisioning, configuration, etc., on servers and network devices. It uses SSH to execute tasks, so does not require any agent; daemon, service or process to be kept running at the target hosts. 

The automation tasks in Ansible, also called playbooks are written in YAML. Unlike a script, playbook describes a desired state of a target host, and Ansible ensures that the host is brought up to that state, no matter what its initial state is. Beneath the surface, a set of components called Ansible modules implement the actual logic of executing a task. Ansible comes with a large collection of modules, and you can write your own for implementing any additional functionality.

Ansible is an open source project sponsored by [Red Hat]. While you could set up and use Ansible on your own, [Red Hat] offers enterprise grade products; [Ansible Tower] and [Ansible Engine] which comes with enterprise level support and added features.

So, let's get started by installing Ansible, and writing a playbook.

# Install Ansible

We are going to use a VM running [Ubuntu 18.04] as our *control node*; the host running Ansible.

Ansible builds for Ubuntu are provided in a PPA, so we have to add it before installing. Our VM connects to Internet via proxy, so we have configured our proxy information in `/etc/apt/apt.conf`. However `apt-add-repository` does not use that proxy configuration so we configure the `http_proxy` environment variable and use `-E` option to make the variables available to superuser.

{% highlight shell %}
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo -E apt-add-repository ppa:ansible/ansible
$ sudo apt install ansible
{% endhighlight %} 

# Ansible config file

Ansible default configuration file is `/etc/ansible/ansible.cfg`. However, this can be overriden by a config file within a particular directory, so that we can have multiple Ansible projects in separate directories, with different config files. 

Let's create a new directory `ansible` in our home directory, and copy the config file there.

{% highlight shell %}
$ mkdir ansible
$ cd ansible
$ cp /etc/ansible/ansible.cfg ./
{% endhighlight %} 

## Host Inventory

Host inventory is the list of *managed nodes*, where Ansible playbooks are executed. The default host inventory is located in `/etc/ansible/hosts` which can be overriden in `ansible.cfg`.

We will create a new file `hosts` in the current directory, and update our `ansible.cfg` to use that as the host inventory.

{% highlight shell %}
inventory      = ./hosts
{% endhighlight %} 

The hosts in the inventory can be categorized in to groups, for easy execution of playbooks on multiple hosts. The inventory could include either IP address or hostname. We have chosen to include the hostnames for readability. If you do not have a DNS server, you could still use hostnames by configuring the host to IP mapping in the `/etc/hosts` file in *control node*.

{% highlight yaml %}
[reverse_proxy]
rproxy.cloudqubes.com

[webservers]
nginx-1.cloudqubes.com
nginx-2.cloudqubes.com
{% endhighlight %} 

We have already setup key based SSH authentication in our hosts. While Ansible can use password based authentication, key based authentication is more secure and convenient. 

Let's confirm our hosts inventory is correctly configured.

{% highlight shell %}
$ ansible all --list-hosts
  hosts (3):
    nginx-1.cloudqubes.com
    nginx-2.cloudqubes.com
    rproxy.cloudqubes.com
$ ansible webservers --list-hosts
  hosts (2):
    nginx-1.cloudqubes.com
    nginx-2.cloudqubes.com
$ ansible reverse_proxy --list-hosts
  hosts (1):
    rproxy.cloudqubes.com
{% endhighlight %} 

Note that using `-` character is not allowed in group names, so we have used `_` instead.

In order to keep things simple, let's enable passwordless `sudo` for user `ubuntu`, on all three hosts.

{% highlight shell %}
$ echo "ubuntu ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/ubuntu
{% endhighlight %} 

# Ad-hoc commands

Ansible ad-hoc commands allow users to run one-off tasks on multiple hosts, without writing any playbooks. We will use that to verify the connectivity to our managed nodes using the `ping` ansible module.

{% highlight shell %}
$ ansible all -m ping
{% endhighlight %} 

# Inventory variables

If the default Python interpreter in your control node is 2.x, you may get a deprecation warning, when you run above command. By setting inventory variable `ansible_python_interpreter` to `python3`, in our inventory file, we could get rid of that warning.

{% highlight yaml %}
[all:vars]
ansible_python_interpreter=/usr/bin/python3
{% endhighlight %} 

We have used `all:vars` because we need to set this for all the managed nodes. If we used `webservers:vars` instead, it will be applicable only for hosts in `webservers` group.

# Writing Playbooks

While you could use ad-hoc commands for simple tasks, the real power of Ansible comes with playbooks.

Ansible playbooks are human readable text files in YAML format. A playbook consists of one or more plays, and each play has a set of tasks. 

Let's create a playbook to install NGINX on our reverse proxy server.

{% highlight yaml %}
- hosts: reverse_proxy
  remote_user: ubuntu
  tasks:
  - name: install nginx server
    apt:
      name: nginx
      state: latest
    become: yes
{% endhighlight %} 

This playbook uses the Ansible module `apt` to install the latest version of `NGINX`. You may recall we mentioned that a playbook should be considered as a desired end state and not a set of steps. Accordingly this playbook describes that latest version of NGINX should be installed. 

If we are to run this multiple times, NGINX would be downloaded and installed the first time only. In subsequent executions, the Ansible will check that NGINX is in its latest version and will do nothing. You can ascertain this by checking `/var/log/apt/history.log` which contains a history of `apt` activities.

## Configure NGINX

Let's enhance this playbook by adding two more tasks to configure NGINX reverse proxy.

{% highlight yaml %}
  - name: write nginx config file for app 1
    template:
      src: nginx/webapp
      dest: /etc/nginx/sites-available/webapp_1
    vars:
      local_port: 5001
      remote_url: http://nginx-1.cloudqubes.com:8001
  - name: write nginx config file for app 2
    template:
      src: nginx/webapp
      dest: /etc/nginx/sites-available/webapp_2
    vars:
      local_port: 5002
      remote_url: http://nginx-1.cloudqubes.com:8002
{% endhighlight %} 

We are using the `template` ansible module to create two configuration files for two web apps, using a single [jinja2] template `nginx/webapp` in the Ansible control node.

{% highlight jinja %}
#jinja2 template 'nginx/webapp'
server{
    {% raw %}listen {{ local_port }};
    location / {
        proxy_pass {{ remote_url }};
    }{% endraw %}
}
{% endhighlight %} 

The `template` module allows passing a dictionary of variables in `vars`, which replaces the variables `local_port` and `remote_url` in [jinja2] template.

## Create simlinks

Using the Ansible module `file`, we will create two simlinks in the `/etc/nginx/sites-enabled` directory. 

{% highlight yaml %}
  - name: create symlink for webapp_1
    file:
      src: /etc/nginx/sites-available/webapp_1
      dest: /etc/nginx/sites-enabled/webapp_1
      state: link
  - name: create symlink for webapp_2
    file:
      src: /etc/nginx/sites-available/webapp_2
      dest: /etc/nginx/sites-enabled/webapp_2
      state: link
{% endhighlight %} 

## Reload NGINX config

Next, we reload NGINX config, with Ansible module `service`. 

{% highlight yaml %}
  - name: reload config file in nginx
    service:
      name: nginx
      state: reloaded
{% endhighlight %} 

## Superuser priviledges

We had used `become` parameter in the initial tasks to switch to superuser mode. This is equivalent to running the task with `sudo`.
{% highlight yaml %}
  become: yes
{% endhighlight %} 

`become` can be specified for each task or for the whole play. Since all the tasks in our play requires superuser priviledges, we had it moved to the play.

Here's the complete playbook with all tasks.

<script src="https://gist.github.com/cloudqubes/36642a715cd84c6832a9118988abe0f1.js"></script>

# Conclusion

In this post, we introduced Ansible and created a playbook to setup a reverse proxy server with NGINX. If you are a telco engineer who still believe that NGINX is only for IT, you may remind yourself that 5GC has adapted HTTP for its control plane. 

With the new features in 5G, this type of dynamic application deployment is not going to be uncommon in future telcos. Ansible is a robust automation platform that telcos should consider adapting, in order to be prepared for this oncoming transformation.

[Red Hat]: https://www.ansible.com/
[Ansible Engine]: https://www.ansible.com/products/engine
[Ansible Tower]: https://www.ansible.com/products/tower
[post]: {{site.baseurl}}{% post_url 2020-01-30-setting-up-an-nginx-reverse-proxy-for-openstack%}
[Ubuntu 18.04]: https://ubuntu.com/
[jinja2]: https://jinja.palletsprojects.com/en/2.11.x/