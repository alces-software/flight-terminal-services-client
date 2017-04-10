# Explanation of the cluster specs format for Flight Launch

When the Flight Launch application loads in a browser, it will load the
cluster specs from an S3 bucket.  The cluster specs are used to specify 1)
which clusters Flight Launch offers to launch; and 2) the details of how they
should be launched.

The format for the cluster specs file and how to configure which cluster specs
file to use are described below.

## Customizing the cluster specs file.

The cluster specs file used can be customized by loading the Flight Launch
application with a GET (url) parameter. E.g., typing the following in the
browser location bar
`https://launch.alces-flight.com?clusterSpecs=myClusterSpecs.json` will
attempt to load the `myClusterSpecs.json` in the
`s3://alces-flight/FlightLaunch/ClusterSpecs/` bucket.

If the `clusterSpecs` url parameter is not provided the default cluster specs
will be used.  They can be found at
`s3://alces-flight/FlightLaunch/ClusterSpecs/default.json`.

## Format

The cluster specs file must be valid JSON.  It must be an objects with two
keys: `schedulers` and `clusterSpecs`.  The format for their values are
described below.


### Format for clusterSpecs 

The value for the `clusterSpecs` key must be an array of objects.  Each
cluster spec object has three parts to it.

```
{
    "ui": {...},
    "costs": {...},
    "fly": {...},
}
```

#### UI section

The `ui` section specifies the title, subtitle and description of the cluster
spec.  E.g.,

```
{
    "ui": {
        "title": "Tiny slurm cluster",
        "subtitle": "Two nodes. Spot instances. SGE scheduler.",
        "body": "A fixed size cluster of 2 compute nodes.  The compute nodes use spot instances with a reserve price of 0.3.  It uses the Slurm scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png"
    },

    "costs": {...},
    "fly": {...},
}
```

The UI section is presented to the user.  It should provide an accurate
description of the cluster that should be launched.  Flight Launch makes no
effort to ensure that it is a faithful description.

#### Fly section

The `fly` section consists of the parameters given to the `fly` binary to
launch the cluster. E.g.,

```
{
    "ui": {...},
    "costs": {...},

    "fly": {
      "args": [
        "--solo",
        "--runtime", "240"
      ],
      "parameterDirectoryOverrides": {
        "solo": {
          "AutoscalingPolicy": "disabled",
          "ComputeSpotPrice": "0.3",
          "SchedulerType": "slurm"
        }
      }
    }
  },
```

Valid values for the `solo` parameter directory override can be found by
running `fly --create-parameter-directory foo ; cat foo/solo.yml`.

Valid values for the `args` array can be found by running `fly cluster launch --help`.
In practice, passing the `"--solo" flag and the `"--runtime"` argument are
likely to be all that is required or wanted.

#### Costs section

The `costs` section describes estimates of the costs of running the cluster
for a single hour.  There are three flavours of costs that could be described.
Currnently, for each cluster spec, Flight Launch will display details about
one of them.

The three cluster specs below show the supported cost flavours.

```
[
{
    "ui": {...},

    "costs": {
      "average": {
        "pricePerHour": 4,
        "text": "Avg £4 / hour",
        "tooltip": "The average cost for this cluster is £4 per hour."
      }
    },

    "fly": {
    }
},
{
    "ui": {...},

    "costs": {
      "estimated": {
        "pricePerHour": 1
        "text": "Est £1 / hour",
        "tooltip": "The estimated cost for this cluster is £1 per hour."
      }
    },

    "fly": {
    }
},
{
    "ui": {...},

    "costs": {
      "max": {
        "pricePerHour": 3,
        "text": "Max £3 / hour",
        "tooltip": "The maximum cost for this cluster is £3 per hour."
      }
    },

    "fly": {
    }
},
]
```

### Format for schedulers 

The value for the `schedulers` key must be an array of objects.  A scheduler
object has the following shape.

```
{
  "type": "gridscheduler",
  "text": "Grid engine",
  "logoUrl": "http://gridscheduler.sourceforge.net/gridengine-logo.png",
  "tooltip": "This cluster uses the Grid engine scheduler"
}
```

 - The `type` value is used to find the scheduler used by a clusterSpec.
 - The `text` value is shown as the text below the scheduler icon at the
   bottom of the clusterSpecs' card.
 - The `tooltip` value is shown as the tooltip for the for that icon.
 - The `logoUrl` is used as the logo for that scheduler.


## Example

An example of a cluster specs json file with three cluster specs is given below.

```
{
  "schedulers": [
    {
      "type": "gridscheduler",
      "text": "Grid engine",
      "logoUrl": "http://gridscheduler.sourceforge.net/gridengine-logo.png",
      "tooltip": "This cluster uses the Grid engine scheduler"
    },
    {
      "type": "slurm",
      "text": "Slurm",
      "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Slurm_Workload_Manager.png/262px-Slurm_Workload_Manager.png",
      "tooltip": "This cluster uses the Slurm scheduler"
    }

  "clusterSpecs": [
    {
      "ui": { 
        "title": "Small SGE cluster",
        "subtitle": "Autoscaling upto 8 nodes. Spot instances. SGE scheduler.",
        "body": "An autoscaling cluster, scaling upto a maximum of 8 compute nodes.  The compute nodes use spot instances with a reserve price of 0.3.  It uses the SGE scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png"
      },
      "costs": {
        "estimated": {
          "pricePerHour": 3
        }
      },
      "fly": {
        "args": [
          "--solo",
          "--runtime", "240"
        ],
        "parameterDirectoryOverrides": {
          "solo": {
            "AutoscalingPolicy": "enabled",
            "ComputeSpotPrice": "0.3",
            "SchedulerType": "gridscheduler"
          }
        }
      }
    },
  
    {
      "ui": { 
        "title": "8 node GPU cluster",
        "subtitle": "8 on demand GPU spot instances. SGE scheduler.",
        "body": "An SGE cluster with 8 GPU compute nodes. The compute nodes use spot instances with a reserve price of 0.3.  It uses the SGE scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png"
      },
      "costs": {
        "max": {
          "pricePerHour": 3
        }
      },
      "fly": {
        "args": [
          "--solo",
          "--runtime", "240"
        ],
        "parameterDirectoryOverrides": {
          "solo": {
            "AutoscalingPolicy": "disabled",
            "SchedulerType": "gridscheduler",
            "ComputeInstanceType": "gpu-1GPU-8C-15GB.small-g2.2xlarge"
          }
        }
      }
    },
  
    {
      "ui": { 
        "title": "Biochemistry cluster",
        "subtitle": "Slurm scheduler; Biochemistry software preinstalled",
        "body": "An autoscaling Slurm cluster with common Biochemistry software preinstalled.  The compute nodes use spot instances with a reserve price of 0.3.",
        "logoUrl": "http://alces-flight.com/images/logo.png"
      },
      "costs": {
        "average": {
          "pricePerHour": 3
        }
      },
      "fly": {
        "args": [
          "--solo",
          "--runtime", "240"
        ],
        "parameterDirectoryOverrides": {
          "solo": {
            "AutoscalingPolicy": "enabled",
            "ComputeSpotPrice": "0.3",
            "PreloadSoftware": "bioinformatics",
            "SchedulerType": "slurm"
          }
        }
      }
    },
  ]
```
