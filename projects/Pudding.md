---
layout: default
title: Pudding
nav_order: 1
parent: Projects
---

# Pudding
[View source code](https://github.com/BorisChen396/Pudding)

Pudding is a music player that let you enjoy music from various sources!

[Download latest][get-latest]{: .btn .btn-primary}&nbsp;
[Download other versions][get-old]{: .btn}

## Installation

Pudding currently only works on Android Lollipop or higher.  You can get latest version [here][get-latest], or find other versions [here][get-old].

## Supported sources

 1. Local media files
 2. YouTube

## Credit

The icon is created by zELiaNUze.

[get-latest]:javascript:fetch("https://api.github.com/repositories/367643669/releases/latest").then(response=>{response.json().then(json=>{window.location.href=json.assets[json.assets.length-1].browser_download_url})});
[get-old]:javascript:if(confirm("Old\u0020versions\u0020may\u0020not\u0020be\u0020usable\u0020because\u0020of\u0020bugs\u0020or\u0020other\u0020problems.\u0020Continue?"))window.location.href="https://github.com/BorisChen396/Pudding/releases";
