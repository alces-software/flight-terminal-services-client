#!/bin/bash

set -euo pipefail

APPS=(flight-launch flight-launch-staging)

main() {
    parse_arguments "$@"
    if [ "${BACKUP_DATE}"  == "" ] ; then
        echo "Option --backup-date missing"
        usage
        exit 1
    fi

    BACKUP="flight-launch-backup-${BACKUP_DATE}.tar.gz"

    header "Fetching backup ${BACKUP}"
    fetch_backup
    header "Extracting backup"
    extract_backup
    header "Reconfiguring apps"
    reconfigure_dokku_apps
    header "Install SSL certs"
    install_ssl_certs
}

fetch_backup() {
    aws s3 cp \
        "s3://alces-flight/FlightLaunch/backups/${BACKUP}" \
        .
}

extract_backup() {
    sudo tar xzf ${BACKUP} -C /
}

reconfigure_dokku_apps() {
    local app config_vars_path
    for app in ${APPS[@]}; do
        config_vars_path="/home/ubuntu/backups/${BACKUP_DATE}/${app}/config.vars"

        dokku config:set ${app} \
            --no-restart \
            $( cat ${config_vars_path} )
    done
}

install_ssl_certs() {
    local app prefix
    for app in ${APPS[@]}; do
        prefix="/home/ubuntu/backups/${BACKUP_DATE}/${app}/server"
        dokku certs:add ${app} ${prefix}.{crt,key}
    done
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
    echo "Restore backup from S3"
    echo
    echo -e "      --backup-date\t\tDate of backup to restore"
    echo -e "      --help\t\tShow this help message"
}

BACKUP=
BACKUP_DATE=

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --help)
                usage
                exit 0
                ;;

            --backup-date)
                BACKUP_DATE=$2
                shift
                shift
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
