# Explanation of the cluster specs format for Flight Launch

When the Flight Launch application loads in a browser, it will load the
cluster specs from an S3 bucket.  The cluster specs are used to specify 1)
which clusters Flight Launch offers to launch; and 2) the details of how they
should be launched.

The format for the cluster specs file and how to configure which cluster specs
file to use are described below.

## Customizing the cluster specs file.

The cluster specs file is determined by the tenant that Flight Launch is using
and can be further customized by loading the Flight Launch application with a
GET (url) parameter.  This is probably made most clear with some examples:

 1. Visiting `https://launch.alces-flight.com` uses the default tenant and so
    loads the clusters specs from
    `s3://alces-flight/FlightLaunch/ClusterSpecs/default/default.json`.

 2. Visiting `https://launch.alces-flight.com/bigvuni` uses the bigvuni tenant
    and so loads the cluster specs from 
    `s3://alces-flight/FlightLaunch/ClusterSpecs/bigvuni/default.json`.

 3. Visiting `https://launch.alces-flight.com/bigvuni?clusterSpecs=test.json`
    uses the bigvuni tenant and the "test.json" cluster specs.  So loads the
    cluster specs from
    `s3://alces-flight/FlightLaunch/ClusterSpecs/bigvuni/test.json`.


## Format

The cluster specs file must be valid JSON.  It must be an object with two
keys: `sharedIcons` and `clusterSpecs`.  The format for their values are
described below.


### Format for clusterSpecs 

The value for the `clusterSpecs` key must be an array of objects.  Each
cluster spec object has four parts to it.

```
{
    "key": UUID,
    "ui": {...},
    "fly": {...},
    "launchOptions": {...},
    "features": {...},
}
```

#### Key

A UUID.  This is used to allow tokens to be restricted to a set of cluster
specs.  It must be a UUID and it should be unique across all cluster specs.

#### UI section

The `ui` section specifies the title, a lowercase variant of the title,
subtitle and description of the cluster spec.  E.g.,

```
{
    "key": UUID,

    "ui": {
        "title": "Tiny SGE cluster",
        "titleLowerCase": "tiny SGE cluster",
        "subtitle": "Two nodes. Spot instances. SGE scheduler.",
        "body": "A fixed size cluster of 2 compute nodes.  The compute nodes use spot instances with a reserve price of 0.3.  It uses the Slurm scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png",
        "icons" : [ ... ],
    },

    "fly": {...},
    "launchOptions": {...},
}
```

The lowercase variant of the title should be written so that it can be
included in the middle of a sentence such as "Your tiny SGE cluster is now
available for use."  Commonly this would involve removing the capitalisation
of the first letter in title.

The UI section is presented to the user.  It should provide an accurate
description of the cluster that should be launched.  Flight Launch makes no
effort to ensure that it is a faithful description.


##### Icons

Cluster specs can also specify the icons that are to be shown in the footer of
the cluster spec card.  The format for an icon object is as follows:

```
{
  "icon": "...",
  "iconType": "...",
  "text": "...",
  "tooltip": "..."
}
```

 - The `text` value is shown as the text below the icon at the bottom of the
   clusterSpecs' card.
 - The `tooltip` value is shown as the tooltip for that icon.
 - The `iconType` value specifies the type of icon.  Valid values are `url`,
   `font-awesome` and `depot`.
 - The `icon` value is interpreted differently depending on the `iconType`,
   but in each case it specifies which icon to use.

When `iconType` is `font-awesome`, the `icon` value is the name of the font
awesome icon.

When the `iconType` is `url` the `icon` value is the URL from which to
download the icon.

The `iconType` `depot` is intended to be used to show pre-installed software.
E.g., if the cluster spec comes with the bioinformatics depot pre-installed
setting `iconType` to `depot` and `icon` to `bioinformatics` the
same bioinformatics logo as used in gridware.alces-flight.com will be
included.

There are two locations that icon objects can be defined, and two methods for
specifying which icons are included for a cluster spec.

An icon can be in-lined into the cluster spec's `ui.icons` value.  E.g.,

```
{
  "clusterSpecs": [
    {
      "ui": {
        "icons": [
          {
            "icon": "tachometer",
            "iconType": "font-awesome",
            "text": "2-3 cu/hour",
            "tooltip": "The compute power rating for this cluster is between 2 and 3 cu (compute units) per hour."
          }
        ]
      }
    }
  ]
}
```

