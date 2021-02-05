import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import path = require('path');
import os = require('os');
import fs = require('fs');

const uuidV4 = require('uuid/v4');
const buildpackToolName = "pack";
const isWindows = os.type().match(/^Win/);

export async function downloadBuildpack(inputVersion: string): Promise<string> {
    let version = tools.cleanVersion(inputVersion);
    if (!version) {
        throw new Error(tasks.loc("InputVersionNotValidSemanticVersion", inputVersion));
    }

    let cachedToolPath = tools.findLocalTool(buildpackToolName, version);
    if (!cachedToolPath) {
        let buildpackDownloadUrl = getBuildpacksDownloadUrl(version);
        let fileName = `${buildpackToolName}-${version}-${uuidV4()}`;
        let buildpackDownloadPath;

        try {
            buildpackDownloadPath = await tools.downloadTool(buildpackDownloadUrl, fileName);
        } catch (exception) {
            throw new Error(tasks.loc("BuildpackDownloadFailed", buildpackDownloadUrl, exception));
        }

        let buildpackUnzippedPath: string
        switch(os.type()) {
            case "Darwin":
            case "Linux":
                buildpackUnzippedPath = await tools.extractTar(buildpackDownloadPath);
                break;
            
            case "Windows_NT":
                buildpackUnzippedPath = await tools.extractZip(buildpackDownloadPath);
                break;

            default:
                    throw new Error(tasks.loc("OperatingSystemNotSupported", os.type()));
        }
        
        cachedToolPath = await tools.cacheDir(buildpackUnzippedPath, buildpackToolName, version);
    }

    let buildpackPath = findBuildpackExecutable(cachedToolPath);
    if (!buildpackPath) {
        throw new Error(tasks.loc("BuildpackNotFoundInFolder", cachedToolPath));
    }

    if (!isWindows) {
        fs.chmodSync(buildpackPath, "777");
    }

    tasks.setVariable('buildpackLocation', buildpackPath);

    return buildpackPath;
}

function getBuildpacksDownloadUrl(version: string): string {
    let platform: string;
    let archiveFormat: string;

    switch(os.type()) {
        case "Darwin":
            platform = "macos";
            archiveFormat = "tgz";
            break;
        
        case "Linux":
            platform = "linux";
            archiveFormat = "tgz";
            break;
        
        case "Windows_NT":
            platform = "windows";
            archiveFormat = "zip";
            break;
        
        default:
            throw new Error(tasks.loc("OperatingSystemNotSupported", os.type()));
    }

    return `https://github.com/buildpacks/pack/releases/download/v${version}/pack-v${version}-${platform}.${archiveFormat}`
}

function findBuildpackExecutable(rootFolder: string): string {
    let buildpackPath = path.join(rootFolder, buildpackToolName + getExecutableExtension());
    var allPaths = tasks.find(rootFolder);
    var matchingResultFiles = tasks.match(allPaths, buildpackPath, rootFolder);
    return matchingResultFiles[0];
}

function getExecutableExtension(): string {
    if (isWindows) {
        return ".exe";
    }

    return "";
}
