
If you have multiple github accounts and using the same laptop to commit code, you already know the problem.

If you don't, check it out here.



 say one for your office and another for personal use you may have found that commiting code from those separate accounts is cumbersome. Git always seems to default to the initially configured user account.

To overcome this problem, you can use SSH to access GitHub. 

### Configure SSH keys in GitHub account

Go to `profile > Settings`.


Generate new SSH keys in my laptop.

```shell
indika@indikas-MacBook-Pro ~ % ssh-keygen 
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/indika/.ssh/id_rsa): /Users/indika/.ssh/my_keys/g-personal
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/indika/.ssh/my_keys/g-personal
Your public key has been saved in /Users/indika/.ssh/my_keys/g-personal.pub
The key fingerprint is:
SHA256:Y4/VZIeXLr6eBkWvWL0o4STVzwFYrWytstRYLdM0SSg indika@indikas-MacBook-Pro.local
The key's randomart image is:
+---[RSA 3072]----+
|           +o=.. |
|          E +.*. |
|         . ++@+o |
|        . o+X+O  |
|        S+.Xo*.. |
|       . =O.=..  |
|        ...=.    |
|          . .o   |
|           o+    |
+----[SHA256]-----+
indika@indikas-MacBook-Pro ~ % ls -l .ssh/my_keys
-rw-------  1 indika  staff  2622 May 25 02:32 g-personal
-rw-r--r--  1 indika  staff   586 May 25 02:32 g-personal.pub
```

Print the public key and copy the output to clipboard.
```shell
indika@indikas-MacBook-Pro ~ % cat .ssh/my_keys/g-personal.pub
```

Paste the public key.
![Add new SSH key](/assets/images/multiple-github-accounts/add-new-ssh-key.png)
*Add new SSH Key*

Now, we have the SSH key configured.
![Configured SSH key](/assets/images/multiple-github-accounts/added-key.png)
*Configured SSH Key*

### Setup the SSH keys in your laptop

Create file `.ssh/config`, if you don't have it already, and add the following lines.
```shell
Host github_personal
	Hostname github.com
	User git
	IdentityFile ~/.ssh/my_keys/g-personal
```

### Repeat the same for the other account

Only change the name in the `.ssh/config`
```shell
Host github_cloudqubes
	Hostname github.com
	User git
	IdentityFile ~/.ssh/my_keys/g-cloudqubes
```



### Create a repo and commit code.

Create a new repository at 

A GitHub repo is accessible via either SSH or HTTPS. By default, the git client uses HTTP to access the repository.
```shell
indika@indikas-MacBook-Pro projects % mkdir personal_app
indika@indikas-MacBook-Pro projects % cd personal_app 
indika@indikas-MacBook-Pro personal_app % echo "This is a test repository" >> README.md
indika@indikas-MacBook-Pro personal_app % git init
indika@indikas-MacBook-Pro personal_app % git add README.md 
```
Configure local username and email

```shell
ubuntu@kube:~/personal_app$ git config --local user.email "indikaimk@gmail.com"
ubuntu@kube:~/personal_app$ git config --local user.name "indikaimk
```

Commit code

```shell
indika@indikas-MacBook-Pro personal_app % git commit -m "test commit"
[master (root-commit) 33324e6] test commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
indika@indikas-MacBook-Pro personal_app % git branch -M main
indika@indikas-MacBook-Pro personal_app % git remote add origin github_personal:indikaimk/personal_app.git
indika@indikas-MacBook-Pro personal_app % git push -u origin main

```

Repeat for the other user account. Remember to update the correct URL.



