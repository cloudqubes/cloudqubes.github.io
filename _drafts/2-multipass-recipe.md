---
layout: post
title:  "How to enable SSH authentication in Multipass VMs"
subtitle: > 
  Multipass is your friend for quickly spinning up VMs in Linux, Mac, or Windows. You can easily launch a VM configured with SSH kay-based authentication in Multipass"
date:   2022-12-28 11:00:00 +0530
categories: [recipe]
tags: [linux]
---


 Just install and run `multipass launch --name my-vm` and you are done. 

This VM has 1 CPU core, 1GB memory, and 5GB storage.
Most importantly it does not have SSH enabled and you have to use `multipass shell` to access it and then configure SSH access.

That's too much work. So, let's use cloud-init to launch a VM with SSH keys.

### Create the SSH keys

Use `ssh-keygen` to create a new key pair.
```shell
$ ssh-keygen -f .ssh/multipass_vm_key
```

Print the public key.
```shell
$ cat .ssh/multipass_vm_key.pub 
```
Then, copy the output to clipboard.


### Create the config file for cloud-init

Create a new file `vm-config.yml`.

```yaml
#cloud-config
users:
  - name: ubuntu
    ssh_authorized_keys:
      ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDbGROILWv5VKu+03TlI9cdZOSZHuXtIfoH32pA0F4C88nRI05IJ+N2VlvSyaP6Zf9UdRHZfa7bkNFbvOQESvir4DgaNRS4aUaSApV13jrr7JSgM6hGMJf32gnUXCUXntXDT+MbJ8PALfCQNRvTcv1ZcQbDBGEhuAwovlzwXOrKoqc3f51Hhsi1nEt/GOm1lQ4shMxkxhM5e3ontC+2cbvwKcgR0k29maJNWi7HnO69dCHhxTlvXsLLN9dUeubXEg6oEMBeIvjKOb2UHk5N1O4zvFdfNGnM1Kf0ef3KUIAZh5rNa/Fq4/QRR75BJ/uF4nuOB1F4ZKmDXPEcoVajTBPLLvhIPzukipKi4BxJBjpibnv6w3tC9M/708UYuRLX2jRyNvQJ52ntlOCATXrq1W4KpS6s7hLBBd4C0gG4wACrmhm7PqVntl9whsBpJcyBWB5T3R2Ce4MzOQYzh+XhmX+CprnuCsoBJv+KleDRLVklyLvOWu5UOYczJBB7mWqTYZs= ubuntu@my_host
```
Replace the line beginning wth `ssh-rsa` with the content copied to clipboard in the previous step.

### Launch VM with 


```shell
$ multipass launch file:///home/dialog/focal-server-cloudimg-amd64-disk-kvm.img --cloud-init ubuntu_vm_2.yml -n my-vm
```

Check the IP address
```shell
$ multipass list                          
Name                    State             IPv4             Image
k8s-1                   Running           10.221.207.122   Not Available
my-vm                   Running           10.221.207.193   Not Available
```

Login to the new VM with SSH.


```shell
$ ssh -i .ssh/m_vm_key ubuntu@10.221.207.193
```


[Multipass]: https://multipass.run/
