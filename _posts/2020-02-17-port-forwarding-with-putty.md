---
layout: post
title:  "SSH port forwarding with PuTTY"
date:   2020-02-17 14:20:00 +0530
categories: [hands-on, Linux]
tags: [linux, ssh, port forwarding, PuTTY, windows]
---

**SSH port forwarding is a versatile feature. Let's see how we can use it with PuTTY.**

SSH port forwarding is a mechanism to send arbitrary traffic over an encrpted SSH tunnel. There are two types of port forwarding; local, and remote. 

This post focus on local port forwarding when the client is not a Linux machine. Let's see the typical scenario, where this would come in handy.

![Usecase for Local Port Forwarding](/assets/images/l_port_forwarding_usecase.png)

Our laptop is running Windows OS, and the Linux server is running a web application over port 3100. The corporate IT firewall, sitting between the laptop and the server, is allowing only SSH traffic to pass through. (While it is possible to get the 3100 port opened from firewall, in a typical organization it is a cumbersome process.)

![Usecase for Local Port Forwarding](/assets/images/l_port_forwarding_function.png)

In local port forwarding, traffic destined to a port (3100 in this case) on the local server is forwarded to the remote server via the SSH tunnel. Since the traffic to destination port 3100 is encapulated, our firewall will sess only traffic to port 22.

For local port forwarding to work, there are no specific configurations to be done at the server. But, the SSH client in our laptop requires some configurations.

While most SSH clients support local port forwarding, we are using [PuTTY], which is a free and popular SSH client software.

Assuming you already have the server IP address configured in [PuTTY], go to Connection -> SSH -> Tunnels, and add following configuration. Note the configurations with the radio button in two rows. (Local and IPv4 should be selected)

![PuTTY configuration](/assets/images/putty_2.png)

Click on `Add`, and you will get below. Again note the `4L` at the beginning of the configuration, which correspond with Ipv4 and Local. Save the configurations to session, and click `Open` to establish the SSH connection.

![PuTTY configuration](/assets/images/putty_3.png)

When SSH session is established, we should be able to reach port 3100 on the remote server via 127.0.0.1:3100. Since our `app` is a HTTPS web application, we can access it with the URL `https://127.0.0.1:3100`. 

For the above port forwarding configuration to work, our `app` on the server must be listening to 127.0.0.1, which you can verify with `ss -t state listening '( sport = 3100 )'` ([more about ss command]({% link _posts/2020-02-13-netstat-is-obsolete-use-ss.md %}))

In some cases the `app` may be listening only on server's private IP address `x.x.x.x`, so that you have to put `x.x.x.x:3100` on the destination textbox in [PuTTY] configurations.

We can also use SSH port forwarding to access a port on a remote machine as below. As long as y.y.y.y is reachable from x.x.x.x, we can access `app` running on server 2, via server 1. Note that the destination in PuTTY configuration for this case should be `y.y.y.y:3100`

![Local Port Forwarding to access a remote machine](/assets/images/l_port_forwarding_usecase_2.png)

# Troubleshooting

If you encounter any problems, you can have a look at PuTTY Event Log. To access Event Log, right click top menu bar, and click `Event Log`, after opening the SSH session to server.

A successful port forwarding will look like this.

{% highlight shell %}
2020-02-17 18:23:54	Local IPv4 port 3100 forwarding to 127.0.0.1:3100
{% endhighlight %} 

# Warning

While SSH port forwarding enables us to access remote ports via a SSH tunnel, it could cause security vulnerabilities. Also it could violate your organization's cyber security policies. Therefore we urge you to use caution when using this feature. We suggest you use it only temporarily, and use proper firewall rules to access your applications on productions servers.

[PuTTY]: https://www.PuTTY.org/
