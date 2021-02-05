import tasks = require('azure-pipelines-task-lib/task');

export async function run(): Promise<number> {

    // Flags
    const customCommand: string = tasks.getInput("customCommand", true)
    const args: string = tasks.getInput("arguments", true);

    const packPath = tasks.which("pack", true);
    const pack = tasks.tool(packPath);
    pack.arg("build");

    if (customCommand) {
        pack.arg(customCommand);
    }

    if (args) {
        pack.arg(args);
    }
    
    return pack.exec();
}