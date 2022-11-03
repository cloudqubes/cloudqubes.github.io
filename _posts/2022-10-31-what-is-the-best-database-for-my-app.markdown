---
layout: post
title:  "What is the best database (for my app)?"
date:   2022-11-03 07:00:00 +0530
categories: [insights, database]
tags: ["Database", "NoSQL"]
---



You’ve got an exciting idea to build a new digital product. You start coding, and ask yourself, “What database should I use?”.  “Everyone out there is talking about that hot, new, powerful database. I will use the same.” comes the innermost answer.

Halfway through the development, you realize that the hot, new database has a frustrating learning curve, a complex query interface, and is not at all suitable for your application. You decide to dump it and settle down for a more proven solution. 

# Cost of wrong decisions

However, you have to pay a price. You must redesign your data model and discard some of the code that you have already written. This is going to impact your delivery timelines. 

You are not the only one who has had this bad experience. There are many types of databases, and they exist for different purposes. As a developer, it’s your responsibility to select the correct one for your use case because an unfitting database will cost you time and money. 

So that you can choose the best database for your next application, let’s discuss about the popular types of databases and their use cases.

# Relational vs NoSQL Databases

## Relational Databases

Relational database and SQL are two frequently associated terms with databases, and there is a good reason for that. Relational databases were the prominent database systems until about 2009 from the 1970s. 

Relational databases are built on the relational model proposed by E.F Codd, in a [paper published in communications of the ACM] [relational-model], in 1970. The relational model defines a relation as a set of n tuples, where each tuple is an array of ordered columns. 

Let's see how we can model a student dataset consisting of students and their classes according to the relational model. 

![Relational model](/assets/images/what-is-the-best-database/relational-model.png){: width="100%" }
*Relational model - Students database*

The Students and Classes are relations with 2 and 5 tuples respectively. The “Student_Classes” defines a many-to-many relationship between them.

Structured Query Language (SQL) was developed based on this relational model. Relational model and SQL paved the way for the development of very successful, widely used relational database software such as [Oracle], [MySQL], [PostgreSQL], etc. These relational databases have proved their capability by efficiently handling billions of records in many web and enterprise applications.

## Limitations of relational databases
The growth of Web 2.0 applications from 2004, began pushing relational database technology to its limits. Web 2.0 companies had to handle exponentially growing datasets consisting of billions and billions of records. To handle such huge data volumes more CPU and memory are required. However, there is a certain limitation of CPU and memory that can be provisioned in a single machine. Beyond that, the only option is to scale horizontally - increase the number of servers. 

In a horizontally scalable database system, each machine in the cluster will own only a portion of the total dataset. The relational databases have problems with this type of horizontal scaling. Certain SQL operations such as `JOIN` and `GROUP BY` can only be efficiently executed when the complete dataset is available in a single server. Also, preserving characteristics such as uniqueness become challenging when the dataset is split across the cluster. Therefore, a relational database works best when the dataset is replicated across all machines in the cluster. But, that is inefficient

## The rise of NoSQL

Driven by the requirement of web-scale companies to overcome these limitations, new database technologies began to emerge. These databases were inherently non-relational so they did not support SQL. Therefore, they were called NoSQL databases, but a better name would have been non-relational databases. Unlike relational databases, NoSQL databases were designed to be horizontally scalable.

As the NoSQL concept further evolved, many types of NoSQL databases were developed for specific use cases. Today, NoSQL has become an umbrella term to denote all these different types of databases. 

However, some developers believe that they must dump relational databases and should use only NoSQL. But, that is a delusion. Also, since NoSQL has become an umbrella term the belief that NoSQL is the only database you need, does not help you to choose any one of those NoSQL databases out there.

# Types of NoSQL databases

We are going to discuss the most popular types of NoSQL databases. Just keep in mind that new types of databases will be developed for new use cases in the future.

## Key-value database

As the name implies, a key-value database uses a simple key-value model to store data. The key has to be unique and the value could be anything such as numbers, strings, JSON objects, etc. 

Key-value databases do not process the value so, no queries can be executed based on the value. These databases do not support a query language as well. The values can only be retrieved based on the keys. 

Here’s how we could model students and their classes in a key-value database.

![Key-value model](/assets/images/what-is-the-best-database/key-value-model.png){: width="100%" }
*Key-Value model*


Key-value databases are suitable for storing config parameters, in-memory data caching, managing session data in web applications, leaderboards, etc. While it’s not impossible to develop an e-commerce application or a blog with a key-value database, it may not be the best for such an application.

