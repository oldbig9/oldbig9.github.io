---
layout: "tool"
title: "时间戳工具"
description: ""
draft: false
showBreadcrumbs: false
showDate: false
showAuthor: false
showReadingTime: false
showWordCount: false
showTableOfContents: false
tool: "timestamp"
---

<div class="ts-tool" data-tool="timestamp">
<div class="ts-tool__now">
<div class="ts-tool__now-row">
<span class="ts-tool__now-label">当前时间戳</span>
<code id="ts-now-s" class="ts-tool__now-val" title="秒">--</code>
<button type="button" class="ts-tool__btn ts-tool__btn--ghost" data-action="now-copy">复制</button>
<select id="ts-tz" class="ts-tool__select ts-tool__select--now" aria-label="时区">
<option value="-720">UTC-12 贝克岛</option>
<option value="-660">UTC-11 美属萨摩亚</option>
<option value="-600">UTC-10 夏威夷</option>
<option value="-570">UTC-9:30 马克萨斯群岛</option>
<option value="-540">UTC-9 阿拉斯加</option>
<option value="-480">UTC-8 太平洋时间/洛杉矶</option>
<option value="-420">UTC-7 山地时间/丹佛</option>
<option value="-360">UTC-6 中部时间/芝加哥</option>
<option value="-300">UTC-5 东部时间/纽约</option>
<option value="-270">UTC-4:30 加拉加斯</option>
<option value="-240">UTC-4 大西洋时间/圣地亚哥</option>
<option value="-210">UTC-3:30 纽芬兰</option>
<option value="-180">UTC-3 巴西利亚/布宜诺斯艾利斯</option>
<option value="-120">UTC-2 中大西洋</option>
<option value="-60">UTC-1 佛得角/亚速尔</option>
<option value="0">UTC 协调世界时/伦敦</option>
<option value="60">UTC+1 巴黎/柏林/罗马</option>
<option value="120">UTC+2 开罗/雅典/约翰内斯堡</option>
<option value="180">UTC+3 莫斯科/内罗毕</option>
<option value="210">UTC+3:30 德黑兰</option>
<option value="240">UTC+4 迪拜/巴库</option>
<option value="270">UTC+4:30 喀布尔</option>
<option value="300">UTC+5 塔什干/伊斯兰堡</option>
<option value="330">UTC+5:30 孟买/新德里</option>
<option value="345">UTC+5:45 加德满都</option>
<option value="360">UTC+6 达卡/阿斯塔纳</option>
<option value="390">UTC+6:30 仰光</option>
<option value="420">UTC+7 曼谷/雅加达</option>
<option value="480" selected>UTC+8 北京/上海/香港</option>
<option value="540">UTC+9 东京/首尔</option>
<option value="570">UTC+9:30 阿德莱德/达尔文</option>
<option value="600">UTC+10 悉尼/墨尔本</option>
<option value="660">UTC+11 努美阿</option>
<option value="690">UTC+11:30 诺福克岛</option>
<option value="720">UTC+12 奥克兰/斐济</option>
<option value="765">UTC+12:45 查塔姆群岛</option>
<option value="780">UTC+13 阿皮亚/汤加</option>
<option value="840">UTC+14 基里巴斯</option>
<option value="local">本地时区</option>
</select>
</div>
<div id="ts-now-date" class="ts-tool__now-date">--</div>
</div>
<div class="ts-tool__grid">
<div class="ts-tool__section">
<h2 class="ts-tool__title">时间戳 → 日期</h2>
<div class="ts-tool__field">
<label class="ts-tool__label" for="ts-input">时间戳</label>
<input type="text" id="ts-input" class="ts-tool__input" placeholder="如 1770000000 或 1770000000000" autocomplete="off">
</div>
<div class="ts-tool__actions">
<button type="button" class="ts-tool__btn ts-tool__btn--primary" data-action="ts-convert">转换</button>
<button type="button" class="ts-tool__btn" data-action="ts-copy">复制结果</button>
<button type="button" class="ts-tool__btn" data-action="ts-clear">清空</button>
</div>
<div class="ts-tool__result">
<pre id="ts-output" class="ts-tool__output">输入时间戳后将显示结果</pre>
<div id="ts-meta" class="ts-tool__meta"></div>
</div>
</div>
<div class="ts-tool__section">
<h2 class="ts-tool__title">日期 → 时间戳</h2>
<div class="ts-tool__field">
<label class="ts-tool__label" for="dt-input">日期时间</label>
<input type="text" id="dt-input" class="ts-tool__input" placeholder="点击选择日期时间" autocomplete="off" readonly>
</div>
<div class="ts-tool__actions">
<button type="button" class="ts-tool__btn ts-tool__btn--primary" data-action="dt-convert">转换</button>
<button type="button" class="ts-tool__btn" data-action="dt-copy">复制结果</button>
<button type="button" class="ts-tool__btn" data-action="dt-clear">清空</button>
</div>
<div class="ts-tool__result">
<pre id="dt-output" class="ts-tool__output">选择日期后将显示结果</pre>
<div id="dt-meta" class="ts-tool__meta"></div>
</div>
</div>
</div>
</div>
