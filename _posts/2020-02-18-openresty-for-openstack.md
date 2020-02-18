---
layout: post
title:  "OpenResty for OpenStack"
date:   2020-02-18 14:20:00 +0530
categories: [hands-on, openstack]
tags: [linux, openstack, openresty, API]
---

**OpenResty is a web platform based on NGINX. So, our NGINX reverse proxy can be replaced with OpenResty.**

We have setup a [reverse proxy]({% post_url 2020-01-30-setting-up-an-nginx-reverse-proxy-for-openstack %}) with [NGINX] for OpenStack APIs, and [configured logging]({% post_url 2020-01-30-setting-up-an-nginx-reverse-proxy-for-openstack %}) also becasuse logs are an essential part of troubleshooting.

But, there's a limitation in our setup. [NGINX] log module cannot read the HTTP response body. While this may be acceptable for most web applications, for an OpenStack integration, the ability to log the total HTTP message body could save you from a lot of guess work.

This is where [OpenResty] comes to help. [OpenResty] is a web platform that integrates [NGINX] and [LuaJIT]. [OpenResty] also includes [ngx_http_lua_module], which implements many advanced functions for manipulating HTTP requests and responses. So, let's get started.

# Install OpenResty

If you have [NGINX] already installed, you have to disable it first.

{% highlight shell %}
$ sudo systemctl disable nginx.service
$ sudo systemctl stop nginx.service
{% endhighlight %} 

We are using [Ubuntu] 18.04, and [OpenResty] is not availale there in the standard repositories, so we have to use repositories provided by [OpenResty]. 

{% highlight shell %}
$ sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
$ wget -O - https://openresty.org/package/pubkey.gpg | sudo apt-key add -
$ sudo apt-get -y install --no-install-recommends software-properties-common
$ sudo add-apt-repository -y "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main"
$ sudo apt-get update
$ sudo apt-get -y install openresty
{% endhighlight %}

# Configure reverse proxy

[OpenResty] configurations are stored in `/usr/local/openresty/nginx/conf`. The `nginx.conf` file holds all the configurations, and follows the same pattern as [NGINX] configurations. 

For each OpenStack service we add a `server` contex within `http` context. Here is the configuration for [Keystone] service. Note the configuration frome line 6 to 13, which copies the contents of HTTP response body to a variable.

{% highlight shell linenos %}
    server{
        listen 35357 ssl;
        ssl_certificate /home/ubuntu/ssl_keys/proxy.cert;
        ssl_certificate_key /home/ubuntu/ssl_keys/proxy.key; 
        lua_need_request_body on;
        set $resp_body "";
        body_filter_by_lua '
            local resp_body = string.sub(ngx.arg[1], 1, 10000)
            ngx.ctx.buffered = (ngx.ctx.buffered or "") .. resp_body
            if ngx.arg[2] then
                ngx.var.resp_body = ngx.ctx.buffered
            end
        ';
        location / {
            proxy_pass https://openstack.dc1.telco.xy:35357;
            proxy_ssl_trusted_certificate /home/ubuntu/ssl_key/cee/openstack.crt;
        }
    }
{% endhighlight %} 

Similarly, you have to add the configurations for all other [OpenStack] services. Then the variable `$resp_body` will be available for `log_format` in `http` contex.

{% highlight shell %}
    log_format  long_format escape=none  '$remote_addr - $server_port - $remote_user [$time_local] - $status - "$request" '
                     '$body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for" req_body:"$request_body" resp_body:"$resp_body"';

    access_log  logs/access.log  long_format;
{% endhighlight %} 

# Apply the configurations

Test the new configurations:
{% highlight shell %}
$ sudo openresty -t
{% endhighlight %} 

If the test is successful, restart [OpenResty] service for the new configurations to be effective.
{% highlight shell %}
$ sudo systemctl restart openresty.service
{% endhighlight %} 

Initiate few API requests, and check the log file at `/usr/local/openresty/nginx/logs` to verify our new log format. 

This post described the basic usage of [OpenResty] as a reverse proxy for [OpenStack]. In a future post we will explore about access restrictions that can be applied by the reverse proxy.

[NGINX]: https://www.nginx.com/
[OpenResty]: https://openresty.org/en/
[LuaJIT]: https://github.com/openresty/luajit2
[ngx_http_lua_module]: https://github.com/openresty/lua-nginx-module
[Ubuntu]: https://ubuntu.com/
[OpenStack]: https://www.openstack.org/
[Keystone]: https://docs.openstack.org/keystone/latest/