[Riak KV] and [etcd] are two open-source key-value databases. [Amazon DynamoDB] is a hosted key-value database from AWS.

Let’s see how to build our student database with [etcd].

{% highlight shell %}
ubuntu@db:~$ etcdctl put name:s1 Hal
OK
ubuntu@db:~$ etcdctl put name:s2 Roger
OK
ubuntu@db:~$ etcdctl put classes:s1 "Mathematics,Science,Geography" 
OK
ubuntu@db:~$ etcdctl put classes:s2 "Mathematics,Art,Philosophy" 
OK
ubuntu@db:~$ etcdctl get name:s1
name:s1
Hal
ubuntu@db:~$ etcdctl get classes:s1
classes:s1
Mathematics,Science,Geography
ubuntu@db:~$ etcdctl get classes:a classes:z
classes:s1
Mathematics,Science,Geography
classes:s2
Mathematics,Art,Philosophy
{% endhighlight %} 

## Document databases
A document database is an extension to the key-value database type, and stores data as documents with a structured format. A document could be structured in XML, YAML, JSON, or even BSON to support binary data. 

Unlike a key-value database which is unaware of the contents of the value, a document database processes and stores the contents of the document so that we can execute queries on the values stored in the document. 

Most document databases organize the documents into groups or collections. While a collection contains similar documents, each document in the same collection can have unique fields as there is no fixed schema.

Let’s model our student dataset in a document database. 

![Document data model](/assets/images/what-is-the-best-database/document-model.png){: width="100%" }
*Document data model*


Due to the flexibility of the document data model, document databases are suitable for a wide variety of use cases like blogs, e-commerce, and enterprise applications. Most datasets that will fit into a relational data model can be modeled to fit a document database as well. However, since there is no support for SQL the data must be modeled to support efficient querying according to the individual use cases.

[MongoDB] is a popular open-source document DB that is also avaialble as a cloud service. [Amazon DocumentDB] and [Google Firestore] are document databases in the cloud.

This is how we create our student database with [MongoDB].

{% highlight shell %}
test> use student-db
switched to db student-db
student-db> db.students.insert({"name": "Hal", classes: ["Mathematics", "Science", "Geography"]})
DeprecationWarning: Collection.insert() is deprecated. Use insertOne, insertMany, or bulkWrite.
{
  acknowledged: true,
  insertedIds: { '0': ObjectId("6357ecdbed4483b3378ebe4d") }
}
student-db> db.students.insert({"name": "Roger", classes: ["Mathematics", "Arts", "Philosophy"]})
{
  acknowledged: true,
  insertedIds: { '0': ObjectId("6357ece0ed4483b3378ebe4e") }
}
student-db> db.students.find()
[
  {
    _id: ObjectId("6357ecdbed4483b3378ebe4d"),
    name: 'Hal',
    classes: [ 'Mathematics', 'Science', 'Geography' ]
  },
  {
    _id: ObjectId("6357ece0ed4483b3378ebe4e"),
    name: 'Roger',
    classes: [ 'Mathematics', 'Arts', 'Philosophy' ]
  }
]
student-db> 
{% endhighlight %} 

Unlike in the key-value database, we can search within a document in a document database. Here’s how we get students who are attending the “Arts” class.

{% highlight javascript %}
student-db> db.students.find({classes: 'Arts'})
[
  {
    _id: ObjectId("6357ece0ed4483b3378ebe4e"),
    name: 'Roger',
    classes: [ 'Mathematics', 'Arts', 'Philosophy' ]
  }
]
{% endhighlight %} 

## Wide-Column database 

Wide column databases store data in rows and columns like a relational database. However, unlike a table in a relational database, a wide-column database defines columns per row. Therefore, each row in a wide-column database can contain a set of unique columns. Tables in a wide-column database can be split across multiple machines to support horizontal scaling.

Let’s model the grades of our student application in a wide-column database.

![Wide-column data model](/assets/images/what-is-the-best-database/wide-column-model.png){: width="100%" }
*Wide-column data model*


The set of columns starting with “grades:” in this model is called a column family. This column family has separate columns for each student based on the classes they take.

While we use this model for demonstration, a wide-column database is not the best database type for an application like a student database. A wide-column database is a good fit for data sets with variable parameter types. You may not often get such datasets in common business applications, but they do occur in scientific and engineering applications. Fault alarms in a telecommunication network, performance data in data center servers, and access logs in firewalls are some examples that will benefit from a wide-column database.

[Apache Cassandra] is an open-source wide-column database and [Google Bigtable] is a wide-column database offered as a service from GCP.

