---
layout: default
title: Pudding
nav_order: 1
parent: Projects
---

# Pudding

Pudding is a music player that let you enjoy music from various sources!

[Download latest][get-latest]{: .btn .btn-primary}&nbsp;
[Download other versions][get-old]{: .btn}

## Installation

Pudding currently only works on Android Lollipop or higher. You can get the latest version [here][get-latest], or find other versions [here][get-old].

## Supported sources

 1. Local media files
 2. YouTube

[get-latest]:javascript:fetch("https://api.github.com/repositories/367643669/releases/latest").then(response=>{response.json().then(json=>{window.location.href=json.assets[json.assets.length-1].browser_download_url})});
[get-old]:javascript:if(confirm("Old versions may not be usable because of bugs or other problems. Continue?"))window.location.href="https://github.com/BorisChen396/Pudding/releases";
