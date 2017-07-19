# Credits

Credits are our mechanism to control how many "compute hours" we allow a user
to run their cluster for, how many "compute hours" a tenant can consume and to
provide a means for monetising Flight Launch.

## Determining cluster runtime

The primary function of credits is to limit the number of hours for which a
cluster runs.  To do this, each cluster spec is defined as consuming a number
of credits per hour, and each token is allocated a number of credits when it
is created.

When a token is used to launch a cluster spec, the runtime for the cluster is
determined by dividing the number of credits allocated to the token, by the
number of credits consumed by the cluster spec each hour.  Some point after
the clusters runtime has expired, the cluster will be automatically
terminated.


## Limiting the number of credits for a tenant

The secondary purpose of credits is to limit how many "compute hours" a tenant
can consume and to provide a means for monetising Flight Launch.

A tenant admin will purchase a number of credits from Alces.  These credits
are allocated to the tenant.  The tenant admin will be provided with access to
the token generator for their tenant.  Each time they create a token for their
tenant a number of credits will be transferred from their tenant to the token.

Once they have no credits remaining, they cannot create any more tokens, until
they have purchased more credits.
