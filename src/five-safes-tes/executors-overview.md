---
theme: air
style: ../entrust-style.css
title: 5s-TES executors
---

# Five Safes TES executors

Five Safes TES supports different execution models depending on the type of analysis being performed. Tasks can either execute a single container directly or use an orchestration layer to reproduce and run complex computational workflows.

- **[Standalone containers](./executors)**:  Executes a single analysis packaged as a single container. The executor directly launches the specified container within the TES environment, making it suitable for self-contained analyses.

- **[Orchestrated containers (WfExS)](./wfexs-executormodel)**: Executes workflow-based analyses using the WfExS-backend as an orchestration layer, which itself runs as a container within the TES environment.
