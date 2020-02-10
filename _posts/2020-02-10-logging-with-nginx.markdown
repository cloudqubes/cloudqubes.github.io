---
layout: post
title:  "Logging with NGINX"
date:   2020-02-10 05:56:00 +0530
categories: [hands-on, linux]
tags: [NGINX reverse-proxy openstack logging]
---

**Placing a reverse proxy in front of OpenStack is a sensible choice. Let's see why?**

In a previous post we setup a reverse proxy with NGINX, for talking to OpenStack API endpoints from our S-VNFMs. If we are to get our hands dirty in any type of API integration, especially with OpenStack,  troubleshooting is inevitable. 

Although OpenStack implement comprehensive logging features, those logs are usually distributed across different locations in OpenStack controller nodes, so our reverse proxy would serve as the ideal central location for collecting all API logs.

NGINX is equipped with a dedicated module, [ngx_http_log_module] for logging HTTP requests. With just two directives in NGINX config, we can start logging all our API requests.

## log_format
The `log_format` directive defines the format of the log file. It takes the form 'log_format <format_name> format_string;`. Here's a sample configuration, which we include within the `http` context in the main configuration file `nginx.conf'

{% highlight shell %}
log_format brief_log '$time_local, $remote_addr, $server_port, $request, status: $status;'

log_format detailed_log '$time_local, $remote_addr, $server_port, $request, status: $status, req_body: $request_body';
{% endhighlight %} 

The `format_string` defines the format of the log file as a string. The strings proceeded by `$` are the variables in NGINX, and the available variables can be found at [log_format] and [variable_index] in NGINX documentation.

The `log_format` directive must always be included within the `http` context. 

## access_log

`access_log` defines where to write our log files. We can place this directive within `http` or `server` contexts. NGINX log files are written immediately after a request is processed, so what is placed in `server` context takes priority.

We are using a dummy python app, to test our logging function. The Python app is listening on port 5000 and we have configured 5001 as the reverse proxy port.

{% highlight shell %}
#python app
server{
    listen 5001;
    client_max_body_size 0;
    
    access_log /var/log/nginx/access_myapp.log detailed_log;
    location / {
        proxy_pass http://127.0.0.1:5000;
    }
}
{% endhighlight %} 

Use curl to issue HTTP request:

{% highlight shell %}
curl -X POST http://127.0.0.1:5001/long_request -d '""param1": "value"'
{% endhighlight %} 

Check the log file:

{% highlight shell %}
$ cat /var/log/nginx/access_myapp.log
05/Feb/2020:13:46:27 +0000, 127.0.0.1, 5001, POST /long_request HTTP/1.1, status: 200, req_body: \x22\x22param1\x22: \x22value\x22
{% endhighlight %} 

You may notice that that `x22` (unicode value) is used to escape the quotation mark. For OpenStack APIs with a lot of parameters in `json` format this would make our log file unreadable.

So, we will update the `log_format` as below.

{% highlight shell %}
log_format detailed_log escape=none '$time_local, $remote_addr, $server_port, $request, status: $status, req_body: $request_body';
{% endhighlight %} 

Check the log file again.

{% highlight shell %}
$ cat /var/log/nginx/access_myapp.log
05/Feb/2020:13:46:27 +0000, 127.0.0.1, 5001, POST /long_request HTTP/1.1, status: 200, req_body: \x22\x22param1\x22: \x22value\x22
05/Feb/2020:13:54:49 +0000, 127.0.0.1, 5001, POST /long_request HTTP/1.1, status: 200, req_body: ""param1": "value"
{% endhighlight %} 

In this post we configured logging function in NGINX server. Although we used a dummy Python app to test our configurations, you could easily apply the concepts to enable logging for your OpenStack configurations.

We this information would make life easier in your NFV journey.

[ngx_http_log_module]:  http://nginx.org/en/docs/http/ngx_http_log_module.html
[log_format]: http://nginx.org/en/docs/http/ngx_http_log_module.html#log_format
[variable_index]: http://nginx.org/en/docs/varindex.html
