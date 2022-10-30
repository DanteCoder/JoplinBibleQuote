# Bible Citation Plugin for Joplin

This plugin parses Bible citations and renders the verses from an osis Bible file:

![image](https://user-images.githubusercontent.com/90792603/155829587-578802fd-7eef-437f-8477-b808ddc74383.png)

You can display multiple citations in the same block:

![image](https://user-images.githubusercontent.com/90792603/155829632-7cd4501e-515f-4bcd-920e-f1e3bb203695.png)


You can reference multiple verses, chapters or books within the same citation, separating verses with commas, chapters with semicolons and books with spaces. For example, the following citations are valid:
    
    ```bible
     (John 3:16,18,19-21; 4:1 Mark 1:1)
     (Genesis 1-2;4:1-3)
    ```
The plugin features the option to display multiple versions:

![image](https://user-images.githubusercontent.com/90792603/155829756-10a53b73-92f3-4185-87ce-1c5ce05789df.png)
         

To display all the available commands type the word "help" in a block:

    ```bible
     help
    ```

## Installation
1. In Joplin, open the configuration screen, then under "Plugins" search for "Bible Quote" and install it. 
2. Download a bible from /bibles/OSIS within this repository to your computer, or use an already existing OSIS xml bible (you can convert almost any bible format to OSIS xml using the software linked below). However, when you retrieve the .xml file, you must right click and save the link in order to download it. Otherwise, you will only get text.
3. Copy the path of the OSIS xml bible and paste it on the plugin setting "Path to the default OSIS Bible file".
4. Optionally set a path to a folder containing more osis bibles in the setting "Path to a folder containing OSIS bibles".
5. Select your desired language for the plugin and save.
6. Enjoy.

For the settings to take effect on already existing citations you need to let the markdown render to refresh. This can be done modifying the note or changing to another note and returning to the previous note.
 
 ## Notes
- To convert almost any bible format to OSIS xml you can use the [Simple Bible Reader](https://www.softpedia.com/get/Others/Home-Education/Jeyareuben-Simple-Bible-Reader.shtml) software.
- If you have a bug or any issue, feel free to make an issue or to modify the plugin.
- If you want to contribute please base your pull requests to the "dev" branch, and prefer to make small, trackable commits.

***
         
This plugin is based on the [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) library to parse the citations.
