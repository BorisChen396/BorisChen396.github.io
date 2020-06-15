var video_id = "";
var file = ""
var fileContent = "null";
var playerResponse;
var fileReader = new XMLHttpRequest();

function main() {
    var link = document.getElementById("video-id").value;
    if(link.indexOf("youtu.be") != -1) {
        link = ((link.split("/"))[1].split("&"))[0];
    }
    else {
        link = ((link.split("v="))[1].split("&"))[0];
    };
    video_id = link;
    file = "https://cors-anywhere.herokuapp.com/https://www.youtube.com/get_video_info?eurl=" + 
            encodeURIComponent(window.location) + "&sts=18421&video_id=" + video_id;
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
                document.title = obj.title;
                document.getElementById("output").innerHTML = "<h2>" + obj.title + "</h2>" + "<br/>" + obj.description;
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