import joplin from "api";
import { settings } from "./settings";
import { ContentScriptType } from 'api/types';






export namespace bibleQuote {
    let bible_path = '';
    

    export async function init() {
        console.log("Biblie Quote plugin started!");

        await settings.register();

        console.log("bible path initiating")
        await updateSetting('biblePath')
        
        joplin.settings.onChange(async (event: any) =>{
            await bibleQuote.settingsChanged(event);
        });
        
        
        
        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            'bible-quote',
            './markdownItPlugin.js'
        ); 
            
            
        await joplin.contentScripts.onMessage('bible-quote', (message) =>{

            if (sessionStorage.tokenCount){
                sessionStorage.tokenCount = Number(sessionStorage.tokenCount) + 1;
            }else{
                sessionStorage.tokenCount = 1;
            }

            if (message === 'bible_path'){
                return bible_path;
            }
            return "Hola mundo";
        });
            
            
    }
        
    export async function settingsChanged(event:any) {
        if (event.keys.indexOf('biblePath') !== -1){
            await updateSetting('biblePath');
        }
    }
    
    export async function updateSetting(setting){
        localStorage.setItem('pluginSettingsUpdated', 'true');
        if (setting === 'biblePath'){
            bible_path = await joplin.settings.value('biblePath');
            localStorage.setItem('biblePath', bible_path);
        }
    }
}