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

get_ec2_id() {
    aws cloudformation describe-stack-resources \
        --stack-name ${STACK_ID} \
        --logical-resource-id EC2Instance \
        | jq -r .StackResources[0].PhysicalResourceId
}

get_ip_address() {
    local ec2_id
    ec2_id=$(get_ec2_id)
    aws ec2 describe-instances \
        --instance-ids ${ec2_id} \
        | jq -r .Reservations[0].Instances[0].PublicIpAddress
}

install_backup_and_restore_scripts() {
    scp "${ROOT}/bin/backup.sh" ubuntu@${IP}:
    scp "${ROOT}/bin/restore.sh" ubuntu@${IP}:
}

main() {
    STACK_NAME="$1"
    if [ "$STACK_NAME" == "" ] ; then
        usage
        exit 1
    fi
    if [ "$STACK_NAME" == "--help" ] ; then
        usage
        exit 0
    fi


    header "Launching instance"
    # launch_instance
    STACK_ID=$(launch_instance | jq -r '.StackId')
    # echo "Instance ID = ${INSTANCE_ID}" | indent
    subheader "Stack ID = ${STACK_ID}"
    wait_for_stack_create_complete

    header "Installing backup/restore scripts"
    IP=$(get_ip_address)
    install_backup_and_restore_scripts

    echo "Public IP Address = ${IP}"
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
    echo "Usage: $(basename $0) STACK_NAME"
    echo
    echo "Create a cloudformation stack to run flight-launch"
    echo
    echo -e "      --help\t\tShow this help message"
}

main "$@"
