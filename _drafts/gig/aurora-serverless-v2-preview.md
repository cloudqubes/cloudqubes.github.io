For your first blog post, a potential topic might be the new "Aurora Serverless v2 Preview" that AWS just announced. Compare it with v1 and with non-serverless. What are the advantages? The differences? When you you use one vs the other? Vs DynamoDB?


Title: An Introduction to Aurora Serverless v2 Preview
Outline:
What is Aurora serverless
Comparison of Aurora serverless V2 with V1, and other DBs on AWS
Comparison of Aurora serverless non-serverless databases
Advantages of Aurora
When to use Aurora V2

Databases are one aspect of the application that can give operation teams a headache. Managing a database specially with high availability takes a lot of time and effort. Scaling a database to cater the application workloads is also a non trivial task, whcih requires building replicas synchronizing and a lot of steps. Why make this effort when an easire option is available, welcome to the world of serverless databases.

Serverless databases are a breeze when compared to the traditional database applications. They reqiure non fo teh effort that was previousley required on administrative tasks such as taking backups managing replicas etc. It frees up your development teams from lot of headaches related to corrupted data and recovery activites, whcih impact the service outages and availability in your application.

Amazon Aurora is a MySQL and PostgreSQL compatible relational database, that is available as a service in AWS cloud.  

# Aurora Serverless v2
On 1st of December, 2020 Amazon introduced the next version of the Aurora Serverless as a preview. This new version, known as Aurora Serverless v2, provides additional features on top of waht was available in Aurora serverless V1. This makes Aurora serveless v2 suitable for much broader set of applications.

# Comparison of Aurora Serverless v2 and v1

Aurora serverless v1 is the initial version of the serverless option of Amazon Aurora. It is suitable for a limited range of applications such as verly low level workloads like blogs or databases with infrequent read/write requests, and as a test database for application developers. Therefore, even though it provided a cost effective highly available database alternative for Amazon Aurora, it was not much of a use to serious organizations out there who are truing to exploit the next opportunity to disrupt the world.

Aurora Serverless v2 is the much awaited version for them. Still in the preview state, v2 is a robust, scalable serverless database that can scale up to hundres-of-thousand transactions per second. It is also scalable which means you do not need to keep capacity pre provisioned. Aurora serverless v2 automatically scales to serve these request while you happily sit and watch developing your application or sipping coffee.

Amazon has not shortage of database solutions. Whatever your requirement, you will find a database for that on AWS.

## Aurora vs DynamoDB
Amazon DynamoDB is a Key-Value database that can cater a wide range of applications incuding ecommerce. Dynamod DB is also a serverless database where you do not have to worry about capacity provisioning. However, it's a NoSQL database which stores data as key-value pairs. While a lot of web applications adapt DynamoDB if you require the nice old SQL queries, NoSQL may not be suitable. 

## Amazon RDS

Amazon Relational Database Service (aka Amazon RDS), is a relational database service provided by Amazon. While being a database service, RDS is not a serveless model. Therefore, while RDS provides a manged database it's still a database configured on a VM, where you would be responsible for scaling it according to the workload. An RDS is still a VM that you can scale up to 32vCPUs. Scalability beyond this limit is your resposibility. You will have to build read replocas according to the workload of your application and share the database queries among them. 

RDS provide several database engines. MySQL, PostgreSQL