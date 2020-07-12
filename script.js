var cors_proxy = "https://cors-anywhere.herokuapp.com/";
var get_video_info = "https://www.youtube.com/get_video_info?eurl=" + encodeURIComponent(window.location) + 
                     "&sts=18432&html5=1&video_id=";
var video_id = "";
var file = ""
var fileContent = "null";
var playerResponse;
var playlist = [];
var playArrey;
var loopMode = 0;

function getVideoId(link) {
    if(link.indexOf("youtu.be") != -1) {
        link = link.split("youtu.be/")[1].split("&")[0];
    }
    else {
        link = link.split("v=")[1].split("&")[0];
    };
    video_id = link;
    file = cors_proxy + get_video_info + video_id;
    getData(file, setVideoInfo);
}

function getData(link, thenFunction) {
    var fileReader = new XMLHttpRequest();
    fileReader.open("GET", link);
    fileReader.onload = function() {
        if(fileReader.readyState === 4) {
            if(fileReader.status === 200 || fileReader.status == 0) {
                thenFunction(fileReader.responseText);
            }
        }
    }
    fileReader.onerror = function() {
        alert(fileReader.statusText + "\n" + fileReader.reason);
    }
    try {
        fileReader.send(null)
    }
    catch (e) {
        alert(e);
        console.log(e);
    };
}

function setVideoInfo(text) {
    playerResponse = JSON.parse(decode(text));
    if(playerResponse.playabilityStatus.status != "OK") {
        alert(playerResponse.playabilityStatus.reason);
        return;
    };
    var obj = lookComponent();
    if(obj == -1) return;
    setPlayerInfo(obj);
}

function setPlayerInfo(obj) {
    while(obj.title.indexOf("+") != -1) {
        obj.title = obj.title.replace("+", " ");
    };
    while(obj.description.indexOf("\n") != -1) {
        obj.description = obj.description.replace("\n", "<br/>");
    };
    while(obj.description.indexOf("+") != -1) {
        obj.description = obj.description.replace("+", " ");
    };
    while(obj.author.indexOf("+") != -1) {
        obj.author = obj.author.replace("+", " ");
    };
    document.getElementById("youtube-src").src = obj.url;
    document.getElementById("youtube-src").type = obj.type;
    document.getElementById("youtube-player").load();
    document.getElementById("youtube-player").play();
    document.title = obj.title;
    document.getElementById("title").innerHTML = obj.title;
    if(document.getElementById("title").clientWidth <= document.body.clientWidth*60/100) {
        document.getElementById("title").style = "animation: none";
    }
    else {
        document.getElementById("title").innerHTML = obj.title + obj.title;
        document.getElementById("title").style = "";
    };
    document.getElementById("description").innerHTML = obj.description;
    setMediaSession(obj);
    playlist[playControl.currentItem] = obj;
    playControl.refresh();
}

function decipher(num) {
    var s = decodeURIComponent(playerResponse.streamingData.adaptiveFormats[num].signatureCipher.split("&")[0].split("s=")[1]);
    var url = decodeURIComponent(playerResponse.streamingData.adaptiveFormats[num].signatureCipher.split("&")[2].split("url=")[1]);
    var Ew = function(a) {
        a = a.split("");
        Dw.h3(a, 22);
        Dw.yE(a, 1);
        Dw.h3(a, 64);
        Dw.Qg(a, 28);
        return a.join("")
    };
    var Dw = {
        h3: function(a) {
            a.reverse()
        },
        yE: function(a, b) {
            a.splice(0, b)
        },
        Qg: function(a, b) {
            var c = a[0];
            a[0] = a[b % a.length];
            a[b % a.length] = c
        }
    };
    return (url + "&sig=" + encodeURIComponent(Ew(s)));
}

function decode(content) {
    var stringSplit = content.split("&");
    for(i = 0; i<stringSplit.length; i++) {
        if(decodeURIComponent(stringSplit[i]).indexOf("player_response=") >= 0) {
            return decodeURIComponent(stringSplit[i]).replace("player_response=", "");
        };
    };
}

function lookComponent() {
    for(i = 0; i < playerResponse.streamingData.adaptiveFormats.length; i++) {
        if(playerResponse.streamingData.adaptiveFormats[i].audioQuality == "AUDIO_QUALITY_MEDIUM") {
            var obj = {"url": null, 
            "type": null,
            "title": null, 
            "author": null,
            "description": null,
            "thumbnail": [],};
            if  (playerResponse.streamingData.adaptiveFormats[i].signatureCipher != undefined) {
                obj.url = decipher(i);
            }
            else {
                obj.url = playerResponse.streamingData.adaptiveFormats[i].url;
            };
            obj.type = playerResponse.streamingData.adaptiveFormats[i].mimeType;
            obj.title =  playerResponse.videoDetails.title;
            obj.description = playerResponse.videoDetails.shortDescription;
            obj.author = playerResponse.videoDetails.author;
            for(i = 0; i < playerResponse.videoDetails.thumbnail.thumbnails.length; i++) {
                obj.thumbnail[i] = {};
                obj.thumbnail[i].src = playerResponse.videoDetails.thumbnail.thumbnails[i].url;
                obj.thumbnail[i].sizes = playerResponse.videoDetails.thumbnail.thumbnails[i].width + 'x' + 
                                     playerResponse.videoDetails.thumbnail.thumbnails[i].height;
                obj.thumbnail[i].type = 'image/jpg';
            };
            return obj;
        };
    };
}

