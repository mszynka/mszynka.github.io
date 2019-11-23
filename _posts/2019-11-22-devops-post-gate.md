---
title: Control your pipe(line)
tags: [Azure DevOps, Microsoft]
style: fill
color: success
description: How to manage and automatically control you deployment process using enterprise tools.
---

It's funny how vendor lock-in can make you use tools that are intercompatible but still change each step of the process so that you have to learn each step as it was something new. This story stands true when it comes to Azure DevOps environment. Each step seems easy to configure but then you find a small piece that is different.

[Azure DevOps](https://azure.microsoft.com/pl-pl/services/devops/) can do many marvelous things. It gives you process transparency and automation and so much more with logging and simply more control of the process. One of the most crucial parts can be CI/CD pipelines. This tool not only can deploy and test (if automated) your product or application but also can give pre-release sanity checks, either automated or manual approval.

![Gate approval (Azure DevOps)](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/_img/deploy-using-approvals/gates-01.png?view=azure-devops)

Let's focus on pre-deployment gate. This tool can easily check if current step of the release pipeline is correct and can continue to next e.g. publish application from integration or demo to public release. Configuration is fairly simple and well written in [this guide](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/deploy-using-approvals?view=azure-devops).

*But what if you wanna go outside the box? What if instead of some manual check you want to ensure that your web application responds correctly?*

There is a step that can invoke REST API url and check if returned value is correct. Checking the value requires knowledge of [expressions](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops) which are used to define conditions for a gate. In the part "Success criteria" you can specify expression that is evaluated to ensure that HTTP request not only returned HTTP 200 OK but also the output JSON is returning correct values. Important note: by default values are parsed as JSON.

![Invoke REST API](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/_img/invoke-rest-api-task.png?view=azure-devops)

### Remarks

Enterprise servies show that with some degree of engagement everyone can be part of deployment team. Couple things to look at:
1. Make sure to automate process you know,
2. Break down the steps according to one plan and logic,
3. Explore additional options,
4. Most of the things only needs parametrization.