Wide-column databases do not support SQL. But, some wide-column databases support a query interface named CQL (Cassandra Query Language). While CQL may look like SQL, it does not support JOIN operations. 

## Graph databases

Graph databases excel at handling highly connected data sets. A graph database stores data as nodes and relationships making the relationships instantly available for queries.

Relational databases handle connections via one-to-many or many-to-many relationships and JOIN operations. This may be efficient enough for first or second-degree connections but falls short beyond that. A graph database can effectively handle datasets with connections that extend beyond 20 or 30 degrees. 

Again, let’s model our student dataset for a graph database.

![Graph data model](/assets/images/what-is-the-best-database/graph-model.png){: width="100%" }
*Graph data model*

Graph databases are suitable for use cases like recommendation engines, access and user management systems, fraud detection systems, etc. 

[NebulaGraph] and [Neo4j] are open-source graph databases that are also available as cloud services. [Amazon Neptune] is a graph database service from AWS. 

## Time series 

A time series database is a specific type of NoSQL database optimized to store a series of metrics or events with a timestamp. It is also possible to use relational or document databases to store such data. But, time series datasets have some unique requirements like aggregating, archiving old data, etc., which cannot be effectively done with relational or document types of databases. Therefore, a purpose-built time series database is more efficient than other databases for storing time series data.

A time series database stores data in columnar format, so it can split data across multiple servers to support horizontal scaling. It is a write-many-read-less type of database as data points in a time series database would be occurring continuously and need to be written to the database at the same rate. 

It’s impossible to adopt a time series data model for a student database. So, let’s assume Hal and Roger are trying to record weather data from an IoT device.

The first device named dev-1, can measure relative humidity. So, we design the time series database with a single series with key “dev-1:humidity”.

![Time series data model](/assets/images/what-is-the-best-database/time-series-model-1.png){: width="100%" }
*Time series model - Single device.*


Several days later Hal and Roger set up a new device dev-2 which can measure both humidity and temperature. So, we add two new series with keys “dev-2:humidity” and “dev-2:temperature”. 

![Time series data model](/assets/images/what-is-the-best-database/time-series-model-2.png){: width="100%" }
*Time series model - Multiple devices.*

The beauty of the time series databases is that we do not have to mess with the existing data to add the new series. Also, this data model will easily scale to millions of devices. If newer devices come with more measurement capabilities we can quite efficiently incorporate those measurements as well.

[Prometheus] and [Riak TS] are two popular open-source time series databases. [Influx DB] is an open-source time series database that is also available as a cloud service.

## Search Engine

Search engine databases are purpose-built for searching textual contents. This is equivalent to an Internet search engine so it is named as a search engine database. A typical search engine database analyzes the text contents and creates indexes, similar to an index in a book. When a search is executed, the database can quickly find the mapping content via this index. 

Search engine databases are helpful for full-text searching in news websites, blogs, software documentation, etc. Log file analysis is another important use case of search engine databases. Typical log files contain a textual description of a certain event or fault in a system. A search engine database can search and correlate log files from multiple sources to yield insightful results.

Again, a search engine database is by no means applicable for a student database. So, let’s assume that Hal and Roger are using a search engine database to index a set of documents on African wildlife.

![Search engine database](/assets/images/what-is-the-best-database/search-engine-database.png){: width="100%" }
*Search engine database.*

There can be an n number of documents. Since we are interested in wildlife, we are creating the index based on animals. Whenever a new document is added, the database will update the index. We can query the database using animal names, and quickly get the response containing the documents where the respective names are mentioned.

[Apache Solr] is an open-source search engine database. [ElasticSearch] is another open-source search engine database that’s also available as a hosted service in AWS and GCP. [Algolia] is a  search engine database that is provided as a hosted solution.

## Spatial

Navigating digital maps has become a part of our everyday lifestyle. Digital maps are required to store and process spatial data that represents geographic locations on Earth. There is a series of standards defined in ISO/TC 211 for spatial data representations. These spatial datasets are stored in spatial databases. 

Often, a spatial database is a relational or a non-relational database, enhanced to store spatial data. [GeoMesa] is such a toolset that enables spatial data support in [Google Bigtable], [Cassandra], [HBase], etc. [Postgis] is also an open-source extension that adds the geospatial capability to [PostgreSQL].

Navigation is the most common use case of digital maps. But, digital maps are used in other applications including civil engineering, telecommunication network planning, seismic surveys, etc. These spatial datasets in these maps need to contain information such as elevation, building infrastructure, soil condition, etc. Spatial databases with support for specific types of information will be required for these kinds of use cases. 

## Multi-model databases

