#!/bin/bash
#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Flight Lackey
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
set -euo pipefail

rm -rf ~/.cache/yarn/npm-flight-common-0.0.0/
rm -rf ~/launch/node_modules/flight-common/

if [ "$1" == "--local" ] ; then
    echo "Adding local flight-common"
    yarn add file:///home/flight-common
else
    echo "Adding remote flight-common"
    yarn add git+https://github.com/alces-software/flight-common.git#react-15-react-router-4
fi
