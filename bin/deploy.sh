#!/bin/bash

set -euo pipefail

main() {
    parse_arguments "$@"
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    header "Building admin and token generator apps"
    build_admin_app
    build_token_generator_app
    subheader "Committing client bundles"
    commit_client_bundles
    trap remove_client_bundles_commit EXIT
    header "Deploying server to ${SERVER_REMOTE}"
    deploy_server
    header "Migrating database"
    migrate_database
    header "Deploying launch client to ${LAUNCH_REMOTE}"
    deploy_launch_client
    header "Deploying manage client" to ${MANAGE_REMOTE}
    deploy_manage_client
}

abort_if_uncommitted_changes_present() {
    if ! git diff-index --quiet HEAD ; then
        echo "$0: Uncommitted changes present aborting. Either stash or commit."
        exit 2
    fi
}

build_admin_app() {
    (
    cd admin-app/
    make
    make install
    ) 2> >(indent 1>&2) | indent
}

build_token_generator_app() {
    (
    cd token-generator
    make
    make install
    ) 2> >(indent 1>&2) | indent
}

commit_client_bundles() {
    (
    cp -ar launch/build/*  server/public/
    git add -A server/public/
    git commit -m 'Add client bundles' server/public/
    ) 2> >(indent 1>&2) | indent
}

deploy_server() {
    (
    local tmp_branch
    tmp_branch=deployment-$(date +%s)
    git branch ${tmp_branch} $(git subtree split --prefix server HEAD )
    git push ${SERVER_REMOTE} -f ${tmp_branch}:master
    git branch -D ${tmp_branch}
    ) 2> >(indent 1>&2) | indent
}

deploy_launch_client() {
    (
    local tmp_branch
    tmp_branch=launch-deployment-$(date +%s)
    git branch ${tmp_branch} $(git subtree split --prefix launch HEAD )
    git push ${LAUNCH_REMOTE} -f ${tmp_branch}:master
    git branch -D ${tmp_branch}
    ) 2> >(indent 1>&2) | indent
}

deploy_manage_client() {
    (
    local tmp_branch
    tmp_branch=manage-deployment-$(date +%s)
    git branch ${tmp_branch} $(git subtree split --prefix manage HEAD )
    git push ${MANAGE_REMOTE} -f ${tmp_branch}:master
    git branch -D ${tmp_branch}
    ) 2> >(indent 1>&2) | indent
}

migrate_database() {
    local dokku_server
    local dokku_app
    dokku_server=$( git remote get-url "${SERVER_REMOTE}" | cut -d@ -f2 | cut -d: -f1 )
    dokku_app=$( git remote get-url "${SERVER_REMOTE}" | cut -d: -f2 )

    ssh ${dokku_server} \
        "dokku run \"${dokku_app}\" rake db:migrate:status; dokku run \"${dokku_app}\" rake db:migrate"
}

remove_client_bundles_commit() {
    subheader "Removing client bundles commit"
    git reset --hard HEAD~1 2> >(indent 1>&2) | indent
}

wait_for_confirmation() {
    echo ""
    echo "Press enter to continue or Ctrl-C to abort like a coward"
    read -s
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
    echo "Deploy HEAD to a dokku app"
    echo
    echo -e "      --production\t\tDeploy to the production environment"
    echo -e "      --help\t\tShow this help message"
}

SERVER_REMOTE=dokku-api-staging
MANAGE_REMOTE=dokku-manage-staging
LAUNCH_REMOTE=dokku-launch-staging

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --production)
                SERVER_REMOTE=dokku-api
                MANAGE_REMOTE=dokku-manage
                LAUNCH_REMOTE=dokku-launch
                shift
                ;;

            --test)
                SERVER_REMOTE=dokku-api-test
                MANAGE_REMOTE=dokku-manage-test
                LAUNCH_REMOTE=dokku-launch-test
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
