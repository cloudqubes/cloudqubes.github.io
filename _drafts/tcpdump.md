Filter out ARP
sudo tcpdump -i ens4 not arp

DHCP
tcpdump -i eth0 -n port 67 or port 68


tcpdump -i eth1 -nn not port 22

tcpdump -i eth1 -nn port 30001 or port 30000
tcpdump -i eth1 -nn port 30000

tcpdump -i eth1 -nn net 10.174.130.0/28


sudo tcpdump -i eth1 -n icmp


-n     Don’t convert host addresses to names.  This can be used to avoid DNS lookups.
-nn    Don’t convert protocol and port numbers etc. to names either.

filter for host
tcpdump -i any -n host 172.16.0.1

