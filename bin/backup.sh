#!/bin/bash

set -euo pipefail

APPS=(flight-launch flight-launch-staging)

main() {
    parse_arguments "$@"

    local suffix backup_dir tar_file

    suffix=$( date +"%F-%H%M%S" )
    backup_dir="/home/ubuntu/backups/${suffix}"
    tar_file="/home/ubuntu/backups/flight-launch-backup-${suffix}.tar.gz"

    create_dirs
    create_env_var_files
    copy_ssl_certs
    create_tar_file
    upload_tar_file_to_s3
}

create_dirs() {
    for app in ${APPS[@]}; do
        mkdir -p "${backup_dir}/${app}"
    done
}

create_env_var_files() {
    local app
    for app in ${APPS[@]}; do
        dokku config ${app} --shell \
            | grep -v '^DOKKU_' \
            | tr -d \' \
            > "${backup_dir}/${app}/config.vars"
    done
}

copy_ssl_certs() {
    # Copy the ssl certs into the backup dir so that they can be imported
    # through the dokku CLI, which will then generate the correct ngxin
    # configuration for them.
    local app
    for app in ${APPS[@]}; do
        cp -a /home/dokku/${app}/tls/server.crt ${backup_dir}/${app}/server.crt
        cp -a /home/dokku/${app}/tls/server.key ${backup_dir}/${app}/server.key
    done
}

create_tar_file() {
    tar czf ${tar_file} \
        /home/dokku/flight-launch{,-staging}/htpasswd/ \
        /home/dokku/flight-launch{,-staging}/nginx.conf.d/ \
        /home/dokku/flight-launch{,-staging}/DOKKU_SCALE/ \
        ${backup_dir}
}

upload_tar_file_to_s3() {
    export AWS_ACCESS_KEY_ID=$( dokku config:get ${APPS[0]} AWS_ACCESS_KEY_ID )
    export AWS_SECRET_ACCESS_KEY=$( dokku config:get ${APPS[0]} AWS_SECRET_ACCESS_KEY )

    aws s3api put-object \
        --acl private \
        --content-type application/gzip \
        --bucket alces-flight \
        --key "FlightLaunch/backups/flight-launch-backup-${suffix}.tar.gz" \
        --body "${tar_file}"
}


header() {
    echo -e "=====> $@"
}

subheader() {
    echo -e "-----> $@"
}

indent() {
    sed 's/^/       /'
}

usage() {
    echo "Usage: $(basename $0) [options]"
    echo
    echo "Backup dokku app configuration to S3"
    echo
    echo -e "      --help\t\tShow this help message"
}

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --help)
                usage
                exit 0
                ;;

            *)
                echo "$(basename $0): unrecognized option ${key}"
                usage
                exit 1
                ;;
        esac
    done
}

main "$@"
