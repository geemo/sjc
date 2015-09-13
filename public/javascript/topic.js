$(function(){
    var pageNumber = 1;
    $('#show-more').click(function(){
        ++pageNumber;
        var showMoreBtn = $(this);
        var topicList = $('#topic-list');
        showMoreBtn.attr('disabled', 'true');

        $.get(ROOT_URL+'/topic/show_more?order='+$(this).attr('order')+'&pageNumber='+pageNumber, function(topics){
            if(topics.length > 0){
                topics.forEach(function(topic){
                    topicList.append('<a href="'+ROOT_URL+'/topic_show?postid='+topic._id+'" class="list-group-item"><h4 class="list-group-item-heading">'
                        +topic.title+'</h4><p class="list-group-item-text"><span>'+topic.nickname+'</span><span style="float:right">'+topic.answerNum+'回/'
                        +topic.readNum+'阅/'+topic.date+'</span></p></a>');
                });
                showMoreBtn.removeAttr('disabled');
            } else {
                showMoreBtn.text('没有更多了');
                showMoreBtn.attr('disabled', 'true');
            }
        });
    });
});