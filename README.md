# Flight Launch and Flight Manage

Flight Launch is a service provided by Alces Flight to quickly launch a
preconfigured Flight Compute cluster.  Flight Manage is a service provided by
Alces Flight to provide access to and management of Flight Compute clusters.

## Getting started developing Flight Launch

Instructions on getting started with developing Flight Launch can be [found
here](GETTING_STARTED.md).

## High-level documenation

Flight Launch consists of four services: server, launch client, manage client,
launch token generator and tenant admin app.  All of these services are
contained in this repository, in the `server`, `launch`, `manaage`,
`token-generator` and `admin-app` directories, respectively.

Flight Launch makes use of a number of concepts, "cluster specs", "launch
tokens", "credits" and "tenants".  A brief overview of these concepts and
links to more information can be found below.

### Cluster specs

Cluster specs specify which clusters are available for launch and what
configuration those clusters are launched with.  More documentation can be
[found here](launch/src/modules/clusterSpecs/data/README-CLUSTER-SPECS.md).

### Launch tokens

A Flight Launch token is a code used to authorize launching a cluster with
Flight Launch.  Each token is allocated a number of credits which determine
how long the cluster it launches will run for.  Further information on launch
tokens can be [read here](token-generator/README.md).

### Credits

Credits are our mechanism to control how many "compute hours" we allow a user
to run their cluster for, how many "compute hours" a tenant can consume and to
provide a means for monetising Flight Launch.  Further information can be
[found here](CREDITS.md).

### Tenants

Tenants are used for three purposes in Flight Launch.

 1. To provide co-branding opportunities.
 2. To support per-tenant credit limits.
 3. To allow different tenants to have different cluster specs.

More information can be [found here](admin-app/README.md).
