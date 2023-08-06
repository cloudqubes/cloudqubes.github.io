

Docker Deskto
Through UI

Docker CLI
Need to check

Docker Service
add file `/etc/systemd/system/docker.service.d/proxy.conf`
```shell
[Service]
Environment="HTTPS_PROXY=http://127.0.0.1:8001"
Environment="HTTP_PROXY=http://127.0.0.1:8001"
Environment="https_proxy=http://127.0.0.1:8001"
Environment="http_proxy=http://127.0.0.1:8001"
```

```shell
sudo systemctl daemon-reload 
sudo systemctl restart docker.service
```

https://medium.com/@bennyh/docker-and-proxy-88148a3f35f7