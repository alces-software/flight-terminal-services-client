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

REPO_ROOT="$(git rev-parse --show-toplevel)/manage"

main() {
    parse_arguments "$@"
    check_dependencies
    setup
}

setup() {
    header "Setting up manage client"
    pushd "${REPO_ROOT}"
    subheader "Creating .env file (if it doesn't exist)"
    cp -an .env.example .env
    subheader "Installing packages"
    yarn 2> >(indent 1>&2) | indent
    popd

    # Make sure the prompt isn't indented.
    echo
}

usage() {
    echo "Usage: $(basename $0) [--remote-gems]"
    echo
    echo "Build the launch client and server docker containers."
    echo
    echo "If --remote-gems is given gems will be downloaded from the internet where needed."
    echo "Otherwise they will have to be cached."
}


check_dependencies() {
    :
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
