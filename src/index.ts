import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { settings } from './settings'

joplin.plugins.register({
	onStart: async function() {

		settings.register();

		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			'bible-quote',
			'./markdownItPlugin.js'
		);
	},
});
