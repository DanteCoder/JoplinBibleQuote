import joplin from "api";
import { settings } from "./settings";
import { ContentScriptType } from 'api/types';

export namespace bibleQuote {

    export async function init() {
        console.log("Biblie Quote plugin started!");

        await settings.register();

        await updateSetting('citeLang');
        await updateSetting('bookNamesLang');
        await updateSetting('biblePath');
        await updateSetting('bookAlignment');
        await updateSetting('chapterAlignment');
        await updateSetting('chapterPadding');
        await updateSetting('verseFontSize');
        await updateSetting('verseAlignment');
        await updateSetting('displayFormat');

        joplin.settings.onChange(async (event: any) =>{
            await bibleQuote.settingsChanged(event);
        });
        
        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            'bible-quote',
            './markdownItPlugin.js'
        );        
    }
        
    export async function settingsChanged(event:any) {
        for (let key of event.keys){
            await updateSetting(key);
        }
    }
    
    export async function updateSetting(setting){
        localStorage.setItem('pluginSettingsUpdated', 'true');
        localStorage.setItem(setting, await joplin.settings.value(setting));    
    }
}
