import tasks = require('azure-pipelines-task-lib/task');
import path = require('path');

import * as buildcommand from './build/buildcommand';
import * as customCommand from './custom/customcommand';
import * as versioncommand from './version/versioncommand';

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    const command = tasks.getInput("command");
    tasks.error(command);

    try {
        switch (command) {
            case "build":
                await buildcommand.run();
                break;

            case "custom":
                await customCommand.run();
                break;

            case "version":
                await versioncommand.run();
                break;

            default:
                throw tasks.loc("CommandNotRecognized", command);
        }

        tasks.setResult(tasks.TaskResult.Succeeded, "");

    } catch(error) {
        tasks.setResult(tasks.TaskResult.Failed, error);
    } finally {}
}

run();
