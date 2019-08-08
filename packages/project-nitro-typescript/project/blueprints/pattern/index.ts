import './css/<%= pattern.file %>.scss';<% if (modifier.name) { %>
import './css/modifier/<%= modifier.file %>.scss';<% } %>
import './js/<%= pattern.file %>';
