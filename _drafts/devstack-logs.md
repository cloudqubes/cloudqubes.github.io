query processes
 sudo systemctl status devstack@*

list devstack units
sudo systemctl list-units | grep devstack

create server
stack@devstack-server-pike:~$ openstack server create --image cirros-0.3.5-x86_64-disk --network private --flavor ubuntu_flavor ubuntu_vm
+-------------------------------------+-----------------------------------------------------------------+
| Field                               | Value                                                           |
+-------------------------------------+-----------------------------------------------------------------+
| OS-DCF:diskConfig                   | MANUAL                                                          |
| OS-EXT-AZ:availability_zone         |                                                                 |
| OS-EXT-SRV-ATTR:host                | None                                                            |
| OS-EXT-SRV-ATTR:hypervisor_hostname | None                                                            |
| OS-EXT-SRV-ATTR:instance_name       |                                                                 |
| OS-EXT-STS:power_state              | NOSTATE                                                         |
| OS-EXT-STS:task_state               | scheduling                                                      |
| OS-EXT-STS:vm_state                 | building                                                        |
| OS-SRV-USG:launched_at              | None                                                            |
| OS-SRV-USG:terminated_at            | None                                                            |
| accessIPv4                          |                                                                 |
| accessIPv6                          |                                                                 |
| addresses                           |                                                                 |
| adminPass                           | EvgHZ582iwW6                                                    |
| config_drive                        |                                                                 |
| created                             | 2020-04-20T05:26:17Z                                            |
| flavor                              | ubuntu_flavor (7e5497d6-7a8c-4fa8-b5de-a78bb04fa3bd)            |
| hostId                              |                                                                 |
| id                                  | 375df968-9e00-4641-aaea-0c17e602437d                            |
| image                               | cirros-0.3.5-x86_64-disk (6d4fafd9-ec76-4661-8198-b7e1dffb1e19) |
| key_name                            | None                                                            |
| name                                | ubuntu_vm                                                       |
| progress                            | 0                                                               |
| project_id                          | 81ce6e42b7ad4647ba146a4ee7e68bab                                |
| properties                          |                                                                 |
| security_groups                     | name='default'                                                  |
| status                              | BUILD                                                           |
| updated                             | 2020-04-20T05:26:16Z                                            |
| user_id                             | b8fb593cec11450b8007342dc1c4be27                                |
| volumes_attached                    |                                                                 |
+-------------------------------------+-----------------------------------------------------------------+

KVM/QEMU logs

ls -l /var/log/libvirt/qemu/

watch
https://www.youtube.com/watch?v=0uEqDarifJs
