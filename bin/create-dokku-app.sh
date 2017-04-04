#!/bin/bash

set -euo pipefail

FLY_VERSION=0.5.0-dev
FLY_DOWNLOAD_URL=https://s3-eu-west-1.amazonaws.com/alces-flight/FlightAttendant/${FLY_VERSION}/linux-x86_64/fly
FLY_EXE_PATH=/app/fly

APP_NAME=flight-launch

main() {
    parse_arguments "$@"
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    header "Creating ${APP_NAME} app on ${DOKKU_SERVER}"
    create_app
    subheader "Adding configuration"
    configure_server
    subheader "Running deploy script"
    print_further_instructions
}

abort_if_uncommitted_changes_present() {
    if ! git diff-index --quiet HEAD ; then
        echo "$0: Uncommitted changes present aborting. Either stash or commit."
        exit 2
    fi
}

create_app() {
    ssh ${DOKKU_SERVER} \
        "dokku apps:create ${APP_NAME}"
}

configure_server() {
    ssh ${DOKKU_SERVER} \
        "dokku config:set --no-restart ${APP_NAME} \
            BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-ruby.git \
            FLY_DOWNLOAD_URL=$FLY_DOWNLOAD_URL \
            FLY_EXE_PATH=$FLY_EXE_PATH \
            WAIT_FOR_ARN_DURATION=120 \
            DEFAULT_KEY_PAIR=aws_ireland \
            DEFAULT_REGION=eu-west-1 \
            ALCES_LOG_WRITER_DEST=stdout \
            RACK_ENV=production \
            RAILS_ENV=production \
            SMTP_HOST=smtp.sparkpostmail.com \
            SMTP_PASSWORD=${SMTP_PASSWORD} \
            SMTP_USERNAME=SMTP_Injection \
            "

    ssh ${DOKKU_SERVER} \
        "dokku domains:add ${APP_NAME} ${DOKKU_SERVER}"
}

print_further_instructions() {
    echo ""
    echo "If not already done, add configuration for SMTP_PASSWORD"
    echo "Then run deploy.sh"
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
    echo "Create and configure the ${APP_NAME} dokku app"
    echo
    echo -e "      --dokku-server SERVER\t\tThe server on which to create the app"
    echo -e "      --smtp-password PASSWORD\t\tThe SMTP password to configure the app to use"
    echo -e "      --help\t\tShow this help message"
}

DOKKU_SERVER=launch.alces-flight.com
SMTP_PASSWORD=

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --dokku-server)
                DOKKU_SERVER=$2
                shift
                shift
                ;;

            --smtp-password)
                SMTP_PASSWORD=$2
                shift
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

main "$@"
