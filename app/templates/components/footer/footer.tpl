<!-- Bottom Toolbar-->
<div class="toolbar" style="display:none">
  <div class="toolbar-inner">
    <div class="left">
      <a href="/blog/{{links.previous.id}}" class="link" data-pagelets="layout.main" data-animation="slideRight">
        <span>上一篇</span>
      </a>
    </div>
    <div class="right">
      <a href="/blog/{{links.next.id}}" class="link" data-pagelets="layout.main" data-animation="slideLeft">
        <span>下一篇</span>
      </a>
    </div>
  </div>
</div>

{% require $id='footer.js' %}