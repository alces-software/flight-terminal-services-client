# Overview of deployment process

## Prerequisites

 - A checked out copy of the flight-launch git repo.
 - Some git remotes which can be created with:
   - `git remote add dokku-api dokku@apps.alces-flight.com:flight-launch-api`
   - `git remote add dokku-launch dokku@apps.alces-flight.com:flight-launch`
   - `git remote add dokku-manage dokku@apps.alces-flight.com:flight-manage`
   - `git remote add dokku-api-staging dokku@apps.alces-flight.com:flight-launch-api-staging`
   - `git remote add dokku-launch-staging dokku@apps.alces-flight.com:flight-launch-staging`
   - `git remote add dokku-manage-staging dokku@apps.alces-flight.com:flight-manage-staging`
 - Some unix tools: `ruby` and `jq`.

## How to deploy a branch to production.

To deploy a new release of Flight Launch, Flight Manage and the Flight Launch
API server follow the instructions below:

 1. Checkout the branch you wish to deploy.
 2. Run `./bin/deploy-and-release.sh`.
 3. Press enter when prompted (there will be 3 prompts to do so) and save
    commit messages to merge to develop and master.
 4. There is no step 4.

## What does deploy-and-release.sh do?

 1. Determines the next tag to use (e.g., 201704.15).
 2. Creates a new release branch (e.g., release/201704.15).
 3. Bumps the version files used by the launch client, manage client and api
    server.
 4. Runs `./bin/deploy.sh` to deploy all three apps to staging.
 5. Runs `./bin/deploy.sh --production` again to deploy all three apps to
    production.
 6. Merges, tags and pushes to github.

## What does deploy.sh do?

Running `./bin/deploy.sh` does the following:

 1. Builds the token generator client and admin app client.
 2. Commits the built clients to the api server's public directory.
 3. Performs git magic to push only the server directory to the
    `dokku-api-staging` remote; the launch directory to the
    `dokku-launch-staging` remote; the manage directory to the
    `dokku-manage-staging` remote.
 4. The dokku remotes build their application using either a standard ruby
    build pack or a standard node build pack.
 5. Removes the built clients from the server's public directory.

Running `./bin/deploy.sh --production` does similar, but pushes to the
production remotes, i.e., `dokku-api`, `dokku-launch` and `dokku-manage`.

## What can go wrong and how do we fix it?

If everything goes well, running the `./bin/deploy-and-release.sh` script is
all that is needed.  If there is a problem, intervention may be required.

**Something didn't work.  What do I do?**  Contact Ben tell him to deploy
the release and update this document with details of the problem and solution.

## How could this be improved?

 1. Write a dokku plugin to remove the need for the git magic to push just the
    server, launch and manage directories.
