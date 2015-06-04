{% extends '../layout/layout.tpl' %}
{% block body %}
<div class="views">
    <div class="view view-main">
            <div class="page navbar-fixed navbar-through">
                {% require $id='header' %}

                {% pagelet $id="main" class="page-content index-main"%}
                    {% require $id='main' %}
                {% endpagelet %}

                {% require $id='footer' %}
            </div>
    </div>
</div>
{% require $id='./blog.css' %}
{% require $id='./blog.js' %}
{% endblock %}