const bibleIndex = require('./bibles/bible_index').default;
import bible from './bibles/rvr1960';

export default function() { 
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
					for (let quote of quotes){

						quote = quote.slice(1,-1);
						let parts = quote.split(' ');

						//If it has 3 parts it means the book starts with a number. eg: (1 corintios 4:5)
						if (parts.length === 3){
							parts = [parts[0] + ' ' + parts[1], parts[2]];
						}
						
						//Parse the book and store his number on full_quote.
						//The full quote includes the chapters and the cited verses
						let full_quote = {
							book:{
								chapters:{}
							}};
						
						//To remove accents and diacritics, and make all lower case
						const bk = (parts[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase();	//The book to parse
						
						let is_a_book = false;
						for (let book of bibleIndex.books) {
							if (bk == book.name || bk == book.abrv){
								is_a_book = true;
								full_quote.book.num = book.num;
							}
						}
						const book_chapters_num = bible.XMLBIBLE.BIBLEBOOK[full_quote.book.num-1].CHAPTER.length;
						
						//Parse the chapters and verses
						const chapters_verses = parts[1].split(';');	//["3:5-8","9:10,12-13"]
						for (let chapt_ver of chapters_verses){
							const splt1 = chapt_ver.split(':');			//["9", "10,12-13"]
							const chapter = parseInt(splt1[0]);
							full_quote.book.chapters[chapter] = {
								verses: []
							}
							
							if (chapter > book_chapters_num){
								return `<p>The book of ${bibleIndex.books[full_quote.book.num-1].name} has only ${book_chapters_num} chapters.</p>`
							}

							const chapter_verses_num = bible.XMLBIBLE.BIBLEBOOK[full_quote.book.num-1].CHAPTER[chapter-1].VERS.length;

							//Parse the verses.
							//If there is only chapter, it will display all the verses
							let verses_long = '';
							if (splt1.length === 1){
								verses_long = ['1-' + chapter_verses_num];
							}else{
								verses_long = (splt1[1]).split(',');	//["10", "12-13"]
							}

							
							const html_exeded_verse = `<p>The chapter ${chapter} from the book of ${bibleIndex.books[full_quote.book.num-1].name} has only ${chapter_verses_num} verses.</p>`;

							for (let verse of verses_long){
								
								if (!verse.includes('-')){
									if (parseInt(verse) > chapter_verses_num){
										return html_exeded_verse;
									}
									full_quote.book.chapters[chapter].verses.push(parseInt(verse));
								}else{
									const splt2 = verse.split('-');
									const min_ver = parseInt(splt2[0]);
									const max_ver = parseInt(splt2[1]);

									if (max_ver > chapter_verses_num){
										return html_exeded_verse;
									}

									if (min_ver < max_ver){
										for (let i = min_ver; i <= max_ver; i++){
											full_quote.book.chapters[chapter].verses.push(i);
										}
									}
								}	
							}
						}

						
						
						if (is_a_book){
							console.log(full_quote);
							html += '<p>Indeed it is a book, whom number is: ';
							html += full_quote.book.num;
							html += '</p>';
						}

					};
				};

				return html;
			};
		},
	}
}
