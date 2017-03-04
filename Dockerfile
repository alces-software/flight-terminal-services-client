#=============================================================================
# Copyright (C) 2015 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#=============================================================================
FROM kkarczmarczyk/node-yarn:7.6
MAINTAINER Alces Development "dev@alces-flight.com"

ARG USER_ID

# Packages to make working in the Docker container nicer go here.
RUN apt-get update && \
    apt-get -y install \
        tmux \
        man \
	vim \
	less

RUN useradd -m -u $USER_ID lackey
USER lackey

ENV HOME /home/lackey
RUN mkdir $HOME/bin
WORKDIR /home/lackey/lackey

RUN mkdir -p $HOME/.cache/yarn && \
    chown -R lackey $HOME/.cache/yarn

RUN yarn global add create-react-app --prefix $HOME

EXPOSE 4002
