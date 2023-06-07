



## Install Git server

### Install Git core

```shell
$ sudo apt-get install git-core
```

### Create user

```shell
$ sudo useradd git
$ sudo passwd git
```

Type in `git123` for the password.
Enable SSH key-based authentication for passwordless entry.


### Create a project directory

```shell
$ mkdir cloudqubes.git
```

### Install Jenkins
Configure GPG key.

```shell
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee     /usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

Add Jenkin repos.
```shell
$  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Install Jenkins
```shell
$ sudo apt-get update
$ sudo apt-get install fontconfig openjdk-11-jre
$ sudo apt-get install jenkins
```