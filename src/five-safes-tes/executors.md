---
theme: air
style: ../entrust-style.css
title: 5s-TES executors
---

# Standalone containers executors
TES tasks run through executors, specified in the `executors` field of a TES message.
An example TES message could contain

```json
{
    ...,
    "executors": [
        {
            "image": "harbor.federated-analytics.ac.uk/5s-tes-analysis-tools/5s-tes-analysis-tools-tre-sqlpg:1.0.0",
            "command": [
                     "--Output=/outputs/output.csv",
                     "--Query=<SOME SQL>"
            ],
        }
    ]
}
```

This tells the TES engine in each TRE to load the `"image"` of the container at the specified URL.
A container is like a lightweight virtual machine wrapping some software, which offers benefits in security and reproducibility.
When the container is loaded, the specified `"command"` is then executed inside the container.
The TES standard lets you run any sequence of containers, so 5s-TES theoretically could too.
In practice, the executors you can run in 5s-TES TREs will depend on which containers the TRE will allow you to.
The examples in this documentation run on containers too, but will not cover all research needs.

## Running bespoke analysis
If you want to run some software that isn't provided by a TRE, you have to prepare a containerised version of the software you want to run. Typically, this may be a script such as python or R code, but can be any language or any tool. We do not currently support languages or tools which require external connections, such as to licence servers.

To containerise a script or tool in this way, the software must be executable from the command line.
Arguments can be passed in at runtime using the TES messages.
The command line arguments will be used in the `command` section of the `executors` in the TES message.
A script will have access to input data passed in through the TES message (through mounted filepaths specified in the inputs, if any) and output data by writing files to the output path specified in the outputs section of the TES message.
We recommend using `/inputs` and `/outputs` where possible.

The following is a list of environment variables which are used by Five Safes TES.
This is primarily of interest as it outlines the names of the variables required for a connection string to the database, which is likely to be required to connect the container to the database.
These variables will overwrite any that are passed through the TES message, as they are added by the submission layer.
```
"Any"
"CATALOG"
"SCHEMA"
"myapi2"
"myapikey"
"postgresDatabase"
"postgresPassword"
"postgresPort"
"postgresSchema"
"postgresServer"
"postgresUsername"
"submissionId"
"test"
"trinoPassword"
"trinoURL"
"trinoUsername"
```

Once your script or tool is ready, it must be built into a [container.](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/) The container's image must be published so it can be accessed by the TRE. A simple way to publish to an accessible location is using [github.](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

TREs can then approve and copy the container locally, to be usable on request (through a TES message). This means you can then submit a TES message to run the new image on the TRE.
