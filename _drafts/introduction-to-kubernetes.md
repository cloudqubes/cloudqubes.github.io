purpose - introduce kubernetes to first timers

In a previous post we installed docker on Ubuntu. In production systems hundreds and thousands of containers would be running across multiple host machines. It is not possible to manualy deploy and mange these containers.

Kubernestes is a software framework that support this. 

# Install Kubernetes

In order to get some hands on experience, let's try out Kubernetes on a single VM. Installing a production ready Kubernets system requuires multiple nodes. But for learning purpuse several options exists for installin Kubernetes on a single node. We will use MicroK8s, which is an implementation fom Canonical.


We will use Ubuntu 18.04 LTS, which supports `snapd`.

### Setup proxy server for `snapd'
If your VM is behind a web proxy, you have to configure the proxy infromation for `snapd`. If you have direct Internet for the VM, you can skip this step.

{% highlight shell %}
$ sudo snap set system proxy.http="http://10.48.250.93:3128"
$ sudo snap set system proxy.https="http://10.48.250.93:3128"
{% endhighlight %} 

### Install MicroK8s

Install current stable MicroK8s version, which is 1.18:
{% highlight shell %}
$ sudo snap install microk8s --classic --channel=1.18/stable
{% endhighlight %} 

### Set user priviledges

Add the current user to group `microk8s` for assigning prilviledges for managing Kubernetes. And give access to the .kube directory.

{% highlight shell %}
$ sudo usermod -a -G microk8s $USER
$ sudo chown -f -R $USER ~/.kube
$ su - $USER
{% endhighlight %} 

#### Check status

Check the status of Microk8s:
{% highlight shell %}
$ microk8s status
{% endhighlight %}
If you get `microk8s is running` in the output, the Kubernetes cluster is installed.

### Using kubectl

`kubectl` is the command line tool for Kubernetes. It is used for all management tasks such as managing resources in the cluster and deploying applications. While it is directly installed in a production Kubernetes depoyment, MicroK8s bundles it inside. In order to avoid namespace conflict `kubectl` bundled with MicroK8s has to be executed as `microk8s kubectl <command>`. 

Running `microk8s kubectl help` will display the list of commands available in `kubectl`. Further help on each command can be obtained by `kubectl <command> --help`.

### Nodes, Pods and Services

Every Kubernetes cluster has one or more nodes. A node is a worker machine (either physical or VM) that runs containerized applications.

A pod is one or more containers that run on a single node, and share some resources such as an IP address or a storage volume. The pod representa a logical unit a containerized application, and consists of tightly coupled containers that are deployed and scaled together.

A service represent an application end point (a URL or IP address) that can be accessed by another service or application. Multiple pods can be exposed by a single service, and Kubernetes handles the loadbalancing function between the pods.

list nodes, pods and services:
{% highlight shell %}
$ microk8s kubectl get nodes
$ microk8s kubectl get pods
$ microk8s kubectl get services
{% endhighlight %} 

Currently our MicroK8s has only a single node, no pods and one service named kubernetes.

#### Troubleshooting
Inspect can give you more details on what is wrong:
{% highlight shell %}
$ microk8s inspect
{% endhighlight %}

{% highlight shell %}
{% endhighlight %} 



[micork8s]: https://microk8s.io/