/* JSON 格式化/压缩工具 + localStorage 历史记录
   单页双模式（Tab 切换），纯原生 JS，无依赖。
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'blowfish_tool_json_history';
  var MAX_HISTORY = 10;
  var MAX_INPUT_LEN = 50 * 1024; // 50KB，超此不缓存，防撑爆 localStorage

  function relTime(ts) {
    var diff = Date.now() - ts;
    var s = Math.floor(diff / 1000);
    if (s < 60) return s + ' 秒前';
    var m = Math.floor(s / 60);
    if (m < 60) return m + ' 分钟前';
    var h = Math.floor(m / 60);
    if (h < 24) return h + ' 小时前';
    var d = Math.floor(h / 24);
    return d + ' 天前';
  }

  function preview(str) {
    var oneline = String(str).replace(/\s+/g, ' ').trim();
    return oneline.length > 60 ? oneline.slice(0, 60) + '…' : oneline;
  }

  var history = {
    read: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    },
    write: function (arr) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); return true; }
      catch (e) { return false; } // 配额满/隐私模式静默降级
    },
    add: function (input, op) {
      if (!input || input.length > MAX_INPUT_LEN) return;
      var arr = this.read().filter(function (r) {
        return !(r.input === input && r.op === op); // 去重
      });
      arr.unshift({ input: input, op: op, ts: Date.now() });
      if (arr.length > MAX_HISTORY) arr = arr.slice(0, MAX_HISTORY);
      this.write(arr);
    },
    clear: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  };

  function showError(el, msg) {
    if (!el) return;
    el.textContent = '✗ ' + msg;
    el.className = 'json-tool__status json-tool__status--error';
  }
  function showOk(el, msg) {
    if (!el) return;
    el.textContent = '✓ ' + msg;
    el.className = 'json-tool__status json-tool__status--ok';
  }

  // HTML 转义
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 递归生成带语法高亮的 HTML（参考 Chrome JSON Viewer 配色）
  function syntaxHighlight(obj, indent) {
    indent = indent || 0;
    var pad = '\n' + '  '.repeat(indent + 1);
    var closePad = '\n' + '  '.repeat(indent);

    if (obj === null) return '<span class="json-tok-null">null</span>';
    if (typeof obj === 'boolean') return '<span class="json-tok-bool">' + obj + '</span>';
    if (typeof obj === 'number') return '<span class="json-tok-num">' + obj + '</span>';
    if (typeof obj === 'string') return '<span class="json-tok-str">"' + esc(obj) + '"</span>';

    var isArray = Array.isArray(obj);
    var open = isArray ? '[' : '{';
    var close = isArray ? ']' : '}';
    var keys = isArray ? obj.map(function (_, i) { return i; }) : Object.keys(obj);

    if (keys.length === 0) return open + close;

    var parts = keys.map(function (k) {
      var val = isArray ? obj[k] : obj[k];
      var keyHTML = isArray ? '' : '<span class="json-tok-key">"' + esc(k) + '"</span>: ';
      return pad + keyHTML + syntaxHighlight(val, indent + 1);
    });
    return open + parts.join(',') + closePad + close;
  }

  function formatJSON(input) {
    return syntaxHighlight(JSON.parse(input), 0);
  }
  function minifyJSON(input) {
    return JSON.stringify(JSON.parse(input));
  }

  function renderHistory(container, inputEl) {
    if (!container) return;
    var arr = history.read();
    if (arr.length === 0) {
      container.innerHTML = '<p class="json-tool__history-empty">暂无记录</p>';
      return;
    }
    container.innerHTML = '';
    arr.forEach(function (r) {
      var item = document.createElement('div');
      item.className = 'json-tool__history-item';
      var tag = document.createElement('span');
      tag.className = 'json-tool__history-tag';
      tag.textContent = r.op === 'format' ? '格式化' : '压缩';
      var p = document.createElement('code');
      p.className = 'json-tool__history-preview';
      p.textContent = preview(r.input);
      var meta = document.createElement('span');
      meta.className = 'json-tool__history-meta';
      meta.textContent = relTime(r.ts);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'json-tool__btn json-tool__btn--small';
      btn.textContent = '回填';
      btn.addEventListener('click', function () {
        if (inputEl) {
          inputEl.value = r.input;
          inputEl.dispatchEvent(new Event('input')); // 触发 autoResize
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      item.appendChild(tag); item.appendChild(p); item.appendChild(meta); item.appendChild(btn);
      container.appendChild(item);
    });
  }

  function initTool(root) {
    var inputEl = root.querySelector('#json-input');
    var outputCode = root.querySelector('#json-output-code'); // <code>
    var statusEl = root.querySelector('#json-status');
    var historyContainer = root.querySelector('#json-history');
    var lastResult = ''; // 保存原始结果文本，供复制使用

    // textarea 根据内容自动撑高（field-sizing 的 JS 兜底）
    function autoResize() {
      if (!inputEl) return;
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.max(200, inputEl.scrollHeight) + 'px';
    }
    inputEl.addEventListener('input', autoResize);
    // 失焦时自动格式化(若有有效输入)
    inputEl.addEventListener('blur', function () {
      var input = inputEl.value;
      if (!input.trim()) return;
      try {
        lastResult = JSON.stringify(JSON.parse(input), null, 2);
        outputCode.innerHTML = formatJSON(input);
        showOk(statusEl, '已自动格式化');
      } catch (err) {
        showError(statusEl, '解析失败：' + err.message);
      }
    });
    autoResize();

    renderHistory(historyContainer, inputEl);

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');

      if (action === 'format' || action === 'minify') {
        var input = inputEl.value;
        if (!input.trim()) { showError(statusEl, '请输入 JSON'); return; }
        try {
          if (action === 'format') {
            lastResult = JSON.stringify(JSON.parse(input), null, 2);
            outputCode.innerHTML = formatJSON(input); // 高亮 HTML 显示
            showOk(statusEl, '格式化成功');
          } else {
            var result = minifyJSON(input);
            lastResult = result;
            outputCode.textContent = result;
            showOk(statusEl, '压缩成功（' + result.length + ' 字节）');
          }
          history.add(input, action);
          renderHistory(historyContainer, inputEl);
        } catch (err) {
          showError(statusEl, '解析失败：' + err.message);
        }
      } else if (action === 'clear-input') {
        inputEl.value = '';
        outputCode.innerHTML = '';
        outputCode.textContent = '';
        lastResult = '';
        statusEl.textContent = '';
        autoResize();
      } else if (action === 'copy') {
        if (!lastResult) { showError(statusEl, '没有可复制的结果'); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lastResult).then(function () {
            showOk(statusEl, '已复制到剪贴板');
          }).catch(function () {
            fallbackCopy();
          });
        } else {
          fallbackCopy();
        }
      } else if (action === 'clear-history') {
        history.clear();
        renderHistory(historyContainer, inputEl);
        showOk(statusEl, '历史已清空');
      }
    });

    function fallbackCopy() {
      var tmp = document.createElement('textarea');
      tmp.value = lastResult;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand('copy'); showOk(statusEl, '已复制'); }
      catch (e) { showError(statusEl, '复制失败'); }
      document.body.removeChild(tmp);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var roots = document.querySelectorAll('.json-tool[data-tool]');
    roots.forEach(function (root) { initTool(root); });
  });
})();
