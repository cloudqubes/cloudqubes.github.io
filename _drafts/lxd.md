
What is LXD and LKC

LXD is installed when installing multipass.
Else, should be possible to install separately


List networks
$ lxc network list

Create network
$ lxc network create test_1 --type bridge
type ovn didn't work. Need to check.

List images
$ lxc image list

Create image
$ lxc image import <tarball>

Tarball must contain a yaml file according to this
https://linuxcontainers.org/lxd/docs/master/image-handling/
--Need to continue from here

Launching an instance

$ lxc launch 
Image must be already imported.