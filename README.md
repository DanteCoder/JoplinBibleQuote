# Bible Citation Plugin for Joplin

This plugin parses bible citation into bible verses. To do this you create a fenced block with "bible" as identifier with the following format:

    ```bible
    (John 3:16-17,18)
    (Psalms 1:1, 16:1-2)
    (Genesis 1 - Exodus 40)
    ```

For example:

![image](https://user-images.githubusercontent.com/90792603/137567310-99b21496-6717-4dca-9a63-24e46d8d6999.png)

The plugin is based on [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) to parse the references.

## Installation
1. In Joplin, open the configuration screen, then under "Plugins" search for "Bible Quote" and install it. 
2. Download a bible from /bibles/OSIS to your computer, or use an already existing OSIS xml bible (you can convert almost any bible format to OSIS xml using the software linked below).
3. Copy the path of the OSIS xml bible and paste it on the plugin setting "Path to OSIS bible file".
4. Select your desired language for citation and book names on the plugin settings and save.
5. Enjoy.

For the settings to take effect after on already existing cites you have to make a change on any of the cites.
 
 ## Notes
- To convert almost from almost any bible format to OSIS xml you can use the [Simple Bible Reader](https://www.softpedia.com/get/Others/Home-Education/Jeyareuben-Simple-Bible-Reader.shtml) software.
 
- If you have a bug or any issue, feel free to make an issue or to modify the plugin.
