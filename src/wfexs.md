---
theme: air
style: entrust-style.css
title: WfExS-backend
---

# Workflow Execution Service (WfExS-backend)

WfExS-backend is a workflow execution orchestrator designed to support secure, reproducible, and portable execution of computational workflows.

Its main goal is to enable **reproducibility of analyses in secure environments**, while simplifying the process for researchers by allowing analyses to be reconstructed and re-executed directly from a Workflow Run RO-Crate (WRROC). From a previous execution description, WfExS can automatically import and stage all the required elements needed to reproduce the analysis of a computational workflow, including workflow definitions, parameters, container images, and input datasets.


Workflow Execution Service Backend (WfExS-backend) is a high-level orchestrator to run scientific workflows reproducibly. It acquires workflows, containers and inputs from a distributed scenario in order to prepare their local execution, interfacing with workflow engines to instantiate them. It supports cwltool and Nextflow workflow engines with current efforts to incorporate snakemake and Galaxy. WfExS-backend was initially developed in EOSC-Life as a demonstrator on sensitive data analysis and is now part of the Service Delivery plan of INB/ELIXIR-ES.

RO-Crate is a community-driven digital objects semantic metadata specification used in scenarios like the description of research datasets in several milestones of their lifecycle. It enables the creation of self-contained representations of the metadata, which can be easily shared and reused, even when the annotated digital objects are publicly identified but under controlled access.

WfExS-backend can consume and produce RO-Crates describing scientific workflows (where the workflow and its resources are available) and workflow executions (description of inputs, containers, etc…). The ideal scenario is where the generated RO-Crates describing workflow instantiations have all the shareable gathered details needed to reproduce them.

Generated WfExS-backend RO-Crates come from previously staged execution scenarios and the gathered, associated metadata (both prospective and retrospective). These RO-Crates should follow the different Workflow Run RO-Crate profiles, taking into account the limitations of the WfExS-backend by gathering all the details from the different workflow engines, their instantiations and the computing environment. These details can ensure that properly documented workflow instantiations are more reproducible, reusable, and easily understood by the scientific community.
