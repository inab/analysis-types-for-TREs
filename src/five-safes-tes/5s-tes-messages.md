---
theme: air
style: ../entrust-style.css
title: Five Safes TES messages
---

# TES messages for 5s-TES

<div class="tip">

The information included here is not essential, but can help you understand what's going under the hood of tools like [the wizards](submitting-to-5s-tes#web-application).

</div>

The reference documentation for TES messages specifies the standard for [creating a task](https://ga4gh.github.io/task-execution-schemas/docs/#tag/TaskService/operation/CreateTask).
5s-TES accepts this format, but some fields are treated differently because of how the [submission layer](/examples-in-five-safes-tes#submission-layer) processes messages before they're sent to a TES engine.

## TES fields

<!--The 5s-TES docs include a 'state' field
Is this documented? Not part of the TES spec-->
| | |
|---|---|
| `name` | User provided task name |
| `description` | User provided task description |
| `inputs` | In a TES message, you can specify files which you would like the engine to download and use in your task. Whether these inputs will be downloaded when your task is running depends on the TRE; some will not allow inputs to be downloaded for security. |
| `outputs` | In TES messages, this specifies where outputs should be stored. This is amended by the TRE agent. |
| `resources` | In a TES message, you can specify the computing resources you would like to have for your task. A TRE may choose what resources you are given, rather than following this. |
| `executors` | A list of containers to run. The images available will depend on what TREs allow. |
| `volumes` | Shared volumes that the containers can use to share data among themselves |
| `tags` | optional in TES, but important for orchestration by the submission layer |

## Use of tags in 5s-TES
In TES, the `tags` field is "used to store meta-data and annotations about a task".
However, in 5s-TES, this has been overloaded so that two tags are essential.

A `Project` tag must contain the name of an approved project in the submission layer

A `tres` tag must contain a list of TREs that should run the task, separated by a pipe character (|). Therefore, the task is sent to each one of the specified TREs in the list. 

An example of the `tags` field is:

```json
"tags": {
            "Project": "NottinghamDemo",
            "tres": "Nottingham TRE 01|Nottingham TRE 02"
         },
```


## Use of templates in 5s-TES


Workflow analyses executed through WfExS are submitted as TES task messages to the TRE. To simplify their preparation and ensure reproducibility, TRE operators are expected to provide TES task templates for each supported analysis scenario. 

Each template encapsulates the orchestration steps required to reproduce a previously validated workflow execution. 

A WfExS TES task template must contain:

- a reference to a Workflow Run RO-Crate (WRROC) describing the analysis.
- execution-specific information, such as the executor configuration and any parameters that may be customised;
references to the datasets and resources available within the TRE.


Researchers typically only need to provide the analysis-specific inputs identified by the template (for example, input datasets or sample sheets), while the remaining execution configuration should remain unchanged.

A complete example of a WfExS TES task template is shown below.


<details>
  <summary>Example of minimal TES Task Template:</summary>


```json
{
  "name": "WfExS offline execution",
  "description": "wfexs offline execution (stage)",
  "inputs": [
    {
      "name": "__workflow__",
      "description": "Workflow Run RO-Crate workflow snapshot (with pre-configured datasets)",
      "url": "URL:/path/to/WRROC",
      "path": "/container/wrroc.zip"
    },
    {
      "name": "input:1:fastq"
      "url": "URL:/path/to/INPUT",
      "path": "/data/input_1_fastq"
    },
  ],
  "outputs": [
    {
      "name": "output-analysis",
      "description": "The outputs generated in the current execution",
      "path": "/outputs",
      "url": "URL:/outputs/bucket/path",
      "type": "DIRECTORY"
    }
  ],
  "volumes": [
    "/shared/",
    "/outputs/",
  ],
  "executors": [
    {
      "image": "ubuntu:24.04",
      "command": [
        "/bin/bash",
        "-c",
        "echo 'params:' > /shared/config.wfex.stage && echo '  input:' >> /shared/config.wfex.stage && echo '    c-l-a-s-s: File'  && echo '    preferred-name: input.fastq' && echo '    url: file:///data/input_1_fastq'"
      ],
      "workdir": "/shared",
      "stdout": "/outputs/prepare_params_stdout.log",
      "stderr": "/outputs/prepare_params_stderr.log",
      "ignore_error": false
    },
    {
      "image": "ghcr.io/inab/wfexs-backend:1.0.9",
      "command": [
        "WfExS-backend",
        "import",
        "-R",
        "/container/wrroc.zip",
        "-W",
        "/shared/config.wfex.stage",
        "-s",
        "--save-workdir-id",
        "/shared/workdir_id_stage.txt"        
      ],
      "workdir": "/shared",
      "stdout": "/outputs/import_stdout.log",
      "stderr": "/outputs/import_stderr.log",
      "ignore_error": false
    },
    {
      "image": "ghcr.io/inab/wfexs-backend:1.0.9",
      "command": [
        "WfExS-backend",
        "staged-workdir",
        "offline-exec",
        "/shared/workdir_id_stage.txt"
      ],
      "workdir": "/shared",
      "stdout": "/outputs/exec_stdout.log",
      "stderr": "/outputs/exec_stderr.log",
      "ignore_error": false
    },
    {
      "image": "ghcr.io/inab/wfexs-backend:1.0.9",
      "command": [
        "WfExS-backend",
        "staged-workdir",
        "--workflow", //"--outputs", "--containers", "--inputs"
        "create-prov-crate",
        "/shared/workdir_id_stage.txt",
        "/outputs/new-wrroc.zip"
      ],
      "workdir": "/shared",
      "stdout": "/outputs/prov_crate_stdout.log",
      "stderr": "/outputs/prov_crate_stderr.log",
      "ignore_error": false
    },  
    {
      "image": "ghcr.io/inab/wfexs-backend:1.0.9",
      "command": [
        "WfExS-backend",
        "staged-workdir",
        "shell",
        "/shared/workdir_id_stage.txt",
        "--",
        "cp", "-dpLr", "outputs", "/outputs/analysis_outputs"
      ],
      "workdir": "/shared",
      "stdout": "/outputs/outputs_cp_stdout.log",
      "stderr": "/outputs/outputs_cp_stderr.log",
      "ignore_error": false
    },  
    
  ],
  "tags": {
  "Project": "EoscEntrustDemo",
  "tres": "Nottingham TRE 02|BSC"
   }
}
```

</details> 

### WfExS TES template structure

1. Import the analysis (staging)

The first execution step imports the selected Workflow Run RO-Crate (WRROC) into WfExS.

During this stage, WfExS reconstructs the workflow execution environment described by the WRROC, stages the required workflow definition, software containers, datasets and reference resources, validates the execution configuration, and prepares the working directory for execution.

2. Offline workflow execution

Once the execution environment has been prepared, WfExS performs the workflow execution in offline mode using the staged working directory.

The execution is delegated to the workflow engine specified by the workflow (e.g. Nextflow or CWL), which runs the workflow using the researcher-provided inputs while preserving the execution configuration captured in the selected WRROC. WfExS orchestrates the execution, monitors its progress, and records the metadata required for provenance generation.

3. Exporting workflow results

WfExS can automatically generate a WRROC at the end of a successful workflow execution. This behaviour is configured in the TES task, which also specifies the destination where the generated WRROC will be written.

The exported WRROC packages the workflow (`--workflow`) together with the execution metadata and provenance information. The contents of the generated WRROC can be tailored to the execution scenario. Besides the workflow definition and execution provenance, additional resources can be embedded as payload, such as the workflow outputs (`--outputs`), software containers (`--containers`), and, where permitted by the TRE security policies, the workflow inputs (`--inputs`).