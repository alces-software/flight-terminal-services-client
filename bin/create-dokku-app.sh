#!/bin/bash

set -euo pipefail

FLY_VERSION=0.5.0-dev
FLY_DOWNLOAD_URL=https://s3-eu-west-1.amazonaws.com/alces-flight/FlightAttendant/${FLY_VERSION}/linux-x86_64/fly
FLY_EXE_PATH=/app/fly

main() {
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    header "Creating app"
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
    ssh launch.alces-flight.com \
        "dokku apps:create flight-launch"
}

configure_server() {
    ssh launch.alces-flight.com \
        "dokku config:set --no-restart flight-launch \
            BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-ruby.git \
            FLY_DOWNLOAD_URL=$FLY_DOWNLOAD_URL \
            FLY_EXE_PATH=$FLY_EXE_PATH \
            WAIT_FOR_ARN_DURATION=120 \
            DEFAULT_KEY_PAIR=aws_ireland \
            DEFAULT_REGION=eu-west-1 \
            ALCES_LOG_WRITER_DEST=stdout \
            RACK_ENV=production \
            RAILS_ENV=production \
            SMTP_HOST= \
            SMTP_PASSWORD= \
            SMTP_USERNAME= \
            "

    ssh launch.alces-flight.com \
        "dokku domains:add flight-launch launch.alces-software.com"
}

print_further_instructions() {
    echo ""
    echo "Add configuration for SMTP_{HOST,PASSWORD,USERNAME}"
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

main "$@"
