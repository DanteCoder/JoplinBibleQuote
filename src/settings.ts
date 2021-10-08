import joplin from "api";
import { SettingItemType } from "api/types";

export namespace settings {

    export async function register() {
        
        await joplin.settings.registerSection("bibleQuoteSection",{
            label: "Bible Quote"
        });

        await joplin.settings.registerSettings({
            citeLang: {
                value:"es",
                type: SettingItemType.String,
                isEnum:true,
                section: "bibleQuoteSection",
                public:true,
                label:"Citation language",
                description:"The language of the citations.",
                options: {
                    es: "Spanish",
                    en: "English"
                },
            },

            bookNamesLang: {
                value:"es",
                type: SettingItemType.String,
                isEnum:true,
                section: "bibleQuoteSection",
                public:true,
                label:"Bible book names language",
                description:"The language to show the books name on.",
                options: {
                    es: "Spanish",
                    en: "English"
                },
            },

            biblePath: {
                value:"",
                type: SettingItemType.String,
                section: "bibleQuoteSection",
                public:true,
                label:"Path to OSIS Bible file",
                description:"e.g. C:/My/Path/To/OSIS_Bible.xml"
            },

            bookAlignment: {
                value:"center",
                type: SettingItemType.String,
                isEnum:true,
                section: "bibleQuoteSection",
                public:true,
                label:"Bible book name alignment",
                options: {
                    center:"Center",
                    left:"Left",
                    right:"Right",
                    justify:"Justify"
                }
            },

            chapterAlignment: {
                value:"left",
                type: SettingItemType.String,
                isEnum:true,
                section: "bibleQuoteSection",
                public:true,
                label:"Chapter number alignment",
                options: {
                    center:"Center",
                    left:"Left",
                    right:"Right",
                    justify:"Justify"
                }
            },

            chapterPadding: {
                value:10,
                minimum: 0,
                maximum: 100,
                type: SettingItemType.Int,
                section: "bibleQuoteSection",
                public:true,
                label:"Chapter side padding",
                description: "Chapter side padding in pixels."
            }

        })


    }



}