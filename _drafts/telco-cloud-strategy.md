purpose - 
How to formulate a cloud strategy for telcos

inform telco executives on the significance of cloud strategy. How to avoid chaotic situations. How to fromulate the cloud strategy and take actions.

Why do I need a cloud strategy?
What should be in a cloud strategy?
How should I formulate a cloud strategy and put it in to action?
--------------------------------------
Cloud is a hot topic in the enterprise community these days. It is more so, for the telcos who have been running legacy network equipments for decades. The cloud transformation is being driven by suppliers, internal customers and external customers. For the traditional telco systems with life spans of 5-7 years this transformation is more significant.

Traditionally telcos have been running there workloads in legacy systems with monolithic hardware and software platforms. These systems delivered mainly voice and broadband data connectivity in a stable operating conditions. The advent of NFV has created a tremendous hype in this still nature.

For most telcos the cloud transformation is driven by incumbent suppliers, who replace their current legacy systems with new virtualized applications runnig on NFV infrastructure provided by same suppliers. On the otherhand most of these telcos have inhouse data centers build by IT departments over decades, with multiple cloud infrastrucutre. 

While the CTOs are driving the NFV transformation, the CIOs are driving a cloud transformation on their own.

# What's in a strategy?

## Analysis of the current situation

A good strategy starts with an analysis of the present situation. You need to anlyse the situation internally and externally and get answers to these questions.

1. What are the cloud technologies currently being used by your company.
As of today you probably have an IT cloud. This could consists of either VMware or OpenStack based virtualization or a combination of both. Additionally it could have supportive infrastructure like firewalls, DC gateways, orchestration and cloud management solutions.

2. Public cloud
Additionally you could be using public clouds such as AWS, Azure or Google. You have to collect waht applications are already deployed on these clouds and what products and services are being used such as containers, databases etc.

3. Current cost model
Do not forget to analze the cloud investement for the past three years to get an understanding of teh current cost model. You may have done new investments to acquire cloud capacity and you may be paying license costs to Vmware and OpenStack as opex. Include the opex costs of public cloud as well.

4. What your competitors are doing?

It is important to be aware of what your competitors are doing right now. How far have they gone in the cloud transformation journey could provide you some insights on waht paths to take and whether you are ahead of them. In the cloud and teh agile world it is always about being the fastest than being the best.

5. What is happening in the region and the world?

Analyzing what other telcos in the region doing, can you get insights. What cloud technologies they are adapting and how they are using it will be helpful. Case studies and industry white papers could help in this regard.

### What are the current problems?

**A framework to analyze what's going on**

A strategy is required when there is a non trivial problem to be solved.

Broadly, business problems are associated with either change or competition. In case of NFV, the problem is caused more by change than by competition. It's important to distinguish this before start working on the problem. 

Once you have gathered all the data of the current situation you need to clearly define the problem or problems that you are going to solve. I emphasize the work clearly, because an unclear definition can lead to bad results.

People start projects with so much focus on the end results, that they forget why they are doing it in the first place. In the cloud transformation, you may have end goals such as agility, lower time to market, lower capex and opex. However, it is important to realize that these are the end goals. 

A good way to identify the problem is to ask why. Ask the question why until you get to the root. Here is how you do it.

Q: Why do I need NFV?
A: I need agility, flexibility, fast go to market cycle

Q: Why do I need agility? Why do I need to optimize investment?
A: If I do not, my competitors will gain advantage by doing this.

The other way of finding is based on negative anticipation.
To uncover by negative anticipation, ask the question what will happen if I do not do this.
Q: If I do not implement NFV
A: The incombents will build siloed cloud infrastructure.

Q: So, what?
A: More costs, infrastructure not unified.

Or you could list a table.

Impact of not doing
1. Incumbents will build siloed clouds
2. It will cost more
3. They will have very little flexibility for onboarding third party VNFs
4. The incumbent will not give control of the NFV to telco
5. 

 This requires careful analysis of the current situation and an anticipation of the future.

It's important to have a solid grip at what's going on, before deciding on what the outcome needs to be. 

1. Investements in multiple separate clouds - IT, enterprise, NFV
2. Influence from incumbent vendors
3. Hard to validate business cases with the high initial costs
4. Fast changing technology that gets outdated rapidly

Areas
1. Current network - what is the drive from incumbent vendors
2. What are the pain points of operations teams and planning teams
3. What cost most in the BAU expansion

## What are we going to do?

From a highlevel view point there are two options you can choose for cloud transformation.

1. NFV transformation driven by VNF
2. NFV transformation driven by NFV platform

### Only one incumbent supplier
If you choose the transformation driven by VNF, you select the VNFs that would demand largest computing capacity and virtualize it first. Naturally this is going to be the EPC. You get a new virtualized EPC running on an NFV platform of the incumbent supplier first. Over time you expand this NFV platform and onboard all other applications such as IMS, HLR etc from the same supplier.
After the platform is running stable you start onboarding VNFs from third party suppliers.

If you choose the other option, you select an open decoupled NFV platform from a supplier other than the incumbent. Then start onboarding small low risk VNFs. This could be like SMSC, firewall etc. Once the platform is stable you start onboarding the main stream applications from the incumbent.
You have to be aware that this is a bumpy road. The incumbent supplier may put strong resistance to onboard on an NFV platform from another supplier. 

### Multiple incumbent suppliers
If you have multiple incumbent suppliers, VNF driven transformation would end up in multiple NFV platforms. 

If you seect the option of transformation driven by platform you choose an open NFV platform and onboard all VNFs from incumbent in to this new platform.




## How are we going to do it?

