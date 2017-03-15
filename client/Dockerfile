#=============================================================================
# Copyright (C) 2015 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Flight Launch.
#
# All rights reserved, see LICENSE.txt.
#=============================================================================
FROM kkarczmarczyk/node-yarn:7.6
MAINTAINER Alces Development "dev@alces-flight.com"

# Packages to make working in the Docker container nicer go here.
RUN apt-get update && \
    apt-get -y install \
        tmux \
        man \
	vim \
	less

# Go to a small amount of effort to ensure that the user id is the same as
# that on the host machine.
ARG USER_ID
RUN useradd -m -u $USER_ID launch
USER launch

ENV HOME /home/launch
RUN mkdir $HOME/bin
WORKDIR /home/launch/launch

RUN mkdir -p $HOME/.cache/yarn && \
    chown -R launch $HOME/.cache/yarn

RUN yarn global add create-react-app --prefix $HOME

EXPOSE 4002
