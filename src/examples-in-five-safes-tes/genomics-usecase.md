---
theme: air
style: ../entrust-style.css
title: Genomics use case
---


# Genomics use case: end-to-end execution of the Sarek pipeline

To illustrate the workflow execution model in practice, we present a genomics use case based on the [Sarek nf-core pipeline](https://nf-co.re/sarek/latest), a standardised workflow for germline and somatic variant analysis.

From the researcher’s perspective, the system enables the execution of a complete genomics analysis without requiring direct interaction with computational infrastructure, workflow engines, or job scheduling systems.

The execution is driven by a previously generated Workflow Run RO-Crate (WRROC), which encapsulates the full description of a prior execution, including workflow definition, parameters, container images, input datasets and metadata.

### Execution workflow

In this deployment model, WfExS is executed directly within a TES-managed environment. The TES infrastructure (exposed via a Funnel implementation) provides both the runtime environment and the execution backend.

The end-to-end execution proceeds as follows:

1. A WRROC describing a previous Sarek execution is imported into WfExS.
2. WfExS runs within the TES node and reconstructs the execution context.
3. Required components (workflows, parameters, containers, inputs) are staged locally in the execution environment.
4. Workflow tasks are generated and executed through the TES interface.
5. TES schedules and executes containerised tasks using Nextflow and the underlying compute resources.
6. Results are produced and stored in .... 
7. A new WRROC is generated, capturing full provenance of the execution.

### Inputs

- Inputs templates (wrroc)
- inputs provided by researcher



### Output and results

From the researcher’s perspective, the results include:

- Standard nf-core Sarek outputs for variant calling analysis
- Structured and reproducible output datasets
- A complete provenance record of the execution, enabling auditability and reuse