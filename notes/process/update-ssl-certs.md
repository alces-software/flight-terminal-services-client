# Updating the SSL certs for the Flight Launch service


 1. Get the new SSL certs from Mark.
 2. Copy them to launch.alces-flight.com
 3. SSH to launch.alces-flight.com
 4. Run `dokku certs:update flight-launch path/to/crt path/to/key`
 5. Run `dokku certs:report flight-launch` to verify new certificates are in
    use.
