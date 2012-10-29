# <%= title %> #

### TOC ###
<% for (var i = 0; i < toc.length; i++) { %>
* [<%= toc[i]['target'] %>](<%= toc[i]['path'] %>)
<% } %>