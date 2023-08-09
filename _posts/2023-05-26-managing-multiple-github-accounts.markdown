---
layout: post
title:  "How to manage multiple GitHub accounts in a single workstation"
subtitle: > 
  Using SSH key-based authentication and SSH config file, you can easily push code from multiple GitHub accounts in the same computer.
date:   2023-05-26 06:00:00 +0530
image: multiple-github-cover.png
categories: [recipe]
tags: [Linux]
---

<div class="header-highlight">
Using SSH key-based authentication and SSH config file, you can push code from multiple GitHub accounts in the same computer.
</div>


You have two GitHub accounts.

You want to `git push` from each account to different GitHub repos.

Unfortunately, that's not possible with the default HTTP authentication.

Here's a simple 4-step solution to set up SSH key-based authentication, and you push code from any number of GitHub accounts.


### #1 Create SSH keys

Create two new SSH keys.

```shell
$ mkdir ~/.ssh/github_keys
$ ssh-keygen -f ~/.ssh/github_keys/git-personal
$ ssh-keygen -f ~/.ssh/github_keys/git-work
```


### #2 Configure SSH Keys in GitHub accounts

Sign in to the personal GitHub account. Click on the profile icon in the top right and click on `Settings`.

Click on the `SSH and GPG Keys`.

![Add new SSH key](/assets/images/multiple-github-accounts/github-ssh-keys.png){: width="100%" }
*Add new SSH Key*

Click on `New SSH Key`.

Print the public key `git-personal.pub` and copy the output to clipboard.

```shell
$ cat .ssh/github_keys/g-personal.pub
```

Paste the public key in the `key` field and click on 'Add SSH Key`.
![Add new SSH key](/assets/images/multiple-github-accounts/add-new-ssh-key.png){: width="100%" }
*Add new SSH Key*

Repeat the same for the other GitHub account using the `git-work.pub` key.

### #3 Update the SSH Config file

Create file `~/.ssh/config`, if you don't have it already, and add the following lines.

```shell
Host github_personal
	Hostname github.com
	User git
	IdentityFile ~/.ssh/github_keys/git-personal
Host github_work
	Hostname github.com
	User git
	IdentityFile ~/.ssh/github_keys/git-work
```

### #4 Push code to GitHub

Sign in to your personal GitHub account and create a new repository `peronal_app`.

In your computer, create folder `personal_app` and add the `README.md` file.

```shell
$ mkdir personal_app
$ cd personal_app 
$ echo "This is a test repository" >> README.md
$ git init
$ git add README.md 
```

Configure local email and username for the repository.

```shell
$ git config --local user.email "yourname@gmail.com"
$ git config --local user.name "yourname"
```

Commit code.

```shell
$ git commit -m "test commit"
$ git branch -M main
```

Here's the crucial step. 

We must configure the URL of the repository referring to the `Host` we configured in the SSH config file.

The SSH URL of your repository is `git@github.com:yourname/personal_app.git`. Replace `git@github` with `github_personal` and configure the remote URL of the repository.

Make sure to replace `yourname` also with your correct GitHub username.

```shell
$ git remote add origin github_personal:yourname/personal_app.git
```

You can now push code to GitHub from your personal account.

```shell
$ git push -u origin main
```

Since we configured the remote URL as `github_personal:yourname/personal_app.git` the `git` client refers to this corresponding `Host` in the SSH config file and use `git-personal` key for authentication. 

```shell
Host github_personal
	Hostname github.com
	User git
	IdentityFile ~/.ssh/github_keys/git-personal
...
```

### Pushing code from the work account

Create new repository in GitHub, and add the `README.md` file in the local directory same as the previous.

Configure the local email and username.

```shell
$ git config --local user.email "your-work-name@workplace.com"
$ git config --local user.name "your-work-name"
```

The remote URL of the repository must refer to `github_work` we used in the SSH config file.

```shell
$ git remote add origin github_work:your-work-name/work_app.git
```

You can push this repository to GitHub from your work account now.

```shell
$ git push -u origin main
```

You can work with any number of GitHub accounts using this method.

### Updating an existing repository 

For existing repositories, change the remote URL to use SSH authentication.

The remote URL is configured in the `.git/config` file inside your repository. 

```shell
...
[remote "origin"]
	url = https://github.com/cloudqubes/your-work-name/work_app.git
...
``` 

Open this file in any existing local repository and update the URL according to the GitHub account you wish to use.

Also, you may have to update the `name` and `email` fields in the same file.
Then, the git client will use SSH authentication for this repository whenever you use `git push`.

Here's a sample config file for a a repository in your work account.

```shell
...
[remote "origin"]
	url = github_work:your-work-name/another_work_app.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
[user]
	email = your-work-name@workplace.com
	name = your-work-name
```

## Cloning a repository

When cloning an existing repository, change the URL to refer the `Host` in SSH config file.

To clone repository `https://github.com/your-work-name/another_work_app.git` substitue `https://github.com/` with `github_work:` like this.

```shell
$ git clone github_work:your-work-name/another_work_app.git
```

## Wrapping up

We have tested this method in Mac and Linux. Windows 10 PowerShel also supports SSH config file. So, it should work on Windows 10 as well.

SSH key-based authentication is easier than the default HTTP authentication because you don't have to type in passwords everytime you use `git push`.

So, give it a try.

Leave a comment if you faced any issues.

