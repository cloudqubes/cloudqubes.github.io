

+----------------------------+--------------------------------------------------------------------+
| Field                      | Value                                                              |
+----------------------------+--------------------------------------------------------------------+
| OS-FLV-DISABLED:disabled   | False                                                              |
| OS-FLV-EXT-DATA:ephemeral  | 0                                                                  |
| disk                       | 0                                                                  |
| id                         | 71e7523d-bc8e-449d-bd50-ff66e41de0bc                               |
| name                       | vnfm_flavor_8eccafdd-5b13-4f92-8373-fa01e9d7d4b7                   |
| os-flavor-access:is_public | True                                                               |
| properties                 | aggregate_instance_extra_specs:zone='true', hw:cpu_policy='shared' |
| ram                        | 24576                                                              |
| rxtx_factor                | 1.0                                                                |
| swap                       |                                                                    |
| vcpus                      | 8                                                                  |
+----------------------------+--------------------------------------------------------------------+

add extra specs to host aggregate as zone = true

To select the host where instances are launched, use the --availability-zone ZONE:HOST:NODE parameter on the openstack server create command.

For example:

$ openstack server create --image IMAGE --flavor m1.tiny \
  --key-name KEY --availability-zone ZONE:HOST:NODE \
  --nic net-id=UUID SERVER