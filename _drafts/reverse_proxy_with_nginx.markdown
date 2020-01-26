---
layout: post
title:  "Reverse Proxy with Nginx"
date:   2020-01-18 05:48:00 +0530
categories: hands-on linux 
tags: nginx reverse-proxy
---

**Nginx is a popular, high performance web server, that can also be used as a reverse proxy. So what?**

The advent of NFV has brought in a challenging learning curve for telco engineers. The skills once confined to IT, are no longer. 

Nginx is a high performance web server, and is widely used in IT to power busy we applications. Additionally it can also perform as a reverse roxy. So What is a reverse proxy?

A reverse proxy is an intermediary server that sits in front of the web servers, receive requests from clients and forwards them to appropriate back-end web server. Unlike a proxy server that is on the clients network, the reverse proxy is located at the server network, probably behind a web application firewall.

Here is an example scenrio of using a reverse proxy. The URL mobile.myapp is sent to web server-1 which is dedicated for serving requests from mobile applications. The URL web.myapp.com is load balanced between web server-2 and web server-3. 

<image>

Nginx can also implement security by restricting client IP addresses from accessing servers.

So, how does all this relates to NFV?

<image>

Here we have used Nginx as a reverse proxy for accesing NFVO and OpenStack from multiple S-VNFMs. It can reduce the networking complexity and also provide security for our NFV infrastructure.

So let's see how to setup the rverse proxy with Nginx.

We are setting up Nginx in a VM running Ubuntu 18.04.

# Install Nginx

{% highlight shell %}
$ sudo apt-get update
$ sudo apt install nginx
{% endhighlight %} 

# Check Nginx status

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

We can see that Nginx service is running without any problems.

# Get OpenStack certificates

Production OpenStack always should be running on SSL, so you have to get the certificates configured in OpenStack environment. Again it could be a self-signed certificate or issued by a certificate authority, and accordingly the Nginx configuration will vary slightly. 

Copy the certificate to `/home/nginx/ssl_key/` so it also reside on the same directory as the Nginx config files.

# Certificate for Nginx

We are going to use a self-signed certificate for our reverse proxy server, so we use `openssl` to generate `.key` and `.cert`.

{% highlight shell %}
$ openssl req  -nodes -new -x509  -keyout proxy.key -out proxy.cert
{% endhighlight %} 


# Configure reverse proxy function

All Nginx configurations are located in `/etc/nginx`. The file names mentioned in this section are located in this, so only relative path is referred.

The web server information are located under `sites-available` directory. Let's create a new file `openstack` inside this directory and add our OpenStack configurations.

The proxy configurations in Nginx reside under `server` directive. Accordingly we have to add separate directives for each of the OpenStack services and NFVO.

This is the configuration for proxying the requests of `kestone` service.

{% highlight shell %}
#keystone
server{
    listen 35357;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:35357;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/cee/ctrl-ca.crt;
    }
}
{% endhighlight %} 

### listen
The `listen` directive specified server port for the OpenStack service, which is 35357 for keystone.

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

Now we have added the configuration for Keystone service. Similarly we can add the configuration for all the services in OpenStack. The complete configuration file `openstack` is below.

{% highlight shell %}
#keystone
server{
    listen 35357;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:35357;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/cee/ctrl-ca.crt;
    }
}

#nova
server{
    listen 8774;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8774;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/cee/ctrl-ca.crt;
    }
}

#neutron
server{
    listen 9696;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:9696;
        proxy_ssl_trusted_certificate /home/nginx/ssl_key/cee/ctrl-ca.crt;
    }
}

#heat
server{
    listen 8004;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    location / {
        proxy_pass https://openstack.dc1.telco.xy:8004;
        proxy_ssl_trusted_certificate /home/ubuntu/ssl_keys/atlas/ca.crt;
    }
}

#glance
server{
    listen 9292;
    ssl on;
    ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
    ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
    client_max_body_size 0;
    location / {
        client_max_body_size 0;
        proxy_pass https://openstack.dc1.telco.xy:9292;
        proxy_ssl_trusted_certificate /home/ubuntu/ssl_keys/atlas/ca.crt;
    }
}
{% endhighlight %} 

Almost all the configurations are similar other that the server port numbers.

Now we have added the `openstack` file under `sites-available` directory. Now add the symbolic link to `sites-enabled` directory.

{% highlight shell %}
$ ln -s sites-available/openstack sites-enabled/openstack
{% endhighlight %} 

