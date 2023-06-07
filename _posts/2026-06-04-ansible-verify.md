---
layout: post
title:  "How to use Ansible for verifying configurations"
subtitle: > 
  You are already using Ansible for configuring Linux servers. Ansible can also verify configurations without actually changing anything.
date:   2023-06-05 06:00:00 +0530
categories: [recipe]
tags: [Linux]
---

<div class="header-highlight">
You are already using Ansible for configuring Linux servers. Here's how you can use Ansible for verifing configurations.
</div>

Ansible is a handy tool for managing configurations in Linux servers. 

Sometimes, you want to verify configurations without actually changing. You can use Ansible module `ansible.builtin.assert`for this purpose.

Ansible module `ansible.builtin.assert` can evaluate string expressions. Coupled with Ansible variable assignment, you can develop Ansible playbooks to verify configurations.

# How to use assert module

The `assert` module accepts three main parameters.

```yaml
  - name: task name
    ansible.builtin.assert:
      that: 
      - "condition"
      success_msg: "Success message"
      fail_msg: "Fail message"
```
The parameter `that` is a list of Jinja2 expressions to be evaluated. 

The task prints the `success_msg` if all expressions are evaluated true. Else, `fail_msg` is printed.

To build the Jinja2 expressions we can use variables.

# Registering variables

An Ansible task is an invocation of an Ansible module which returns a value. The `register` keyword stores this value in memory and makes it available for subsequent tasks .

```yaml
- name: cat test_file
  ansible.builtin.command:
    cmd: cat /home/ubuntu/test_file
  register: test_file
```

The `cat test_file` task stores the return value of `cmd` module in a variable named `test_file`. Any task that comes below this task in the play, can refer to the variable `test_file`.

Let's inspect the variable using the `debug` module.

```yaml
  - name: debug test_file
    ansible.builtin.debug:
      var: test_file
```


The output of the task.
```shell
TASK [debug test_file] *****************************************************************************************************************************************************************************
ok: [740-1-k8s1] => {
    "test_file": {
        "changed": true,
        "cmd": [
            "cat",
            "/home/ubuntu/test_file"
        ],
        "delta": "0:00:00.004001",
        "end": "2023-06-06 06:58:39.177322",
        "failed": false,
        "msg": "",
        "rc": 0,
        "start": "2023-06-06 06:58:39.173321",
        "stderr": "",
        "stderr_lines": [],
        "stdout": "test_string\nnew string\nThis string is in fil",
        "stdout_lines": [
            "test_string",
            "new string",
            "This string is in file"
        ]
    }
}

```

The return value of an Ansible module is a dictionary with multiple key-value pairs. We can use these keys for building the expressions for `that` parameter in the `assert` module.

You can find the complete playbook `debug-test-file.yml` in [GitHub repository][assert-repo] 

# Ignoring errors

Ansible stops execution when a task fails. That's fine for configuring servers.

But, when we are using Ansible for verifying configurations, we need to continue even if a task evaluates to false. 
So, we set `ignore errors` to true in the play.

```yaml
  ignore_errors: true
```

# Usecases

Let's see some usecases for verifying configurations with `ansible.builtin.assert`.

## Check the existence of a file

The module `stat` can retrieve status of files aand directories.

This task retrieve the status of `test_file` in the users's home directory and store the result in the variable `test_file`.

```yaml
- name: Get status of test_file
  ansible.builtin.stat:
    path: /home/ubuntu/test_file
  register: test_file
```

Inspect the contents of the `test_file`.

```yaml
  - name: debug test_file_1
    ansible.builtin.debug:
      var: test_file_1
```

Tast output.
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

The `stat` module returns many parameters. Some are self explanatory. Refer the [Stat module docs][stat-docs] for interpretation of the rest of the parameters.

Let's see how to use the `exists` key to check if a file exists.


```yaml
- name: assert test_file exists
  ansible.builtin.assert:
    that: 
    - "test_file.stat.exists"
    success_msg: "OK: test_file exists"
    fail_msg: "NOK: test_file does not exists"
```

The `pw_name` key holds the username of the owner.

```yaml
  - name: assert test_file owner username is ubuntu
    ansible.builtin.assert:
      that: 
      - "test_file.stat.pw_name == 'ubuntu'"
      success_msg: "OK: test_file owner is ubuntu"
      fail_msg: "NOK: test_file owner is not ubuntu"
```

The `gr_name` key holds the group name of owner.

```yaml
  - name: assert test_file owner group name is not root
    ansible.builtin.assert:
      that: 
      - "test_file.stat.gr_name != 'root'"
      success_msg: "OK: test_file owner group is not root"
      fail_msg: "NOK: test_file owner group is root"
```

The complete playbook `file-check.yml` is available in the GitHub repo.
Clone the repo and run the playbook to see the output.

```shell
$ ansible-playbook file-check.yml
```

### Check contents of a file

The Ansible module `command` can run shell commands.
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


The `test_file.stdout` contains output of the command which we can examine to check the contents of the file.

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

### Check the status of a service

The module `ansible.builtin.service_facts` can rerieve information related to services ans store them in `ansible_facts.services` variable.

```yaml
  - name: Populate service facts
    ansible.builtin.service_facts:
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

Some service names hava a dot notation such as `ssh.service.
For accessing such keys we need to use the square brackets.

```yaml
  - name: assert ssh.service is running
    ansible.builtin.assert:
      that: 
      - "ansible_facts.services['ssh.service'].state == 'running'"
      success_msg: "OK: ssh.service is running"
      fail_msg: "NOK: ssh.service is not running"
```

### Check the status of a kernel module


This is handy for checking security compliances.


[assert-repo]: https://github.com/cloudqubes/ansible_assert
[stat-docs]: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/stat_module.html