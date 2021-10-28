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



[get-latest]:javascript:fetch("https://api.github.com/repositories/367643669/releases/latest").then(response=>{response.json().then(json=>{window.location.href=json.assets[json.assets.length-1].browser_download_url})});
[get-old]:javascript:if(confirm())window.location.href="https://github.com/BorisChen396/Pudding/releases";
