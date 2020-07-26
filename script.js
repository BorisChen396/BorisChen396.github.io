var cors_proxy = "https://cors-anywhere.herokuapp.com/";
var get_video_info = "https://www.youtube.com/get_video_info?eurl=" + encodeURIComponent(window.location) + 
                     "&sts=18466&html5=1&video_id=";
var video_id = "";
var file = ""
var fileContent = "null";
var playerResponse;
var playlist = [];
var playArrey;
var loopMode = 0;
var qualitySet = "AUDIO_QUALITY_MEDIUM";

function getVideoId(video_id) {
    file = cors_proxy + get_video_info + video_id;
    getData(file, setVideoInfo);
}

function getData(link, thenFunction) {
    var fileReader = new XMLHttpRequest();
    fileReader.open("GET", link);
    fileReader.onload = function() {
        if(fileReader.readyState === 4) {
            if(fileReader.status === 200 || fileReader.status == 0) {
                if(thenFunction) thenFunction(fileReader.responseText);
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
    var tags = {
        id: playerResponse.videoDetails.videoId,
        part: "snippet"
    }
    getInfoFromAPI("videos", tags, setVideoInfoFromAPI);
}

function setPlayerInfo(obj) {
    document.getElementById("youtube-player").src = obj.url;
    document.getElementById("youtube-player").type = obj.type;
    document.getElementById("youtube-player").load();
    document.getElementById("youtube-player").play();
    playlist[playControl.currentItem] = Object.assign(playlist[playControl.currentItem], obj);
    playControl.refresh();
}

function getInfoFromAPI(ref, tags, thenFunction) {
    var key = "AIzaSyCJecgTtdDpk76QLDM67uFSHaqsQpjUI9k";
    var _tags = "";
    for(var i = 0; i < Object.keys(tags).length; i++) {
        _tags = _tags + "&" + Object.keys(tags)[i] + "=" + tags[Object.keys(tags)[i]];
    };
    var link = "https://www.googleapis.com/youtube/v3/" + ref + "?key=" + key + _tags;
    getData(link, thenFunction);
}

function setVideoInfoFromAPI(APIText) {
    var videoInfo = JSON.parse(APIText).items[0].snippet;
    document.title = videoInfo.title;
    playlist[playControl.currentItem] = Object.assign(playlist[playControl.currentItem], videoInfo);
    setTitleAnimation(videoInfo.title);
    document.getElementById("description").innerHTML = videoInfo.description.replace(/\n/g, "<br/>");
    videoInfo.thumbnails = [videoInfo.thumbnails.default, videoInfo.thumbnails.high,
                            videoInfo.thumbnails.medium, videoInfo.thumbnails.standard]
    for(var i = 0; i < videoInfo.thumbnails.length; i++) {
        videoInfo.thumbnails[i].sizes = videoInfo.thumbnails[i].width + "x" + videoInfo.thumbnails[i].height;
        videoInfo.thumbnails[i].type = "image/jpg";
        videoInfo.thumbnails[i].src = videoInfo.thumbnails[i].url + "?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB";
    };
    setMediaSession(videoInfo);
    playControl.refresh();
}

var Zu = function(a) {
    a = a.split("");
    Yu.QC(a, 39);
    Yu.oN(a, 77);
    Yu.QC(a, 20);
    return a.join("")
};
var Yu = {
    oN: function(a) {
        a.reverse()
    },
    QC: function(a, b) {
        var c = a[0];
        a[0] = a[b % a.length];
        a[b % a.length] = c
    },
    mI: function(a, b) {
        a.splice(0, b)
    }
};

function decipher(num) {
    var s = decodeURIComponent(playerResponse.streamingData.adaptiveFormats[num].signatureCipher.split("&")[0].split("s=")[1]);
    var url = decodeURIComponent(playerResponse.streamingData.adaptiveFormats[num].signatureCipher.split("&")[2].split("url=")[1]);
    return (url + "&sig=" + encodeURIComponent(Zu(s)));
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
        if(playerResponse.streamingData.adaptiveFormats[i].audioQuality == qualitySet) {
            var obj = [{"url": null,
                       "type": null
            }];
            if  (playerResponse.streamingData.adaptiveFormats[i].signatureCipher != undefined) {
                obj.url = decipher(i);
            }
            else {
                obj.url = playerResponse.streamingData.adaptiveFormats[i].url;
            };
            obj.type = playerResponse.streamingData.adaptiveFormats[i].mimeType.split(";")[0];
            return obj;
        };
    };
}

function setMediaSession(mediaInfo) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: mediaInfo.title,
          artist: mediaInfo.channelTitle,
          album: '',
          artwork: mediaInfo.thumbnails
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

var playlistItem;

var playControl = {
    currentItem: 0,
    add: function(videoId) {
        var a = playlist.length;
        playlist[a] = {};
        playlist[a].videoId = videoId;
        this.refresh();
        a == 0 ? this.play(a) : null;
    },
    addPlaylist: function(playlistId) {
        var tags = {
            playlistId: playlistId,
            part: "snippet,id"
        }
        getInfoFromAPI("playlistItems", tags, function test(text) {
            text = JSON.parse(text);
            while(text.nextPageToken) {
                var tags = {
                    playlistId: playlistId,
                    part: "snippet,id",
                    pageToken: text.nextPageToken
                };
                getInfoFromAPI("playlistItems", tags, test());
            };
            console.log(text);
        });
    },
    remove: function(item) {
        for(var i = item; i < playlist.length; i++) {
            playlist[i] = playlist[i+1];
        };
        playlist[playlist.length - 1] = undefined;
        this.refresh();
    },
    play: function(item) {
        if(String(item).indexOf("playlistItem_") >= 0) {item = Number(item.replace("playlistItem_", ""))};
        this.currentItem = item;
        playlist[this.currentItem].url ? setPlayerInfo(playlist[this.currentItem]) : getVideoId(playlist[item].videoId);
    },
    prev: function() {
        if(this.currentItem == 0) return;
        document.getElementById("youtube-player").src = "";
        this.play(this.currentItem - 1);
    },
    next: function() {
        if(loopMode == 1) {
            document.getElementById("youtube-player").currentTime = 0;
            document.getElementById("youtube-player").play();
            return;
        }
        else if(loopMode == 2 && this.currentItem == playlist.length - 1) {
            this.currentItem = -1;
        };
        if(this.currentItem == playlist.length - 1) return;
        document.getElementById("youtube-player").src = "";
        this.play(this.currentItem + 1);
    },
    clear: function() {
        playlist = [];
        this.refresh();
    },
    refresh: function() {
        document.getElementById("playlist").innerHTML = "";
        for(var i = 0; i < playlist.length; i++) {
            //playlistItem[1] = onclick, [3] = style, [5] = innerHTML
            playlistItem = ["<div class='playlistItem' id='playlistItem_" + i + "' onclick='", "", "' style='", "", "'>", "", "</div>"];

            if(playlist[i].title){
                playlistItem[5] = playlist[i].title;
            }
            else {
                playlistItem[5] = "https://youtu.be/" + playlist[i].videoId;
            };
            if(i == this.currentItem) {
                playlistItem[3] = "";
                playlistItem[5] = "<i>" + playlistItem[5] + "</i>";
                playlistItem[1] = "";
            }
            else {
                playlistItem[3] = "cursor: pointer;";
                playlistItem[1] = "playControl.play(" + i + ")";
            };
            document.getElementById("playlist").innerHTML = document.getElementById("playlist").innerHTML + playlistItem.join("");
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

function stringSplit(string) {
    string = string.split("&");
    var a = {};
    for(var i = 0; i < string.length; i++) {
        a[string[i].split("=")[0]] = string[i].split("=")[1];
    };
    return a;
}