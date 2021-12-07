---
layout: default
title: Pudding 開發進度
nav_order: 1
parent: Blogs
---
# Pudding 開發進度

## 2021/12/07

目前正在開發下一版布丁，將會對布丁的架構和介面進行大幅度的修改。(但是我要學測了所以沒什麼時間Orz)

### UI介面

介面將會採用Google的Material 3進行設計，程式將會自動使用系統色彩(Android 12以上)，否則預設會黃色色彩主題。

預計將主要和設定Activity整合為一個，並使用Bottom Navigation和ViewPager來切換。新增項目對話框亦將移除，改為使用和其他頁面同等的Fragment設計，使用者可於Bottom Navigation切換至新增項目的Fragment並新增項目。

加入歌詞功能，會根據播放項目的資訊自動由來源平台或者Google搜尋可用的歌詞。

使用新的圖示。

![Dialog screenshot](20211207-pudding-1.jpg "Material 3 對話框")

### 播放服務

新增Track物件作為項目的基礎物件，方便後續新增其他平台的支援。

### 其他

新增登入YouTube帳號功能，以播放一些需要登入才可播放的項目。
新增睡眠計時器，可於設定的時間後暫停播放器。
