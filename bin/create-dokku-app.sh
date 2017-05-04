#!/bin/bash

set -euo pipefail

FLY_VERSION=0.6.0-dev
FLY_DOWNLOAD_URL=https://s3-eu-west-1.amazonaws.com/alces-flight/FlightAttendant/${FLY_VERSION}/linux-x86_64/fly
FLY_EXE_PATH=/app/fly

APPS=(flight-launch flight-launch-staging)
declare -A DOMAINS

main() {
    parse_arguments "$@"
    determine_domains

    header "Checking repo is clean"
    abort_if_uncommitted_changes_present

    for app in ${APPS[@]}; do
        header "Creating ${app} app on ${DOKKU_SERVER}"
        create_app
        subheader "Adding configuration"
        configure_app
    done

    subheader "Adding cronjob"
    add_cronjobs
    subheader "Configuring nginx"
    configure_nginx
    print_further_instructions
}

determine_domains() {
    DOMAINS[flight-launch]="${DOMAIN_ROOT}"
    DOMAINS[flight-launch-staging]="staging.${DOMAIN_ROOT}"
}

abort_if_uncommitted_changes_present() {
    if ! git diff-index --quiet HEAD ; then
        echo "$0: Uncommitted changes present aborting. Either stash or commit."
        exit 2
    fi
}

create_app() {
    ssh ${DOKKU_SERVER} \
        "dokku apps:create ${app}"
}

configure_app() {
    ssh ${DOKKU_SERVER} \
        "dokku config:set --no-restart ${app} \
            ALCES_LOG_WRITER_DEST=stdout \
            AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
            AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
            BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-ruby.git \
            DEFAULT_KEY_PAIR=aws_ireland \
            AWS_REGION=eu-west-1 \
            FLY_DOWNLOAD_URL=$FLY_DOWNLOAD_URL \
            FLY_EXE_PATH=$FLY_EXE_PATH \
            RACK_ENV=production \
            RAILS_ENV=production \
            SMTP_HOST=smtp.sparkpostmail.com \
            SMTP_PASSWORD=${SMTP_PASSWORD} \
            SMTP_USERNAME=SMTP_Injection \
            TZ=UTC \
            WAIT_FOR_ARN_DURATION=120 \
            "

    ssh ${DOKKU_SERVER} \
        "dokku domains:add ${app} ${DOMAINS[${app}]}"
}

add_cronjobs() {
    ssh ${DOKKU_SERVER} \
        'cat <<EOF | crontab -
PATH=/sbin:/bin:/usr/sbin:/usr/bin

*/15 * * * * dokku --rm run flight-launch rake alces:clusters:expired:terminate
EOF
'
}

configure_nginx() {
    ssh ${DOKKU_SERVER} \
        "cat <<EOF | sudo tee /etc/nginx/conf.d/00-default-vhost.conf
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;

  ssl_certificate     /home/dokku/${APPS[0]}/tls/server.crt;
  ssl_certificate_key /home/dokku/${APPS[0]}/tls/server.key;
  ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;

  server_name _;
  return 410;
  log_not_found off;
}
EOF
"
}

print_further_instructions() {
    cat <<EOF | sed 's/^\s*|//'
      |
      |Additional configuration required.
      |
      |Ensure configuration values have been added for:
      |
      |  - SMTP_PASSWORD
      |  - AWS_ACCESS_KEY_ID
      |  - AWS_SECRET_ACCESS_KEY
      |
      |You may also want to configure:
      |
      |  - DEFAULT_TEMPLATE_SET
      |  - REGIONS_TO_CHECK_FOR_EXPIRED_CLUSTERS
      |
      |You will also need to configure the apps to use HTTPS with the correct certs.
      |
      |Once additional configuration has been completed, run ./bin/deploy.sh
EOF
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
    echo "Create and configure the ${APPS[0]} dokku app"
    echo
    echo -e "      --aws-access-key-id ACCESS_KEY\t\tThe AWS access key to configure the app to use"
    echo -e "      --aws-secret-access-key SECRET_KEY\t\tThe AWS secret key to configure the app to use"
    echo -e "      --dokku-server SERVER\t\tThe server on which to create the app"
    echo -e "      --domain DOMAIN\t\tThe vhost domain to use for the app"
    echo -e "      --smtp-password PASSWORD\t\tThe SMTP password to configure the app to use"
    echo -e "      --help\t\tShow this help message"
}

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DOKKU_SERVER=launch.alces-flight.com
DOMAIN_ROOT=launch.alces-flight.com
SMTP_PASSWORD=

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --aws-access-key-id)
                AWS_ACCESS_KEY_ID=$2
                shift
                shift
                ;;

            --aws-secret-access-key)
                AWS_SECRET_ACCESS_KEY=$2
                shift
                shift
                ;;

            --dokku-server)
                DOKKU_SERVER=$2
                shift
                shift
                ;;

            --domain)
                DOMAIN_ROOT=$2
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
