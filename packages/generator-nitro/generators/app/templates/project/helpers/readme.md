# Custom <%= options.templateEngine %> helpers

If your project needs any additional or custom helpers, place them in this folder.<% if (options.templateEngine === 'hbs') { %> Subdirectories are also allowed <% } %>  
Every file which has the .js extension will be included.

These helpers will be loaded into Nitro automatically.

An example could look like this:

```js<% if (options.templateEngine === 'twig') { %>
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'helper-name',
		regex: /^helper-name/,
		next: [],
		open: true,
		compile: function(token) {
			// do any parameter logic here
			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			try {
				// do any template / render logic here

				// return the markup
				return {
					chain: chain,
					output: 'Output Markup'
				};

			} catch (e) {
				return {
					chain: chain,
					output: twigUtils.logAndRenderError(e)
				};
			}
		}
	};
};<% } else { %>
module.exports = function(foo) {
    // Helper Logic
};<% } %>
```
<% if (options.templateEngine === 'twig') { %>
The helper name get's defined in the type property above. 
The regex property needs to be extended to contain any possible arguments of the helper.
For more complex example's please check out the core helpers.<% } else { %>
The helper name will automatically match the filename, so if you name your file `foo.js` your helper will be called `foo`.<% } %>
