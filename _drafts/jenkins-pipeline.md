---
layout: post
title:  "What is Jenkins and what can I do with it"
description: > 
  How to use Jenkins to build a CI/CD pipeline.
image: "jenkins/jenkins-cover.png"
date:   2023-07-23 05:50:00 +0530
categories: [hands-on]
tags: [DevOps]
---


# Prerequisites

Install Java
```shell
sudo apt-get install openjdk-11-jre
```

# Install Jenkins

Configure GPG key.

```shell
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee     /usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

Add Jenkin repos.
```shell
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Install Jenkins
```shell
sudo apt-get update
sudo apt-get install jenkins
```

Start Jenkins
```shell
systemctl start jenkins.service
```

At the installation, Jenkins creates the initial password for the admin user.
```shell
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Copy this to clipboard as we need it in the next step.

Point the browser to `http://172.0.0.1:8080` for Jenkins web UI.

![Unlock Jenkins](/assets/images/jenkins/jenkins-unlock.png){: width="100%" }
*Unlock Jenkins*

Enter the admin password we copied earlier.

Install plugins.
![Unlock Jenkins](/assets/images/jenkins/jenkins-install-plugins.png){: width="100%" }
*Unlock Jenkins*

Create admin user. (cloudqubes, )

Safe restart


