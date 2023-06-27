---
layout: post
title:  "What is VNF Onboarding"
date:   2020-08-18 06:20:00 +0530
categories: [insights, NFV]
tags: [Telecom]
---

You are underway on full throttle on the virtualization journey. You have an NFV Platform, complete with SDN and orchestration, and have already onboarded VNFs from multiple suppliers. The project is really gaining traction. But, wait a moment. Have you really onboarded those VNFs?

VNF onboarding is the term that loosely defines the process of getting an instance of a VNF running on NFV infrastructure. However, this loose definition could be a barrier, for achiving the intended agility of cloudification. In the worst case, you will end up with a bunch of VNFs that are harder to maintain than legacy PNFs, and with the false assurance that you have a virtualized network.

# How to avoid this trap?

The first step of VNF onboarding, or doing anything that matters, is to define the outcome. The term *getting an instance of the VNF running on NFV infrastructure* just create a vague silhouette, but does not paint a clear picture for understanding.

## What is the correct definition of VNF onboarding

**VNF onboarding can be defined as the process of making the VNF life cycle management procedures available as zero or one one touch operations on a particular NFV infrstructure.**

This clearly defines the outcome. Once a VNF is onboarded, its life cycle management procedures must be available as zero or one touch operations. 

# How many VNFs have you really onboarded?

Now that our definition of VNF onboarding is much more than just getting an instance of the VNF up and running. However, this definition still contains an ambiguous term; **VNF life cycle management**.

So, let's define that.

## VNF lifecycle management

A VNF has four life cycle management procedures; three mandatory, and one optional.

1. Instantiation

    VNF instantiation is the process of deploying an instance of a VNF on an NFV platform, and making that instance ready for handling traffic. The instantiation procedure has to do two things.

    * Provision the virtual resources in VIM according to the VNFD and the environment variables template bundled in to a VNF package.
    * Perform Day-0 and Day-1 configurations according to the configuration templates bundled in to the same VNF package.

2. Healing

    At any point in time, one or more VMs in the VNF could encounter faults due to issues in VM itslef, or in underlying infrastructure. Such fualts has to be recovered by the healing process.

    It removes the faulty VMs,  recreates them using either backup or original VM images, and perform the Day-0 and Day-1 configurations on the VMs to ensure that they are ready to support the VNF for handling traffic.

    The healing process could be triggered either manually or automatically. The automatic triggering option is knows as auto-healing. The healing can be executed either with support from NFVO/VNFM or directly by VIM.

3. Termination

    Termination is the process of removing the virtual resources associated with the VNF. The termination process can be either graceful or forceful.

    A graceful termination will first isolate the VNF instance, so that new traffic handling requests will not come to the VNF. Then it has to wait until the existing traffic handling sessions are either released or migrated to a different VNF instance.
    
    Afer that the virtual resources of the VNF will be deleted.

4. Scaling (optional)

    All three procedures described above are mandatory for operating a VNF. But, the scaling is an optional procedure since it will not be practically required for every VNF. 
    
    Similar to healing, scaling can be either triggered manualy or automaticaly, and latter is known as auto-scaling. 

    There are two types of scaling procedures:
    * Scale-out

      The scale-out procedure adds one or more VMs to the VNF, increasing its traffic handling capacity. Day-0 and Day-1 configuration of the newly added VMs should also be included in this procedure.
    * Scale-in
    
      The scale-in operation removes one or more VMs from the VNF and reduce the traffic handling capacity of the VNF. Before removing the VMs, the procedure should ensure that existing traffic sessions handled by those VMs are either released or migrated to other VMs.

Now, we have clearly defined the VNF life cycle management procedures. But we have used some other terms like Day-0 configurations, VNF package etc., in these definitions. Let's clarify those terms as well.

## Day-0, Day-1, Day-2 configurations of VNF

### Day-0 

Day-0 configurations are done during the deployment of the VNF instance. Most of the time this would be guest OS configurations of VMs such as IP address, login details etc.

### Day-1

After the VNF instance is deployed, day-1 configrations make the VNF instance ready for handling traffic. This was called initial commissioning, and done manually in the PNFs.

### Day-2

Any configuration done after a VNF instance is operational, are known as Day-2 configurations.

## VNF Package
The VNF Package is a zip archive that includes:

### VNFD Template
The VNFD Template contains the definitions for virtual resources of the VNF. Depending on the onboarding option, the VNFD could be a Heat orchestration template or a TOSCA template complying with [SOL001].

### Environment Variables Template
An environment variables template defines values for certain parameters defined in VNFD. These could be parameters such as IP addresses, virtual network names etc., that are specific to a particular VNF instance.

Using the same VNFD and different environment variables templates, multiple VNF instances can be created

### VNF Configuration Template
A VNF configuration template defines Day-0 and Day-1 configurations for a VNF. These are the configurations that are typically done via MML in the PNFs.

In the VNF package these configuration templates are text files that needs to be passed in to the VNF during or just after initialization. 

When onbording VNFs with Heat templates cloud-init would be the preferred option for passing these configuration files to the VMs. In the SVNFM option, the SVNFM can use any vendor specific mechanism to do these configuration in the VNF.

### VNF images/binaries etc. (optional)
VNF images and binaries such as software packages can also be bundled in to the VNF package.

When onboarding VNFs via SVNFM, the SVNFM can use the binaries to install software on the VMs via SSH, or any other vendor specific mechanism. In the Heat template option, OpenStack config drive and cloud-init can be used for achieving similar results.

## Zero Touch Operation

A sero touch operation does not require any human intervention, from start to completion. It's triggered by a system, when certain conditions are met.

## One Touch Operation

A one touch operation is started manually, but does not require any human intervention until it's completed.

# The outcome of VNF Onboarding

With all our definitions now in place, let's relook at VNF onboarding. We described VNF onboarding as the process that makes the VNF life cycle management procedures available as zero or one one touch operations on a particular NFV platform.

Based on this, we can elaborate the outcome of VNF onboarding as:

1. One or more instances of the VNF are up and running with Day-0 and Day-1 configurations completed.
2. All the VNF life cycle mangement procedures are avialable as zero or one touch operations.
3. The operations team at telco can create a new instance of the VNF on any data center, by executing the one touch VNF instantiation procedure, without any support from the VNF supplier.
4. The operations team at telco can execute healing, scaling or termination procedures on any existing VNF instance, without any support from the VNF supplier.

This is what the outcome must be, for a real VNF onboarding. So, how many VNFs have you onboarded?

*[NFVO]: NFV Orchestrator
*[VNFM]: VNF Manager
*[SVNFM]: Specific VNF Manager
*[VNF]: Virtualized Network Function
*[PNF]: Physical Network Function
*[VIM]: Virtualized Infrastructure Manager
*[VNFD]: VNF Descriptor
*[TOSCA]: Topology and Orchestration Specification for Cloud Applications

[SOL001]: https://portal.etsi.org/webapp/WorkProgram/Frame_WorkItemList.asp?SearchPage=TRUE&butExpertSearch=++Search++&qETSI_NUMBER=NFV-SOL+001&qETSI_ALL=TRUE&includeNonActiveTB=TRUE&qSORT=HIGHVERSION&qREPORT_TYPE=SUMMARY&optDisplay=10&titleType=all
