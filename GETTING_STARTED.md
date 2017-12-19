# Getting started

The instructions below assume that docker is being used to run the server and
that the client applications are built on the docker host.  Using docker isn't
necessary, but the instructions below, and many of the scripts assume that to
be the case.

If you are happy to use docker for development follow the instructions below.
If you don't want to use docker, then you will have to manually follow through
the steps in `bin/setup.sh` and `server/Dockerfile`.  It should be straight
forward and you can document what happened here.


## Initial setup

First you need to copy and adapt the server and client environment variables
files suitably for your local environment:

For the server:

```bash
cp server/config/foreman/{dev.env,local.dev.env}
$EDITOR server/config/foreman/local.dev.env
```

At a minimum you will need to set the `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`.

For the launch client:

```bash
cp launch/{.env.example,.env}
$EDITOR launch/.env
```

If you are going to deploy to production at any point, you will need to set
the `REACT_APP_ANALYTICS_TRACKER_ID`.

For the manage client:

```bash
cp manage/{.env.example,.env}
$EDITOR manage/.env
```

Once you have your environment variables configured, run the setup script.


```bash
bin/setup.sh
```

## Starting the containers

Once the initial setup has been completed, you can run the launch and manage
client build servers and the web server in separate terminals:

```bash
docker-compose up server
```

```bash
cd launch ; yarn run start
```

```bash
cd manage ; yarn run start
```

Flight Launch will then be accessible at `localhost:3002` and Flight Manage at
`localhost:3004`.  Configuring the port that Flight Launch runs on during
development has been left as a future enhancement.
