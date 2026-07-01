---
theme: air
style: ../entrust-style.css
title: WfExS-backend with GA4GH TES
---

# Orchestrated containers executors

## WfExS-backend with GA4GH Task Execution Service (TES) 

WfExS-backend is a workflow execution orchestrator designed to support secure, reproducible, and portable execution of computational workflows.

It simplifies the reproducibility of computational analyses. Rather than manually configuring workflow definitions, software dependencies, container images, and input datasets, researchers can reproduce a previous analysis directly from a Workflow Run RO-Crate (WRROC). WfExS uses the WRROC to automatically reconstruct the execution environment by staging all the required components, including workflow definitions, execution parameters, container images, and reference datasets.

In this implementation, WfExS is integrated with a GA4GH TES deployment using a customised Funnel instance. WfExS itself runs as a container within the TES execution environment, where it prepares and orchestrates the execution of workflow-based analyses.


### How the WfExS executor works

The execution model is based on a clear separation of responsibilities between orchestration and execution:

- **Funnel (GA4GH TES implementation)** provides the execution environment and manages computational resources.
- **WfExS-backend** runs as a TES executor, reconstructing the analysis from a WRROC, staging the required resources, and coordinating execution.
- **Workflow engines (e.g. Nextflow)** interpret and execute computational workflows defined in a portable and reproducible manner.
- **Computational workflows [(e.g. nf-core pipeline, Sarek)](../examples-in-five-safes-tes/genomics-usecase)** define the scientific analysis logic executed on compute resources as a series of containerised tasks.


The overall execution flow is illustrated below.

![Architecture diagram WfExS with TES](./wfexs_architecture.png)


## Checklist for an analysis 

- A Workflow Run RO-Crate (WRROC) describing the analysis is available.
- Required datasets and reference resources are accessible within the TRE.
- TES task template of the scenario, describing which parameters can be changed.
- Any modified input parameters must be compatible with the workflow. Researchers may adjust analysis-specific parameters (e.g. filtering thresholds or quality cut-offs), but changes that alter the execution context, such as replacing the reference genome, modifying workflow definitions, or using incompatible input file formats, may invalidate the execution or compromise reproducibility.

Once these requirements are met, WfExS can reconstructs the execution environment and submit the workflow for execution through the TES infrastructure.
 

![Architecture wfexs with tes](./wfexs_inputs.png)


## Key security considerations 

- **Nested Containerisation Execution**: increased complexity to achieve the targeted isolation through FUSE encryption.
- **Workflow introspection in an isolated environment**: all the dependencies have to be provided beforehand to avoid issues.
- **Controlled filesystem access**: careless bind mount and caches might expose sensitive unencrypted host data if not controlled.
- **Secret management**: how to perform the proper key exchanges needed to decrypt contents on the fly, or safely encrypt results before they are exported.
- **Temporary writable storage**: it should be encrypted to avoid leakages.
- **Persistent tracking & metadata**: accountability must be performed wherever it is possible.

## Provenance and RO-Crate model

