#!/bin/bash

set -euo pipefail

main() {
    header "Checking repo is clean"
    abort_if_uncommitted_changes_present
    header "Building client"
    build_client
    subheader "Committing client bundle"
    commit_client_bundle
    trap remove_client_bundle_commit EXIT
    header "Deploying"
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
    git push dokku -f ${tmp_branch}:master
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

main "$@"
