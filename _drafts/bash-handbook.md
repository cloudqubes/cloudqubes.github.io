
# Mount a disk drive

sudo fdisk /dev/vdb
add partition, and write.

sudo mkfs.ext4 /dev/vdb1
sudo mount /dev/vdb1 /disks/

## List all kernel modules
find /lib/modules/$(uname -r) -type f -name '*.ko'

## Get details of kernel module
modinfo i40evf
