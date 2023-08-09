---
layout: post
title:  "Introduction to Networking in AWS"
date:   2022-10-07 06:00:00 +0530
categories: [insights]
image: aws-networking-cover.png
tags: ["Cloud", "AWS"]
---

Networking in AWS is quite different from networking in a private data center. You do not have to worry about managing hardware like switches, routers, or firewalls in AWS because everything is available as software. There are three main networking components in AWS.

### Amazon Virtual Private Cloud (VPC)
A VPC is a logical network boundary for your cloud resources. Think of it as your private cloud hosted in AWS. Your AWS resources such as EC2 instances must reside in a VPC.

A VPC belongs to a particular AWS region and cannot be shared across two AWS regions. When you create a new account, AWS will automatically create a VPC in each region for you. This VPC is known as the default VPC, and you can create additional VPCs depending on your networking requirements. A VPC contains multiple subnets and route tables.

### Subnets
A subnet in AWS closely resembles a VLAN in a private data center. Each subnet has a unique IP address range. No two subnets in the same VPC can have overlapping IP addresses. The resources in a VPC such as the EC2 instances are connected to subnets. 

### Route tables
Each subnet in the VPC must be associated with a route table. The route table defines a series of rules for routing IP packets. Two EC2 instances in separate subnets can communicate with each other if the subnets are associated with the same route table.

# Planning your VPCs in AWS

There are certain services like AWS-managed databases, serverless functions, etc., that are located outside of VPCs. All other resources such as EC2 instances, firewalls, EKS clusters, etc., reside inside a VPC. You can use multiple VPCs to implement logical isolation among such resources. Certain use cases require this kind of logical isolation.

### Dev, test, and prod environments
It is a good practice in software development to isolate the development, test, and production environments. Using a separate VPC for each environment can provide this isolation.

You can further enhance the separation by restricting access to the production VPC using the AWS IAM policies. Since separate VPCs can use overlapping IP CIDRs you can use the same IP design in all your development, test, and production setups.


### Multiple teams
A large organization may have multiple development teams working on different software  applications. Keeping all these applications in a single VPC may lead to conflicts in IP address assignment, resource management, etc. By using separate VPCs, each team can work independently without the risk of affecting the other team.
IP Address Planning in VPCs
Each VPC must be assigned with an IPv4 CIDR block. This IP block can be from /28 to /16. Since VPCs are logically separated, the same IP CIDR can be used in two VPCs without any conflicts. AWS considers this IP range as private and does not allow you to directly expose them to the Internet. While you can assign any public or private IPv4 range to the VPC, AWS recommends using a private IP range defined as in RFC 1918. 

Once you assign a CIDR block to a VPC, it is not possible to expand or change it. However, you can assign secondary CIDR blocks to a VPC.

A VPC can also have an IPv6 CIDR block. You can let AWS assign this IPv6 block or use your IPv6 blocks in some AWS regions.


# IP Assignment to Subnets
A VPC can have multiple subnets. A subnet can be assigned with an IPv4 or IPv6 address range. These ranges must be within the main CIDR blocks assigned to the VPC. Two subnets cannot have overlapping IP ranges.

We all know that the first and the last IP address of a subnet are not usable because the first is the network address and the last is the broadcast address. In AWS there are three more IP addresses that cannot be assigned to resources. As an example, if your subnet is 10.0.2.0/28, below IP addresses are reserved by AWS.

10.0.2.0/28 - Network address
10.0.2.1/28 - Reserved by AWS for the Route table.
10.0.2.2/28 - Reserved by AWS for DNS purposes.
10.0.2.3/28 - Reserved by AWS for future use.
10.0.2.15/28 - Broadcast address


## VPC and AWS Availability zones
Each AWS region has at least three or more availability zones. An availability zone is a physically separated data center in a particular region. A VPC can span across several availability zones, but a subnet must reside in one availability zone.

![Availability zones](/assets/images/blog-aws-availability-zones.png)
*Availability zones*

You can distribute workloads across availability zones by provisioning resources in subnets belonging to different availability zones. It can improve the resiliency of the applications. 

