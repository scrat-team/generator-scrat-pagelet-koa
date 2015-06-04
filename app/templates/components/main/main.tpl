{% if page404 %}
  {% require $id='404' %}
{% elseif list %}
  <div class="page index-list">
    {% require $id='list' %}
  </div>
{% elseif id %}
  <div class="page index-list">
    {% require $id='detail' %}
  </div>
{% endif %}

{% script %}
  var main = require('./main.js');
  main.setTitle("{{name}}");

  {% if list %}
    main.setType("list");
  {% elseif id %}
    main.setType("detail");
  {% endif %}

  {% if links %}
    main.setNav({{JSON.stringify(links)}});
  {% else %}
    main.setNav(null);
  {% endif %}
{% endscript %}