
Have to enable packet forwarding
sudo sysctl -w net.ipv4.ip_forward=1


source nat for NFV proxy

sudo iptables -t nat -A PREROUTING -i ens3 -j DNAT -p tcp --dport 3128 --to 10.48.250.93:3128
sudo iptables -t nat -A POSTROUTING -o ens3 -j SNAT --to 10.199.254.107

delete rule
sudo iptables -t nat -D PREROUTING 1

list with line number
sudo iptables -nL --line-numbers -t nat

sudo iptables -t nat -A PREROUTING -i eth1 -j DNAT -p tcp --dport 8006 --to 10.199.254.85:8006


ip route add 10.199.254.80/29 via 10.174.130.1