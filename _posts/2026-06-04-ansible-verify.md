---
layout: post
title:  "How to use Ansible for verifying configurations in Linux"
subtitle: > 
  You are already using Ansible for configuring Linux machines. Did you know that Ansible can also verify configurations without actually changing anything.
date:   2023-06-05 06:00:00 +0530
categories: [recipe]
tags: [Linux]
---

<div class="header-highlight">
You are already using Ansible for configuring Linux machines. Here's how you can use Ansible to verify configurations without actually changing.
</div>

Ansible module `ansible.builtin.assert` can evaluate string expressions. 

Coupled with Ansible variable assignment, you can develop Ansible playbooks to verify various configurations in Linux OS.

# How to use assert module

The `assert` module accepts three main parameters.

The parameter `that` is a list of string expressions to be evaluated.

The task prints the `success_msg` if all expressions are evaluated true. Else, `fail_msg` is printed.

```yaml
  - name: task nema
    ansible.builtin.assert:
      that: 
      - "condition"
      success_msg: "Success message"
      fail_msg: "Fail message"
```

# Registering variables

An Ansible task is an invocation of an Ansible module which returns a value. The `register` keyword stores this value in memory and makes it available for subsequent tasks .

```yaml
- name: cat test_file
  ansible.builtin.command:
    cmd: cat /home/ubuntu/test_file
  register: test_file
```

The `cat test_file` task stores the return value of `cmd` module in a variable named `test_file`. Any task that comes below this task in the play, can refer to the variable `test_file`.

The return value of an Ansible module is a dictionary which you can inspect using the `debug` module.

```yaml
  - name: debug test_file
    ansible.builtin.debug:
      var: test_file
```

This is the complete playbook which you can run to see this in action.

You can use the values in the variable to build string expressions to be evaluated by `assert` module. 

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

Then, we can use the variable `test_file` to check whether file exists.

```yaml
- name: assert test_file exists
  ansible.builtin.assert:
    that: 
    - "test_file.stat.exists"
    success_msg: "OK: test_file exists"
    fail_msg: "NOK: test_file does not exists"
```

Let's use the `debug` module to inspect the variable `test_file`

```yaml
debug
```

The `stat` module returns a lot of information about a file.
We'll show how to use two common parameters.

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

Here's the code for the complete playbook that works with two files

```yaml
- hosts: all
  remote_user: ubuntu
  become: yes
  ignore_errors: true
  tasks:
  - name: Check existing file
    ansible.builtin.stat:
      path: /home/ubuntu/test_file # This file exists
    register: test_file_1
  - name: Check not existing file
    ansible.builtin.stat:
      path: /home/ubuntu/test_file_not_exists # This file does not exists
    register: test_file_2

  - name: assert test_file exists
    ansible.builtin.assert:
      that: 
      - "test_file_1.stat.exists"
      success_msg: "OK: test_file exists"
      fail_msg: "NOK: test_file does nox exists"

  - name: assert test_file_2 exists
    ansible.builtin.assert:
      that: 
      - "test_file_2.stat.exists"
      success_msg: "OK: test_file_2 exists"
      fail_msg: "NOK: test_file_2 does nox exists"

  - name: assert test_file owner username is ubuntu
    ansible.builtin.assert:
      that: 
      - "test_file_1.stat.pw_name == 'ubuntu'"
      success_msg: "OK: test_file owner is ubuntu"
      fail_msg: "NOK: test_file owner is not ubuntu"

  - name: assert test_file owner groupname is not root
    ansible.builtin.assert:
      that: 
      - "test_file_1.stat.gr_name != 'root'"
      success_msg: "OK: test_file owner group is not root"
      fail_msg: "NOK: test_file owner group is root"
```

Save it as `file-check.yml` and run the playbook.

```shell
$ ansible-playbook file-check.yml
```

### Check contents of a file

The Ansible module `command` can run shell commands.

```yaml
  - name: cat test_file
    ansible.builtin.command:
      cmd: cat /home/ubuntu/test_file
    register: test_file
```



### Check whether a service is running



### Check the status of a kernel module


This is handy for checking security compliances.