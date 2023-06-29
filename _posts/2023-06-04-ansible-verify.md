---
layout: post
title:  "How to use Ansible for verifying configurations"
subtitle: > 
  You are already using Ansible for configuring Linux servers. Here's how to use Ansible for verifing configurations.
date:   2023-06-11 05:50:00 +0530
categories: [recipe]
tags: [Linux]
---

<div class="header-highlight">
You are already using Ansible for configuring Linux servers. Here's how to use Ansible for verifing configurations.
</div>

Ansible is a handy tool for configuration management.

Sometimes, you want to verify configurations without actually changing. You can do that with Ansible `assert` module.

The `assert` module can evaluate Jinja2 expressions. Coupled with Ansible variable assignment, you can write Ansible playbooks to check for specific configuration parameters.

# How to use Ansible assert

The `assert` module accepts three main parameters.
```yaml
  - name: task name
    ansible.builtin.assert:
      that: 
      - "condition"
      success_msg: "Success message"
      fail_msg: "Fail message" 
```

The parameter `that` is a list of Jinja2 expressions. 

The task prints the `success_msg` if all the expressions are evaluated true or `fail_msg` if any expression is false.

To build the Jinja2 expressions we can use Ansible variables.

# Registering variables

An Ansible task is an invocation of an Ansible module which returns a value. The `register` keyword stores this value in memory and makes it available for subsequent tasks.

```yaml
- name: list files
  ansible.builtin.command:
    cmd: ls -k /home/ubuntu
  register: cmd_ls
```

The `list files` task invokes the module `cmd` which executes the Linux command `ls -k /home/ubuntu`. The task stores the return value in the variable `cmd_ls`. Any task that comes below this task in the play, can refer the variable `cmd_ls`.

Let's inspect the variable using the `debug` module.

```yaml
- name: debug cmd_ls
  ansible.builtin.debug:
    var: cmd_ls
```
The complete playbook `variable-test.yml` is available in [ansible_assert] GitHub repository. Clone the repo and run the playbook to check the output.

```shell
TASK [debug cmd_ls] ********************************************************************************************************************************************************************************
ok: [740-1-k8s1] => {
    "cmd_ls": {
        "changed": true,
        "cmd": [
            "ls",
            "-k",
            "/home/ubuntu"
        ],
        "delta": "0:00:00.005862",
        "end": "2023-06-10 15:00:20.355971",
        "failed": false,
        "msg": "",
        "rc": 0,
        "start": "2023-06-10 15:00:20.350109",
        "stderr": "",
        "stderr_lines": [],
        "stdout": "my_file\ntest_file",
        "stdout_lines": [
            "my_file",
            "test_file"
        ]
    }
}
```

As you can see from this output, the return value of the `cmd` module is a Python dictionary.

Most Ansible modules return a similar data structure. You can use the keys and valuse in this data structure for building the Jinja2 expressions for `that` parameter in the `assert` module.



# Usecases

Let's see some usecases for verifying configurations with Ansible `assert`.

## Check the existence of a file

The module `stat` can retrieve status of files and directories.

This task retrieves the status of `test_file` in the user's home directory.

```yaml
- name: Get status of test_file
  ansible.builtin.stat:
    path: /home/ubuntu/test_file
  register: test_file_1
```

Inspect the contents of the `test_file_1` variable with debug.

```yaml
  - name: debug test_file_1
    ansible.builtin.debug:
      var: test_file_1
```

Task output.
```shell
TASK [debug test_file_1] ***************************************************************************************************************************************************************************
ok: [740-1-k8s1] => {
    "test_file_1": {
        "changed": false,
        "failed": false,
        "stat": {
            "atime": 1686121585.736978,
            "attr_flags": "e",
            "attributes": [
                "extents"
            ],
            "block_size": 4096,
            "blocks": 8,
            "charset": "us-ascii",
            "checksum": "6f2170a833122bdfb8382742c2ca693a36c3ac58",
            "ctime": 1685828081.3049781,
            "dev": 2049,
            "device_type": 0,
            "executable": false,
            "exists": true,
            "gid": 1000,
            "gr_name": "ubuntu",
            "inode": 258118,
            "isblk": false,
            "ischr": false,
            "isdir": false,
            "isfifo": false,
            "isgid": false,
            "islnk": false,
            "isreg": true,
            "issock": false,
            "isuid": false,
            "mimetype": "text/plain",
            "mode": "0664",
            "mtime": 1685828081.3049781,
            "nlink": 1,
            "path": "/home/ubuntu/test_file",
            "pw_name": "ubuntu",
            "readable": true,
            "rgrp": true,
            "roth": true,
            "rusr": true,
            "size": 45,
            "uid": 1000,
            "version": "1457468022",
            "wgrp": true,
            "woth": false,
            "writeable": true,
            "wusr": true,
            "xgrp": false,
            "xoth": false,
            "xusr": false
        }
    }
}
```

The `stat` module returns a range of key-value pairs that represent multiple parameters about the file. Some keys are self explanatory. Refer the [Stat module docs][stat-docs] for interpretation of the others.

Here are three usefule keys and how to use them in Jinja2 expressions in `assert` module.

The `exists` key is a boolean representation of the existence of the file.

```yaml
- name: assert test_file exists
  ansible.builtin.assert:
    that: 
    - "test_file.stat.exists"
    success_msg: "OK: test_file exists"
    fail_msg: "NOK: test_file does not exists"
```

The `pw_name` key holds the username of the owner. We will check whether the value equals `ubuntu`.

```yaml
  - name: assert test_file owner username is ubuntu
    ansible.builtin.assert:
      that: 
      - "test_file.stat.pw_name == 'ubuntu'"
      success_msg: "OK: test_file owner is ubuntu"
      fail_msg: "NOK: test_file owner is not ubuntu"
```

