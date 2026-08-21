---
layout: "tool"
title: "JSON 工具"
description: ""
draft: false
showBreadcrumbs: false
showDate: false
showAuthor: false
showReadingTime: false
showWordCount: false
showTableOfContents: false
---

<div class="json-tool" data-tool="json">
  <div class="json-tool__actions">
    <button type="button" class="json-tool__btn json-tool__btn--primary" data-action="format">格式化</button>
    <button type="button" class="json-tool__btn json-tool__btn--primary" data-action="minify">压缩</button>
    <button type="button" class="json-tool__btn" data-action="clear-input">清空</button>
    <button type="button" class="json-tool__btn" data-action="copy">复制结果</button>
  </div>

  <p id="json-status" class="json-tool__status" role="status" aria-live="polite"></p>

  <div class="json-tool__grid">
    <div class="json-tool__panel">
      <label class="json-tool__label" for="json-input">输入 JSON</label>
      <textarea id="json-input" class="json-tool__textarea" rows="18" placeholder='在此粘贴 JSON，例如：{"name":"test","value":1}'></textarea>
    </div>
    <div class="json-tool__panel">
      <label class="json-tool__label" for="json-output">输出结果</label>
      <pre id="json-output" class="json-tool__output" aria-live="polite"><code id="json-output-code"></code></pre>
    </div>
  </div>

  <details class="json-tool__history">
    <summary>历史记录（最近 10 条）</summary>
    <div id="json-history" class="json-tool__history-list"></div>
    <button type="button" class="json-tool__btn json-tool__btn--danger" data-action="clear-history">清空历史</button>
  </details>
</div>
