---
theme: air
style: ../entrust-style.css
title: Genomics use case
---


# Genomics use case: end-to-end execution of the Sarek pipeline

To illustrate the workflow execution model in practice, we present a genomics use case based on the [Sarek nf-core pipeline](https://nf-co.re/sarek/latest), a standardised workflow for germline and somatic variant analysis.

From the researcher’s perspective, the system enables the execution of a complete genomics analysis without requiring direct interaction with computational infrastructure, workflow engines, or job scheduling systems.

The execution is driven by a previously generated Workflow Run RO-Crate (WRROC), which encapsulates the full description of a prior execution, including workflow definition, parameters, container images, input datasets and metadata.

## Execution workflow

In this deployment model, WfExS is executed directly within a TES-managed environment. The TES infrastructure (exposed via a Funnel implementation) provides both the runtime environment and the execution backend.

The end-to-end execution proceeds as follows:

1. The researcher submits a TES task configured to use the WfExS executor. The task includes a previously generated Workflow Run RO-Crate (WRROC) together with the execution configuration.
2. The TES infrastructure launches the WfExS container within the execution environment.
3. WfExS imports the WRROC and reconstructs the workflow execution context by staging the workflow definition, software containers, input datasets, reference resources, and execution parameters.
4. The Sarek workflow is executed using the Nextflow workflow engine.
5. Analysis results are written to the WfExS working directory and exported according to the TES task configuration.
6. WfExS generates a new Workflow Run RO-Crate (WRROC) containing the workflow outputs, execution metadata, and provenance information.


## Inputs

This example reproduces a previous execution of the nf-core Sarek workflow using a Workflow Run RO-Crate (WRROC).

The execution requires:

- **Workflow Run RO-Crate (WRROC):** a previously generated WRROC describing the Sarek execution. It contains the workflow definition, execution parameters, software containers, reference resources, and provenance information required to reconstruct the analysis.

  The WRROC used in this example is available from Zenodo:

  > **Sarek Full Test Workflow Run RO-Crate (WRROC):** *[https://zenodo.org/records/21134855]*

- **Researcher-provided inputs:** researchers may provide analysis-specific input values through the TES task template. Typical examples include sample sheets, filtering thresholds, or other configurable analysis parameters. Changes that alter the workflow definition or execution context are not supported when reproducing the execution.


## Outputs and results

After the execution completes, researchers obtain:

- Standard nf-core Sarek outputs, including variant calling results and workflow reports.
- Structured output datasets stored in the WfExS `outputs/` directory.
- Execution logs and metadata describing the completed analysis.
- A newly generated Workflow Run RO-Crate (WRROC) containing the workflow outputs together with the execution metadata and provenance, enabling the analysis to be reproduced or shared.


### WfExS execution outputs

When a workflow is executed, WfExS creates a structured execution directory containing all the resources required to run the analysis and the results produced during execution.

The execution is organised into two main locations:

- **Cache directory:** stores reusable resources, such as downloaded workflows, software containers, and reference datasets. Keeping these resources in a cache avoids downloading or preparing them again in future executions.

- **Working directory (WORKDIR):** contains all files related to a specific workflow execution, including staged inputs, intermediate files, outputs, metadata, and provenance.

A typical WORKDIR contains the following directories:

| Directory | Description |
|-----------|-------------|
| `containers/` | Container images required to execute the workflow. |
| `inputs/` | Input datasets and reference files staged for the execution. |
| `extrapolated-inputs/` | Additional input files (sample .csv) generated automatically during workflow preparation. |
| `workflow/` | Local copy of the workflow definition and associated resources. |
| `engineTweaks/` | Workflow engine configuration and execution-specific settings prepared by WfExS. |
| `intermediate/` | Temporary files and intermediate results generated while the workflow is running. |
| `outputs/` | Final workflow outputs produced by the analysis. This is typically the directory researchers will inspect after execution. |
| `meta/` | Execution metadata, provenance information, logs, and the generated Workflow Run RO-Crate (WRROC). |
| `.TEMP/` | Temporary working directory used during execution. |

In addition, WfExS creates an internal identification files (`.id.json`) that uniquely identify the execution instance and support reproducibility and provenance tracking.

For most researchers, the most relevant directories are:

- **`outputs/`**, containing the analysis results.
- **`meta/`**, containing the execution metadata, provenance information and logs.