---
layout: default
---

# Download

If your download doesn't start in a few seconds, [click here](javascript: document.body.onload()).

<script>document.body.onload=function(){switch(new URL(window.location.href).searchParams.get("req")){case"android-pudding":fetch("https://api.github.com/repositories/367643669/releases/latest").then(e=>{e.json().then(e=>{window.open(e.assets[e.assets.length-1].browser_download_url,"_self")})});break;case"pudding-is-delicious":window.open("https://youtu.be/dQw4w9WgXcQ","_self");break;default:window.open(window.location.host,"_self")}};</script>
