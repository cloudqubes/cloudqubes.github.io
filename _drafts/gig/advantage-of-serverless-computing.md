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

## Technical advantages for developers

When developing an application the developer is tasked with creating a scalable software and deploying it on the infrastructure. They have to make sure the application scales by adding more servers. When doing so, it requires support from other compoents like load balancers etc. Scaling database applications is a lot harder. It demands proper application desing from the start, because manipulating databases is risky and you can corrupt all the data in it. Therefore developers working as a small team or as solo-developers faces a critical challenge for developting and delivering the final product.

The serverless model helps the developers in focusing on implementing the business logic. The cloud provider defines the architecture of the application and the framework, so the developers do no have to bother on it.


code execution is fully managed by the cloud platform an


where the code execution is fully managed by the cloud infrastrucuture

# Drawbacks

Cold start
