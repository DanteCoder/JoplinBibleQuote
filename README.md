# Bible Citation Plugin for Joplin

This plugin parses bible citation into bible verses. To do this you create a fenced block with "bible" as identifier with the following format:

    ```bible
    (John 3:16-17,18)
    (Psalms 1:1, 16:1-2)
    (Genesis 1 - Exodus 40)
    ```

For example:

![image](https://user-images.githubusercontent.com/90792603/137567310-99b21496-6717-4dca-9a63-24e46d8d6999.png)

In the same block of code you can write multiple cites, each one closed with parenthesis:
   
    ```bible
     (<first cite>)
     (<second cite>)(third cite)
     (
     <fourth cite part one
     fourth cite part two>
     ) 
     (<fifth cite>)
    ```

You can reference multiple verses, chapters or books within the same cite, separating verses with commas, chapters with semicolons and books with spaces. For example, the following cites are valid:
    
    ```bible
     (John 3:16,18,19-21; 4:1 Mark 1:1)
     (Genesis 1-2;4:1-3)
    ```

You can use other characters to separate verses, chapters and books, like periods; the parser will try its best to get all the references, but it will behave better with standard separators ("," ";" "." ":"). 

For the book names in the cites, you can write it as the full name or its abbreviation.
         

## Installation
1. In Joplin, open the configuration screen, then under "Plugins" search for "Bible Quote" and install it. 
2. Download a bible from /bibles/OSIS to your computer, or use an already existing OSIS xml bible (you can convert almost any bible format to OSIS xml using the software linked below).
3. Copy the path of the OSIS xml bible and paste it on the plugin setting "Path to OSIS bible file".
4. Select your desired language for citation and book names on the plugin settings and save.
5. Enjoy.

For the settings to take effect after on already existing cites you have to make a change on any of the cites.
 
 ## Notes
- To convert almost any bible format to OSIS xml you can use the [Simple Bible Reader](https://www.softpedia.com/get/Others/Home-Education/Jeyareuben-Simple-Bible-Reader.shtml) software.
 
- If you have a bug or any issue, feel free to make an issue or to modify the plugin.

***
         
This plugin is based on [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) to parse the references.
