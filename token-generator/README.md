# Flight Launch Tokens

A Flight Launch token is a code used to authorize launching a cluster with
Flight Launch.  Each token is allocated a number of credits which determine
how long the cluster it launches will run for.

Along with a number of credits, each launch token is restricted in which
cluster specs it is permitted to launch.  At its most permissive, a token can
be permitted to launch any cluster spec belonging to a single tenant.
Alternatively, it can be restricted in which of the tenant's clusters specs it
can be launched.

## Creating launch tokens

Instructions on creating launch tokens can be [read
here](GENERATING_TOKENS.md).

## Developing the launch token generator

Instructions on developing the launch token generator can be [read
here](DEVELOPMENT.md).
