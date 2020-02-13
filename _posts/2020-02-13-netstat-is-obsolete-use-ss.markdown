---
layout: post
title:  "netstat is obsolete use 'ss'"
date:   2020-02-13 18:20:00 +0530
categories: [hands-on, linux]
tags: [linux, netstat, ss, network, tools]
---

**netstat has been a valuable tool for Linux sysadmins for a long time. Now there is a better option.**

If you are still using `netstat` this is news for you. There is a better alternative; `ss`. According to the documentation of `ss`, it can display more socket information than other tools.

The following commands were executed on Ubuntu 18.04 with `ss` version `ss180129`. Depending on your version, output parameters may slightly vary.

Given no arguments, `ss` comaand will list all TCP, UDP, and [Unix sockets], that are in `established` state.

{% highlight shell %}
$ ss
{% endhighlight %} 

Option `a` is used to print all sockets, in all states.

{% highlight shell %}
$ ss -a
{% endhighlight %}

List only TCP sockets, in `established` state.
{% highlight shell %}
$ ss -t
{% endhighlight %}

List all TCP sockets, in all states.
{% highlight shell %}
$ ss -ta
{% endhighlight %}

Display additional information on TCP sockets.
{% highlight shell %}
$ ss -ti
{% endhighlight %}

The output of `ss -ti` include almost all the paraemters related to TCP stack, so wil be invaluable in troubleshooting network issues.

{% highlight shell %}
$ ss -ti
State               Recv-Q                Send-Q                                  Local Address:Port                                  Peer Address:Port                 
ESTAB               0                     64                                     10.199.254.220:ssh                                  172.20.10.10:51131
         cubic wscale:8,7 rto:248 rtt:45.193/25.671 ato:40 mss:1410 pmtu:1450 rcvmss:1168 advmss:1410 cwnd:10 bytes_acked:63569 bytes_received:5724 segs_out:155 segs_in:144 data_segs_out:150 data_segs_in:62 send 2.5Mbps lastrcv:4 lastack:4 pacing_rate 5.0Mbps delivery_rate 6.3Mbps app_limited busy:5128ms unacked:1 retrans:0/2 rcv_space:28200 rcv_ssthresh:45036 minrtt:44.417
ESTAB               0                     0                                      10.199.254.220:ssh                                  172.20.10.10:63611
         cubic wscale:8,7 rto:232 rtt:31.616/10.127 ato:40 mss:1410 pmtu:1450 rcvmss:1168 advmss:1410 cwnd:18 ssthresh:20 bytes_acked:180817 bytes_received:41516 segs_out:731 segs_in:813 data_segs_out:724 data_segs_in:587 send 6.4Mbps lastsnd:4713788 lastrcv:4713872 lastack:4713788 pacing_rate 7.7Mbps delivery_rate 49.7Mbps busy:19220ms rcv_rtt:430578 rcv_space:28332 rcv_ssthresh:73068 minrtt:1.185
{% endhighlight %}

Filtering can be applied based on [socket status]. The command takes the form `ss [options] state <tcp-state>`.

List all TCP listening ports.
{% highlight shell %}
$ ss -ta state listening
{% endhighlight %}

List all TCP ports in SYN-SENT status.
{% highlight shell %}
$ ss -ta state syn-sent
{% endhighlight %}

Filtering can also be done based IP address.
{% highlight shell %}
$ ss -tai dst 10.199.254.82
{% endhighlight %}

Or, based on source, dstination ports.
{% highlight shell %}
$ ss -t '( sport = :ssh )'
{% endhighlight %}

These filters can be combined to get a more fine grained output. Below command will list the TCP sockets in established state to port 22 with peer IP 172.16.10.10.
{% highlight shell %}
$ ss -t '( sport = :ssh )' dst 172.16.10.10
{% endhighlight %}

As you may appreciate `ss` has advanced filtering capabilities and provides more information than `netstat`. So, next time when you are investigating any network related things, rememeber to use `ss` instead of `netstat`.

[Unix sockets]: http://en.wikipedia.org/wiki/Unix_domain_socket
[socket status]: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Protocol_operation