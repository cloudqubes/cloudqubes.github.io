---
layout: post
title:  "Setting up an NGINX Reverse Proxy for OpenStack"
date:   2020-01-30 19:00:00 +0530
categories: hands-on linux 
tags: NGINX reverse-proxy openstack
---

**NGINX is a popular, high performance web server, that can also be used as a reverse proxy. So what?**

NFV itself presents a challenging learning curve for telco engineers. Also it demands a lot of skills on Linux, that were once confined to IT. So, in this post we are going sharpen up some of those skills.

[NGINX] is a popular, high performance web server, used to power busy web applications. Additionally it can also perform as a reverse proxy. So What is a reverse proxy?

A reverse proxy is an intermediary server that sits in front of the web servers, receives requests from clients, and forwards them to appropriate back-end web server. Unlike a proxy server that is on the clients network, the reverse proxy is located at the server network, probably behind a web application firewall.

Here is an example scenario of using a reverse proxy. The URL mobile.myapp is sent to web server-1 which is dedicated for serving requests from mobile applications. The URL web.myapp.com is load balanced between web server-2 and web server-3. 

![Reverse Proxy](/assets/images/reverse_proxy.png)

So, how does this relate to NFV?

![Reverse Proxy](/assets/images/reverse_proxy_openstack.png)

Here we have used [NGINX] as a reverse proxy for accesing NFVO and OpenStack from multiple S-VNFMs. It can reduce the networking complexity for integrating a new S-VNFM, and provide security for our NFV infrastructure.

So let's see how to setup the reverse proxy with [NGINX].

# Install NGINX
First, install NGINX on a VM running Ubuntu 18.04.
{% highlight shell %}
$ sudo apt-get update
$ sudo apt install nginx
{% endhighlight %} 

# Check NGINX status
Check that NGINX service is enabled, and is running:
{% highlight shell %}
$ systemctl is-enabled nginx.service
enabled
$ systemctl status nginx.service
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2020-01-13 23:22:42 UTC; 2min 32s ago
     Docs: man:nginx(8)
  Process: 13607 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
  Process: 13598 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
 Main PID: 13609 (nginx)
    Tasks: 9 (limit: 4915)
   CGroup: /system.slice/nginx.service
           ├─13609 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           ├─13612 nginx: worker process
           ├─13614 nginx: worker process
           ├─13615 nginx: worker process
           ├─13616 nginx: worker process
           ├─13617 nginx: worker process
           ├─13618 nginx: worker process
           ├─13619 nginx: worker process
           └─13620 nginx: worker process

Jan 13 23:22:42 devstack-vm systemd[1]: Starting A high performance web server and a reverse proxy server...
Jan 13 23:22:42 devstack-vm systemd[1]: Started A high performance web server and a reverse proxy server.
{% endhighlight %} 

We can see that NGINX service is running without any issues.

# Get OpenStack certificates

Production OpenStack APIs should be running on SSL, so you have to get the certificates configured in your OpenStack environment. Depending on the implementation, the SSL certificate could either be a self-signed certificate, or issued by a certificate authority. NGINX configuration will slightly vary for these two cases, as you will see in the below section.

Get the certificate and copy it to `/home/nginx/ssl_key/` (or anywhere accessible by the user running NGINX).

# Certificate for NGINX

We are going to use a self-signed certificate for our reverse proxy server, so we use `openssl` to generate `.key` and `.cert`.

{% highlight shell %}
$ openssl req -nodes -new -x509 -keyout proxy.key -out proxy.cert
{% endhighlight %} 


# Configure the reverse proxy function

All NGINX configuration files are located in `/etc/nginx` directory.

The web server information are in `sites-available` directory. Let's create a new file `openstack` inside this directory and add our OpenStack configurations.

The proxy configurations in NGINX reside under `server` directive. Accordingly we have to add separate directives for each of the OpenStack services and NFVO.

This is the configuration for proxying the requests of `kesytone` service.

{% highlight shell %}
#keystone
server{
    listen 35357;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:35357;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/openstack.crt;
    }
}
{% endhighlight %} 

### listen
The `listen` directive specified server port for the OpenStack service, which is 35357 for [Keystone].

### ssl
Since we are using HTTPS we configure `ssl on`.

### ssl_certificate and ssl_certificate_key

Thes are the certificate and key we created for the proxy server. Note that we did not use a passphrase when generating the certificate. If you did, you have to specify it as `pem passphrase = <your passphrase>`

