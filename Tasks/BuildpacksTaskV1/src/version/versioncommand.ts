import tasks = require('azure-pipelines-task-lib/task');

export async function run(): Promise<number> {

    const packPath = tasks.which("pack", true);
    const pack = tasks.tool(packPath);
    pack.arg("version");

    return pack.exec();
}