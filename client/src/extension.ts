import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/lib/node/main";
import * as dotenv from 'dotenv'

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	dotenv.config({ path: path.resolve(__dirname, '../../.env') });
	// The debug options for the server
	let serverCommand = process.env.SQL_LANGUAGE_SERVER_PATH;
	let debugOptions = { env: { RUST_LOG: "trace" } };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { command: serverCommand },
		debug: {
			command: serverCommand,
			args: [],
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'sql' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('*.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'sql-language-server',
		'SQL Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
