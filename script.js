var cors_proxy = "https://cors-anywhere.herokuapp.com/";
var get_video_info = "https://www.youtube.com/get_video_info?eurl=" + encodeURIComponent(window.location) + 
                     "&sts=18432&html5=1&video_id=";
var video_id = "";
var file = ""
var fileContent = "null";
var playerResponse;
var fileReader = new XMLHttpRequest();
var thumbnail = [];

function playMusic(link) {
    if(link.indexOf("youtu.be") != -1) {
        link = link.split("youtu.be/")[1].split("&")[0];
    }
    else {
        link = link.split("v=")[1].split("&")[0];
    };
    video_id = link;
    file = cors_proxy + get_video_info + video_id;
    fileReader.open("GET", file, true);
    fileReader.onreadystatechange = function() {
        if(fileReader.readyState === 4) {
            if(fileReader.status === 200 || fileReader.status == 0) {
                playerResponse = JSON.parse(decode(fileReader.responseText));
                if(playerResponse.playabilityStatus.status != "OK") {
                    alert(playerResponse.playabilityStatus.reason);
                    return;
                };
                var obj = lookComponent();
                if(obj == -1) return;
                document.getElementById("youtube-src").src = obj.url;

                console.log(obj.url);

                document.getElementById("youtube-src").type = obj.type;
                document.getElementById("youtube-player").load();
                document.getElementById("youtube-player").play();
                while(obj.title.indexOf("+") != -1) {
                    obj.title = obj.title.replace("+", " ");
                };
                while(obj.description.indexOf("\n") != -1) {
                    obj.description = obj.description.replace("\n", "<br/>");
                };
                while(obj.description.indexOf("+") != -1) {
                    obj.description = obj.description.replace("+", " ");
                };
                while(playerResponse.videoDetails.author.indexOf("+") != -1) {
                    playerResponse.videoDetails.author = playerResponse.videoDetails.author.replace("+", " ");
                };
                document.title = obj.title;
                document.getElementById("title").innerHTML = "<h2>" + obj.title + "</h2>";
                document.getElementById("description").innerHTML = obj.description;
                setMediaSession(obj.title, playerResponse.videoDetails.author);
            }
        }
    }
    fileReader.send(null);
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
            "description": null};
            if  (playerResponse.streamingData.adaptiveFormats[i].signatureCipher != undefined) {
                obj.url = decipher(i);
            }
            else {
                obj.url = playerResponse.streamingData.adaptiveFormats[i].url;
            };
            obj.type = playerResponse.streamingData.adaptiveFormats[i].mimeType;
            obj.title =  playerResponse.videoDetails.title;
            obj.description = playerResponse.videoDetails.shortDescription;
            return obj;
        };
    };
}

function setMediaSession(videoTitle, videoAuthor) {
    for(i = 0; i < playerResponse.videoDetails.thumbnail.thumbnails.length; i++) {
        thumbnail[i] = {};
        thumbnail[i].src = playerResponse.videoDetails.thumbnail.thumbnails[i].url;
        thumbnail[i].sizes = playerResponse.videoDetails.thumbnail.thumbnails[i].width + 'x' + 
                             playerResponse.videoDetails.thumbnail.thumbnails[i].height;
        thumbnail[i].type = 'image/jpg';
    };
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: videoTitle,
          artist: videoAuthor,
          album: '',
          artwork: thumbnail
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
        /*navigator.mediaSession.setActionHandler('previoustrack', function() {});
        navigator.mediaSession.setActionHandler('nexttrack', function() {});*/
      }
}