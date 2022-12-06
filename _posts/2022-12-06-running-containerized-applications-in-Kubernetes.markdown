---
layout: post
title:  "Running containerized applications in Kubernetes"
subtitle: > 
  This article explains the basics of running containerized applications in Kubernetes.
date:   2022-12-06 17:00:00 +0530
categories: [devops, insights]
tags: [Kubernetes]
---

<div class="header-highlight">
A containerized application running in Kubernetes is a collection of Pods. Kubernetes takes care of scheduling these Pods across nodes in a cluster.
</div>

A containerized application is composed of microservices where each microservice is deployed in a container. A Pod is a group of one or more containers running in the same node.

This is a containerized application with three containers in two Pods.

![A containerized application in Kubernetes](/assets/images/running-containerized-apps/containerized-app-1.png){: width="100%" }
*A containerized application*

To run this application in a Kubernetes cluster, we must instruct Kubernetes on how to create the Pods.
There are several methods of doing that.
# Create individual Pods

You can use the `kubectl` command to create individual pods.

{% highlight shell %}
cloud@ubuntu:~$ microk8s kubectl run nginx --image=nginx
pod/nginx created
cloud@ubuntu:~$ microk8s kubectl get pods
NAME   READY   STATUS              RESTARTS   AGE
Nginx   0/1     ContainerCreating   0          11s
{% endhighlight %} 


When a Pod is no longer needed, it can be deleted using the `kubectl delete` command.

{% highlight shell %}
cloud@ubuntu:~$ microk8s kubectl delete pods/nginx
pod "nginx" deleted
{% endhighlight %} 

A Pod is an object in Kubernetes. The above commands are directly creating and deleting the Pod objects.

This method is known as managing Kubernetes objects with imperative commands.

It works for creating one or two pods for testing purpose or a one-off task. But, it’s not practical, if not impossible for an application that has hundreds of Pods. 

Instead of creating Pods individually, we can use Kubernetes configuration files for such applications.

# Kubernetes configuration files

Kubernetes configuration files are YAML-formatted definitions of Kubernetes objects. A single configuration file can hold definitions of multiple objects. Since a Pod is also an object in Kubernetes, you can use these configuration files for deploying an application with multiple Pods.

# Using configuration files imperatively

Here’s a configuration file with two Pod definitions. The `spec` field specifies the configuration of containers in each Pod. Each Pod in this configuration file runs one Nginx container.

{% highlight yaml %}

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-1
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80
        
---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-2
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80  
{% endhighlight %} 

The `kubectl create` command accepts the file as an input and creates the two pods.

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl create -f nginxpod.yml 
pod/nginx-pod-1 created
pod/nginx-pod-2 created
{% endhighlight %} 


Let’s try to amend our application with one more pod by updating the configuration file.

{% highlight yaml %}
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-1
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80
        
---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-2
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80     

---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-3
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80    
{% endhighlight %} 

Using the `kubectl create` command with the updated configuration file.

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl create -f nginxpod.yml 
pod/nginx-pod-3 created
Error from server (AlreadyExists): error when creating "nginxpod.yml": pods "nginx-pod-1" already exists
Error from server (AlreadyExists): error when creating "nginxpod.yml": pods "nginx-pod-2" already exists
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-pod-1   1/1     Running   0          4m25s
nginx-pod-2   1/1     Running   0          4m25s
nginx-pod-3   1/1     Running   0          27s
{% endhighlight %} 

It prints an error indicating that `nginx-pod-1` and `nginx-pod-2` already exist. But, `nginx-pod-3` is created. 

In this method, we are creating Kubernetes objects imperatively using Kubernetes configuration files. But, there is a better method.

# Using configuration files declaratively

