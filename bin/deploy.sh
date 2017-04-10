#!/bin/bash

set -euo pipefail

main() {
    parse_arguments "$@"
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    if [ "$SKIP_CLIENT_BUILD" == "false" ] ; then
        header "Building client"
        build_client
    fi
    subheader "Committing client bundle"
    commit_client_bundle
    trap remove_client_bundle_commit EXIT
    header "Deploying to ${REMOTE}"
    deploy_server
}

abort_if_uncommitted_changes_present() {
    if ! git diff-index --quiet HEAD ; then
        echo "$0: Uncommitted changes present aborting. Either stash or commit."
        exit 2
    fi
}

build_client() {
    (
    rm -rf client/build/
    docker-compose run --rm client ./bin/use-latest-flight-common.sh
    docker-compose run --rm client yarn run build
    ) 2> >(indent 1>&2) | indent
}

commit_client_bundle() {
    (
    cp -ar client/build/*  server/public/
    git add -A server/public/
    git commit -m 'Add client bundles' server/public/
    ) 2> >(indent 1>&2) | indent
    CLIENT_BUNDLE_COMMITTED=1
}

deploy_server() {
    (
    tmp_branch=deployment-$(date +%s)
    git branch ${tmp_branch} $(git subtree split --prefix server HEAD )
    git push ${REMOTE} -f ${tmp_branch}:master
    git branch -D ${tmp_branch}
    ) 2> >(indent 1>&2) | indent
}

remove_client_bundle_commit() {
    subheader "Removing client bundle commit"
    if [ "${CLIENT_BUNDLE_COMMITTED}" == "1" ] ; then
        git reset --hard HEAD~1 2> >(indent 1>&2) | indent
    fi
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
