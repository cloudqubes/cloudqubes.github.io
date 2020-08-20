purpose - Introduce the concept of VNF onboarding






# What is a VNF?

A VNF is a group of VMs interconnected with virtual networks, and deliver a specific service. 



used to cover all aspects of getting VNFs to run on the NFV infrastrucutre. It involves all the activities from concepts to instantiation of the VNF. It can be broken down to three phases
Design
Modeling
Deployment

#Design
Objective of the design is to create a blueprint of the VNF to be onboarded to the NFV platform. The NFV platforms defer in terms of resource availability, networking, VM recovery mechanisms, storage options etc. Taking all these factors in to consideration the VNF design has to be done.
The output of the design phase would be the HLD and LLD of the VNF.

Identify the onboarding mechanism.

#Modeling
The next step is creating the models of the VNF according to that. There are two modeling options for VNFs
HOT
TOSCA
Selection of the modeling option depends on the mechanism of onboarding.

HOT
Heat Orchestration Template is the template used by OpenStack Heat. A HOT package consists of a set of Heat template files in YAML, and describes the virtual resources such as networks, block storage volumes, virtual machines, flavors etc. Additionally the HOT package can include scripts and binaries that would be loaded to VMs after instantiation.

TOSCA
TOSCA is the modeling language adapted by ETSI NFV framework for creating VNF packages. The initial version of TOSCA used XML as the modeling language, but the new version has apapted YAML. TOSCA goes beyond defining the virtual resources, and define policies for scaling etc.

The outcome of the modeling phase is the VNF package.

#Deployment

