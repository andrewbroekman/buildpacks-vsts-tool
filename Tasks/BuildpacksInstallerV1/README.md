# Buildpacks.io tool installer


### Overview

The Buildpacks Tool Installer task acquires a specified version of [Buildpacks](https://buildpacks.io/) from the Internet or the tools cache and prepends it to the PATH of the Azure Pipelines Agent (hosted or private). Use this task to change the version of Buildpacks used in subsequent tasks like [Buildpacks]().
Adding this task before the [Buildpacks task]() in a build definition ensures you are using that task with the right Buildpacks version.


### Contact Information

Please report a problem at [Github](https://github.com/) if you are facing problems in making this task work. You can also share feedback about the task like, what more functionality should be added to the task, what other tasks you would like to have, at the same place.


### Pre-requisites for the task

The task can run on the following build agent operating systems:
- Windows
- MacOS
- Linux


### Parameters of the task

* **Display name\*:** Provide a name to identify the task among others in your pipeline.

* **Version\*:** Specify the exact version of Buildpacks to install.
Example: 
    To install Buildpacks version 0.16.0, use 0.16.0
For getting more details about exact version, refer [this link](https://github.com/buildpacks/pack/releases)


### Output Variables

* **Buildpacks location:** This variable can be used to refer to the location of the pack binary that was installed on the agent in subsequent tasks.
