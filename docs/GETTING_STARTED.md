# Getting started

Below are instructions on getting started with developing the manage client.
Similar instructions for the launch api server and launch client can be found
in their repos.

## Initial setup

First you need to copy and adapt the environment variables
files suitably for your local environment:

```bash
cp .env.example .env
$EDITOR .env
```

Once you have your environment variables configured, run the setup script.


```bash
bin/setup.sh
```

## Starting the containers

Once the initial setup has been completed, you can run the development server
with:

```bash
yarn run start
```

Flight Manage will then be accessible at
`http://launch.alces-flight.lvh.me:3004`.  Configuring the port has been left
as a future enhancement.
