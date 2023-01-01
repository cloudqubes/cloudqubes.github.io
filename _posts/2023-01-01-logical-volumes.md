---
layout: post
title:  "How to extend the root disk space in Ubuntu"
subtitle: > 
  While installing Ubuntu Server if you let the installer take care of the disk partitioning, the root volume will not occupy the entire disk by default. But, Ubuntu uses LVM so you can easily extend the volumes, if you run out of space.
date:   2022-12-28 11:00:00 +0530
categories: [recipe]
tags: [linux]
---


Here's how to resize the default logical volume in Ubuntu 20.04 (Focal Fossa).


### Check the current disk utilization.

```shell
dialog@r740:~$ df -h
Filesystem                         Size  Used Avail Use% Mounted on
tmpfs                               38G  2.7M   38G   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv   98G   11G   83G  12% /
tmpfs                              189G     0  189G   0% /dev/shm
tmpfs                              5.0M     0  5.0M   0% /run/lock
/dev/sda2                          2.0G  126M  1.7G   7% /boot
/dev/sda1                          1.1G  5.3M  1.1G   1% /boot/efi
tmpfs                               38G  4.0K   38G   1% /run/user/1000
```

The 98G root partition is mounted at `/dev/mapper/ubuntu--vg-ubuntu--lv` which indicates that it is a logical volume.

### View the logical volume

```shell
dialog@r740:~$ sudo lvdisplay 
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/ubuntu-lv
  LV Name                ubuntu-lv
  VG Name                ubuntu-vg
  LV UUID                zD6JWq-kNyn-j4QN-B2YQ-PfMk-CQi5-hyGDNW
  LV Write Access        read/write
  LV Creation host, time ubuntu-server, 2022-08-10 17:33:38 +0000
  LV Status              available
  # open                 1
  LV Size                100.00 GiB
  Current LE             25600
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```
The logical volume belongs to the volume group `ubuntu-vg`.
The logical volume size is 100 GiB.

### View the volume group

```shell
dialog@r740:~$ sudo vgdisplay 
  --- Volume group ---
  VG Name               ubuntu-vg
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  2
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               <891.20 GiB
  PE Size               4.00 MiB
  Total PE              228147
  Alloc PE / Size       25600 / 100.00 GiB
  Free  PE / Size       202547 / <791.20 GiB
  VG UUID               akPqd3-w8FH-l86R-SQ0Y-42KS-MI7c-Gj2psL
```

We have 791.2 GiB of free space.

### Check the physical volume

```shell
dialog@r740:~$ sudo pvdisplay 
  --- Physical volume ---
  PV Name               /dev/sda3
  VG Name               ubuntu-vg
  PV Size               891.20 GiB / not usable 2.00 MiB
  Allocatable           yes 
  PE Size               4.00 MiB
  Total PE              228147
  Free PE               202547
  Allocated PE          25600
  PV UUID               HEBVLN-mSCE-lnEB-Ksf5-GSSd-J1m0-pdWPvG
```
The physical volume size is 891.20 GiB.

### Extend the logical volume

We have enough free capacity in the physical volume and the volume group.
What is remaining is to extend the logical volume.

```shell
dialog@testlab7401:~$ sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
  Size of logical volume ubuntu-vg-1/ubuntu-lv changed from 100.00 GiB (25600 extents) to <891.20 GiB (228147 extents).
  Logical volume ubuntu-vg-1/ubuntu-lv successfully resized.
``` 

Check the vlume size.

```shell
dialog@r740:~$ sudo lvdisplay 
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/ubuntu-lv
  LV Name                ubuntu-lv
  VG Name                ubuntu-vg
  LV UUID                zD6JWq-kNyn-j4QN-B2YQ-PfMk-CQi5-hyGDNW
  LV Write Access        read/write
  LV Creation host, time ubuntu-server, 2022-08-10 17:33:38 +0000
  LV Status              available
  # open                 1
  LV Size                <891.20 GiB
  Current LE             228147
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```
Now, the size has increased to 891.20 GiB.

### Resize file system

```shell
dialog@r740:~$ sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
resize2fs 1.46.5 (30-Dec-2021)
Filesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required
old_desc_blocks = 13, new_desc_blocks = 112
The filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 233622528 (4k) blocks long.
```

Check the size.

```shell
dialog@testlab7401:~$ df -h
Filesystem                            Size  Used Avail Use% Mounted on
tmpfs                                  38G  2.9M   38G   1% /run
/dev/mapper/ubuntu--vg--1-ubuntu--lv  877G   92G  749G  11% /
tmpfs                                 189G     0  189G   0% /dev/shm
tmpfs                                 5.0M     0  5.0M   0% /run/lock
/dev/sda2                             2.0G  126M  1.7G   7% /boot
/dev/sda1                             1.1G  5.3M  1.1G   1% /boot/efi
tmpfs                                  38G  4.0K   38G   1% /run/user/1000
```

Now, the root volume has 877 GiB capacity.
