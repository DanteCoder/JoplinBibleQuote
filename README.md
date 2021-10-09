# Bible Citation Plugin for Joplin

This plugin parses bible citation into bible verses. To do this you create a fenced block with "bible" as identifier with the following format:

    ```bible
    (genesis 1:1)
    (exodo 1:3-6)
    ```

For example:

![](./example.png)

The plugin is based on [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) to parse the references.

## Installation
Install the .jpl under Releases.

## Notes

Right now the only bible available language is spanish for the bible books names and bible citation, and the bible version is Reina Valera 1960.

You can change the bible version by using an OSIS bible file, and changing the bible path in /src/markdownItPlugin.ts line 7.

To change the citation language you need to modify the import on /src/markdownItPlugin.ts line 2, [referenced here](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser#non-english-support).

To change the bible book names just rename them in src/bibles/bible_index.js.
