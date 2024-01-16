---
title: "ubuntu ibus rime配置"
date: 2024-01-11 10:23:08
draft: false
tags:
- Ubuntu
- ibus
- rime
categories:
- tech
---

Linux环境：

* Ubuntu20.04
* Gnome3.36.8
* Ibus

拷贝`~/.config/ibus/rime/build/default.yaml`到`~/.config/ibus/rime/default.yaml`

1. 设置左shift输入英文字母
   
   ```shell
   ascii_composer:
     good_old_caps_lock: true
     switch_key:
       Caps_Lock: clear
       Control_L: noop
       Control_R: noop
       Eisu_toggle: clear
       Shift_L: commit_code #输入时左shift键输入英文字母而不是中文
       Shift_R: commit_text
   ```
2. 设置后选词数量
   
   ```shell
   menu:        
     page_size: 9
   ```
3. 取消输入方案选择的快捷键，默认与vscode调出terminal快捷键冲突
   
   ```shell
   switcher:    
     abbreviate_options: true
     caption: "〔方案選單〕"                                               
     fold_options: true
     hotkeys:   
       - "Control+grave" # 去掉这个即可
       - "Control+Shift+grave"
       - F4 
   ```
4. 候选词水平展示，ibus,创建文件`~/.config/ibus/rime/build/ibus_rime.yaml`
   
   ```shell
   style:
     horizontal: true
   ```
5. 优先使用简体中文输入方案
   
   ```shell
   schema_list: 
     - schema: luna_pinyin_simp # 中文简体                                    
     - schema: luna_pinyin
     - schema: luna_pinyin_fluency
     - schema: bopomofo
     - schema: bopomofo_tw
     - schema: cangjie5
     - schema: stroke
     - schema: terra_pinyin
   ```
