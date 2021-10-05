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

				let matchs  = token.content.match(/\(.*?\)/g)

				if (matchs){
					for (let match of matchs){

						match = match.slice(1,-1);

						html += '<p>';
						html += match;
						html += '</p>';
					};
				};

				return html;
			};
		},
	}
}
