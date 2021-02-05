import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
import * as installer from './buildpack-installer';

async function configureBuildpack() {
    let inputVersion = tasks.getInput("buildpacksVersion", true);
    let buildpackPath = await installer.downloadBuildpack(inputVersion);
    let envPath = process.env['PATH'];

    // Prepend the tools path. Instructs the agent to prepend for future tasks
    if (envPath && !envPath.startsWith(path.dirname(buildpackPath))) {
        tools.prependPath(path.dirname(buildpackPath));
    }
}

async function verifyBuildpack() {
    console.log(tasks.loc("VerifyBuildpacksInstallation"));
    let buildpackPath = tasks.which("pack", true);
    let buildpackTool : ToolRunner = tasks.tool(buildpackPath);
    buildpackTool.arg("version");
    return buildpackTool.exec();
}

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    try {
        await configureBuildpack();
        await verifyBuildpack();
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    } catch (error) {
        tasks.setResult(tasks.TaskResult.Failed, error);
    }
}

run();
