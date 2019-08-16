$(function () {
    $(".scmUser").click(function(){
        $(".scmUserTip").toggle();
    });
    $(".sideNavSwitch").mousemove(function(){
        $("#scmSidebar").animate({left:'10px'});
    });
    $(".scmSBReturn").click(function(){
        $("#scmSidebar").animate({left:'-300px'});
    });

});
