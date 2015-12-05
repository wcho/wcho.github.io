function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

var mediaOptions = {
    audio: getQueryVariable('noaudio') === false,
    video: getQueryVariable('novideo') === false
};
var nick = getQueryVariable('nick') || 'anonymous';
var debug = getQueryVariable('debug') !== false;
var local = getQueryVariable('local') !== false;
console.log('opts', mediaOptions, nick);

var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: local ? 'local' : '',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: debug,
    media: mediaOptions,
    nick: nick
});
var joined = false;
// we have to wait until it's ready
webrtc.on('readyToCall', function () {
    // you can name it anything
    console.log('readyToCall', webrtc);
    if (!joined) {
        joined = true;
        webrtc.joinRoom('wsdk');
    }
});

webrtc.on('createdPeer', function (peer) {
    console.log('createdPeer', peer.nick, peer);
});

webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer.nick, peer);
    if (peer.nick) {
        var remotes = document.getElementById('remotes');
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'container_' + webrtc.getDomId(peer);
        var nick = document.createElement('span');
        nick.innerHTML = peer.nick || 'me';
        d.appendChild(nick);
        d.appendChild(video);
        remotes.appendChild(d);
    }
});

webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed', peer.nick, peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes && el) {
        remotes.removeChild(el);
    }
});
webrtc.webrtc.on('hello', function () {
    console.log('msg hello');
});
