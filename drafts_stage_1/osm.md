
Install charmed OSM

# Install Juju and OSM clients

{% highlight shell %}
$ sudo snap install juju --classic
$ sudo snap install osmclient --edge
$ sudo snap connect osmclient:juju-client-observe
{% endhighlight %} 
`snap connect` connect osmclient with juju.

# Bootstrap Juju controller on LXD

config file

default-series: xenial
no-proxy: localhost
apt-http-proxy: http://10.48.250.93:3128
apt-https-proxy: https://10.48.250.93:3128
apt-ftp-proxy: ftp://10.48.250.93:3128
http-proxy: http://10.48.250.93:3128
https-proxy: https://10.48.250.93:3128
ftp-proxy: ftp://10.48.250.93:3128


this fails
{% highlight shell %}
$ juju bootstrap localhost osm-lxd --config=config.yaml
{% endhighlight %} 
ERROR failed to bootstrap model: cannot start bootstrap instance in availability zone "palo-alto-jumpserver": no matching image found




{% highlight shell %}
{% endhighlight %} 



[snap-interfaces]: https://snapcraft.io/docs/interface-management