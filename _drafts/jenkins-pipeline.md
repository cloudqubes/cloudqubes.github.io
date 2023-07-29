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

Change the default port (Optional)
By default, Jenkins listens on port 8080 on the server. I am using this port for another service, so I change the port to 8002.

Jenkins seems to store the configuration files in different locations in different Linux distributions. In Ubuntu there are two places that refer the port number. So, let's update both place.

Update the `HTTP_PORT` parameter in `/etc/default/jenkins`. 
```shell
HTTP_PORT=8002
```

Update the `JENKINS_PORT` in `usr/lib/systemd/system/jenkins.service`
```shell
Environment="JENKINS_PORT=8002"
```

Since we changed a Systemd config file we nee to reload the Systemd configurations as well.

```shell
sudo systemctl daemon-reload
```

Start Jenkins (or restart if it has laready been running.)
```shell
systemctl start jenkins.service
```

At the installation, Jenkins creates the initial password for the admin user.
```shell
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Copy this to clipboard as we need it in the next step.

Point the browser to `http://172.0.0.1:8002` (use the correct port number) for Jenkins web UI.

![Unlock Jenkins](/assets/images/jenkins/jenkins-unlock.png){: width="100%" }
*Unlock Jenkins*

Enter the admin password we copied earlier.

Install plugins.
![Install plugins](/assets/images/jenkins/jenkins-install-plugins.png){: width="100%" }
*Install plugins*
You can either select and install plugins or let Jenkins install the suggested plugins.

Then, Jenkind will prompt you to create admin user. We use `cloudqubes` as the username. Use a preferred username and give a password as well.

![Create admin user](/assets/images/jenkins/jenkins-create-admin-user.png){: width="100%" }
*Create admin user*

When the Getting started wizard is over you will get the Jenkins Dashboard.

![Jenkins dashboard](/assets/images/jenkins/jenkins-dashboard.png){: width="100%" }
*Jenkins dashboard*

We want to create a CI/CD pipeline for a Go Lang application. So make sure the plugins are installed. In the dash board, click on Manage Jenkins then click on Manage Plugins.


![Jenkins available plugins](/assets/images/jenkins/jenkins-available-plugins.png){: width="100%" }
*Jenkins available plugins*

Select and install `Go Plugin`, `Git plugin`, `Pipeline`.

Once plugins are installed, restart Jenkins.
Go to `http://127.0.0.1:8002/restart` and clikc on the `Yes` button.
Within one minute restart will complete and you'll be redirected to the dashboard.

# Jenkins Pipeline
A CI/CD pipeline is a collection of software components that work to bring software from the developers workstations to edliver to th end users, 
Jenkins implement CI/CD pipelines via plugins. 

The set of software is not just enough to make up a CI/CD pipeline. We must instruct the softwaer what to do. This is provided via JenKinsFile.

Let's create a mock JenkinsFile first.

Click on the `New item` in the top left hand corner in the Jenkins dashboard.

Select `Pipeline`, give name as `first_pipelin' and click `OK`.

![Creating the first Pipeline](/assets/images/jenkins/jenkins-first-pipeline.png){: width="100%" }
*Creating the first Pipeline*

Scroll to the bottom and enter this is the definition textarea and clikc `Save`.

```shell
pipeline {
  agent any

  stages {
    stage('Test') {
      steps {
        echo 'This is my first pipeline'
      }
    }
  }
}
```

Go to the Jenkins dashboard and we can see the pipline we just created.

![First Pipeline](/assets/images/jenkins/jenkins-dashboard-first-pipeline.png){: width="100%" }
*First Pipeline*

Run the Pipeline by clicking on the small arrow in the right end of the pipeline. It will run the Pipeline in the background.

Click on the PipeLine name in the dashboard to get a detailed view of the Pipeline.

![Pipeline detailed view](/assets/images/jenkins/jenkins-pipeline-detailed-view.png){: width="100%" }
*Pipeline detailed view*

The build histoty at the bottom left shows the history of running the task. Since we ran our taks only once, we have one entry here. 

run the task again by clicking on hthe `Build now` in the right panel and you will get one more entry in the build history.

![Pipeline build history](/assets/images/jenkins/jenkins-pipeline-build-history.png){: width="100%" }
*Pipeline build history*

Click the first entry in the build histroy and click on the `Console output` in the left panel. We can see the 

![Pipeline build history](/assets/images/jenkins/jenkins-pipeline-cosole-output.png){: width="100%" }
*Pipeline build history*

# Creating a Jenkins Pipeline for a Go Lang project

## Creating the git repo

Go to your Git repository server and create a new git repositoty.

```shell
su git
cd /srv/git
mkdir number-crunch.git
cd number-crunch.git
git init --bare
```

Clone the repo number-crunch to your local machine and update the remote URL to point to the private git repo.

```shell
git clone git@github.com:cloudqubes/number-crunch.git
git remote set-url origin git@10.129.204.148:/srv/git/number-crunch.git
```

Add a dummy Jenkins file.
```shell
pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
      }
    }
    stage('Test') {
      steps {
        echo 'Testing..'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying....'
      }
    }
  }
}
```

Commit the repo to our private Git server.

```shell

```


In the Jenkins dashboard page clikc on `New item` at the top right to create a new project. 

![Creating the Number-crunch Pipeline](/assets/images/jenkins/number-crunch-pipeline-1.png){: width="100%" }
*Creating the Number-crunch Pipeline*

