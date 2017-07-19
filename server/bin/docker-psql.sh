#!/bin/bash

container_name=flightlaunch_db_1
database=launch
db_ip=$( docker inspect flightlaunch_db_1 | jq -r '.[].NetworkSettings.Networks[].IPAddress' )
echo "Connecting to ${db_ip}" >&2
psql -h ${db_ip} -U postgres launch
