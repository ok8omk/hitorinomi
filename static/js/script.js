$(function() {
  
  // Peer object
  const peer = new Peer({
    key:   window.__SKYWAY_KEY__,
    debug: 3,
  });

  let localStream;
  let room;
  peer.on('open', () => {
    $('input:hidden[name="peerId"]').val(peer.id);
  });

  // call: リモートのpeerが自分に発信してきたときに発生
  peer.on('call', (call) => {
    //  mediaConnectionをアクティブにするための最初の応答
    call.answer(window.localStream);
    step3(call);
  });

  $('#enter').on('click', function(){

    $("form").submit();

    $("#post_page").hide();
    $("#chat_page").show();

    // 第一引数で指定したPeerIDへ発信　mediaconnectionを返す
    var call = peer.call($('input:hidden[name="peerId"]').val(), window.localStream);
    step3(call);

  });

  step1();
});


// audiom, videoの準備
function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true},function(stream) {
  // Set your video displays
  $('#my-video').prop('src', URL.createObjectURL(stream));
  window.localStream = stream;
  step2();}, function(){$('#step1-error').show();});
}


// 受け取ったstreamを表示
function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  // UI stuff
  window.existingCall = call;
  $('#their-id').text(call.peer);
  call.on('close', step2);
}

