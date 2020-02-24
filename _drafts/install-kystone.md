enable OpenStack repository
# add-apt-repository cloud-archive:stein

update packages
# sudo apt update

install OpenStack client
# apt install python3-openstackclient

install MariaDB
# apt install mariadb-server python-pymysql

create file /etc/mysql/mariadb.conf.d/99-openstack.cnf 

[mysqld]
bind-address = 10.124.70.115

default-storage-engine = innodb
innodb_file_per_table = on
max_connections = 4096
collation-server = utf8_general_ci
character-set-server = utf8

edit /etc/hosts
10.124.70.115 key-vm

restart mysql
# service mysql restart

secure mysql
# mysql_secure_installation
root password
root^321 password

install rabbitMQ
# apt install rabbitmq-server

add openstack user for rabbitmq
# rabbitmqctl add_user openstack rabbit^321

set permissions for openstack user
# rabbitmqctl set_permissions openstack ".*" ".*" ".*"

install memcached
# apt install memcached python-memcache

set the interface in /etc/memcached.conf
-l 10.124.70.115

restart memcached
# sudo service memcached restart

install etcd
# apt install etcd

did not change anythin in /etc/default/etcd

check the status of etcd
# sudo systemctl status etcd

Install Keystone

login to mysql

# sudo mysql -u root -p

create database
MariaDB [(none)]> create database keystone;

grant priviledges
GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost' \
IDENTIFIED BY 'KEYSTONE_DBPASS';
GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%' \
IDENTIFIED BY 'KEYSTONE_DBPASS';

create additional user
CREATE USER 'keystoneuser'@'localhost' IDENTIFIED BY 'key^321';
GRANT ALL PRIVILEGES ON keystone.* TO 'keystoneuser'@'localhost';


install keystone package
# apt install keystone

update keystone.conf
[database]
# ...
connection = mysql+pymysql://keystone:KEYSTONE_DBPASS@key-vm/keystone

[token]
# ...
provider = fernet

populate the database
# keystone-manage db_sync

initialize fernet key repo
# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone

bootstrap
# keystone-manage bootstrap --bootstrap-password keystone^321 \
  --bootstrap-admin-url http://key-vm:5000/v3/ \
  --bootstrap-internal-url http://key-vm:5000/v3/ \
  --bootstrap-public-url http://key-vm:5000/v3/ \
  --bootstrap-region-id RegionOne

configure apache
edit /etc/apache2/apache2.conf
ServerName key-vm

restart apache2
# systemctl restart apache2.service

configure environment variables

create file keystone with below.

export OS_USERNAME=admin
export OS_PASSWORD=keystone^321
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://key-vm:5000/v3
export OS_IDENTITY_API_VERSION=3

$ source keystone

