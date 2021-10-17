const parseXmlString = require('xml2js').parseString;
const fs = require('fs');

import bibleIndexFull from './bible_index'
let bibleIndex = null;

let cite_lang = null;
let book_names_lang = null;
let chapter_title_text = null;
let bible_path = null;
let book_alignment = null;
let chapter_alignment = null;
let chapter_padding = null;
let verse_font_size = null;
let verse_alignment = null;

let jsonBible = {div:[{chapter:[{verse:[{_:''}]}]}]};

let bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
let bcv = new bcv_parser;
const bibleInfo = bcv.translation_info();

updateSettings();


export default function (context) {
	return {
		plugin: function (markdownIt, _options) {
			const defaultRender = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options, env, self);
			};

			markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
				const token = tokens[idx];

				if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);

				if (localStorage.getItem('pluginSettingsUpdated') === 'true'){
					localStorage.setItem('pluginSettingsUpdated', 'false');
					updateSettings();
				}

				if (bible_path === null){
					const noBibleHtml = `<div style="padding:35px; border: 1px solid #545454;">
					<p>There is no selected OSIS xml bible or the path is invalid.<p></div>`
					
					return noBibleHtml
				}

				let html = '';
				let quotes = (token.content.replace(/\n/g, ' ')).match(/\(.*?\)/g);

				if (quotes) {

					html += '<div style="border:1px solid #545454;">'

					for (let quote of quotes) {
						const full_quote = parseQuote(quote);

						for (let b of full_quote) {
							html += `<div style="padding: 35px;"><h2 style="text-align:${book_alignment};"><b>${b.name}</b></h2>`;

							for (let c of b.chapters) {
								html += `<h3 style="padding:${chapter_padding}px; text-align:${chapter_alignment}"><b>${chapter_title_text} ${c.ID}</b></h3>`;

								html += `<div style="white-space: pre-wrap; font-size: ${verse_font_size}px; text-align:${verse_alignment}">`;

								for (let v of c.verses) {
									let text = <string>jsonBible.div[b.num - 1].chapter[c.num - 1].verse[v - 1]._;
									text = text.trim();
									text = text.replace(/\n /g, '<br>----');
									text = text.replace(/\s+/g, ' ');
									text = text.replace(/----/g, '\t');

									html += `<bstyle="font-size: ${verse_font_size}px">${v}. </b>${text}<br>`
								}

								html += '</div>';
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

function updateSettings(){
	cite_lang = localStorage.getItem('citeLang');
	book_names_lang = localStorage.getItem('bookNamesLang');
	bible_path = localStorage.getItem('biblePath');
	book_alignment = localStorage.getItem('bookAlignment');
	chapter_alignment = localStorage.getItem('chapterAlignment');
	chapter_padding = localStorage.getItem('chapterPadding');
	verse_font_size = localStorage.getItem('verseFontSize');
	verse_alignment = localStorage.getItem('verseAlignment');

	try {
		jsonBible = (XmlBible2Js(bible_path)).osis.osisText[0];
	} catch (error) {
		bible_path = null;
	}

	switch (cite_lang) {
		case 'es':
			bcv_parser = require('bible-passage-reference-parser/js/es_bcv_parser').bcv_parser;
			break;
			
		case 'en':
		bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
		break;

		default:
			break;
	}
	bcv = new bcv_parser;

	switch (book_names_lang) {
		case 'es':
			bibleIndex = bibleIndexFull.es;
			chapter_title_text = bibleIndexFull.chapter.es
			break;
			
		case 'en':
			bibleIndex = bibleIndexFull.en;
			chapter_title_text = bibleIndexFull.chapter.en
		break;

		default:
			break;
	}
}

function XmlBible2Js(bible_path: string) {
	let parsed_bible = null;

	const xml = fs.readFileSync(bible_path, 'utf8');
	parseXmlString(xml, function (err, result) {
		if (err) throw err;
		parsed_bible = result;
	})

	return parsed_bible;
}

function parseQuote(quote: string) {
	let books = [];

	if (bcv.parse(quote).osis() === '') {
		return books;
	}
	
	bcv.set_options({ 'osis_compaction_strategy': 'bcv', 'consecutive_combination_strategy': 'separate' });
	let entities = (bcv.parse(quote).parsed_entities())[0];
	let start_bcv = null;
	let end_bcv = null;

	console.log("entities:");
	console.log(entities);

	console.log("Cite:");
	console.log(osis2Cite(entities));

	for (let entity of entities.entities) {
		start_bcv = entity.start;
		end_bcv = entity.end;

		let start_b = bibleInfo.books.indexOf(start_bcv.b) + 1;
		let end_b = bibleInfo.books.indexOf(end_bcv.b) + 1;

		for (let b = start_b; b <= end_b; b++) {

			let bookId = bibleInfo.books[b - 1];
			let b_c_num = bibleInfo.chapters[bookId].length;

			if (start_b === end_b) {
				//If there is only one book
				for (let c = start_bcv.c; c <= end_bcv.c; c++) {

					let c_v_num = bibleInfo.chapters[bookId][c - 1];

					if (start_bcv.c === end_bcv.c) {
						//If there is only one chapter

						for (let v = start_bcv.v; v <= end_bcv.v; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}

					} else if (c === start_bcv.c) {
						//If c is the first chapter

						for (let v = start_bcv.v; v <= c_v_num; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}

					} else if (c === end_bcv.c) {
						//If c is the last chapter

						for (let v = 1; v <= end_bcv.v; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}

					} else {
						//If c is any chapter in between the first and last chapters

						for (let v = 1; v <= c_v_num; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}
					}
				}

			} else if (b === start_b) {
				// If b is the first book

				for (let c = start_bcv.c; c <= b_c_num; c++) {

					let c_v_num = bibleInfo.chapters[bookId][c - 1];

					if (c === start_bcv.c) {
						//If c is the first chapter

						for (let v = start_bcv.v; v <= c_v_num; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}

					} else {
						//If c is any chapter in between the first and last chapters, or is the last chapter

						for (let v = 1; v <= c_v_num; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}
					}
				}

			} else if (b === end_b) {
				// If b is the last book

				for (let c = 1; c <= end_bcv.c; c++) {
					
					let c_v_num = bibleInfo.chapters[bookId][c - 1];
					
					if (c === end_bcv.c) {
						//If c is the last chapter

						for (let v = 1; v <= end_bcv.v; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}

					} else {
						//If c is any chapter in between the first and last chapters, or is the first chapter

						for (let v = 1; v <= c_v_num; v++) {
							insertAndDivide(bookId + '.' + c + '.' + v);
						}
					}
				}

			} else {
				// If b is any book in between the first and last books

				for (let c = 1; c <= b_c_num; c++) {
					
					let c_v_num = bibleInfo.chapters[bookId][c - 1];
					
					for (let v = 1; v <= c_v_num; v++) {
						insertAndDivide(bookId + '.' + c + '.' + v);
					}
				}
			}
		}
	}

	function insertAndDivide(osis) {
		let osis_parts = osis.split('.');
		let last_book_idx = <number>null;
		let last_chapter_idx = <number>null;

		//Divide into books
		const b_num = bibleInfo.order[osis_parts[0]];
		const b_name = bibleIndex[b_num - 1]
		if (books.length === 0) {
			books.push({
				ID: osis_parts[0],
				num: b_num,
				name: b_name,
				chapters: []
			})
		} else {
			last_book_idx = books.length - 1;
			if (books[last_book_idx].ID !== osis_parts[0]) {
				books.push({
					ID: osis_parts[0],
					num: b_num,
					name: b_name,
					chapters: []
				})
			}
		}
		last_book_idx = books.length - 1;

		//Divide into chapters
		if (books[last_book_idx].chapters.length === 0) {
			books[last_book_idx].chapters.push({
				ID: osis_parts[1],
				num: parseInt(osis_parts[1]),
				verses: []
			})
		} else {
			last_chapter_idx = books[last_book_idx].chapters.length - 1;
			if (books[last_book_idx].chapters[last_chapter_idx].ID !== osis_parts[1]) {
				books[last_book_idx].chapters.push({
					ID: osis_parts[1],
					num: parseInt(osis_parts[1]),
					verses: []
				})
			}
		}
		last_chapter_idx = books[last_book_idx].chapters.length - 1;

		//Divide into verses
		books[last_book_idx].chapters[last_chapter_idx].verses.push(
			parseInt(osis_parts[2])
		)
	}

	return (books);
}

function osis2Cite(main_entity){
	let cite = ''

	/*
	entity types:
	bcv		=>	Single verse
	bc		=>	Single chapter
	cv		=>	Can be preceded by (bcv || bc)
	integer	=>	Can be preceded by (bcv || bc || cv)
	range	=>	Can be preceded by (bcv || bc || cv || null)
	*/

	let last_ent_type = null;
	let last_book = null;

	for (let entity of main_entity.entities){
		if (entity.type === 'bcv'){
			const bName = bibleIndex[bibleInfo.books.indexOf(entity.start.b)];
			cite += ' ' + bName + ' ' + entity.start.c + ':' + entity.start.v;
			last_ent_type = 'bcv';
			last_book = entity.start.b;

		}else if (entity.type === 'bc'){
			const bName = bibleIndex[bibleInfo.books.indexOf(entity.start.b)];
			cite += ' ' + bName + ' ' + entity.start.c;
			last_ent_type = 'bc';
			last_book = entity.start.b

		}else if (entity.type === 'cv'){
			cite += ', ' + entity.start.c + ':' + entity.start.v;
			last_ent_type = 'cv';

		}else if (entity.type === 'integer'){
			if (last_ent_type === 'bcv' || 'cv'){
				cite += ',' + entity.start.v

			}else if (last_ent_type === 'bc'){
				cite += ', ' + entity.start.c
			}

		}else if (entity.type === 'range'){
			//Implement for range type entities
		}
	}

	return cite;
}