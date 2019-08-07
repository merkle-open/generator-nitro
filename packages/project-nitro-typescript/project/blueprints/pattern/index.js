import './css/<%= pattern.file %>.scss';<% if (modifier.name) { %>
import './css/modifier/<%= pattern.file %>-<%= modifier.file %>.scss';<% } %>
import './js/<%= pattern.file %>';<% if (decorator.name) { %>
import './js/decorator/<%= pattern.file %>-<%= decorator.file %>';<% } %>
