Title of the article: Advantages of Serverless Computing
Intended audience: Developers, Engineering Managers
Subheadings:
What is Serverless computing?
Technical advantages for developers
Commercial advantages of going Serverless
Brief Introduction to AWS Lambda and AWS Fargate (the two serverless compute services in AWS)
When to go Serverless


Serverless computing is a cloud computing architecture, that free up the developers from the task of managing infrastructure. The cloud provider privides a fully managed environment to execute the code, including the language runtime. The underlying infrastructure becomes fully transparent to the developers, so they do not have to bother about resource management and scaling of the application.

The serverless computing architecture was first commercially implemented by Google as the Google App Engine. Serverless architecture has not evolved to provide computing (CPU and memeory), databases and various other software components. 

CPU and memory is often provided as a serverless runtime where application developers can deplpy there code, which gets executed in the runtime privided by the cloud service provider.

Serverless and platform as a service has some subtle differences. The PAAS provied an environment to run a complete application, and is billed on the resouce allocated such as RAM and CPU time. 
In the serverless model application is billed by the number of requests and the time taken for processing each request. Unlike PAAS, the serverless model requires the developers to write code in a specific framework provided by the cloud provider.

# Advantages of serverless architecture

## 1. Optimize cost
However cheap the cloud computing can be the cost of hosting is still a non trivial barrier for startups. The serverless model helps keep the cost at minimum by avoiding upfront costs and costs for idle resources. Applications in serveless architecture are billed as per the actual requests received and served, so an idle servelss application does not add more costs. 

## 2. Let developers focus on business logic
When developing an application, the developers are taked with the design of the overall application architecture. However, in serverless model the application architecture is alreasy defined by the cloud provider. The developers just has to focus on implementing teh business logic without worrying on the overall design. This could be a huge advantege to solo developers and small teams at startups.

## 3. Better scalability
Building a scalable application is a complex task. In today's dynamic word it's not unlikely that some applications suddenly has to scale to serve millions of requests from just 1000 today. A traditional application, scaling to this level is challenging and can take time and effort. On the other hand the scalablity of serverless applications are entirely handled by cloud providers, so the developers do not have to be bothered by it.

They have to make sure the application scales by adding more servers. When doing so, it requires support from other compoents like load balancers etc. 

Scaling database applications is a lot harder. It demands proper application desing from the start, because manipulating databases is risky and you can corrupt all the data in it. Therefore developers working as a small team or as solo-developers faces a critical challenge for developting and delivering the final product.

## 4. Simplified architecure

Scaling a traditional web application needs building a complex application architecture that does not depend just on the application code. When adding more servers or containers the application developers have to add more components like load balancers etc.

## 5. More secure
Application security is often an overlooked point specially with small development teams. Securing an application demands expertise and effort from the developers. In a serverless architecure the application security is inherently privided by the framework of the cloud service provider, so developers are freed up from the secuiry burden.

## 6. Distributed hosting of the application
An application deployed in VMs or containers, is generally served from a single location of teh cloud provider. Therefore, if the developers wishes to make use of distributed CDNs to increase  user experience by reducing latency, that patr needs to be built in to the application with separate effort. But, a serverless application is served by distributed locations of the cloud provider, so the content a delivered from the nearest location of the user. 

## 7. Inbuilt reseliency
Hosting an application in cloud does not mean it'd prone to failure. The capability of disaster recovery should be developed in the application so that service is available to users, even if a single data center or location is out of servce. In the serverless model, the developers need not be concerned with DR, since it comes built in to the serverless framework of the provider.

## 8. Faster delivery
The serveless model allows faster delivery and time to market. Building an application from scratch and shipping it out, needs time and effort related to application infrastructure such as databases, packaging and building the final product. In the serverless model, the most of teh building and deployment part is taken cared by the cloud provider, so developers are able to deliver the final product faster.

# Where this is applicable
Serverless is great. Isn't it? I am going to use it for all my new applications. But wait. Serverless may not be the best arhcitectural option for all applications. There are particular cases where the serverless model fits the bill.

1. Web and mobile backends

2. IoT backends
3. Data processing


# Where it's not applicable

1. Streaming audio, video applications
2. Messaging applications using websockets


 the application is billed for the actual requests that are served by the cloud. 

When developing an application the developer is tasked with creating a scalable software and deploying it on the infrastructure. 

The serverless model helps the developers in focusing on implementing the business logic. The cloud provider defines the architecture of the application and the framework, so the developers do no have to bother on it.

Cloud 

code execution is fully managed by the cloud platform an


where the code execution is fully managed by the cloud infrastrucuture

# Drawbacks

Cold start