### location

The `location` directive contains the configurations for the upstream server, in our case OpenStack service. `/` in location means we are passing all requests coming to port 35357 to upstream server. We can define a relative path such as `/v2.0`, if we need to pass requests only coming to that path.

### proxy_pass

This is the URL of the upstream server.

### proxy_ssl_trusted_certificate

This is the certificate used by OpenStack services. Since our OpenStack is using a self-signed certificate we have specified it under `proxy_ssl_trusted_certificate`. If we are using a certificate issued by a Certificate Authoriy we have to specify the certificate and key using `proxy_ssl_certificate` and `proxy_ssl_certificate_key`.

Now, we can add the configuration for all the services in [OpenStack]. 

{% highlight shell %}
#keystone
server{
    listen 35357;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:35357;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/openstack.crt;
    }
}

#nova
server{
    listen 8774;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8774;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/openstack.crt;
    }
}

#neutron
server{
    listen 9696;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:9696;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/openstack.crt;
    }
}

#heat
server{
    listen 8004;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8004;
        proxy_ssl_trusted_certificate /home/nginx/ssl_keys/openstack.crt;
    }
}

#cinder
server{
    listen 8776;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    client_max_body_size 0;
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8776;
        proxy_ssl_trusted_certificate /home/nginx/ssl_keys/openstack.crt;
    }
}

#glance
server{
    listen 9292;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key; 
    client_max_body_size 0;
    location / {
        proxy_pass https://openstack.dc1.telco.xy:9292;
        proxy_ssl_trusted_certificate /home/nginx/ssl_keys/openstack.crt;
    }
}

#cinder
server{
    listen 8776;
    ssl on;
    ssl_certificate /home/nginx/ssl_keys/proxy.cert;
    ssl_certificate_key /home/nginx/ssl_keys/proxy.key;
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8776;
        proxy_ssl_trusted_certificate /home/nginx/ssl_keys/openstack.crt;
    }

{% endhighlight %} 

Almost all the configurations are similar other that the server port numbers of the different OpenStack services.

However, there's an important additional configuration required for [Glance]. By defualt, [NGINX] is configured to check the size of the HTTP request and discard it, if the size exceeds 1M bytes. When uploading images via [Glance], the size of the HTTP requests exceeds this value, since it involves transferring large image files. Therefore, we have to set `client_max_body_size` parameter to `0` to disable the checking of HTTP request size, for the configuration of [Glance] service. Otherwise those request will not be passed to [Glance] service, and HTTP response 413 (Request Entity Too Large) would be sent to the client.

We added the `openstack` file under `sites-available` directory. Now we have to add a symbolic link in `sites-enabled` directory, to link to the `openstack` file in `sites-available`.

{% highlight shell %}
$ ln -s sites-available/openstack sites-enabled/openstack
{% endhighlight %} 

In a production OpenStack deployment, it is preferred to use a URL instead of IPs to access the APIs. If the URL is not configured in the DNS server in your network, add an entry in the `hosts` file on the server running [NGINX].

{% highlight shell %}
x.x.x.x openstack.dc1.telco.xy
{% endhighlight %} 

x.x.x.x is the IP address of your OpenStack service. In this setup all OpenStack services are configured in a single IP address, but be mindful that some OpenStack deployments could be using different URLs and IPs for different services.

# Restart NGINX

Once all configurations are done, check that NGINX configurations are correct.

{% highlight shell %}
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
{% endhighlight %} 

Now restart NGINX service:
{% highlight shell %}
$ sudo nginx -t
$ sudo systemctl restart nginx.service
{% endhighlight %} 

# Verify

Access Keystone via reverse proxy:

{% highlight shell %}
curl -k -i -X POST https://<reverse_proxy_ip>:35357/v2.0/tokens -H "Accept:application/json" -H "Content-Type:application/json" -d '
{
  "auth":{
    "tenantName": "test_tenant",
    "passwordCredentials": {
      "username": "tenant_user",
      "password": "abcd"
    }
  }
}
'
{% endhighlight %} 

If all went well, you will receive the response from Keystone, containing the token.

*[S-VNFM]: Specific VNF Manager

[NGINX]: https://www.NGINX.com/
[Keystone]: https://docs.openstack.org/keystone/latest/
[Glance]: https://docs.openstack.org/glance/latest/
[OpenStack]: https://www.openstack.org/