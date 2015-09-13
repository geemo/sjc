$(function(){
    var pageNumber = 1;
    $('#show-more-topic').click(function(){
        ++pageNumber;
        var showMoreBtn = $(this);
        var topicList = $('#topic-list');
        showMoreBtn.attr('disabled', 'true');

        $.get(ROOT_URL+'/user/show_more_topic?username='+topicList.attr('username')+'&pageNumber='+pageNumber, function(topics){
            if(topics.length > 0){
                topics.forEach(function(topic){
                    topicList.append('<a href="'+ROOT_URL+'/topic_show?postid='+topic._id+'" class="list-group-item">'+topic.title+'</a>');
                });
                showMoreBtn.removeAttr('disabled');
            } else {
                showMoreBtn.text('没有更多了');
                showMoreBtn.attr('disabled', 'true');
            }
        });
    });

    $('#show-more-comment').click(function(){
        ++pageNumber;
        var showMoreBtn = $(this);
        var commentList = $('#comment-list');
        showMoreBtn.attr('disabled', 'true');

        $.get(ROOT_URL+'/user/show_more_comment?username='+commentList.attr('username')+'&pageNumber='+pageNumber, function(comments){
            if(comments.length > 0){
                comments.forEach(function(comment){
                    commentList.append('<a href="'+ROOT_URL+'/topic_show?postid='+comment.topicid+'" class="list-group-item">'+comment.content+'</a>');
                });
                showMoreBtn.removeAttr('disabled');
            } else {
                showMoreBtn.text('没有更多了');
                showMoreBtn.attr('disabled', 'true');
            }
        });
    });

    $('#btn-modify').click(function(){

        if(!$('#nickname-modify').val()){
            $('#tip-modify').text('昵称不能为空!');
        }else if($('#pwd-modify').val() && $('#pwd-modify').val().length < 6){
            $('#tip-modify').text('密码长度为6-12位!');
        }else{
            var nickname = $('#nickname-modify').val();
            $.post(ROOT_URL+'/user', {
                'nickname': nickname,
                'sign': $('#sign-modify').val(),
                'pwd': $('#pwd-modify').val()
            }, function(data){
                $('#nickname').text(nickname);
                $('#tip-modify').css('color','green');
                $('#tip-modify').text('修改成功!');
            })
        }
    });
});