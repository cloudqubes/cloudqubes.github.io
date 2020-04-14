ubuntu@reverse-proxy-01:~/ansible$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:zU7+9SMxuFaFquLFqFX5i4UzD3D2ISxxrzstfpEUfbI ubuntu@reverse-proxy-01
The key's randomart image is:
+---[RSA 2048]----+
|            .    |
|           . o . |
|       . .  . =  |
|        +oo. E . |
|       oSB=o+ .  |
|        O+*=.+   |
|       o O=++ +  |
|      o..+O*.o o |
|     ...o+=o. . o|
+----[SHA256]-----+
ubuntu@reverse-proxy-01:~/ansible$


copy public key to remote server
ubuntu@reverse-proxy-01:~/ansible$ ssh-copy-id ubuntu@nginx-1.cloudqubes.com
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/ubuntu/.ssh/id_rsa.pub"
The authenticity of host 'nginx-1.cloudqubes.com (10.199.254.221)' can't be established.
ECDSA key fingerprint is SHA256:Jy28TYz35O1oLKan7yVo3fjQsS+I6EjAfLYcZjqD3kM.
Are you sure you want to continue connecting (yes/no)? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
ubuntu@nginx-1.cloudqubes.com's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'ubuntu@nginx-1.cloudqubes.com'"
and check to make sure that only the key(s) you wanted were added.

ubuntu@reverse-proxy-01:~/ansible$ ssh ubuntu@nginx-1.cloudqubes.com
