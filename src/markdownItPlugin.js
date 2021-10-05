const bibleIndex = require('./bibles/bible_index').default;

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

						if (parts.length === 3){
							parts = [parts[0] + ' ' + parts[1], parts[2]];
						}

						//To remove accents and diacritics
						const bk = parts[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
						const verse = parts[1];

						let is_a_book = false;
						let book_num = 0;

						for (let book of bibleIndex.books) {
							if (bk == book.name || bk == book.abrv){
								is_a_book = true;
								book_num = book.num;
							}
						}
						
						if (is_a_book){
							html += '<p>Indeed it is a book, whom number is: ';
							html += book_num.toLocaleString();
							html += '</p>';

						}

					};
				};

				return html;
			};
		},
	}
}