Some applications depend on multiple types of datasets so using one specific type of database is not efficient. As an example, a social media application may have one dataset that is best suited for a relational database and another dataset that requires features of a graph database. These applications are also called polyglot persistence applications. 

While they benefit from using different database technologies, using several databases leads to synchronization problems and operational overhead. Multi-model databases solve this problem by merging the flexibility of NoSQL and the features of relational databases. These databases support executing queries in relational or non-relational models. 

Most multi-model databases available today are extensions built on top of previous relational to NoSQL databases. An example is the JSON support added in [PostgreSQL]. [FaunaDB] is a multi-model database that is available as a service. [Couchbase], which is primarily a NoSQL database, offers many features of a relational database.

# Choosing the right database
A database is an integral part of any web, mobile or enterprise application, and most often is the limiting factor of scalability.

Once an application is in operation, swapping the database is no easy task. Therefore, you must ensure that you are choosing the best database right at the beginning.

## Things to consider - your use case must come first
The best database for your application is not necessarily the most scalable or the most popular database out there. Your use case determines the type of data you are working with and the scale. So, your use case is the most important factor for your decision about the database.

However, there are some other factors that will also come into play.

1. Expertise
> If you have previous experience with a particular database, you tend to stick to it and avoid the learning curve of using totally new technology. 

2. Programming language/framework
> Some programming languages and frameworks officially support specific database types. As an example, Both [Django] and [RubyOnRails] support [PostgreSQL] and [MySQL] out of the box. Similarly, [Node.js] supports [MongoDB]. If you have already decided on the programming language or the framework, you may prefer using one of those officially supported databases.

3. Industry trend
> From time to time, new technologies emerge, and create hype in the industry. You may be tempted to select a database technology simply because it’s the hottest trend. The popularity of NoSQL databases in the recent past caused many developers to adopt them even for inappropriate use cases. 

Expertise and the programming language could be fairly reasonable considerations when choosing a database. But, the use case must be the most weighted factor of your database decision. Choosing the database based on the industry trend is the worst thing you could do.

## The best database for your application
There is no silver bullet in database management systems. Therefore, you must analyze your use case and select the best database that fits your needs and deliver your expected results. However, some databases can be adapted for multiple use cases. As an example, you can use a relational database to store time series data. But, using a time series database will be more efficient. 

## Hype around NoSQL

NoSQL databases have created lots of industry hype. NoSQL databases could be more scalable than relational databases due to their design. But, if your data model does not fit a NoSQL database, the scalability of NoSQL is not going to help you. Also, the fact that NoSQL databases are more scalable does not imply that relational databases are not scalable. The recent developments in relational databases have added various scaling features that we hope to discuss in some upcoming articles. 

If you are choosing a NoSQL database, the most important thing is to choose the right type of NoSQL database as there are several variants in the NoSQL domain. 

Always remember that a wrong design with the database will definitely impact your application launch. You do not want to miss your deadline just because you were messing with the most powerful database technology on the planet.

[relational-model]: https://doi.org/10.1145%2F362384.362685
[Riak KV]: https://riak.com/products/riak-kv/
[etcd]: https://riak.com/products/riak-kv/
[Amazon DynamoDB]: https://aws.amazon.com/dynamodb/
[MongoDB]: https://www.mongodb.com
[Amazon DocumentDB]: https://aws.amazon.com/documentdb/
[Google Firestore]: https://cloud.google.com/firestore
[Apache Cassandra]: https://cassandra.apache.org/_/index.html
[Google Bigtable]: https://cloud.google.com/bigtable/docs/overview
[NebulaGraph]: https://www.nebula-graph.io
[Neo4j]:https://neo4j.com
[Amazon Neptune]: https://aws.amazon.com/neptune/
[Prometheus]: https://prometheus.io
[Riak TS]:https://riak.com/products/riak-ts/
[Influx DB]: https://www.influxdata.com
[Apache Solr]: https://solr.apache.org
[ElasticSearch]: https://www.elastic.co
[Algolia]: https://www.algolia.com
[GeoMesa]: https://www.geomesa.org
[Cassandra]: https://cassandra.apache.org/_/index.html
[HBase]: https://hbase.apache.org
[Postgis]: https://postgis.net
[PostgreSQL]: https://www.postgresql.org
[FaunaDB]: https://fauna.com
[Couchbase]: https://www.couchbase.com
[MySQL]: https://www.mysql.com
[Django]: https://www.djangoproject.com
[RubyOnRails]:https://rubyonrails.org
[Node.js]: https://nodejs.org/en/
[Oracle]: https://www.oracle.com/database/technologies/
