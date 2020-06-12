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
			{
				enableScripts: true
			}
		  );
		// And set its HTML content
		panel.webview.html = getWebviewContent();
		//var newMemory = getNewMemory();
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

	  .content-table {
		border: 1px solid white;
		border-collapse: collapse;
		margin: 25px 0;
		font-size: 1.5em;
		min-width: 400px;
	  }

	  .content-table thead tr{
		  background-color: #009879;
		  color: #ffffff;
		  text-align: left;
		  font-weight: bold;
	  }

	  .content-table th,
	  .content-table td{
		  padding: 12px 15px;
	  }

	  .content-table tbody tr{
		  border-bottom: 1px solid #666666
	  }

	  </style>
  </head>
  <body>
	<h1>
		Memory Visualizer
	</h1>
	<table id="memory-table" class="content-table">
		<thead>
			<tr>
				<th>Space</th>
				<th>Type</th>
				<th>References</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th></th>
				<th></th>
				<th></th>
				<th></th>				  				  
			</tr>
		</tbody>
		
	</table>

	<script>
		  
		`+ fillTable(getNewMemory()) +`
		  
	</script>

  </body>
  </html>`;
}

function getNewMemory(){
	var fs = require('fs');
	var strFile = fs.readFileSync(__dirname+"/data/memory.json", "utf8");
	var jsFile = JSON.parse(strFile);

	var result = [];

	if(jsFile.updatedMemory != null){
		for (var i=0; i<jsFile.updatedMemory.length; i++){
			var cell = [];

			cell[0] = JSON.stringify(jsFile.updatedMemory[i].address);
			cell[1] = JSON.stringify(jsFile.updatedMemory[i].type);
			cell[2] = JSON.stringify(jsFile.updatedMemory[i].references);
			cell[3] = JSON.stringify(jsFile.updatedMemory[i].data);
			
			result.push(cell);
		}
	}
	return result;
}


function fillTable(list){
	var memoryBody;
	memoryBody = `var table = document.getElementById("memory-table");`
	

	for (var i=0; i< list.length; i++){
		memoryBody = memoryBody + 
		`
		var row = table.insertRow();
		var cell1 = row.insertCell();
		var cell2 = row.insertCell();
		var cell3 = row.insertCell();
		var cell4 = row.insertCell();
		cell1.innerHTML = `+list[i][0]+`;
		cell2.innerHTML = `+list[i][1]+`;
		cell3.innerHTML = `+list[i][2]+`;
		cell4.innerHTML = `+list[i][3]+`;
		`	
	}

	console.log('The memory has been updated');
	return memoryBody;
}
