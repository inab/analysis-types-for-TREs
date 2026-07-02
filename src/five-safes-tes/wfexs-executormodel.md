---
theme: air
style: ../entrust-style.css
title: WfExS-backend with GA4GH TES
---

# Orchestrated containers executors

## WfExS-backend with GA4GH Task Execution Service (TES) 

[WfExS-backend](https://github.com/inab/WfExS-backend) is a workflow execution orchestrator designed to support secure, reproducible, and portable execution of computational workflows.

It simplifies the reproducibility of computational analyses. Rather than manually configuring workflow definitions, software dependencies, container images, and input datasets, researchers can reproduce a previous analysis directly from a [Workflow Run RO-Crate (WRROC)](https://www.researchobject.org/workflow-run-crate/). WfExS uses contents represented in WRROC standard to automatically reconstruct the execution environment by staging all the required components, including workflow definitions, execution parameters, container images, and reference datasets.

In this implementation, WfExS is integrated with a deployment of [Funnel](https://calypr.org/tools/funnel/), a [GA4GH TES](https://www.ga4gh.org/product/task-execution-service-tes/) service implementation. This deployment uses a customised setup, in order to allow nested container executions. WfExS itself runs as a container within the TES execution environment, where it prepares and orchestrates the execution of workflow-based analyses.


### How the WfExS executor works

The execution model is based on a clear separation of responsibilities between orchestration and execution:

- **Funnel (GA4GH TES implementation)** provides the execution environment and manages computational resources.
- **WfExS-backend** runs as a TES executor, reconstructing the analysis from a WRROC, staging the required resources, and coordinating execution.
- **Workflow engines (e.g. Nextflow)** interpret and execute computational workflows defined in a portable and reproducible manner.
- **Computational workflows [(e.g. nf-core pipeline, Sarek)](../examples-in-five-safes-tes/genomics-usecase)** define the scientific analysis logic executed on compute resources as a series of containerised tasks.


The overall execution flow is illustrated below.

![Architecture diagram WfExS with TES](./wfexs_architecture.png)


## Checklist for an analysis 

To execute a workflow analysis using WfExS executor, researchers submit a *TES task* describing the analysis to be reproduced. Rather than defining the workflow execution from scratch, the task references a **Workflow Run RO-Crate (WRROC)** containing the complete description of a previous execution.

The WRROC embeds all the information required to reconstruct the analysis, including the workflow definition, execution parameters, software containers, reference resources, and provenance metadata. The TES task complements this information with execution-specific settings, such as the selected executor and any parameters that are intended to be customised for the new execution.

For each supported workflow, one or more **task templates** should be made available. These templates define which execution parameters can be modified by researchers while preserving the reproducibility of the workflow. For example, users may adjust analysis-specific parameters, such as filtering thresholds or quality cut-offs, whereas changes that fundamentally alter the execution context (such as replacing the reference genome or modifying the workflow definition) should not be permitted.

Before executing a workflow with the WfExS executor, researchers should ensure that:

- A Workflow Run RO-Crate (WRROC) describing the analysis is available.
- Required datasets and reference resources are accessible within the TRE (or already cached).
- TES task template of the scenario, describing which parameters can be changed.
- Any modified input parameters must be compatible with the workflow. 

Once these requirements are met, WfExS can reconstructs the execution environment and submit the workflow for execution through the TES infrastructure.
 

![Architecture wfexs with tes](./wfexs_inputs.png)


The task template contains:

- a reference to a Workflow Run RO-Crate (WRROC) describing the previous analysis;
- execution-specific information, such as the executor configuration and any parameters that may be customised;
references to the datasets and resources available within the TRE.

Templates should be provided for each supported workflow so that researchers only need to supply the information that is intended to vary between executions.

Example of minimal TES Task Template:

```json
{
  "name": "WfExS offline execution",
  "description": "wfexs offline execution (stage)",
  "executors": [
    {
      "image": "ghcr.io/inab/wfexs-backend:1.0.6",
      "command": [
        "WfExS-backend",
        "staged-workdir",
        "offline-exec",
        "/root/WfExS-instance-dirs/workdir_id_stage.txt"
      ]
    }
  ]
}




```

## Key security considerations 

- **Nested Containerisation Execution**: increased complexity to achieve the targeted isolation through FUSE encryption.
- **Workflow introspection in an isolated environment**: all the dependencies have to be provided beforehand to avoid issues.
- **Controlled filesystem access**: careless bind mount and caches might expose sensitive unencrypted host data if not controlled.
- **Secret management**: how to perform the proper key exchanges needed to decrypt contents on the fly, or safely encrypt results before they are exported.
- **Temporary writable storage**: it should be encrypted to avoid leakages.
- **Persistent tracking & metadata**: accountability must be performed wherever it is possible.

## Provenance and RO-Crate model

