---
theme: air
toc: false
style: entrust-style.css
title: RO-Crate
---

# RO-Crate

[RO-Crate](https://www.researchobject.org/ro-crate/) is a way of packaging research data together with structured, machine-readable metadata, so that a dataset or analysis carries its own description of what it is, where it came from, and how it can be used. In federated analysis this gives researchers and TREs a common format for describing analysis requests and their results: the [Five Safes RO-Crate profile](https://trefx.uk/5s-crate/) extends RO-Crate for workflow runs on sensitive data in TREs, with each step (validation, sign-off, execution, disclosure control) recorded in the RO-Crate itself.

## Validating RO-Crates

An RO-Crate can be validated automatically against the RO-Crate specification, and against profiles such as the Five Safes RO-Crate. The [RO-Crate Validation Service](https://esciencelab.org.uk/RO-Crate-Validation-Service/) provides this as a REST API that a TRE can deploy or call.

<div class="tip">

For the full guide to validating RO-Crates (installing and running the service, the REST API, and validating Five Safes RO-Crates), see the [RO-Crate Validation Service documentation](https://esciencelab.org.uk/RO-Crate-Validation-Service/).

</div>
