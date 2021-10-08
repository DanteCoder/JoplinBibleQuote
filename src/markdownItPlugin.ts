import joplin from 'api'
import bibleIndex from './bibles/bible_index';
const bcv_parser = require('bible-passage-reference-parser/js/es_bcv_parser').bcv_parser;
const bcv = new bcv_parser;
const parseXmlString = require('xml2js').parseString;
const fs = require('fs');

let bible_path = 'D:\\Dante Gamaliel\\Coding\\PersonalProjects\\JoplinPlugins\\JoplinBibleQuote\\src\\bibles\\OSIS\\Reina-Valera 1960.xml';
const jsonBible = (XmmBible2Js(bible_path)).osis.osisText[0];
console.dir(jsonBible);
const bibleInfo = bcv.translation_info();

export default function () {
	return {
		plugin: function (markdownIt, _options) {
			const defaultRender = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options, env, self);
			};

			markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
				const token = tokens[idx];

				if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);
				let html = '';
				let quotes = token.content.match(/\(.*?\)/g)

				if (quotes) {

					html += '<div style="border:1px solid #545454;">'

					for (let quote of quotes) {
						const full_quote = parseQuote(quote);

						for (let b of full_quote){
							html += `<div style="padding: 35px;"><h2 style="text-align:center;"><b>${bibleIndex.books[b.num-1].full_name}</b></h2>`;

							for (let c of b.chapters){
								html += `<h3 style="padding-left: 10px"><b>Capítulo ${c.ID}</b></h3>`;

								html +='<div style="white-space: pre-wrap;">';

								for (let v of c.verses){
									let text = <string>jsonBible.div[b.num-1].chapter[c.num-1].verse[v-1]._;
									text = text.replace(/\n /, '');
									text = text.replace(/\n /g, '<br>----');
									text = text.replace(/\s+/g,' ');
									text = text.replace(/----/g,'\t');

									html += `<b>${v}. </b>${text}<br>`
								}

								html +='</div>';
							}

							html += '</div>'
						}

						html += '<hr width="90%" size="1">'
					};
					html = html.slice(0, html.length - '<hr width="90%" size="1">'.length);
					html += '</div><br>'
				};

				return html;
			};
		},
	}
}

function XmmBible2Js(bible_path: string) {
	let parsed_bible = null;

	const xml = fs.readFileSync(bible_path, 'utf8');
	parseXmlString(xml, function (err, result) {
		if (err) throw err;
		//console.dir(result);
		parsed_bible = result;
	})

	return parsed_bible;
}

function parseQuote(quote: string) {
	let books = [];

	if (quote === '()'){
		return books;
	}

	bcv.set_options({'osis_compaction_strategy': 'bcv', 'consecutive_combination_strategy': 'separate'});
	bcv.parse(quote);
	const osisS = <string>bcv.osis().split(',');


	for (let osis of osisS) {

		if (osis.includes('-')){
			const osis_range = osis.split('-');
			//console.log(osis_range);
			const osis_splits = [osis_range[0].split('.'), osis_range[1].split('.')]
			//console.log(osis_splits);
			const low = parseInt(osis_splits[0][2]);
			const hig = parseInt(osis_splits[1][2]);

			for (let i = low; i <= hig; i++){
				insertAndDivide(osis_splits[0][0] + '.' + osis_splits[0][1] + '.' + i);
			}

			continue;
		}

		insertAndDivide(osis);

	}
	
	function insertAndDivide(osis){
		let osis_parts = osis.split('.');
		let last_book_idx = <number>null;
		let last_chapter_idx = <number>null;
		
		//Divide into books
		if (books.length === 0) {
			books.push({
				ID: osis_parts[0],
				num: bibleInfo.order[osis_parts[0]],
				chapters: []
			})
		} else {
			last_book_idx = books.length - 1;
			if (books[last_book_idx].ID !== osis_parts[0]) {
				books.push({
					ID: osis_parts[0],
					num: bibleInfo.order[osis_parts[0]],
					chapters: []
				})
			}
		}
		last_book_idx = books.length - 1;
		
		/* console.log(1);
		console.log(books); */
	
		//Divide into chapters
		if (books[last_book_idx].chapters.length === 0) {
			books[last_book_idx].chapters.push({
				ID: osis_parts[1],
				num: parseInt(osis_parts[1]),
				verses: []
			})
		} else {
			last_chapter_idx = books[last_book_idx].chapters.length - 1;
			if (books[last_book_idx].chapters[last_chapter_idx].ID !== osis_parts[1]){
				books[last_book_idx].chapters.push({
					ID: osis_parts[1],
					num: parseInt(osis_parts[1]),
					verses:[]
				})
			}
		}
		last_chapter_idx = books[last_book_idx].chapters.length - 1;
	
	
		/* console.log(2);
		console.log(books); */
	
		/* console.log(last_book_idx);
		console.log(last_chapter_idx); */
	
		//Divide into verses
		books[last_book_idx].chapters[last_chapter_idx].verses.push(
			parseInt(osis_parts[2])
		)
	
		/* console.log(3);
		console.log(books); */
	}

	//console.log(books);



	return (books);
}