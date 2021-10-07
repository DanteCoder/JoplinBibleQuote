import joplin from 'api'
import bibleIndex from './bibles/bible_index';
import bible from './bibles/rvr1960';
/*  const bcv_parser = require('bible-passage-reference-parser/js/es_bcv_parser').bcv_parser;
const bcv = new bcv_parser;
const parseXmlString = require('xml2js').parseString;
const fs = require('fs'); */

/* let jsonBible = null;
let bible_path = null; */

export default function(context) { 
	return {
		plugin: function(markdownIt, _options) {
			const defaultRender = markdownIt.renderer.rules.fence || function(tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options, env, self);
			};

			markdownIt.renderer.rules.fence = function(tokens, idx, options, env, self) {
				const token = tokens[idx];
				if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);
				
				let html = '';
				
				let quotes  = token.content.match(/\(.*?\)/g)
				
				if (quotes){

					html += '<div style="border:1px solid #545454;">'

					for (let quote of quotes){

						const full_quote = parseQuote(quote);

						//console.log(full_quote);

						if (full_quote.book.name === null) {
							html += '<div style="padding: 20px;"><h2 style="text-align:center;"><b>Invalid book name</b></h2></div>';
							continue;
						}

						html += `<div style="padding: 20px;"><h2 style="text-align:center;"><b>${full_quote.book.name}</b></h2>`;

						for (let chapter of full_quote.book.chapters){
							if (chapter.num === null){
								html +='<h3>Invalid chapter</h3>';
								html +=`<p>The book of ${full_quote.book.name} has ${full_quote.book.num_chapters} chapters.</p>`;
								continue;
							}
							html += `<h3>Capítulo ${chapter.num}</h3>`;

							html += '<p align="justify";>';

							for (let verse of chapter.verses){
								if (verse === null){
									html += '<p>Invalid verse. '
									html += `The chapter has ${chapter.num_verses} verses.</p>`
									continue;
								}
								html += `<b>${verse}.</b> ${bible.XMLBIBLE.BIBLEBOOK[full_quote.book.num-1].CHAPTER[chapter.num-1].VERS[verse-1]}<br>`
							}

							html += '</p>';
						}

						html += '</div><hr width="90%" size="1">'
					};
					html = html.slice(0, html.length - '<hr width="90%" size="1">'.length);
					html += '</div><br>'
				};

				return html;
			};
		},
	}
}

/* function XmmBible2Js(bible_path){
	let parsed_bible = null;
	
	const xml = fs.readFileSync(bible_path, 'utf8');
	parseXmlString(xml, function(err, result){
		if (err) throw err;
		parsed_bible = result;
	})

	return parsed_bible;
} */

/* function parseQuote(quote){
	bcv.parse(quote);
	//console.log(bcv.osis());

	let full_quote = {
		book:{
			num: null,
			name: null,
			num_chapters: null,
			chapters:[]
		}};

	return(full_quote);
} */

function parseQuote(quote){
	//Parse the book and store his number on full_quote.
	//The full quote includes the chapters and the cited verses
	let full_quote = {
		book:{
			num: null,
			name: null,
			num_chapters: null,
			chapters:[]
		}};

	quote = quote.slice(1,-1);
	let parts = quote.split(' ');

	//If it has 3 parts it means the book starts with a number. eg: (1 corintios 4:5).
	//Merge the first two parts
	if (parts.length === 3){
		parts = [parts[0] + ' ' + parts[1], parts[2]];
	}
	
	//To remove accents and diacritics, and make all lower case
	const bk = (parts[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase();	//The book to parse
	
	//Parse the book number
	for (let book of bibleIndex.books) {
		if (bk == book.name || bk == book.abrv){
			full_quote.book.num = book.num;
			full_quote.book.name = book.full_name;
			full_quote.book.num_chapters = bible.XMLBIBLE.BIBLEBOOK[full_quote.book.num-1].CHAPTER.length;
			break;
		}
	}

	if (full_quote.book.num === null){
		return full_quote;
	}
	
	//Parse the chapters and verses
	const chapters_verses = parts[1].split(';');	//["3:5-8","9:10,12-13"]
	for (let chapt_ver of chapters_verses){
		const splt1 = chapt_ver.split(':');			//["9", "10,12-13"]
		const chapter = parseInt(splt1[0]);

		full_quote.book.chapters.push({
			num: null,
			num_verses: null,
			verses: []
		});

		//If the chapter is not in the book or is NaN, continue.
		if (chapter > full_quote.book.num_chapters || chapter < 1 || Number.isNaN(chapter) ){
			continue;
		}

		full_quote.book.chapters[full_quote.book.chapters.length - 1].num = chapter;
		full_quote.book.chapters[full_quote.book.chapters.length - 1].num_verses = bible.XMLBIBLE.BIBLEBOOK[full_quote.book.num-1].CHAPTER[chapter-1].VERS.length;;

		//Parse the verses.
		let verses_long = '';
		//If there is only chapter specified, it will display all the verses
		if (splt1.length === 1){
			verses_long = ['1-' + full_quote.book.chapters[full_quote.book.chapters.length - 1].num_verses];
		}else{
			verses_long = (splt1[1]).split(',');	//["10", "12-13"]
		}

		for (let verse of verses_long){
			//If it's a single verse
			if (!verse.includes('-')){
				//If the verse is not on the chapter or is NaN, the verse is null.
				if (parseInt(verse) > full_quote.book.chapters[full_quote.book.chapters.length - 1].num_verses || parseInt(verse) < 1 || Number.isNaN(parseInt(verse))){
					full_quote.book.chapters[full_quote.book.chapters.length - 1].verses.push(null);
				}else{
					full_quote.book.chapters[full_quote.book.chapters.length - 1].verses.push(parseInt(verse));
				}
			}else{
				const splt2 = verse.split('-');
				const min_ver = parseInt(splt2[0]);
				const max_ver = parseInt(splt2[1]);

				if (max_ver > full_quote.book.chapters[full_quote.book.chapters.length - 1].num_verses || min_ver < 1){
					full_quote.book.chapters[full_quote.book.chapters.length - 1].verses.push(null);
				}else{
					if (min_ver <= max_ver){
						for (let i = min_ver; i <= max_ver; i++){
							full_quote.book.chapters[full_quote.book.chapters.length - 1].verses.push(i);
						}
					}else{
						for (let i = max_ver; i >= min_ver; i--){
							full_quote.book.chapters[full_quote.book.chapters.length - 1].verses.push(i);
						}
					}
				}
			}
		}
	}

	return full_quote;
} 