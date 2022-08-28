---
layout: post
title:  "Why do telcos go cloud-native"
date:   2022-06-29 06:10:00 +0530
categories: [handson, Telco]
tags: [cloud-native, NFV]
---

NFV came in with so many promises, but after 10 years from its inception, most of those promises still remain undelivered. And now, the next wave of technology transformation is coming. 5G is coming with cloud-native architecture and the telcos are being pushed to transform their data centers to cloud-native.

# Why are the software companies embracing containerization?
Enterprise software teams or the startup have one common problem - meet the changing requiremetns of the customers. For the enterprise teams the costomers are the empployees of the company. For an startup the customers are the end users of the product.

# Containeri


# 12 factor CNFs

1. Externalized Configurations - The configurations are spearated from the application and managed via a separate configuration management tool.

2. Resiliency - Each microservice is stateless and use an external data source to store session data (ex- a SIP session, PDP context). If a particular microservice is destroyed a central manager spinup a new micro service and assign it with the particular sessions of the desroyed micro service.

3. Scalability - A cloud-native application is infinitely scalable. Current PNFs and VNFs have certain capacity limitations. (Ex- 300GB/s throughput, 1M IMS sessions). A CNF is scalable by adding any number of microservices irrespective of such capacity limits. The cloud infrastrucutre must facilitate loadbalancing of traffic among these microservices.

4. Logging - Each microservice must emit logs as a stream of events. This stream must be fed into a log manageemnt software where they can be queried.

5. Deployability - The operations teams should be able to manage the end-to-end lifecycle of an application without the involvement from the supplier. When a new instance is deployed, it should download the required configurations from the central configuration management system and apply. The CNF should be ready for service without any involvement MML commands etc.

6. API first - The CNF should expose all its external interfaces as APIs. 

7. Tracing

8. Metrics - 

9. LCM workflows - The CNF must be associated with a set of workflows for executing software upgrades. This upgrade process must be first executed in the CSP's test environment and thoroughly tested. Then it can be applied on all the production environments while traffic is being handled. A certain interruption is expected but there msut be no total outage of the CNF.

10. Separation of stateless and statefull microservices - The application architecture must clearly indicate the statelss and statefull miroservices. 

11. Automated backups - The data stored in either disks/databases must be automatically backed up.

12. Containerized - The CNF must be containerized and run on Kubernetes.

