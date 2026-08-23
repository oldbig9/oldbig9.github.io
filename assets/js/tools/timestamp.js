/* 时间戳工具:双向转换(时间戳→日期 / 日期→时间戳)
   日期选择使用 flatpickr(datetime 模式),纯数学计算不依赖浏览器时区。
*/
import flatpickr from '../../vendor/flatpickr/flatpickr.min.js';
import '../../vendor/flatpickr/l10n/zh.js';

(function () {
  'use strict';

  // 星期中文
  var WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  // 取本地时区偏移(分钟)
  function localOffset() {
    return -new Date().getTimezoneOffset();
  }

  // 取时区偏移:select 值 "480"/"0"/"-300" 或 "local"
  function getOffset(selVal) {
    if (selVal === 'local') return localOffset();
    return parseInt(selVal, 10);
  }

  // 偏移转成 +HH:MM 字符串
  function offsetLabel(min) {
    var sign = min >= 0 ? '+' : '-';
    var abs = Math.abs(min);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    return 'UTC' + sign + (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  // 两位补零
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // 毫秒时间戳 → 按指定时区偏移(分钟)格式化日期串
  // 关键:用 UTC 分量 + 偏移,避免浏览器时区干扰
  function formatDate(ms, offsetMin) {
    // 先在 UTC 基础上构造一个"目标时区"的 Date
    // 偏移为正(东区)意味着当地时间 = UTC + offset
    var d = new Date(ms + offsetMin * 60000);
    var Y = d.getUTCFullYear();
    var Mo = d.getUTCMonth() + 1;
    var D = d.getUTCDate();
    var H = d.getUTCHours();
    var Mi = d.getUTCMinutes();
    var S = d.getUTCSeconds();
    var w = d.getUTCDay();
    return {
      full: Y + '-' + pad(Mo) + '-' + pad(D) + ' ' + pad(H) + ':' + pad(Mi) + ':' + pad(S),
      date: Y + '-' + pad(Mo) + '-' + pad(D),
      time: pad(H) + ':' + pad(Mi) + ':' + pad(S),
      week: '星期' + WEEK[w],
      year: Y, month: Mo, day: D, hour: H, min: Mi, sec: S,
      iso: d.toISOString().replace('T', ' ').slice(0, 19)
    };
  }

  // 相对时间(基于"目标时区当前时间")
  function relTime(ms, offsetMin) {
    var now = Date.now();
    var diff = ms - now;
    var abs = Math.abs(diff);
    var sign = diff < 0 ? '前' : '后';
    var s = Math.floor(abs / 1000);
    if (s < 60) return s + ' 秒' + sign;
    var m = Math.floor(s / 60);
    if (m < 60) return m + ' 分钟' + sign;
    var h = Math.floor(m / 60);
    if (h < 24) return h + ' 小时' + sign;
    var d = Math.floor(h / 24);
    if (d < 30) return d + ' 天' + sign;
    var mo = Math.floor(d / 30);
    if (mo < 12) return mo + ' 个月' + sign;
    return Math.floor(mo / 12) + ' 年' + sign;
  }

  // 智能判断秒/毫秒:13位以上视为毫秒,10位视为秒
  function detectUnit(str) {
    var n = String(str).trim();
    // 去掉小数点
    var intPart = n.split('.')[0];
    if (intPart.length >= 13) return 'ms';
    return 's';
  }

  function setStatus(el, msg, ok) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'ts-tool__meta' + (ok === false ? ' ts-tool__meta--error' : '');
  }

  // === 时间戳 → 日期 ===
  // 单位按时间戳长度自动判断:13位以上=毫秒,否则=秒
  function convertTsToDt(root) {
    var input = root.querySelector('#ts-input').value.trim();
    var output = root.querySelector('#ts-output');
    var meta = root.querySelector('#ts-meta');
    if (!input) { setStatus(meta, '请输入时间戳', false); return; }

    var tzVal = root.querySelector('#ts-tz').value;

    var num = Number(input);
    if (isNaN(num)) { setStatus(meta, '无效的数字', false); return; }

    // 自动判断单位(按位数)
    var actualUnit = detectUnit(input);
    var ms = actualUnit === 'ms' ? num : num * 1000;

    if (ms < 0 || ms > 8640000000000000) {
      setStatus(meta, '时间戳超出有效范围', false);
      return;
    }

    var offset = getOffset(tzVal);
    var fmt = formatDate(ms, offset);
    output.textContent = fmt.full + ' ' + offsetLabel(offset) + '\n' + fmt.week;

    var info = [
      '相对: ' + relTime(ms, offset),
      'ISO: ' + fmt.iso,
      '日期: ' + fmt.date,
      '时间: ' + fmt.time,
      actualUnit === 'ms' ? '已按毫秒换算' : '已按秒换算'
    ].join('\n');
    setStatus(meta, info, true);
  }

  // === 日期 → 时间戳 ===
  // 从 flatpickr 实例取选中日期(本地分量),按选定时区换算成时间戳
  function convertDtToTs(root) {
    var fp = root.querySelector('#dt-input')._flatpickr;
    var picked = fp && fp.selectedDates ? fp.selectedDates[0] : null;
    var output = root.querySelector('#dt-output');
    var meta = root.querySelector('#dt-meta');
    if (!picked) { setStatus(meta, '请选择日期时间', false); return; }

    var tzVal = root.querySelector('#ts-tz').value;

    // flatpickr 返回的 Date 用本地分量表达用户选的"年月日时分秒"
    // 取其本地分量,视为目标时区时间
    var Y = picked.getFullYear();
    var Mo = picked.getMonth();
    var D = picked.getDate();
    var H = picked.getHours();
    var Mi = picked.getMinutes();
    var S = picked.getSeconds();

    // 构造 UTC 分量毫秒: Date.UTC 得到该"输入视为 UTC 时区"的毫秒数
    var utcMs = Date.UTC(Y, Mo, D, H, Mi, S);

    // 输入实际属于 offset 时区:当地 = UTC + offset
    // 所以真实 UTC 毫秒 = utcMs - offset*60000
    var offset = getOffset(tzVal);
    var realMs = utcMs - offset * 60000;

    var sec = Math.floor(realMs / 1000);
    var ms = realMs;

    output.textContent = '秒:   ' + sec + '\n毫秒: ' + ms;

    var fmt = formatDate(realMs, offset);
    var info = [
      '校验: ' + fmt.full + ' ' + offsetLabel(offset),
      '星期: ' + fmt.week,
      'ISO: ' + fmt.iso
    ].join('\n');
    setStatus(meta, info, true);
  }

  function init(root) {
    // 顶部当前时间戳实时刷新(每秒),按全局时区显示日期
    var nowS = root.querySelector('#ts-now-s');
    var nowDate = root.querySelector('#ts-now-date');
    var tzSel = root.querySelector('#ts-tz');
    function tickNow() {
      var ms = Date.now();
      if (nowS) nowS.textContent = Math.floor(ms / 1000);
      if (nowDate) {
        var offset = getOffset(tzSel.value);
        var fmt = formatDate(ms, offset);
        nowDate.textContent = fmt.full + ' ' + offsetLabel(offset) + ' · ' + fmt.week;
      }
    }
    tickNow();
    setInterval(tickNow, 1000);

    // 时间戳→日期:输入即转换 + 按钮转换
    var tsInput = root.querySelector('#ts-input');
    tsInput.addEventListener('input', function () { convertTsToDt(root); });

    // 时区切换:更新顶部当前日期时间 + 两个方向重算
    tzSel.addEventListener('change', function () {
      tickNow();
      convertTsToDt(root);
      convertDtToTs(root);
    });

    // 日期→时间戳: flatpickr 单输入框 datetime 模式
    var dtInput = root.querySelector('#dt-input');
    var initDate = new Date(); // 默认当前时间,flatpickr 会用本地分量展示
    flatpickr(dtInput, {
      enableTime: true,
      time_24hr: true,
      dateFormat: 'Y-m-d H:i',
      locale: 'zh',
      defaultDate: initDate,
      allowInput: false,
      minuteIncrement: 1,
      onChange: function () { convertDtToTs(root); }
    });

    // 按钮事件
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');

      if (action === 'ts-convert') convertTsToDt(root);
      else if (action === 'dt-convert') convertDtToTs(root);
      else if (action === 'ts-clear') {
        root.querySelector('#ts-input').value = '';
        root.querySelector('#ts-output').textContent = '输入时间戳后将显示结果';
        root.querySelector('#ts-meta').textContent = '';
      } else if (action === 'dt-clear') {
        var fp = dtInput._flatpickr;
        if (fp) fp.clear();
        root.querySelector('#dt-output').textContent = '选择日期后将显示结果';
        root.querySelector('#dt-meta').textContent = '';
      } else if (action === 'ts-copy') {
        copyText(root.querySelector('#ts-output').textContent, root);
      } else if (action === 'dt-copy') {
        copyText(root.querySelector('#dt-output').textContent, root);
      } else if (action === 'now-copy') {
        // 仅复制当前秒级时间戳
        var curSec = Math.floor(Date.now() / 1000);
        copyText(String(curSec), root);
      }
    });

    // 时间戳→日期: 不自动填充,等待用户输入
    // flatpickr 已用 defaultDate 初始化,触发一次转换
    convertDtToTs(root);
  }

  function copyText(text, root) {
    // 从面板里找 status meta 显示复制结果
    if (!text || text.indexOf('将显示') > -1) return;
    var notice = root.querySelector('#ts-meta'); // 复用显示
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (notice) { notice.textContent = '已复制: ' + text.split('\n')[0]; }
      }).catch(function () { fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }

  function fallbackCopy(text) {
    var tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(tmp);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var roots = document.querySelectorAll('.ts-tool[data-tool]');
    roots.forEach(function (root) { init(root); });
  });
})();
