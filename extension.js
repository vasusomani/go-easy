const vscode = require("vscode");
const path = require("path");

let terminal;

async function setProjectDirectoryCommand() {
  let projectDirectory = await vscode.window.showInputBox({
    prompt:
      "Enter the project directory relative path (eg: /path/to/dir) or press enter to select current dir",
    placeHolder: "Project Directory",
  });

  if (projectDirectory) {
    await vscode.workspace
      .getConfiguration()
      .update(
        "goEasy.projectDirectory",
        projectDirectory,
        vscode.ConfigurationTarget.Global
      );
    vscode.window.showInformationMessage(
      `Project directory set to: ${projectDirectory}`
    );
  } else {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor && activeTextEditor.document) {
      const currentFileUri = activeTextEditor.document.uri;
      projectDirectory = path.dirname(currentFileUri.fsPath);
      console.log(projectDirectory);
      vscode.window.showInformationMessage(
        `Project directory set to: ${projectDirectory}`
      );
    } else {
      vscode.window.showErrorMessage("No active file found.");
      return;
    }
  }
}

function isInProjectDirectory(filePath) {
  const projectDirectory = vscode.workspace
    .getConfiguration()
    .get("goEasy.projectDirectory");

  return projectDirectory && filePath.includes(projectDirectory);
}

async function runGoCommand(projectDirectory) {
  let arr = projectDirectory.split("/");
  let buildName = arr[arr.length - 1];

  let newTerminal = vscode.window.createTerminal({
    name: "Go Terminal",
    hideFromUser: true,
  });
  newTerminal.sendText(
    `pgrep ${buildName} | xargs  kill && cd ./${projectDirectory} && go build && go run .`
  );

  newTerminal.show();
  if (terminal) {
    console.log("terminal found");
    await terminal.dispose();
  } else {
    console.log("terminal not found");
  }
  terminal = newTerminal;
}

const disposable = vscode.workspace.onDidSaveTextDocument((document) => {
  const savedFilePath = document.uri.fsPath;

  if (isInProjectDirectory(savedFilePath)) {
    console.log("File in project directory");
    console.log(savedFilePath);
    const projectDirectory = vscode.workspace
      .getConfiguration()
      .get("goEasy.projectDirectory");

    runGoCommand(projectDirectory);
  } else {
    console.log("File not in project directory");
    console.log(savedFilePath);
  }
});

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "goEasy.setProjectDirectory",
    setProjectDirectoryCommand
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
  disposable.dispose();
}
exports.deactivate = deactivate;