A declarative definition contains the end state we wish to achieve. Therefore, when using the declarative method we use the `kubectl apply’ command. It will scan the configuration file, and amend the cluster to match our definitions.

Remember to delete all Pods created in earlier steps before executing this command. 

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginxpod.yml 
pod/nginx-pod-1 created
pod/nginx-pod-2 created
pod/nginx-pod-3 created
{% endhighlight %} 


Let’s try to amend our workload with one more pod.

{% highlight yaml %}
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-1
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80
        
---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-2
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80     

---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-3
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80

---

apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-4
spec:
  containers:
  - name: nginx
    image: nginx:1.23.2
    ports:
    - containerPort: 80    
{% endhighlight %} 



Running the `kubectl apply` again.

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginxpod.yml 
pod/nginx-pod-1 unchanged
pod/nginx-pod-2 unchanged
pod/nginx-pod-3 unchanged
pod/nginx-pod-4 created
{% endhighlight %} 

We are not getting an error this time. Kubernetes can identify that pod-1 to 3 already exists so it’s creating the fourth pod only. 

However, running a workload as a collection of individual pods is not a good practice. If our application has hundreds of pods, we would have to copy-paste the pod definition a hundred times. Kubernetes has a higher-level object for such use cases.

# ReplicaSet

A ReplicaSet is a group of pods. This is a definition of a ReplicaSet with three Pods, indicated by `replicas` field. 

A ReplicaSet can have only one Pod `spec`.  The Pod spec in this ReplicaSet has one Nginx container and the RelicaSet will create three replicas of this Pod.

{% highlight shell %}
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
  labels:
    app: webapp
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      webapp: nginx
  template:
    metadata:
      labels:
        webapp: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.23.2
        ports:
        - containerPort: 80
{% endhighlight %} 

Using `kubectl apply` to create the ReplicaSet

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginx-replica.yml 
replicaset.apps/nginx created
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get rs
NAME    DESIRED   CURRENT   READY   AGE
nginx   3         3         0       5s
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get rs
NAME    DESIRED   CURRENT   READY   AGE
nginx   3         3         3       10s
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-xmlpq   1/1     Running   0          13s
nginx-ncbnq   1/1     Running   0          12s
nginx-mpvtn   1/1     Running   0          12s
{% endhighlight %} 

We can easily scale this workload to any number of pods by altering the value of `spec.replicas` field.

Let’s update it to 4.

{% highlight yaml %}
  replicas: 4
{% endhighlight %}

Using the `kubectl apply` to update our workload.

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginx-replica.yml 
replicaset.apps/nginx configured
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-xmlpq   1/1     Running   0          2m24s
nginx-ncbnq   1/1     Running   0          2m23s
nginx-mpvtn   1/1     Running   0          2m23s
nginx-4h69h   1/1     Running   0          6s
{% endhighlight %}  

Scaling down is also easy. Just update the number of replicas to your desired count and run `kubectl apply`. Here we are bringing down the number of Pods to two.

{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginx-replica.yml 
replicaset.apps/nginx configured
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME          READY   STATUS        RESTARTS   AGE
nginx-mpvtn   1/1     Running       0          4m40s
nginx-4h69h   1/1     Running       0          2m23s
nginx-ncbnq   1/1     Terminating   0          4m40s
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-mpvtn   1/1     Running   0          4m43s
nginx-4h69h   1/1     Running   0          2m26s
{% endhighlight %} 

ReplicaSets simplify the scaling of a containerized application. You can adjust the number of replicas to match the current load.

However, running standalone ReplicaSets is also not a recommended approach in Kubernetes. Instead, you must use Kubernetes Workloads.

# Kubernetes Workloads

A Kubernetes Workload is a collection of Pods that is managed by a Workload controller. This controller reschedules failed Pods to ensure that the required number of healthy Pods are always available. 

Kubernetes has five built-in workload types, and you can create additional types by writing a custom controller.

1. Deployment
  > A Deployment consists of Pods that do not need to maintain any persistent states. A typical example is a front-end of a web application. It will consist of a web server such as Nginx and the application logic that is responsible for interacting with databases and serving the HTML views.

2. StatefulSet
  > Pods in a StatefulSet can maintain persistent states. These Pods can have Kubernetes Persistent Volumes.

3. DaemonSet
  > A DaemonSet will run a copy of a Pod on all nodes. A DaemonSet is useful for cluster-wide services such as monitoring node health, log collection, etc.

4. Job
  > A Job is a one-time task. Once a Job is created, Kubernetes will ensure that the specified number of Pods are executed till completion.

5. CronJob
  > CronJob is a Job that Kubernetes repeats at scheduled intervals.

<div class="inline-highlight">
All production applications must be managed as Workloads in Kubernetes.
</div>

A typical containerized application will be a combination of different types of Workloads. 

A web application usually has a set of stateless frontend services and a stateful backend datastore. Therefore, this application must be deployed into Kubernetes using Deployment and StatefulSets Workloads.

![A containerized web application](/assets/images/running-containerized-apps/containerized-app-2.png){: width="100%" }
*A web application with frontend and backend pods.*

If we are to enhance this web application with a newsletter service, we can add a new Pod of type CronJob.

![A containerized web application with a CronJob](/assets/images/running-containerized-apps/containerized-app-3.png){: width="100%" }
*A web application including a CronJob.*

# Creating a Deployment

This is a definition of a Deployment that runs two replicas of an Nginx Pod.

{% highlight yaml %}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.23.2
        ports:
        - containerPort: 80
{% endhighlight %}

Using `kubectl apply` to create the deployment
{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl apply -f nginx.yml 
deployment.apps/nginx-deployment created
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME                                READY   STATUS              RESTARTS   AGE
nginx-deployment-86956f97b8-h4t6p   0/1     ContainerCreating   0          7s
nginx-deployment-86956f97b8-wms8g   0/1     ContainerCreating   0          7s
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-86956f97b8-h4t6p   1/1     Running   0          36s
nginx-deployment-86956f97b8-wms8g   1/1     Running   0          36s
{% endhighlight %}


Query the Deployment and the ReplicaSet within the Deployment with `kubectl`.
{% highlight shell %}
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           3m37s
cloud@ubuntu:~/projects/kube-config$ microk8s kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-86956f97b8   2         2         2       3m41s
cloud@ubuntu:~/projects/kube-config$ 
{% endhighlight %}



All types of Kubernetes Workloads can be created using configuration files like this.
We will dig into more details about each type of Workload in a series of upcoming articles.


 



