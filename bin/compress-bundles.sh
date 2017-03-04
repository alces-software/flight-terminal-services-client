#!/bin/bash
#=============================================================================
# Copyright (C) 2015-2016 Stephen F. Norledge and Alces Software Ltd.
#
# This file is part of Alces Prime
#
# All rights reserved, see LICENSE.txt.
#=============================================================================
set -e

main() {
    if $COMPRESS_JAVASCRIPT ; then
        compress_javascript
    fi

    if $COMPRESS_CSS ; then
        compress_css
    fi
}

compress_javascript() {
    for i in dist/*alces-flight*.*.min.js ; do
        if file -i $i | grep -q -v gzip ; then
            gzip $i
            mv $i.gz $i
        fi
    done
}

compress_css() {
    for i in dist/*alces-flight*.*.css ; do
        if file -i $i | grep -q -v gzip ; then
            gzip $i
            mv $i.gz $i
        fi
    done
}

usage() {
    echo "Usage: $(basename $0) BUNDLE_TYPE..."
    echo
    echo "Compress asset bundles."
    echo
    echo "Specify one or more of the BUNDLE_TYPEs to compress  Available bundle types are:"
    echo
    echo "  javascript    Compress all javascript"
    echo "  css           Compress all css"
    echo
}


validate_arguments() {
    if $COMPRESS_JAVASCRIPT || $COMPRESS_CSS ; then
        # All is right with the world
        :
    else
        usage
        exit 1
    fi
}

COMPRESS_JAVASCRIPT=false
COMPRESS_CSS=false

while [[ $# > 0 ]] ; do
    key="$1"

    case $key in
        everything)
            COMPRESS_JAVASCRIPT=true
            COMPRESS_CSS=true
            ;;
        javascript)
            COMPRESS_JAVASCRIPT=true
            ;;
        css)
            COMPRESS_CSS=true
            ;;
        *)
            # unknown option
            ;;
    esac
    if [[ $# > 0 ]] ; then
        shift # past argument or value
    fi
done

validate_arguments

main "$@"
