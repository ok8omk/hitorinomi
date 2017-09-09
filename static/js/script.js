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

    $("#post_page").hide();
    $("#chat_page").show();

    $.ajax({
      // リクエストメソッド(GET,POST,PUT,DELETEなど)
      type: 'POST',
      // リクエストURL
      url: '/match',
      // タイムアウト(ミリ秒)
      timeout: 10000,
      // キャッシュするかどうか
      cache: false,
      // サーバに送信するデータ(name: value)
      data: {
        'peerId': peer.id,
        'type': $("input:radio[name='group1']:checked").val()
      },
      // レスポンスを受け取る際のMIMEタイプ(html,json,jsonp,text,xml,script)
      // レスポンスが適切なContentTypeを返していれば自動判別します。
      dataType: 'text',
      // Ajax通信前処理
      beforeSend: function(jqXHR) {
        // falseを返すと処理を中断
        return true;
      },
      // コールバックにthisで参照させる要素(DOMなど)
      context: domobject
    }).done(function(response, textStatus, jqXHR) {
        // 成功時処理
        //レスポンスデータはパースされた上でresponseに渡される
         // 第一引数で指定したPeerIDへ発信　mediaconnectionを返す
      var call = peer.call(response, window.localStream);
      step3(call);
    }).fail(function(jqXHR, textStatus, errorThrown ) {
        // 失敗時処理
    }).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
        // doneまたはfail実行後の共通処理
    });

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

