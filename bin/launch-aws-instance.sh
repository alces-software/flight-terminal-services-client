#!/bin/bash

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

launch_instance() {
    aws  cloudformation create-stack \
        --stack-name ${STACK_NAME} \
        --template-body file://${ROOT}/cloudformation/launch.json \
        --parameters ParameterKey=KeyName,ParameterValue=aws_ireland
}

wait_for_stack_create_complete() {
    subheader "Waiting for stack to create complete"
    aws cloudformation wait stack-create-complete \
        --stack-name $STACK_ID \
        2> >(indent 1>&2) | indent
}

main() {
    STACK_NAME="$1"
    header "Launching instance"
    # launch_instance
    STACK_ID=$(launch_instance | jq -r '.StackId')
    # echo "Instance ID = ${INSTANCE_ID}" | indent
    wait_for_stack_create_complete
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
