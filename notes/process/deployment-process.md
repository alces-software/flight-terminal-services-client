# Overview of deployment process

## Prerequisites

 - A checked out copy of the flight-launch git repo.
 - A couple of git remotes which can be created with:  `git remote add dokku
   dokku@launch.alces-flight.com:flight-launch` and `git remote add
   dokku-staging dokku@launch.alces-flight.com:flight-launch-staging`.
 - Some unix tools: `ruby`, `jq`, `docker` and `docker-compose`.

## How to deploy a branch to production.

To deploy a new release of Flight Launch follow the instructions below:

 1. Checkout the branch you wish to deploy.
 2. Run `./bin/deploy-and-release.sh`.
 3. Press enter when prompted (there will be 3 prompts to do so) and save
    commit messages to merge to develop and master.
 4. There is no step 4.

## What does deploy-and-release.sh do?

 1. Determines the next tag to use (e.g., 201704.15).
 2. Creates a new release branch (e.g., release/201704.15).
 3. Bumps the version files used by the client and server.
 4. Runs the `./bin/deploy.sh` script.
 5. Promotes the staging app to production app.
 6. Merges, tags and pushes to github.

## What does deploy.sh do?

 1. Builds the client.
 2. Commits the built client to the server's public directory.
 3. Performs git magic to push only the server directory to the
    `dokku-staging` remote.
 4. The dokku remote builds the server application using a standard ruby build
    pack.
 5. Removes the built client from the server's public directory.

## What can go wrong and how do we fix it?

If everything goes well, running the `./bin/deploy-and-release.sh` script is
all that is needed.  If there is a problem, intervention may be required.

**I can't install docker or docker-compose because MAC. What do I do?**
Contact Ben and tell him to deploy the release.

**Building the client has failed.  What do I do?**  Run
`./bin/deploy-and-release.sh` again.  Building the client occasionally fails,
but I've never seen it happen twice in a row.

**Building the client failed again.  What do I do?**  Contact Ben and tell him
to deploy the release.

**Deploying the server failed.  What do I do?**  Now this one is a little more
tricky.  We're no longer on the develop branch and have already spent time
building the client.

Discover why the deploy failed and see if you can fix it.  Once the
fix has been commited, run `./bin/deploy.sh --skip-client-build`.  That will
attempt a new deploy to the staging app.  Once the deployment is successful,
promote staging to production by SSHing into the dokku server and running the
commands from the `promote_staging_to_production` function in
`./bin/deploy-and-release.sh`.  Finally, run `./bin/merge-and-tag-release.sh
NEW_VERSION` 

## How could this be improved?

 1. Write a dokku plugin so that the client can be built on the dokku server.
    This would remove the need for having docker and docker-compose installed
    locally in order to deploy.
 2. Write a dokku plugin to remove the need for the git magic to push just the
    server directory.


## Building a new AWS instance.

We don't need to do this to deploy a new release.  There is documentation on
how to [build the AWS instance](./build-aws-instance.md) which also includes
documentation on backup and restore.
