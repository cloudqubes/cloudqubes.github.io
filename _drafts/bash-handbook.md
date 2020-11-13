
## Mount a disk drive

sudo fdisk /dev/vdb
add partition, and write.

sudo mkfs.ext4 /dev/vdb1
sudo mount /dev/vdb1 /disks/

## List all kernel modules
find /lib/modules/$(uname -r) -type f -name '*.ko'

## Get details of kernel module
modinfo i40evf

## Print size of the directory
sudo du -sh {directory_name}
Ex - sudo -sh /

## Print directories with size of each directory
sudo du -sh {directory_name}*
Ex - sudo -sh /*

# File Management

## Copy multiple files/directories to target directory
cp -r file1 file2 directory1 target_directory/

## Clone disk 
dd if=

# Network Namespace

## List network namspaces
ip netns list

# IP Stack

## Print IP routing tables
ip route show table all
