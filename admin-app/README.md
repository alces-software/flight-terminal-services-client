# Flight Launch tenant admin app

Tenants are used for three purposes in Flight Launch.

 1. To provide co-branding opportunities.
 2. To support per-tenant credit limits.
 3. To allow different tenants to have different cluster specs.

Each of these is explained in more detail below.

## Co-branding

Each tenant can be configured to include co-branding in the Flight Launch
application and in the emails sent by Flight Launch.  Co-branding
opportunities currently allow the name and logo of the tenant to be included
alongside Alces Flight's name and logo.

## Credits

Each tenant can optionally have a limit on the number of credits allocated to
its tokens.  Further information can be [found here](../CREDITS.md).

## Cluster specs

Each tenant has its own set of cluster specs available to it.  Information on
cluster specs can be [found
here](../client/src/modules/clusterSpecs/data/README-CLUSTER-SPECS.md).

## Default tenant

When using Flight Launch a tenant can be specified by including it in the URL.
If no tenant is specified when using Flight Launch, the default tenant is used
implicitly.  When using the tenant admin app, the default tenant appears named
as "default".
