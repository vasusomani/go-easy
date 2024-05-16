# Go Easy

Go Easy is your Go development companion, simplifying your workflow with automatic server reloading upon saving files. Seamlessly integrate auto-reloading functionality into your Go projects within Visual Studio Code. Focus on coding while Go Easy handles the hassle of restarting your server. Boost your productivity and streamline your development process with Go Easy!

## Installation

You can install Go Easy directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=VasuSomani.go-easy). Simply search for "Go Easy" in the Extensions view (Ctrl+Shift+X) and click Install.

## Features

- Automatic server reloading upon saving files
- Simplified workflow for Go development
- Integration with Visual Studio Code

## Usage

1. **Setting Up Your Project**
   Open your Go project in Visual Studio Code.
   Use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and select **Go Easy: Start Server** to set the project directory or use shortcut Ctrl+Shit+T or Cmd+Shift+T
   Enter the directory path of your Go project where the main.go or server.go is present or press Enter to select the current directory.
2. **Starting the Server**
   Once the project directory is set, the server will automatically start.
   You can also start the server manually by using the command Go Easy: Start Server.
3. **Writing Your Go Code**
   Write your Go code as usual in Visual Studio Code.
   Save your files (Ctrl+S or Cmd+S) to trigger automatic server reloading.
   The logs will be visible in Output Window of your editor
4. **Stopping the Server**
   When you're done working on your project, you can stop the server using the command **Go Easy: Stop Server**.

## Configuration

- `goEasy.projectDirectory`: The directory path of your Go project.

## Keyboard Shortcuts

- **Start Server**: Ctrl+Shift+T (Cmd+Shift+T on macOS)

## Support

For any issues, feedback, or feature requests, please [open an issue](https://github.com/vasusomani/go-easy/issues) on GitHub.

## Repository

You can find the source code and contribute to this extension on [GitHub](https://github.com/vasusomani/go-easy).