## Private and public subnets
All IP ranges assigned to a VPC are considered private by AWS. So, all subnets in a VPC are also assigned private IP address ranges. You can connect some of the subnets in the VPC to an Internet Gateway. These subnets are called public subnets because the EC2 instances in these subnets can reach the Internet.

![Public and private subnets in a VPC](/assets/images/blog-aws-public-and-private subnets.png)
*Public and private subnets*

However, to reach the Internet the EC2 instance must have a public IP address. This is not a problem for IPv6 subnets. But, if it is an IPv4 subnet you must specifically assign a public IP address to the EC2 instances. There are two options for assigning a public IPv4 address.

### Auto Assign Public IP address
An AWS subnet has a parameter that enables the automatic assignment of a public IPv4 address. Once it is enabled every time you launch an instance in that subnet, it will assign a public IPv4 address from a pool that is managed by AWS. 

### Elastic IP address
If you want to assign a static public IPv4 address, use the Elastic IP address. When you create an elastic IP address, AWS assigns a public IPv4 address from a pool that is either AWS-managed or user-owned. Then, you can assign this Elastic IP to EC2 instances and the public Ipv4 address will remain fixed until the Elastic IP is deleted.

# Elastic Network Interfaces (ENI)
ENI is a virtual NIC in AWS. When you launch an EC2 instance, AWS creates an ENI and assigns it to the EC2. This ENI is known as the primary ENI. You can also attach secondary ENIs to an EC2 instance. 

An ENI belongs to a subnet and is assigned an IPv4 or IPv6 address from the subnet. If the subnet is configured to auto-assign a public IPv4 address, the ENI will also be assigned a public IP address. Also, it is possible to associate an Elastic IP address to ENI so that the EC2 instance can use the Elastic IP.

An ENI can be attached or detached from an EC2 instance on the run. Once the ENI is attached to a new virtual machine, it will only provision the network interface. You must login to the EC2 instance and configure the interface IP address details.

# Internet Gateway
An Internet Gateway provides Internet access to VPC resources such as EC2 that has a public IP address assigned. The corresponding subnet must have a default route to the Internet Gateway to facilitate this connectivity.

However, it is not recommended for EC2 instances in a production environment to be directly connected to the Internet via an Internet Gateway. You must always implement appropriate security controls such as firewalls when allowing Internet access to an EC2 instance.

# Securing VPC Resources
Security Groups and Network ACLs are two mechanisms for filtering incoming or outgoing traffic of any resources in a VPC.

## Security Groups
Security groups are stateful firewalls that can be attached to ENIs for filtering traffic. An ENI must have at least one security group, but you can also attach multiple security groups to one ENI. 

A security group has multiple security rules. Each rule defines matching criteria for allowing traffic to pass and the traffic that is not matched to any rule is dropped. 

Security groups operate at layer 4 of the OSI model. So, security rule criteria can contain IP CIDR and a TCP/UDP port number. The IP CIDR may be a specific IP or a range of IP addresses. 

Instead of the IP CIDR, the security rule may refer to a security group as well. This security group could be the same security group to which the rule belongs or a different security group. This is useful for creating a rule that allows traffic between resources in the same VPC.

This mechanism is used in the default security group created in the default VPC of your account. It facilitates connectivity between any two instances you create in that VPC. 


## Network ACLs
Network ACLs are stateless firewalls associated with subnets in a VPC. A subnet must be associated with only one ACL, but an ACL can be assigned to multiple subnets. 

A Network ACL has a set of rules which defines whether particular IP port combinations are allowed or denied. Each rule has a number that defines the priority where the lower number has a higher priority.. For each IP packet, AWS analyzes the rules in the priority order. When a rule is matched, the packet is allowed or denied and no further rules are analyzed.

Since network ACLs are stateless, you must define the corresponding rules to allow the return traffic for each inbound or outbound rule you add.



# Conclusions
AWS has all the features and functions to implement a very robust networking architecture. This article introduces just its basic concepts. In upcoming articles, we will dive deeper into some of the topics that we introduced here.




