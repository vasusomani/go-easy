const vscode = require("vscode");
const { spawn } = require("child_process");

let outputChannel;

function sendWindowMessage(message) {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: message,
      cancellable: false,
    },
    async (progress, token) => {
      await setTimeout(() => {}, 35000);
    }
  );
}

async function setProjectDirectoryCommand() {
  // Check if server is already running
  if (outputChannel) {
    sendWindowMessage("Go Easy server is already running, stop it first");
    return;
  }

  const directory = await vscode.window.showInputBox({
    prompt:
      "Enter the project directory relative path (eg: /path/to/dir) or press enter to select current dir",
    placeHolder: "Project Directory",
  });

  if (directory) {
    console.log("Flag 1", directory);
    await vscode.workspace
      .getConfiguration("goEasy")
      .update(
        "projectDirectory",
        directory,
        vscode.ConfigurationTarget.Workspace
      );

    vscode.window.showInformationMessage(
      `Project directory set to: ${directory}`
    );
    restartProcess(directory);
  } else {
    console.log("Flag 2", directory);
    await vscode.commands.executeCommand(
      "workbench.action.focusActiveEditorGroup"
    );
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor && activeTextEditor.document) {
      const currentFileUri = activeTextEditor.document.uri;
      console.log("Curr File", currentFileUri);
      const filePath = currentFileUri.path;
      const projectDir = filePath.substring(0, filePath.lastIndexOf("/"));
      console.log("Flag 3", projectDir);
      await vscode.workspace
        .getConfiguration("goEasy")
        .update(
          "projectDirectory",
          projectDir,
          vscode.ConfigurationTarget.Workspace
        );
      restartProcess(projectDir);
    } else {
      vscode.window.showErrorMessage("No active file found.");
      return;
    }
  }
}

async function isInProjectDirectory(filePath) {
  console.log("In isInProjectDirectory");
  console.log("File Path", filePath);
  const projectDirectory = await vscode.workspace
    .getConfiguration("goEasy")
    .get("projectDirectory");
  console.log("Project Dir", projectDirectory);

  return filePath.includes(projectDirectory);
}

function spawnProcess(projectDir) {
  console.log("project dir: " + projectDir);
  let arr = projectDir.split("/");
  let buildName = arr[arr.length - 1];
  console.log("Build Name", buildName);
  const child = spawn("bash", [
    "-c",
    `cd ${projectDir} && go build -o ${buildName} && go run .`,
  ]);

  child.stdout.on("data", (data) => {
    console.log(data.toString("utf-8"));
    outputChannel.appendLine(data.toString("utf-8"));
  });
  child.stderr.on("data", (data) => {
    console.log(data.toString("utf-8"));
    outputChannel.appendLine(data.toString("utf-8"));
  });
  child.on("error", (error) => {
    console.log("error", error);
    outputChannel.appendLine(error.toString());
  });
  child.on("exit", (code, signal) => {
    if (code) {
      console.log(`Process exited with code ${code}\n`);
      outputChannel.appendLine(`Process exited with code ${code}\n`);
    }
    if (!code && !signal) {
      console.log("Process ended successfully\n");
      outputChannel.appendLine("Process ended successfully\n");
    }
  });
}

async function restartProcess(projectDir) {
  console.log("Flag 4", projectDir);
  let arr = projectDir.split("/");
  let buildName = arr[arr.length - 1];
  console.log("Build Name", buildName);
  if (!outputChannel) {
    console.log("Flag 5", projectDir);
    outputChannel = await vscode.window.createOutputChannel("GoEasy Output");
    outputChannel.show();
    spawnProcess(projectDir);
  } else {
    console.log("Flag 6", projectDir);
    const killChild = spawn("bash", ["-c", `pgrep ${buildName} | xargs kill`]);
    killChild.on("exit", (code, signal) => {
      console.log("Kill process exited", code, signal);
      spawnProcess(projectDir);
    });
  }
}

// Stop the server if running
async function stopServer() {
  const projectDirectory = await vscode.workspace
    .getConfiguration("goEasy")
    .get("projectDirectory");

  if (outputChannel != null && projectDirectory != null) {
    console.log(projectDirectory);
    let arr = projectDirectory.split("/");
    let buildName = arr[arr.length - 1];
    const killChild = spawn("bash", ["-c", `pgrep ${buildName} | xargs kill`]);
    await outputChannel.dispose();
    outputChannel = null;
    killChild.on("exit", (code, signal) => {
      console.log("Kill process exited", code, signal);
      vscode.window.showInformationMessage("Go Easy server stopped.");
    });
  } else {
    sendWindowMessage("No Go Easy server found to stop");
  }
}

const startServer = vscode.workspace.onDidSaveTextDocument(async (document) => {
  const savedFilePath = document.uri.fsPath;
  const projectDirectory = await vscode.workspace
    .getConfiguration("goEasy")
    .get("projectDirectory");
  console.log("Flag 6", projectDirectory);
  console.log("Flag 6", savedFilePath);
  if (isInProjectDirectory(savedFilePath)) {
    console.log("Flag 7", projectDirectory);
    console.log("File in project directory");
    console.log("saved file path", savedFilePath);
    console.log("projectDir at disposal var :", projectDirectory);
    restartProcess(projectDirectory);
  } else {
    console.log("Flag 8", projectDirectory);
    console.log("File not in project directory");
    console.log(savedFilePath);
  }
});

//Register Command
function activate(context) {
  //Run Command
  let startServer = vscode.commands.registerCommand(
    "goEasy.setProjectDirectory",
    setProjectDirectoryCommand
  );

  //Stop Command
  let stopServerCommand = vscode.commands.registerCommand(
    "goEasy.pauseExtension",
    stopServer
  );

  context.subscriptions.push(stopServerCommand);
  context.subscriptions.push(startServer);
}
exports.activate = activate;

//Dispose Function
function deactivate() {
  startServer.dispose();
}
exports.deactivate = deactivate;
