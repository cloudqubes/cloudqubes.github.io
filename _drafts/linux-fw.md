purpose - clarify the purpose of allowed_ip_address pair in OpenStack


EO Package in SANDBOX tenant - allowed_address_pair_test

check ip forwarding

sysctl net.ipv4.ip_forward

enable ip forwarding
sudo sysctl -w net.ipv4.ip_forward=1
this is not persistent

# Uncomment the next line in  /etc/sysctl.conf to permanently enable packet forwarding for IPv4
#net.ipv4.ip_forward=1


ubuntu@vm-firewall:~$ sudo iptables -L
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
ubuntu@vm-firewall:~$

ACCEPT means default policy is to accept

 iptables is a kernel module. It is never a "service" that can be "stopped". They are used to tell the kernel how to handle connections.

sudo iptables -A FORWARD -i ens4 -o ens5 -j ACCEPT


list all iptable rules
 sudo iptables -L -n -v

to delete rules by chain and number

~$ sudo iptables -L --line-numbers
$ sudo iptables -D FORWARD 1
When a rule is deleted, the numbers in below rules will be rearranged.

Allowed IP pair is not required to receive traffic destined to an IP address different from the interface IP

check the OVS tables, with and without security groups

 Prints a brief overview of the switch database configuration
ovs-vsctl show

Prints a list of configured bridges
ovs-vsctl list-br
root@compute-9-1816:~# ovs-vsctl list-br
br-fake
br-fw-admin
br-hds-agent
br-int
br-mgmt
br-prv
br-sdnc-sbi
root@compute-9-1816:~#


Prints a list of ports on a specific bridge.
ovs-vsctl list-ports <bridge>

list interfaces in a bridge
ovs-vsctl list-ifaces br-int


print specific interface
ovs-vsctl list interface vhu8be97389-a0


ovs-ofctl show <bridge> : Shows OpenFlow features and port descriptions.
ovs-ofctl snoop <bridge> : Snoops traffic to and from the bridge and prints to console.
ovs-ofctl dump-flows <bridge> <flow> : Prints flow entries of specified bridge. With the flow specified, only the matching flow will be printed to console. If the flow is omitted, all flow entries of the bridge will be printed.

print the tables of a bridge/switch
ovs-ofctl dump-tables br-int

OVS bridges: https://pve.proxmox.com/wiki/Open_vSwitch

OVS ports: http://arthurchiao.art/blog/ovs-deep-dive-6-internal-port/



openflow table

action resubmit (, <table>) go to the specified table. this is an OVS extension.

print flow table of a specific table
ovs-ofctl dump-flows br-int | grep "table=245"

there are some tables with no rules
# ovs-ofctl dump-flows br-int | grep "table=17"



#NAT

iptables -t nat -A PREROUTING -i eth1 -p tcp --dport 6000 -j DNAT --to 10.199.254.85:30001

add return route from 10.199.254.85

ip route add 10.199.130.92/32 via 10.199.254.86 dev eth1

for intiating connections from vnfm
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 3103 -j DNAT --to 10.199.130.92:3103
iptables -t nat -D PREROUTING -i eth0 -p tcp --dport 3103 -j DNAT --to 10.199.130.92:3103

iptables -t nat -A POSTROUTING -o eth1 -j SNAT --to 10.199.0.142