function setMediaSession(mediaInfo) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: mediaInfo.title,
          artist: mediaInfo.author,
          album: '',
          artwork: mediaInfo.thumbnail
        });
      
        navigator.mediaSession.setActionHandler('play', function() {
            document.getElementById("youtube-player").play();
        });
        navigator.mediaSession.setActionHandler('pause', function() {
            document.getElementById("youtube-player").pause();
        });
        navigator.mediaSession.setActionHandler('seekbackward', function() {
            document.getElementById("youtube-player").currentTime += -5;
        });
        navigator.mediaSession.setActionHandler('seekforward', function() {
            document.getElementById("youtube-player").currentTime += 5;
        });
        navigator.mediaSession.setActionHandler('previoustrack', function() {
            playControl.prev();
        });
        navigator.mediaSession.setActionHandler('nexttrack', function() {
            playControl.next();
        });
      }
}



var playControl = {
    currentItem: 0,
    add: function(link) {
        var a = playlist.length;
        playlist[a] = {};
        playlist[a].link = link;
        a == 0 ? this.play(a) : null;
        this.refresh();
    },
    remove: function(item) {
        for(var i = item; i < playlist.length; i++) {
            playlist[i] = playlist[i+1];
        };
        playlist[playlist.length - 1] = undefined;
        this.refresh();
    },
    play: function(item) {
        var tmp = this.currentItem;
        this.currentItem = item;
        playlist[this.currentItem].url ? setPlayerInfo(playlist[this.currentItem]) : getVideoId(playlist[item].link);
    },
    prev: function() {
        if(this.currentItem == 0) return;
        var tmpurl = document.getElementById("youtube-src").src;
        var tmptime = document.getElementById("youtube-player").currentTime;
        document.getElementById("youtube-player").src = "";
        var stat = this.play(this.currentItem - 1);
        if(stat == -1) {
            playlist[this.currentItem] = undefined;
            this.currentItem++;
            document.getElementById("youtube-player").src = tmpurl;
            document.getElementById("youtube-player").currentTime = tmptime;
            document.getElementById("youtube-player").play();
            this.refresh();
        };
    },
    next: function() {
        document.getElementById("youtube-src").src = "";
        if(loopMode == 1) {
            document.getElementById("youtube-player").currentTime = 0;
            document.getElementById("youtube-player").play();
            return;
        }
        else if(loopMode == 2 && this.currentItem == playlist.length - 1) {
            this.currentItem = -1;
        };
        if(this.currentItem == playlist.length - 1) return;
        var tmpurl = document.getElementById("youtube-src").src;
        var tmptime = document.getElementById("youtube-player").currentTime;
        var stat = this.play(this.currentItem + 1);
        if(stat == -1) {
            playlist[this.currentItem] = undefined;
            this.currentItem--;
            document.getElementById("youtube-src").src = tmpurl;
            document.getElementById("youtube-player").currentTime = tmptime;
            document.getElementById("youtube-player").play();
            this.refresh();
        };
    },
    clear: function() {
        playlist = [];
        this.refresh();
    },
    refresh: function() {
        document.getElementById("playlist").innerHTML = "";
        for(var i = 0; i < playlist.length; i++) {
            if(i == this.currentItem) {
                document.getElementById("playlist").innerHTML = document.getElementById("playlist").innerHTML + 
                                                                "<i>" + playlist[i].title + "</i>";
            }
            else if(playlist[i].title){
                document.getElementById("playlist").innerHTML = document.getElementById("playlist").innerHTML + 
                                                                "<div class='playlistItem'><a style='cursor: pointer' onclick='playControl.play(" + 
                                                                i + ")'>" + playlist[i].title + "</a></div><br/>";
            }
            else {
                document.getElementById("playlist").innerHTML = document.getElementById("playlist").innerHTML + 
                                                                "<div class='playlistItem'><a style='cursor: pointer' onclick='playControl.play(" + 
                                                                i + ")'>" + playlist[i].link + "</a></div><br/>";
            };
        };
    },
    savePlaylist: function() {
        var expires = new Date();
        expires.setTime(expires.getTime + 7*24*60*60*1000);
        document.cookie = "playlist=" + escape(playlist.toString) + ";expires=" + expires.toGMTString();
    }
}

function loopSwitch() {
    loopMode++;
    if(loopMode == 3) loopMode = 0;
    if(loopMode == 0) document.getElementById("loopSwitch").innerHTML = "none";
    if(loopMode == 1) document.getElementById("loopSwitch").innerHTML = "single";
    if(loopMode == 2) document.getElementById("loopSwitch").innerHTML = "queue";
}
