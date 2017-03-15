#!/bin/bash
#=============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Flight Launch.
#
# All rights reserved, see LICENSE.txt.
#=============================================================================
set -e

main() {
    if $UPLOAD_EVERYTHING ; then
        upload_everything
        compress_javascript
        upload_javascript
        compress_css
        upload_css
    fi

    if $UPLOAD_JAVASCRIPT ; then
        upload_javascript_maps
        compress_javascript
        upload_javascript
    fi

    if $UPLOAD_CSS ; then
        upload_css_maps
        compress_css
        upload_css
    fi
}


upload_everything() {
    gsutil -m \
        -h "Cache-Control:public,max-age=31557600" \
        cp -a public-read  \
        dist/*  gs://alces-portal/flight-lackey/
}

upload_javascript_maps() {
    gsutil -m \
        -h "Cache-Control:public,max-age=31557600" \
        cp -a public-read  \
        dist/*.js.map  gs://alces-portal/flight-lackey/
}

upload_css_maps() {
    gsutil -m \
        -h "Cache-Control:public,max-age=31557600" \
        cp -a public-read  \
        dist/*.css.map  gs://alces-portal/flight-lackey/
}

upload_css() {
    gsutil -m \
        -h "Cache-Control:public,max-age=31557600" \
        -h "Content-Encoding:gzip" \
        cp -a public-read  \
        dist/*.css  gs://alces-portal/flight-lackey/
}

compress_javascript() {
    local source_dir
    source_dir=$( dirname ${BASH_SOURCE[0]} )
    ${source_dir}/compress-bundles.sh javascript
}

compress_css() {
    local source_dir
    source_dir=$( dirname ${BASH_SOURCE[0]} )
    ${source_dir}/compress-bundles.sh css
}

upload_javascript() {
    gsutil -m \
        -h "Cache-Control:public,max-age=31557600" \
        -h "Content-Encoding:gzip" \
        cp -a public-read  \
        dist/*flight-lackey-client.*.min.js  gs://alces-portal/flight-lackey/
}

usage() {
    echo "Usage: $(basename $0) ASSETS..."
    echo
    echo "Uploads assets to cloud storage."
    echo
    echo "Specify one or more of the ASSETS to upload.  Available ASSETS are:"
    echo
    echo "  everything    Upload all javascript, css, source maps, images and fonts"
    echo "  javascript    Upload all javascript and javascript source maps"
    echo "  css           Upload all css and css source maps"
    echo
}


validate_arguments() {
    if $UPLOAD_JAVASCRIPT || $UPLOAD_CSS || $UPLOAD_EVERYTHING ; then
        # All is right with the world
        :
    else
        usage
        exit 1
    fi
}

UPLOAD_EVERYTHING=false
UPLOAD_JAVASCRIPT=false
UPLOAD_CSS=false

while [[ $# > 0 ]] ; do
    key="$1"

    case $key in
        everything)
            UPLOAD_EVERYTHING=true
            ;;
        javascript)
            UPLOAD_JAVASCRIPT=true
            ;;
        css)
            UPLOAD_CSS=true
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
