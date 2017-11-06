#!/bin/bash

set -euo pipefail

main() {
    parse_arguments "$@"
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    header "Building admin and token generator apps"
    build_admin_app
    build_token_generator_app
    if [ "$SKIP_CLIENT_BUILD" == "false" ] ; then
        header "Building client"
        build_client
    fi
    subheader "Committing client bundle"
    commit_client_bundle
    trap remove_client_bundle_commit EXIT
    header "Deploying to ${REMOTE}"
    deploy_server
    header "Migrating database"
    migrate_database
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

build_client() {
    (
    rm -rf client/build/
    pushd client/
    yarn run build
    popd
    ) 2> >(indent 1>&2) | indent
}

commit_client_bundle() {
    (
    cp -ar client/build/*  server/public/
    git add -A server/public/
    git commit -m 'Add client bundles' server/public/
    ) 2> >(indent 1>&2) | indent
}

deploy_server() {
    (
    tmp_branch=deployment-$(date +%s)
    git branch ${tmp_branch} $(git subtree split --prefix server HEAD )
    git push ${REMOTE} -f ${tmp_branch}:master
    git branch -D ${tmp_branch}
    ) 2> >(indent 1>&2) | indent
}

migrate_database() {
    local dokku_server
    local dokku_app
    dokku_server=$( git remote get-url "${REMOTE}" | cut -d@ -f2 | cut -d: -f1 )
    dokku_app=$( git remote get-url "${REMOTE}" | cut -d: -f2 )

    ssh ${dokku_server} \
        "dokku run \"${dokku_app}\" db:migrate:status; dokku run \"${dokku_app}\" db:migrate"
}

remove_client_bundle_commit() {
    subheader "Removing client bundle commit"
    git reset --hard HEAD~1 2> >(indent 1>&2) | indent
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
    echo -e "      --dokku-remote REMOTE\t\tThe git remote to deploy to"
    echo -e "      --skip-client-build\t\tDon't rebuild the client"
    echo -e "      --help\t\tShow this help message"
}

REMOTE=dokku-staging
SKIP_CLIENT_BUILD=false

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --dokku-remote)
                REMOTE=$2
                shift
                shift
                ;;

            --skip-client-build)
                SKIP_CLIENT_BUILD=true
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
