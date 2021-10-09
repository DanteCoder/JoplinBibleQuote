import joplin from "api";
import { settings } from "./settings";
import { ContentScriptType } from 'api/types';

export namespace bibleQuote {
    
    export async function init() {
        console.log("Biblie Quote plugin started!");

        await settings.register();

        /* joplin.settings.onChange(async (event: any) =>{
            await bibleQuote.settingsChanged(event);
        }); */
        
        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            'bible-quote',
            './markdownItPlugin.js'
        );  
    }

    /* export async function settingsChanged(event:any) {
        
        if (event.keys.indexOf('bookAlignment') !== -1){

        }
    } */

}