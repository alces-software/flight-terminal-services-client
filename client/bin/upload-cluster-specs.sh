#!/bin/bash

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)

main() {
    parse_arguments "$@"
    echo
    echo "Uploading ${SRC} -> FlightLaunch/ClusterSpecs/${DEST}"
    echo
    aws s3api put-object \
        --acl public-read \
        --content-type application/json \
        --bucket alces-flight \
        --key "FlightLaunch/ClusterSpecs/${DEST}" \
        --body "${SRC}"
}

usage() {
    echo "Usage: $(basename $0) [options]"
    echo
    echo "Upload cluster specs to S3"
    echo
    echo -e "      --src CLUSTER_SPECS\tThe cluster specs to upload (default"
    echo -e "                         \t${DEFAULT_SRC})"
    echo -e "      --dest KEY\t\tThe destination that the specs should be uploaded to (default test.json)"
    echo -e "      --help\t\t\tShow this help message"
}

DEST=test.json
DEFAULT_SRC="${REPO_ROOT}/client/src/modules/clusterSpecs/data/clusterSpecs.dev.json"
SRC=$DEFAULT_SRC

parse_arguments() {
    while [[ $# > 0 ]] ; do
        key="$1"

        case $key in
            --src)
                SRC=$2
                shift
                shift
                ;;

            --dest)
                DEST=$2
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
