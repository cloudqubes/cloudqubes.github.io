Historyically security groups were implemented in IP tables.

Now firewall driver is openvswitch. so security is implemented in flow tables in OVS.

https://docs.openstack.org/neutron/pike/admin/config-ovsfwdriver.html

print ovs flow table
$ sudo ovs-vsctl list flow_table

