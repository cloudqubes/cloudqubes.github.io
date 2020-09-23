purpose - introduce the concept of config-drive and cloud-init.
          demistify the magical cloud-init



# Nova metadata
Metadata is a configuration mechanism implemented in Nova, which configuration data available to VMs at the time of instantiation. Metadata has two options for doing this.

* Config drive
    Config drive is a special kind of a virtual disk dirve, that get attached to a VM at instantiation time. The VM can mount the dirve and access its contents. 
* Metadata service
    This is a web api service, which is made available to VMs via a special IP address `169.254.169.254`. This is a [link-local address], which is a special type af address used for communication within a specific network segment. In OpenStack this is implemented via Neutron and not assigned to any virtual or physical host.

To keep things simple, we are going to focus on the config drive in this post, reserving metadata service for another day.

# Enabling config drive
If you are using OpenStack with KVM and libvirt, which is the most widely deployed option the host compute needs to have [genisoimage] installed.
The `nova.conf` can force eanble config drive for all VMs.
{% highlight yaml %}
[DEFAULT]
force_config_drive = True
{% endhighlight %} 
If it is not enabled by default, you have to enable it for each VM.
When using CLI, is can be enabled by `--config-drive true` parameter.
When using HOT, you have to set `config_drive: true` in `OS::Nova::Server`.

# Types of metadata
There are three types of metadata, that can be made available to a VM.
1. User provided data
This data is provided as a blob by the user. When using CLI, it is passed to `user-data` parameter, and when using HOT it is passed in `user_data`:
2. Nova provided data
This data is passed to the VM by Nova, transparent to the user. Mainly this data includes the hostnmame and the availability zone of the VM
3. Deployer provided data
The deployer or administrator of OpenStack can pass some data to a VM wthout exposng to tehe user who creates the VM.

# Passing the User Provided Data

Let's pass some data to the config drive in CLI and Heat templates

## CLI

##

# Using config drive in VM

## CLI

When creating a VM with OpenStack CLI user-data can be passed 

## cloud-init
If you are using an image with cloud-init enabled, it's seamless. Cloud-init mounts the config drive and access it's data. All you have to do it provide the data in a specific format so cloud-init can execute various tasks.

### Enable password authentication
As mentioned at the beginning, the cloud images of most operating systems have the password authentication disabled. cloud-init can be used to enable password authentication and set the password of the default user account.

For brevity we have shown only the part related to creating the VM. In this case we are using `user_data_format` as `RAW` which means whatever specified in string in `user_data` will be passed to Nova unmodified.
`user_data` is a string. The `|` symbol means that it's a multiline string.
{% highlight yaml %}
  ubuntu_k:
    type: OS::Nova::Server
    properties:
      name: "ubuntu"
      image: "bionic-server-cloudimg-amd64-v2"
      flavor: { get_resource: flavor }
      networks:
        - port: { get_resource: oam_port }
      config_drive: true
      user_data_format: RAW
      user_data: |
        #cloud-config
        users:
        - default
            
{% endhighlight %} 



## References:
1. [Config drive - OpenStack Adminstration guides][config-drive-admin]


[link-local address]: https://en.wikipedia.org/wiki/Link-local_address
[config-drive-admin]: https://docs.openstack.org/nova/latest/admin/config-drive.html
[genisoimage]: https://wiki.debian.org/genisoimage



{% highlight yaml %}

{% endhighlight %} 
