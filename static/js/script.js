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

  $('#enter').on('click', function(){

  

  });
});


