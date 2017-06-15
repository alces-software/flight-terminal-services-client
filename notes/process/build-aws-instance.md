# Building an AWS instance to run the Flight Launch service

Building the AWS instance, creating and configuring the dokku apps and
deploying a release of Flight Launch is a semi-automated process.

Building a new AWS instance is not needed in order to deploy a new version of
the application.  There is documentation on [deploying a new
release](./deployment-process.md) you can read.

The reasons for wanting to build a new AWS instance include, 1) the old AWS
instance having been destroyed; 2) wishing to upgrade the version of dokku;
and probably some others.


## Prerequisites

 - A checked out copy of the flight-launch git repo.
 - Some unix tools: `aws`, `ruby`, `jq`, `docker` and `docker-compose`.


## Overview

In brief, we need to:

 1. Create the AWS instance
 2. Chose domain names and configure git remotes
 3. Create and configure the dokku apps on that instance
 4. Restore a backup of the dokku apps
 5. Deploy the application


## Creating the AWS instance

To create the AWS instance run the script

```
./bin/launch-aws-instance.sh STACK_NAME
```

STACK_NAME can be anything you wish, but a useful name would probably be
`flight-launch-YYYYMM-1`.  Once the script has completed, it will print out
the instances public IP address.  Make not of it.


## Choosing domain names and configuring git remotes

Before we can create the dokku apps, we first need to decide what domain we
are using for the apps.  Possible examples include `launch.alces-flight.com`
or `my-deployment-test.launch.alces-flight.com`, depending on whether you are
intending for this deployment to be the production machine or not.

The rest of this documentation assumes that you will be using the domain
`launch.alces-flight.com`.

Once you have determined the domain, you need to ensure that you can resolve
the names for the two dokku apps we are about to create.  You can do this by
adding a temporary entry to `/etc/hosts`, such as


```
34.250.118.123 launch.alces-flight.com staging.launch.alces-flight.com
```

or

```
34.250.118.123 my-deployment-test.launch.alces-flight.com staging.my-deployment-test.launch.alces-flight.com
```

Where the IP address is the one you took note of in the previous step.

You will also need to ensure that the flight-launch git repo has a couple of
git remotes configured.  These can be created with:

```
git remote add dokku dokku@launch.alces-flight.com:flight-launch
git remote add dokku-staging dokku@launch.alces-flight.com:flight-launch-staging
```

or

```
git remote add dokku-my-deployment-test dokku@my-deployment-test.launch.alces-flight.com:flight-launch
git remote add dokku-my-deployment-test-staging dokku@my-deployment-test.launch.alces-flight.com:flight-launch-staging
```


## Create and configure the dokku apps

To create and configure the dokku apps we run the following script


```
./bin/create-dokku-app.sh \
    --domain launch.alces-flight.com \
    --dokku-server launch.alces-flight.com
```

or

```
./bin/create-dokku-app.sh \
    --domain my-deployment-test.launch.alces-flight.com \
    --dokku-server my-deployment-test.launch.alces-flight.com
```


## Restoring a backup of the dokku apps

A list of available backups can be found at
https://console.aws.amazon.com/s3/buckets/alces-flight/FlightLaunch/backups/?region=us-east-1&tab=overview.
Select the one that you wish to restore from and make note its date.  E.g.,
for the backup `flight-launch-backup-2017-06-15-083159.tar.gz` its date is
`2017-06-15-083159`.

Once you have the backup date selected you need to

```
ssh ubuntu@launch.alces-flight.com
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
./restore.sh BACKUP_DATE
```

or

```
ssh ubuntu@my-deployment-test.launch.alces-flight.com
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
./restore.sh BACKUP_DATE
```

Where the AWS credentials can be your usual AWS credentials.  Or any that can
download the backup from S3.


## Deploying the Flight Launch application

Deploy the Flight Launch application to the staging app and then promote it to
the production app.  From your local machine run

```
./bin/deploy.sh --dokku-remote dokku-staging
```

or 

```
./bin/deploy.sh --dokku-remote dokku-my-deployment-test-staging
```

Check that the staging app is OK by navigating to
https://staging.launch.alces-flight.com or
https://staging.my-deployment-test.launch.alces-flight.com.

If it is, promote the staging app to production:

```
ssh ubuntu@launch.alces-flight.com
sudo docker tag dokku/flight-launch-staging dokku/flight-launch
dokku tags:deploy flight-launch latest
```

or

```
ssh ubuntu@my-deployment-test.launch.alces-flight.com
sudo docker tag dokku/flight-launch-staging dokku/flight-launch
dokku tags:deploy flight-launch latest
```

Check that the production app is OK by navigating to
https://launch.alces-flight.com or
https://my-deployment-test.launch.alces-flight.com.


## What can go wrong and how do we fix it?

**The SSL certs aren't valid. What do I do?** Restoring the backup will
configure the apps to use the SSL certs in the backup.  If you are restoring
to a machine configured with a different domain, you will run into SSL cert
validity errors.  Information on the certs can be found by running `dokku
certs:report`.  Correct certs can be generated or configured by using the
`dokku certs:generate` or `dokku certs:add` commads.  See `dokku certs:help`
for more information.
