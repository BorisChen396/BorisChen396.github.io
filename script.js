var cors_proxy = "https://cors-anywhere.herokuapp.com/";
var video_id = "";
var file = ""
var fileContent = "null";
var playerResponse;
var fileReader = new XMLHttpRequest();
var thumbnail = [];

function main() {
    var link = document.getElementById("video-id").value;
    if(link.indexOf("youtu.be") != -1) {
        link = ((link.split("/"))[1].split("&"))[0];
    }
    else {
        link = ((link.split("v="))[1].split("&"))[0];
    };
    video_id = link;
    file = cors_proxy + "https://www.youtube.com/get_video_info?eurl=" + encodeURIComponent(window.location) + "&sts=18421&video_id=" + video_id;
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
                document.getElementById("output").innerHTML = "<h2>" + obj.title + "</h2>" + "<br/>" + obj.description;
                setMediaSession(obj.title, playerResponse.videoDetails.author);
            }
        }
    }
    fileReader.send(null);
}

function download() {
    document.getElementById("receive-data").src = "https://www.youtube.com/get_video_info?video_id=Cy1wYBFkakI";
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
            if  (playerResponse.streamingData.adaptiveFormats[i].signatureCipher != undefined ||
                 playerResponse.streamingData.adaptiveFormats[i].url == undefined) {
                     alert("無法解析已加密影片");
                     return -1;
                 };
            var obj = {"url": playerResponse.streamingData.adaptiveFormats[i].url, 
            "type": playerResponse.streamingData.adaptiveFormats[i].mimeType,
            "title": playerResponse.videoDetails.title,
            "description": playerResponse.videoDetails.shortDescription};
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
    console.log(thumbnail);
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