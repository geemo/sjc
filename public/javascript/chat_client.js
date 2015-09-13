$(function(){
    window.Chat = {
        socket: null,
        username: '',
        nickname: '',
        pageNumber: 1,
        pageCount: 1,
        init: function(){
            Chat.socket = io();
            Chat.username = $('#nickname').attr('username');
            Chat.nickname = $('#nickname').text();

            $('#send-btn').click(function(){
                Chat.sendMessage();
            });
            $('#message-input').keydown(function(e){
                if(e.which === 13){
                    if(Chat.username) Chat.sendMessage();
                    else $('#login').modal('show');
                }
            });
            $('#history-modal').on('show.bs.modal', function(){

                $.get(ROOT_URL+'/chat/history', function(data){
                    var modal_body = $('#history-modal .modal-body');
                    modal_body.empty();
                    data.records.forEach(function(record){
                        modal_body.append('<p style="clear:both">'+record.content+
                            '</p><span class="right">'+record.nickname+' / '+
                            record.date+'</span>');
                    });
                    Chat.pageCount = Math.ceil(data.recordCount / 10);

                    if(Chat.pageCount <= 1){
                        $('#page-footer').hide();
                    } else {
                        $('#page-footer').show();
                        $('#previous').hide();
                        $('#next').show();
                    }
                });
            });
            $('#history-modal').on('hide.bs.modal', function(){

                Chat.pageNumber = 1;
                Chat.pageCount = 1;
            });
            $('#previous').click(function(){
                Chat.pageNumber -= 1;

                $.get(ROOT_URL+'/chat/history?pageNumber='+Chat.pageNumber, function(records){
                    var modal_body = $('#history-modal .modal-body');
                    modal_body.empty();
                    records.forEach(function(record){
                        modal_body.append('<p style="clear:both">'+record.content+
                            '</p><span class="right">'+record.nickname+' / '+
                            record.date+'</span>');
                    });
                });

                $('#next').show();
                if(Chat.pageNumber <= 1){
                    $(this).hide();
                    $('#next').show();
                }
            });
            $('#next').click(function(){
                Chat.pageNumber += 1;

                $.get(ROOT_URL+'/chat/history?pageNumber='+Chat.pageNumber, function(records){
                    var modal_body = $('#history-modal .modal-body');
                    modal_body.empty();
                    records.forEach(function(record){
                        modal_body.append('<p style="clear:both">'+record.content+
                            '</p><span class="right">'+record.nickname+' / '+
                            record.date+'</span>');
                    });
                });

                $('#previous').show();
                if(Chat.pageNumber >= Chat.pageCount){
                    $(this).hide();
                    $('#previous').show();
                }
            });
            Chat.socket.on('message', function(message){
                Chat.displayMessage(message);
            });
            Chat.socket.on('join', function(){
                $('#chat-box').append('<div class="info-tip">禽兽来了</div>');
                Chat.scrollToBottom();
            });
            Chat.socket.on('left', function(){
                $('#chat-box').append('<div class="info-tip">屌丝走了</div>');
                Chat.scrollToBottom();
            });

            Chat.showTime();
            setInterval(function(){
                Chat.showTime();
                Chat.scrollToBottom();
            }, 300000);
        },
        sendMessage: function(){
            var messageInput = document.getElementById('message-input');
            if(messageInput.value === ''){
                messageInput.placeholder = '发送数据不能为空!';
            }else{
                var message = {
                    username: Chat.username,
                    nickname: Chat.nickname,
                    content: messageInput.value
                };

                Chat.socket.emit('message', message);
                messageInput.value = '';
                messageInput.focus();
            }
        },
        displayMessage: function(message){
            var isme = (message.username === Chat.username) ? true : false;
            if(isme){
                $('#chat-box').append('<div class="header right"><a href="/user?username='+message.username+'">'+message.nickname
                    +'</a></div><div class="msg-box right"><span class="arrow-right-top"></span>'
                    +message.content+'</div>');
            }else{
                $('#chat-box').append('<div class="header left"><a href="/user?username='+message.username+'">'+message.nickname
                    +'</a></div><div class="msg-box left"><span class="arrow-left-top"></span>'
                    +message.content+'</div>');
            }
            Chat.scrollToBottom();
        },
        scrollToBottom: function(){
            window.scrollTo(0, 9999999);
        },
        showTime: function(){
            $('#chat-box').append('<div class="info-tip">' + (new Date()).toLocaleTimeString() + '</div>');
        }

    };

    Chat.init();
});