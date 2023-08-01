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

Create a new folder in your development workstation and create these three files.

counter.go
```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
)

// Global variable for counter
var count int

func countUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	count = count + 1
	json.NewEncoder(w).Encode(count)
}

func countDown(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	count = count - 1
	json.NewEncoder(w).Encode(count)
}

func main() {
	http.HandleFunc("/count-up", countUp)
	http.HandleFunc("/count-down", countDown)

	fmt.Printf("Starting server on port 9000\n")
	count = 0
	fmt.Printf("Counter :%d\n", count)
	err := http.ListenAndServe(":9000", nil)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("Shutting down server\n")
	} else if err != nil {
		fmt.Printf("Cannot start server :%s\n", err)
		os.Exit(1)
	}
}
```
//todo add the go.mod and Dockerfile


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
git init
git add .
git commit -m "initial"
git remote add origin git@10.129.204.148:/srv/git/counter-app.git
git push -u origin master
```

## Create a SSH private key for `jenkins` user.

We want our Jenkins server to be able to access this git repository. We'll do so by creating an SSH key.
Login to the Jenkins VM via SSH and create a private key for the `jenkins` user.

Switch to the `jenkins` user.  
Note that `jenkins` is a service account so it is not have a default shell so we specifiy it via `-s`
```shell
sudo su -s /bin/bash jenkins
```

Create SSH Key pair.
```
ssh-keygen
```
Note that keys will be stored in `/var/lib/jenkins/.ssh/` as you can check from the output.

Copy the keys to our git server.
```shell
ssh-copy-id /var/lib/jenkins/.ssh/id_rsa.pub git@10.129.204.148
```

In this step you will also be adding the key fingerprint to `/var/lib/jenkins/.ssh/known_hosts`. 

Verify SSH access.
```shell
ssh -i /var/lib/jenkins/.ssh/id_rsa git@10.129.204.148
```

Copy the SSH key private key.
```shell
cat /var/lib/jenkins/.ssh/id_rsa
```

Keep this ready as you will need it in the next step.

## Create the Jenkins project
In the Jenkins dashboard page clikc on `New item` at the top right to create a new project. 

![Creating the Counter-app Pipeline](/assets/images/jenkins/counter-app-pipeline-1.png){: width="100%" }
*Creating the Counter-app Pipeline*

Select `Pipeline` and give name as `counter-app` and click `OK`.


In the next page, scroll down to the Pipeline section.

![Pipeline definition](/assets/images/jenkins/counter-app-pipeline-2.png){: width="100%" }
*Pipeline definition*

In the Definition filed, select `Pipeline script from SCM` to indicate Jenkins to extract the Jenkinsfile from the git repo.
Select Git in the SCM field.

In the repository URL enter `git remote add origin git@10.129.204.148:/srv/git/counter-app.git`.

Next, we need to provide the credentials for Jenikins server to access our repository. Click `Add` under the credentials field.

Select `SSH Username with private key` as the kind.

Type in `git` in the username field.

![Git server credentials](/assets/images/jenkins/counter-app-pipeline-credentials.png){: width="100%" }
*Git server credentials*

Under `private key` select `Enter directly` and copy paste the SSH private key that we created in the Jenkins server in the previous section. Then click `Add`.

![Git server credentials - private key](/assets/images/jenkins/counter-app-pipeline-credentials-2.png){: width="100%" }
*Git server credentials - private key*

In the branches filed select `*/master` as the branch to build.

Click `Save` to create the Pipeline.

# Updating the Jenkins file

Our `Jenkinsfile` is still a dummy. We need to update it with the real world build steps.


