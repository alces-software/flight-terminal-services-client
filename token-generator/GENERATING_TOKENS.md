# Generating tokens for Flight Launch

## Navigating to the token generator

To generate a token for a tenant for use with Flight Launch visit
`https://launch.alces-flight.com/alces/admin/<TENANT-IDENTIFIER>/token-generator`,
e.g., `https://launch.alces-flight.com/alces/admin/default/token-generator`,
or `https://launch.alces-flight.com/alces/admin/bigvuni/token-generator`.

To generate a token for a particular set of cluster specs add
`?clusterSpecs=<my-cluster-specs>` to the URL.  E.g.,
`https://launch.alces-flight.com/alces/admin/default/token-generator?clusterSpecs=staging.json`.


## Generating a token

 1. Choose to either generate absurd or meaningless tokens.  (Try generating
    one of each and you'll understand the difference).
 2. Select if the token can launch *any* cluster (for the specified tenant) or
    is restricted to launching only certain clusters (for the specified
    tenant).
 3. Select the number of tokens to create
 4. Add a note to the tokens that you create.  This can later be used for
    deleting old tokens from old events.
 5. Optionally, enter an email address to have the token automatically emailed
    to the recipient by Flight Launch.
 6. Click "Go!"


## For the staging deployment  (https://staging.launch.alces-flight.com)

Generating tokens for the staging deployment of Flight Launch is similar to
above.  However, the URLs will need to be prefixed with `staging.`, e.g., 
`https://launch.alces-flight.com/alces/admin/default/token-generator`.
