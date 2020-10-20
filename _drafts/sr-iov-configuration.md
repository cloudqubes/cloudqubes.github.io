# Using SR-IOV
SR-IOV requires supported PCIe device, host compute with Intel VT-d or AMD IOMMU extensions, and driver software in both host and guest OS. 

Since Network Interface Cards are the most widely deployed use case of SR-IOV let's see how to create a VM with an SR-IOV enabled vNIC.

## Verify SR-IOV support in NIC

The first thing you have to check is whether your host machine is equipped with a NIC card which supports SR-IOV. The `lspci` command can give you information on PCI devices attached to the system. However, it will print only the IDs of the devices, and not the names.

You can use the [PCI IDs file][pci-id-file] hosted at [PCI ID Repository][pci-id-repo] to check the name of the CPI device mappting to the ID.

{% highlight shell %}
$ lspci | grep -i ethernet
3b:00.0 Ethernet controller: Intel Corporation Device 158b (rev 02)
3b:00.1 Ethernet controller: Intel Corporation Device 158b (rev 02)
5e:00.0 Ethernet controller: Intel Corporation Device 158b (rev 02)
5e:00.1 Ethernet controller: Intel Corporation Device 158b (rev 02)
d8:00.0 Ethernet controller: Intel Corporation Device 158b (rev 02)
d8:00.1 Ethernet controller: Intel Corporation Device 158b (rev 02)
{% endhighlight %} 

In the above case the ID `158b` is `Ethernet Controller XXV710`.

Alternatively you can use the `update-pciids` utility to fetch the PCI IDs file and install it in your system. Then every time you use `lspci` it will print the device name instead of the ID.

Next, check the manufacturers specification of the NIC to see whether SR-IOV is supported.

## Enable Intel VT-d or AMD IOMMU

If you are using Intel CPU on the host compute VT-d has to be enbaled in BIOS and OS kernel. Refer the device manufactures documentation for enabling VT-d on BIOS because different manufactures may use different terms.

Enbaling VT-d in the kernel requires modifying `grub.conf` and rebooting. Depending on your Linux distribution the procedure for modifying the `grub.conf` may vary. Please follow the relevant instructions to insert `intel_iommu=on` parameter to grub.conf and reboot.

If you are working on an AMD CPU, the parameter to be inserted to `grub.conf` will be `amd_iommu=on` instead.

## Kernel modules

For supported devices, the kernel module (aka drivers) are loaded automatically. To check the relevant kernel module for the device use `lspci` with `k` option. 

{% highlight shell %}
$ lspci -k 
d8:00.1 Ethernet controller: Intel Corporation Device 158b (rev 02)
        Subsystem: Intel Corporation Device 0000
        Kernel driver in use: i40e
{% endhighlight %} 
Note that output has been truncated to show only one device.

i40e
{% highlight shell %}
root@compute-9-1818:~# modinfo i40e
filename:       /lib/modules/4.4.0-133-generic/updates/dkms/i40e.ko
version:        2.4.6
license:        GPL
description:    Intel(R) 40-10 Gigabit Ethernet Connection Network Driver
author:         Intel Corporation, <e1000-devel@lists.sourceforge.net>
srcversion:     AED7BF3F5ECA621CC4402E8
alias:          pci:v00008086d0000158Bsv*sd*bc*sc*i*
alias:          pci:v00008086d0000158Asv*sd*bc*sc*i*
alias:          pci:v00008086d000037D3sv*sd*bc*sc*i*
alias:          pci:v00008086d000037D2sv*sd*bc*sc*i*
alias:          pci:v00008086d000037D1sv*sd*bc*sc*i*
alias:          pci:v00008086d000037D0sv*sd*bc*sc*i*
alias:          pci:v00008086d000037CFsv*sd*bc*sc*i*
alias:          pci:v00008086d000037CEsv*sd*bc*sc*i*
alias:          pci:v00008086d00001588sv*sd*bc*sc*i*
alias:          pci:v00008086d00001587sv*sd*bc*sc*i*
alias:          pci:v00008086d00001589sv*sd*bc*sc*i*
alias:          pci:v00008086d00001586sv*sd*bc*sc*i*
alias:          pci:v00008086d00001585sv*sd*bc*sc*i*
alias:          pci:v00008086d00001584sv*sd*bc*sc*i*
alias:          pci:v00008086d00001583sv*sd*bc*sc*i*
alias:          pci:v00008086d00001581sv*sd*bc*sc*i*
alias:          pci:v00008086d00001580sv*sd*bc*sc*i*
alias:          pci:v00008086d00001574sv*sd*bc*sc*i*
alias:          pci:v00008086d00001572sv*sd*bc*sc*i*
depends:        ptp,vxlan
retpoline:      Y
vermagic:       4.4.0-133-generic SMP mod_unload modversions retpoline
parm:           debug:Debug level (0=none,...,16=all) (int)

{% endhighlight %}


{% highlight shell %}

{% endhighlight %} 