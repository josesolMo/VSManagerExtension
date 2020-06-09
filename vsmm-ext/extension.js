// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsmm-ext" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vsmm-ext.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
			'memoryVisualizer',
			'Memory Visualizer',
			vscode.ViewColumn.One,
			{}
		  );
		// And set its HTML content
		panel.webview.html = getWebviewContent();
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from VSMemoryManagerExtension!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function getWebviewContent() {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
	  <style>
	  table, th, td {
		border: 1px solid white;
		border-collapse: collapse;
	  }
	  th, td {
		padding: 15px;
		text-align: left;
	  }
	  table#t01 {
		width: 100%;    
		background-color: #ffffff;
	  }
	  </style>
  </head>
  <body>
	<h1>
		Memory Visualizer
	</h1>
	<table id="memory-table" class="table" style="width:60%">
		<thead>
			<tr>
				<th>Space</th>
				<th>Tag</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
		<tr>
			<th>0xFFFF</th>
			<th>valor1</th>
			<th>1234</th>
		</tr>
	</tbody>
	</table> 


	<script>
		
	</script>
  </body>
  </html>`;
  }