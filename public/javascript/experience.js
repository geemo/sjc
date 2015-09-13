var zanFunc = function(that){
    var temp = $(that).children('span');
    temp.text(+temp.text()+1);
    $(that).attr('disabled', 'disabled');
    $.get(ROOT_URL+'/action?action=0&id='+that.parentNode.id);
};
var kenFunc = function(that){
    var temp = $(that).children('span');
    temp.text(+temp.text()+1);
    $(that).attr('disabled', 'disabled');
    $.get(ROOT_URL+'/action?action=1&id='+that.parentNode.id);
};
$(function(){
    var pageNumber = 1;
    $('#show-more').click(function(){
        ++pageNumber;
        var showMoreBtn = $(this);
        var jockList = $('#jock-list');
        $.get(ROOT_URL+'/experience/show_more?order='+showMoreBtn.attr('order')+'&pageNumber='+pageNumber, function(experiences){
            if(experiences.length > 0){
                experiences.forEach(function(experience){
                    jockList.append('<div class="list-group-item"><p>'
                        +experience.question+'</p><p>神回复: '
                        +experience.answer+'</p><div id="'+experience._id
                        +'"><span class="zan btn btn-default btn-xs" onclick="zanFunc(this)">赞(<span>'
                        +experience.zan+'</span>)</span><span class="ken btn btn-default btn-xs" onclick="kenFunc(this)">坑(<span>'
                        +experience.ken+'</span>)</span><span class="pull-right">'+experience.date+'</span></div></div>');
                });
                showMoreBtn.removeAttr('disabled');
                showMoreBtn.text('显示更多+');
            } else {
                showMoreBtn.attr('disabled', 'true');
                showMoreBtn.text('没有更多了');
            }
        });
        showMoreBtn.attr('disabled', 'true');
        showMoreBtn.text('正在加载...');
    });
});