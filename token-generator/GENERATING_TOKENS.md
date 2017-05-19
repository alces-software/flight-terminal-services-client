# Generating tokens for Flight Launch

## Navigating to the token generator

To generate a token for the default tenant for use with Flight Launch visit
`https://s3-eu-west-1.amazonaws.com/alces-flight-launch-token-generator/index.html`

To generate a token for a particular tenant visit
`https://s3-eu-west-1.amazonaws.com/alces-flight-launch-token-generator/index.html?tenant=<my-tenant>`
e.g.,
`https://s3-eu-west-1.amazonaws.com/alces-flight-launch-token-generator/index.html?tenant=bigvuni`.


## Generating a token

 1. Enter your AWS credentials and click "submit".
 2. Choose to either generate absurd or meaningless tokens.  (Try generating
    one of each and you'll understand the difference).
 3. Select if the token can launch *any* cluster (on *any* tenant) or is
    restricted to launching only certain clusters.
 4. Select the number of tokens to create
 5. Add a note to the tokens that you create.  This can later be used for
    deleting old tokens from old events.
 6. Click "Go!"

**WARNING**

If a token is not restricted to launching a particular set of clusters, it
will be capable of launching *any* cluster in *any* tenant.
