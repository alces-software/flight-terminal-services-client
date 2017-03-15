FROM ruby:2.3

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir -p /app
WORKDIR /app

# Go to a small amount of effort to ensure that the user id and group id are
# the same as that on the host machine.
ARG USER_ID
ARG GROUP_ID
RUN groupadd -g $GROUP_ID app-user
RUN useradd -m -u $USER_ID -g $GROUP_ID app-user
USER app-user

# Override the GEM_HOME and BUNDLE_* environment variables set in the ruby:2.3
# Dockerfile.  These settings allow adding the downloaded gems to git and
# makes viewing the gem source easier.
ENV GEM_HOME /app/vendor
ENV BUNDLE_PATH="$GEM_HOME" \
    BUNDLE_BIN="/app/bin" \
    BUNDLE_APP_CONFIG="/app/.bundle"
ENV PATH $BUNDLE_BIN:$PATH