An icon can also be defined as a shared icon and referenced from the cluster
spec's `ui.icons` value.  E.g.,

```
{
  "sharedIcons": {
    "sge": {
      "icon": "https://s3-eu-west-1.amazonaws.com/alces-flight/FlightLaunch/Logos/gridengine.png",
      "iconType": "url",
      "text": "SGE",
      "tooltip": "This cluster provides the Open Grid Scheduler (SGE) job scheduler."
    }
  },
  "clusterSpecs": [
    {
      "ui": {
        "icons": [
          {
            "sharedIcon": "sge"
          }
        ]
      }
    }
  ]
}
```


#### Fly section

The `fly` section consists of the parameters given to the `fly` binary to
launch the cluster. E.g.,

```
{
    "key": UUID,
    "ui": {...},

    "fly": {
      "args": [
        "--solo"
      ],
      "parameterDirectoryOverrides": {
        "solo": {
          "AutoscalingPolicy": "disabled",
          "ComputeSpotPrice": "0.3",
          "SchedulerType": "slurm"
        }
      }
    }

    "launchOptions": {...},
},

```

Valid values for the `solo` parameter directory override can be found by
running `fly --create-parameter-directory foo ; cat foo/solo.yml`.

Valid values for the `args` array can be found by running `fly cluster launch
--help`.  In practice, passing the `"--solo" flag is likely to be all that is
required or wanted.

#### Launch options section

The `launchOptions` section describes a set of launch options for the cluster
spec.

These options are mutually exclusive and exactly one must be selected.  If
there is a single option the client app will automatically select that option.
If there are two options the user will be able to select one of them.

WARNING: Currently, if there are more than two options, the client app will
only allow selecting between the first two.  It should be relatively simple to
extend this to support more than two options.

```
{
    "key": UUID,
    "ui": {...},

    "launchOptions": {
      "defaultOptionIndex": 0,
      "options": [{
        "costPerHour": 2,
        "name": "Standard",
        "description": "Offers a good compromise between cost and job durability.",
        "fly": {
          "args": [],
          "parameterDirectoryOverrides": {
            "solo": {
              "ComputeSpotPrice": "0.113"
            }
          }
        }
      },{
        "costPerHour": 3,
        "name": "High",
        "description": "Uses more compute units; provides better job durability",
        "fly": {
          "args": [],
          "parameterDirectoryOverrides": {
            "solo": {
              "ComputeSpotPrice": "0.226"
            }
          }
        }
      }]
    },

    "fly": {...}
}
```

The `launchOptions` object must contain two keys `defaultOptionIndex` and
`options`.  The `defaultOptionIndex` value specifies which option should be
selected by default.  The `options` array contains a list of launch options.

Each launch option has a `name` and `description` which are presented to the
user to allow them to chose between them.  The `costPerHour` value is the
number of compute credits that that option consumes each hour.  The `fly`
value has the same format as described above (Fly section).

The `args` and `parameterDirectoryOverrides` in the launch option take
precedence over those specified for the cluster spec itself.


#### Features section

The features section contains a description of which features the cluster spec
supports.  At the time of writing, the only supported feature is the
`forgeCollections` feature.  If a cluster spec supports this feature, the user
will be offered the option of specifying which forge collections they wish
installed when their cluster launches.

```
{
    "key": UUID,
    "ui": {...},
    "launchOptions": {...},
    "fly": {...},

    "features": {
      "forgeCollections": true
    }
}
```



## Example

An example of a cluster specs json file with three cluster specs is given below.

```
{
  "sharedIcons": {
    "sge": {
      "icon": "https://s3-eu-west-1.amazonaws.com/alces-flight/FlightLaunch/Logos/gridengine.png",
      "iconType": "url",
      "text": "SGE",
      "tooltip": "This cluster provides the Open Grid Scheduler (SGE) job scheduler."
    },
    "slurm": {
      "icon": "https://s3-eu-west-1.amazonaws.com/alces-flight/FlightLaunch/Logos/slurm.png",
      "iconType": "url",
      "text": "Slurm",
      "tooltip": "This cluster uses the Slurm Workload Manager job scheduler."
    }
  },

  "clusterSpecs": [
    {
      "ui": { 
        "title": "Small SGE cluster",
        "titleLowerCase": "small SGE cluster",
        "subtitle": "Autoscaling upto 8 nodes. Spot instances. SGE scheduler.",
        "body": "An autoscaling cluster, scaling upto a maximum of 8 compute nodes.  The compute nodes use spot instances with a reserve price of 0.3.  It uses the SGE scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png",
        "icons" [
          {
            "sharedIcon": "sge"
          },
          {
            "icon": "tachometer",
            "iconType": "font-awesome",
            "text": "2-3 cu/hour",
            "tooltip": "The compute power rating for this cluster is between 2 and 3 cu (compute units) per hour."
          }
        ]
      },
      "launchOptions": {
        "defaultOptionIndex": 0,
        "options": [{
          "costPerHour": 2,
          "name": "Standard",
          "description": "The standard launch configuration offering a good compromise between cost and job durability.",
          "fly": {
            "parameterDirectoryOverrides": {
              "solo": {
                "ComputeSpotPrice": "0.3"
              }
            }
          }
        },
        {
          "costPerHour": 3,
          "name": "High",
          "description": "This launch configuration uses more compute units per hour to provide better durability for your jobs.",
          "fly": {
            "args": [],
            "parameterDirectoryOverrides": {
              "solo": {
                "ComputeSpotPrice": "0.9"
              }
            }
          }
        }]
      },
      "fly": {
        "args": [
          "--solo"
        ],
        "parameterDirectoryOverrides": {
          "solo": {
            "AutoscalingPolicy": "enabled",
            "SchedulerType": "gridscheduler"
          }
        }
      }
    },
  
    {
      "ui": { 
        "title": "8 node GPU cluster",
        "titleLowerCase": "8 node GPU cluster",
        "subtitle": "8 on demand GPU spot instances. SGE scheduler.",
        "body": "An SGE cluster with 8 GPU compute nodes. The compute nodes use spot instances with a reserve price of 0.3.  It uses the SGE scheduler.",
        "logoUrl": "http://alces-flight.com/images/logo.png",
        "icons" [
          {
            "sharedIcon": "sge"
          },
          {
            "icon": "tachometer",
            "iconType": "font-awesome",
            "text": "2 cu/hour",
            "tooltip": "The compute power rating for this cluster is 20 cu (compute units) per hour."
          }
        ]
      },
      "launchOptions": {
        "defaultOptionIndex": 0,
        "options": [{
          "costPerHour": 20,
          "name": "Standard",
          "description": "The standard launch configuration offering a good compromise between cost and job durability.",
          "fly": {
            "parameterDirectoryOverrides": {
              "solo": {
                "ComputeSpotPrice": "1.3"
              }
            }
          }
        }]
      },
      "features": {
        "forgeCollections": true
      },
      "fly": {
        "args": [
          "--domain", "launch-1",
        ],
        "parameterDirectoryOverrides": {
          "cluster-master": {
            "SchedulerType": "gridscheduler"
          }
        }
      }
    },
  
    {
      "ui": { 
        "title": "Biochemistry cluster",
        "titleLowerCase": "biochemistry cluster",
        "subtitle": "Slurm scheduler; Biochemistry software preinstalled",
        "body": "An autoscaling Slurm cluster with common Biochemistry software preinstalled.  The compute nodes use spot instances with a reserve price of 0.3.",
        "logoUrl": "http://alces-flight.com/images/logo.png",
        "icons" [
          {
            "sharedIcon": "sge"
          },
          {
            "icon": "tachometer",
            "iconType": "font-awesome",
            "text": "5-10 cu/hour",
            "tooltip": "The compute power rating for this cluster is between 5 and 10 cu (compute units) per hour."
          }
        ]
      },
      "launchOptions": {
        "defaultOptionIndex": 0,
        "options": [{
          "costPerHour": 5,
          "name": "Standard",
          "description": "The standard launch configuration offering a good compromise between cost and job durability.",
          "fly": {
            "parameterDirectoryOverrides": {
              "solo": {
                "AutoscalingPolicy": "enabled",
                "ComputeSpotPrice": "0.3"
              }
            }
          }
        },
        {
          "costPerHour": 10,
          "name": "High",
          "description": "This launch configuration uses more compute units per hour to provide better durability for your jobs.",
          "fly": {
            "args": [],
            "parameterDirectoryOverrides": {
              "solo": {
                "AutoscalingPolicy": "disabled",
                "ComputeSpotPrice": "0"
              }
            }
          }
        }]
      },
      "fly": {
        "args": [
          "--solo"
        ],
        "parameterDirectoryOverrides": {
          "solo": {
            "PreloadSoftware": "bioinformatics",
            "SchedulerType": "slurm"
          }
        }
      }
    },
  ]
```