The `gr_name` key holds the group name of owner and here's how we check whether the owner does not belong to the `root` user group.

```yaml
  - name: assert test_file owner group name is not root
    ansible.builtin.assert:
      that: 
      - "test_file.stat.gr_name != 'root'"
      success_msg: "OK: test_file owner group is not root"
      fail_msg: "NOK: test_file owner group is root"
```

Create the file `/home/ubuntu/test_file` and run the playbook `file-check.yml` in the [ansible_assert] to see the output.

## Check the contents of a file

The Ansible module `command` can run Linux commands.
Let's run `cat` command with the `test_file` and inpect the contents.

```yaml
  - name: cat test_file
    ansible.builtin.command:
      cmd: cat /home/ubuntu/test_file
    register: test_file
```

Here's the debug output of the `test_file.
```yaml
TASK [debug test_file] *****************************************************************************************************************************************************************************
ok: [740-1-k8s1] => {
    "test_file": {
        "changed": true,
        "cmd": [
            "cat",
            "/home/ubuntu/test_file"
        ],
        "delta": "0:00:00.005361",
        "end": "2023-06-07 07:32:53.087623",
        "failed": false,
        "msg": "",
        "rc": 0,
        "start": "2023-06-07 07:32:53.082262",
        "stderr": "",
        "stderr_lines": [],
        "stdout": "test_string\nnew string\nThis string is in fil",
        "stdout_lines": [
            "test_string",
            "new string",
            "This string is in fil"
        ]
    }
}

```

The `test_file.stdout` contains the output of the `cat` command.
We can use it in Jinja2 expressions to check the contents of the file.

```yaml
  - name: assert line in file
    ansible.builtin.assert:
      that: 
      - "'This string is in file' in test_file.stdout"
      success_msg: "OK: String is in file"
      fail_msg: "NOK: String is not in file"

  - name: assert line not in file
    ansible.builtin.assert:
      that: 
      - "'This string is not in file' not in test_file.stdout"
      success_msg: "OK: String is not in file"
      fail_msg: "NOK: String is in file
```

Refer `file-content-check.yml` in the [ansible_assert] for the complete playbook. 

## Check the status of a service

The module `ansible.builtin.service_facts` can rerieve information related to services and store them in `ansible_facts.services` variable.

```yaml
  - name: Populate service facts
    ansible.builtin.service_facts:
```

Let's print the `ansible_facts.services` to see what it contains.

```yaml
- name: Print service facts
  ansible.builtin.debug:
    var: ansible_facts.services
```

We get a list of the services installed in the target system.

Note that a part of the output is omitted for brevity.

```shell
TASK [Print service facts] *************************************************************************************************************************************************************************
ok: [740-1-k8s1] => {
    "ansible_facts.services": {
        "ModemManager.service": {
            "name": "ModemManager.service",
            "source": "systemd",
            "state": "running",
            "status": "enabled"
        },
        "NetworkManager.service": {
            "name": "NetworkManager.service",
            "source": "systemd",
            "state": "stopped",
            "status": "not-found"
        },
        "accounts-daemon.service": {
            "name": "accounts-daemon.service",
            "source": "systemd",
            "state": "running",
            "status": "enabled"
        },
        "apparmor": {
            "name": "apparmor",
            "source": "sysv",
            "state": "running"
        },
...
```


Check whether `apparmor` service is running.
```yaml
  - name: assert apparmor is running
    ansible.builtin.assert:
      that: 
      - "ansible_facts.services.apparmor.state == 'running'"
      success_msg: "OK: apparmor is running"
      fail_msg: "NOK: apparmor is not running"
```

Some service names hava a dot notation such as `ssh.service`.
For accessing such keys use the Python array notations - single quoted key within square brackets.

```yaml
  - name: assert ssh.service is running
    ansible.builtin.assert:
      that: 
      - "ansible_facts.services['ssh.service'].state == 'running'"
      success_msg: "OK: ssh.service is running"
      fail_msg: "NOK: ssh.service is not running"
```

Run the playbook `service-check.yml` in the [ansible_assert] to see the output.

### Check the status of a kernel module

Ansible does not have a module for checking status of Linux kernel modules. But, we can use the `command` module to get output of `lsmod` and analyze.

```yaml
  - name: List loaded kernel modules
    ansible.builtin.command:
      cmd: "lsmod"
    register: loaded_modules
```
Checking the `ip_tables` module status.

```yaml
  - name: Check iptables is loaded
    ansible.builtin.assert:
      that:
      - "'ip_tables' in loaded_modules.stdout" 
      success_msg: "OK: ip_tables is loaded"
      fail_msg: "NOK: ip_tables is not loaded"
```

The `command` module does not use the Linux shell to execute commands. So, it cannot interpret `$` notations.
To run commands with such notations, use the `shell` module.

```yaml
  - name: List all kernel modules
    ansible.builtin.shell:
      cmd: "find /lib/modules/$(uname -r) -name '*.ko*'"
    register: all_modules
```
Run the playbook `kernel-module-check.yml` in the [ansible_assert] to see the output.

### Ignoring errors

Ansible stops execution when a task fails. That's fine for configuring servers.

But, when we are using Ansible for verifying configurations, we need to continue even if a task evaluates to false. 
So, when using Ansible for configuration verification set `ignore errors` to true in the playbook.

```yaml
  ignore_errors: true
```
### Ansible can do many things

Ansible can do things other than configuring servers. We just used Ansible for verifying configurations. These configuration verification capabilities in Ansible are handy for automating security compliance checking and audits.

In future posts, let's explore more usecases of Ansible.


[ansible_assert]: https://github.com/cloudqubes/ansible_assert
[stat-docs]: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/stat_module.html