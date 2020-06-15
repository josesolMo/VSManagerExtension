// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { userInfo } = require('os');
var list;

//Log variables
var usrname;
var passwrd;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsmm-ext" is now active!');
	//sendLogInfo("jose","0108");

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
		setInterval(() =>{
			panel.webview.html = getWebviewContent();
		},100);
		//mdificar();


		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'user':
					usrname = message.text;
				  	vscode.window.showErrorMessage(message.text);
					  return;
			  }
			  switch (message.command) {
				case 'pass':
					passwrd = message.text;
					vscode.window.showErrorMessage(message.text);
					sendLogInfo(usrname,passwrd, true);
					return;
			  }

			  switch (message.command) {
				case 'toLocal' :
					//sendLogInfo("","",false);
					vscode.window.showErrorMessage(message.text);
					return;
			  }
			  
			},
			undefined,
			context.subscriptions
		);
	
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
	  <title>Memory Visualizer</title>
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
		  border-bottom: 1px solid #666666;
	  }

	  .content-table tbody tr:last-of-type {
		  boder-bottom: 2px solid #666666;
	  }

	  </style>
  </head>
  <body>
	<h1 id="mem-visual">
		Memory Visualizer (Local)
	</h1>


	<label for="fname">Username:</label>
	<input type="text" id="username" name="username"><br><br>
	<label for="lname">Password:</label>
	<input type="text" id="password" name="password"><br><br>
	<input type="button" value="Change Memory" onClick="sendRemoteRequest()">

	<hr style="border-color:#666666;">

	<table id="memory-table" class="content-table">
		<thead>
			<tr>
				<th>Space</th>
				<th>Type</th>
				<th>References</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody id="mem-body">
			<tr>
				  <th></th>
				  <th></th>
				  <th></th>
				  <th></th>
			</tr>
		</tbody>
		
	</table>

	<script>
		  
		`+ populate() +`

		const vscode = acquireVsCodeApi();

		function sendRemoteRequest(){

			
			var visualizer = document.getElementById('mem-visual');
			if (visualizer.textContent != "Memory Visualizer (Remote)"){

				var username = document.getElementById('username').value;
				var password = document.getElementById('password').value;

				vscode.postMessage({command: 'user', text: username});
				vscode.postMessage({command: 'pass', text: password});

				visualizer.textContent = "Memory Visualizer (Remote)";
				return false;
			}else{

				

				visualizer.textContent = "Memory Visualizer (Local)";
				
				return false;
			}
		}
		  
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
	list = result;
}

function populate(){
		
	getNewMemory();
	var memoryBody;
	memoryBody = `var table = document.getElementById("mem-body");`
		
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

	//console.log('The memory has been updated');
	return memoryBody;

}


function sendLogInfo(_username,_password,_remote){

	console.log("bug");
	var fs = require('fs');
	var strFile = fs.readFileSync(__dirname+"/data/memory.json", "utf8");
	var jsFile = JSON.parse(strFile);

	jsFile.logInfo.username = _username;
	jsFile.logInfo.password = _password;
	jsFile.logInfo.remote = _remote;

	fs.writeFileSync(__dirname+"/data/memory.json", JSON.stringify(jsFile));

	strFile = fs.readFileSync(__dirname+"/data/memory.json", "utf8");
	jsFile = JSON.parse(strFile);

	console.log(jsFile);

	return;
}

function mdificar(){
	var fs = require('fs');
	var strFile = fs.readFileSync(__dirname+"/data/memory.json", "utf8");
	var jsFile = JSON.parse(strFile);

	var cont = 1;
	setInterval(()=>{
		jsFile.updatedMemory[0].address = cont;
		fs.writeFileSync(__dirname+"/data/memory.json", JSON.stringify(jsFile));
		cont++;
	},100);
}