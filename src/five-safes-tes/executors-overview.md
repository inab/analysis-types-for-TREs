---
theme: air
style: ../entrust-style.css
title: 5s-TES executors
---

# Five Safes TES executors

Five Safes TES supports different technical execution models. Tasks can either execute a single container directly or use an orchestration layer to reproduce and run complex computational workflows.

- **[Standalone containers](./executors)**: This is suited for analyses whose layout depends on software from a single container image, or software from several containers sequentially executed. The execution is described with a single TES message with the explicit list of containers and commands within them to be run one after another.

- **[Orchestrated containers (WfExS)](./wfexs-executormodel)**: As TES model is designed on either single or linear tasks. Non-linear workflows, which depend on software from other containers, require and orchestration layer with some nesting techniques. Workflow-based analyses are run using the WfExS-backend as an orchestrator, which runs both the corresponding workflow engine and the needed container instances within its own container instance. Nested containarisation (e.g. Singularity within Docker or Singularity within Singularity) enables this orchestration while remaining compatible with the TES environment. 