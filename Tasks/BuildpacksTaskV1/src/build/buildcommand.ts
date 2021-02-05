import tasks = require('azure-pipelines-task-lib/task');

export async function run(): Promise<number> {

    // Options
    const imageName = tasks.getInput("imageName");

    // Flags
    const builder: string = tasks.getInput("builder")
    const buildpacks: string[] = tasks.getDelimitedInput("buildpacks", "\n", false);
    const clearCache: boolean = tasks.getBoolInput("clearCache");
    const defaultProcess = tasks.getInput("defaultProcess");
    const descriptor = tasks.getPathInput("descriptor");
    const envVariables = tasks.getDelimitedInput("envVariables", "\n", false)
    const envFiles = tasks.getDelimitedInput("envFiles", "\n", false)
    const projectPath = tasks.getPathInput("projectPath")
    const pullPolicy = tasks.getPathInput("pullPolicy")
    const runImage = tasks.getInput("runImage");
    const tags = tasks.getDelimitedInput("tags", "\n", false);
    const trustBuilder = tasks.getBoolInput("trustBuilder");

    const packPath = tasks.which("pack", true);
    const pack = tasks.tool(packPath);
    pack.arg("build");

    if (imageName) {
        pack.arg(imageName);
    }

    if (builder) {
        pack.arg("--builder");
        pack.arg(builder);
    }

    buildpacks.forEach(el => {
        pack.arg("--buildpack")
        pack.arg(el);
    });

    if (clearCache) {
        pack.arg("--clear-cache");
    }

    if (defaultProcess) {
        pack.arg("--default-process");
        pack.arg(defaultProcess);
    }

    if (descriptor) {
        pack.arg("--descriptor")
        pack.arg(descriptor)
    }

    envVariables.forEach(el => {
        pack.arg("--env")
        pack.arg(el);
    });

    envFiles.forEach(el => {
        pack.arg("--env-file")
        pack.arg(el);
    });

    if (projectPath) {
        pack.arg("--path")
        pack.arg(projectPath)
    }

    if (pullPolicy) {
        pack.arg("--pull-policy")
        pack.arg(pullPolicy)
    }

    if (runImage) {
        pack.arg("--run-image")
        pack.arg(runImage)
    }

    tags.forEach(el => {
        pack.arg("--tag")
        pack.arg(el);
    });

    if (trustBuilder) {
        pack.arg("--trust-builder")
    }

    return pack.exec();
}