
DHCP enabled network

root@cic-1:~# openstack network show dhcp_test
+---------------------------+--------------------------------------+
| Field                     | Value                                |
+---------------------------+--------------------------------------+
| admin_state_up            | UP                                   |
| availability_zone_hints   |                                      |
| availability_zones        |                                      |
| created_at                | 2020-06-01T12:57:46                  |
| description               |                                      |
| id                        | 0a894f59-b8ff-45ed-8131-285f4f00d3ed |
| ipv4_address_scope        | None                                 |
| ipv6_address_scope        | None                                 |
| mtu                       | 1450                                 |
| name                      | dhcp_test                            |
| port_security_enabled     | True                                 |
| project_id                | b533aa3d58714099b302b73f3ab32f26     |
| provider:network_type     | vxlan                                |
| provider:physical_network | None                                 |
| provider:segmentation_id  | 4333                                 |
| router_external           | Internal                             |
| shared                    | False                                |
| status                    | ACTIVE                               |
| subnets                   | ff7c373a-491b-4966-98a5-68359d94da3f |
| tags                      | []                                   |
| updated_at                | 2020-06-01T12:57:46                  |
+---------------------------+--------------------------------------+
root@cic-1:~# openstack subnet show  ff7c373a-491b-4966-98a5-68359d94da3f

+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| allocation_pools  | 10.174.130.2-10.174.130.6            |
| cidr              | 10.174.130.0/29                      |
| created_at        | 2020-06-01T12:57:49                  |
| description       |                                      |
| dns_nameservers   |                                      |
| enable_dhcp       | True                                 |
| gateway_ip        | 10.174.130.1                         |
| host_routes       |                                      |
| id                | ff7c373a-491b-4966-98a5-68359d94da3f |
| ip_version        | 4                                    |
| ipv6_address_mode | None                                 |
| ipv6_ra_mode      | None                                 |
| name              | dhcp_test_v4                         |
| network_id        | 0a894f59-b8ff-45ed-8131-285f4f00d3ed |
| project_id        | b533aa3d58714099b302b73f3ab32f26     |
| subnetpool_id     | None                                 |
| updated_at        | 2020-06-01T12:57:49                  |
+-------------------+--------------------------------------+

renew lease

sudo dhclient -r ens4
sudo dhclient ens4

netplan config

        ens4:
            dhcp4: true
            match:
                macaddress: fa:16:3e:c7:ed:1a
            mtu: 1450
            set-name: ens4


get the DHCP server address

ubuntu@test-vm1:~$ grep -r "DHCPOFFER" /var/log/syslog
Jun  2 05:40:00 test-vm1 dhclient[2168]: DHCPOFFER of 10.174.130.3 from 10.174.130.2
Jun  2 05:41:03 test-vm1 dhclient[2240]: DHCPOFFER of 10.174.130.3 from 10.174.130.2
Jun  2 05:43:01 test-vm1 dhclient[2406]: DHCPOFFER of 10.174.130.3 from 10.174.130.2
Jun  2 08:03:22 test-vm1 dhclient[14035]: No DHCPOFFERS received.
Jun  2 08:11:34 test-vm1 dhclient[14035]: No DHCPOFFERS received.
Jun  2 08:12:16 test-vm1 dhclient[14240]: No DHCPOFFERS received.
Jun  2 08:19:16 test-vm1 dhclient[14035]: No DHCPOFFERS received.
ubuntu@test-vm1:~$

10.174.130.0/29

