#!/bin/bash

#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
set -eu
set -o pipefail

ALLOW_REMOTE_GEMS=false
SOURCE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

main() {
    parse_arguments "$@"
    check_dependencies
    setup
}

setup() {
    header "Preparing to build docker containers"
    prepare_server

    header "Building docker containers"
    export USER_ID=$(id -u)
    export GROUP_ID=$(id -g)
    docker-compose build 2> >(indent 1>&2) | indent

    setup_client
    setup_server

    # Make sure the prompt isn't indented.
    echo
}

setup_client() {
    pushd "${SOURCE_DIR}"/client

    header "Creating .env file (if it doesn't exist)"
    cp -an .env.example .env

    header "Installing packages"
    client yarn 2> >(indent 1>&2) | indent

    popd
}

prepare_server() {
    pushd "${SOURCE_DIR}"/server

    subheader "Creating server/config/foreman/local.dev.env file (if it doesn't exist)"
    cp -an config/foreman/dev.env config/foreman/local.dev.env

    popd
}

setup_server() {
    pushd "${SOURCE_DIR}"/server
    header "Running server setup script"
    if $ALLOW_REMOTE_GEMS ; then
        bin/setup --remote-gems
    else
        bin/setup
    fi
    popd
}

usage() {
    echo "Usage: $(basename $0) [--remote-gems]"
    echo
    echo "Build the client and server docker containers."
    echo
    echo "If --remote-gems is given gems will be downloaded from the internet where needed."
    echo "Otherwise they will have to be cached."
}


check_dependencies() {
    type -p docker > /dev/null || { echo "Please install docker and docker-compose" ; exit 1; }
    type -p docker-compose > /dev/null || { echo "Please install docker-compose" ; exit 1; }
}

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --remote-gems)
                ALLOW_REMOTE_GEMS=true
                shift
                ;;

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

header() {
    echo -e "\n>>> $@ <<<"
}

subheader() {
    echo -e " ---> $@"
}

indent() {
    sed 's/^/  /'
}

main "$@"
