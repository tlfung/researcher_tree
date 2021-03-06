window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame              ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame         ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout;
} )();

var MyApp = function MyApp(){
    var self = this;

    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
    
    // init models
    this.model = new Tree_Model();
    $(window).scrollTop(0);
    // set slider bar
    $("#period_slider").ionRangeSlider({
        min: 1990, 
        max: 2015,
        from: 1990, 
        to: 2015,
        type: 'double',
        step: 1,
        min_interval: 4,
        onChange: function(obj) {
            $("#draw_tree").removeAttr("disabled");
            $('#nodelink').attr("disabled", true);
        }
    });

    // update display container size
    $("#system_page").css({'height': $(window).height()-23-$("#header").height()-$("#footer").height()});
    $("#tree_result").css({'height': $("#system_page").height()});
    $(".thumb_cnt").css({'height': $("#tree_result").height()});
    $(".thumb_cnt").css({'width': ($("#result").width()*0.99)*2/12});
    $(".snap_view").css({'height': $(".snap_view").width()+20});
    $("#anim_container").css({'height': $("#tree_result").height()});
    $("#anim_container").css({'width': ($("#result").width()*0.99)*7/12});
    $("#mapping_container").css({'width': ($("#result").width()*0.99)*3/12-15});
    
    $("#click_info").css({'max-height': $("#system_page").height()-390});
    $("#click_info").css({'overflow-y': 'auto'});
    $("#click_info").css({'overflow-x': 'hidden'});
    $("#candidates").css({'max-height': $("#system_page").height()-150});
    $("#candidates").css({'overflow-y': 'auto'});
    $("#candidates").css({'overflow-x': 'hidden'});

    $("#system_page").hide();
    // $("#example").css({'height': window.innerHeight});
    $("#main_display").css({'min-height': $(window).innerHeight()-43-$("#header").height()-$("#footer").height()});
    $("#help_page").css({'height': window.innerHeight, 'width': window.innerWidth});

    // $("#anim_container").css({'width': $("#tree_cnt").width()-10});
    window.onresize = function(event) {
        $("#main_display").css({'min-height': $(window).height()-23-$("#header").height()-$("#footer").height()});
        $("#system_page").css({'height': $(window).height()-23-$("#header").height()-$("#footer").height()});
        $("#tree_result").css({'height': $("#system_page").height()});
        $(".thumb_cnt").css({'height': $("#tree_result").height()});
        $(".thumb_cnt").css({'width': ($("#tree_result").width()*0.99)*2/12});
        $(".snap_view").css({'height': $(".snap_view").width()+15});
        $("#anim_container").css({'height': $("#tree_result").height()});
        $("#anim_container").css({'width': ($("#tree_result").width()*0.99)*7/12});
        $("#mapping_container").css({'width': ($("#tree_result").width()*0.99)*3/12-15});

        $("#click_info").css({'max-height': $("#system_page").height()-390});
        $("#click_info").css({'overflow-y': 'auto'});
        $("#click_info").css({'overflow-x': 'hidden'});
        $("#candidates").css({'max-height': $("#system_page").height()-150});
        $("#candidates").css({'overflow-y': 'auto'});
        $("#candidates").css({'overflow-x': 'hidden'});

        $("#help_page").css({'height': window.innerHeight, 'width': window.innerWidth});
        for(var e in tree_egos){
            // var img_id = "#" + e;
            tree_util.set_anim_canvas(e);
        }
        self.model.trigger('change:current_ego');
    };

    // $('.popup-link').magnificPopup({
    //     type: 'image'
    //     // other options
    // });

    var retrieve = $('#check_url');
    var finish = $('#draw_tree');
    var start = $('#start_btn');
    var search = $('#search_name');
    var graph = $('#nodelink');
    var tutorial = $('.tutorial');
    var helps = $('#help_page');
    var el_slide = $('#help_slide');
    var el_slide_next = $('#slide_next');
    var el_slide_previous = $('#slide_previous'); 
    
    tutorial.click(function(){
        console.log("in tutorial");
        helps.show();        
        if(el_slide.height() > $(window).height()){
            el_slide.removeAttr("width");
            el_slide.attr("height", "90%");
        } 
        el_slide.center();

    });

    // for slides
    el_slide_next.click(function(){
        var num_slide =  parseInt(el_slide.attr('value'));
        if(num_slide < 16){
            el_slide.attr('src', 'media/img/help/p' + (num_slide+1) +'.png');
            el_slide.attr('value', (num_slide+1)); 
        }
        else{
            helps.hide();
        }
        return false;
    });

    el_slide_previous.click(function(){
        var num_slide =  parseInt(el_slide.attr('value'));
        if(num_slide > 1){
            el_slide.attr('src', 'media/img/help/p' + (num_slide-1) +'.png');
            el_slide.attr('value', (num_slide-1)); 
        }
        return false;
    });

    helps.click(function(){
        helps.hide();
    });

    el_slide.click(function(){
        var num_slide =  parseInt(el_slide.attr('value'));
        if(num_slide < 16){
            el_slide.attr('src', 'media/img/help/p' + (num_slide+1) +'.png');
            el_slide.attr('value', (num_slide+1)); 
        }
        else{
            helps.hide();
        }
        return false;
    });

    start.click(function(){
        console.log("click start");
        $('body').css('background-image', 'none');
        $('#help_link').show();
        $('#help_slide').attr('value', '1');
        $('#help_slide').attr('src', 'media/img/help/p1.png');
        $("#system_page").show();
        $("#search_engine").show();
        $("#start_page").hide();
        $('#anim_panel').hide();
        $('#highlight_panel').hide();
    });

    retrieve.click(function(){
        console.log("click search");
        var resercher = $("#dblp_url").val();
        self.model.check_researcher(resercher);
        $("#progress").show();
        $("#detail").hide();
        $("#tree_result").hide();
        $('#anim_panel').hide();
        $('#highlight_panel').hide();
        graph.attr("disabled", true);
    });

    search.click(function(){
        console.log("click search");
        var resercher = $("#scholar").val();
        // var dblp_url = "http://dblp.uni-trier.de/pers/hd/";
        // var dblp_url = "http://dblp.uni-trier.de/search?q=" + encodeURIComponent(resercher);
        var dblp_url = "http://dblp.uni-trier.de/search/author?q=" + encodeURIComponent(resercher);
        
        self.model.search_researcher(dblp_url);
        $("#progress").show();
        $("#detail").hide();
        $("#tree_result").hide();
        $('#anim_panel').hide();
        $('#highlight_panel').hide();
        // $("#other_design").hide();
        graph.attr("disabled", true);
    });

    graph.click(function(){
        console.log("click nodelink link");
        // window.open('media/html/forcedirect.html', '_blank');
        $('#graph_cnt').show();

    });

    $('#remove_graph').click(function(){
        $('#graph_cnt').hide();
        return false;
    });

    $('#remove_graph').hover(function(){
        $('#remove_graph').show();
        return false;
    });

    finish.click(function(){
        console.log("click finish");
        finish.attr("disabled", true);
        // graph.removeAttr("disabled");
        // $("#other_design").show();
        $("#feedback").removeAttr("disabled");
        $("#more").removeAttr("disabled");
        $("#loading").show();
        $("#tree_result").hide();
        $("#tree1_cnt")[0].click();

        var slider = $("#period_slider").data("ionRangeSlider");
        // var resercher = $("#dblp_url").val();
        var resercher = DBLP_url;
        sy = slider.result.from;
        ey = slider.result.to;
        var gap = ey - sy + 1;
        var max_gap = Math.ceil(gap/3);
        if (gap <= 10)
            gap = 1
        else if (10 < gap && gap <= 20)
            gap = 2
        else if (20 < gap && gap <= 30)
            gap = 3
        else if (30 < gap && gap <= 40)
            gap = 4
        else if (40 < gap && gap <= 50)
            gap = 5
        else
            gap = 6

        util.set_gap_list(gap, max_gap);
        util.set_default_scale();
        $("#block_page").hide();
        $("#updating").hide();

        // ga('send', 'event', DBLP_researcher, "render", "start_year", sy);
        // ga('send', 'event', DBLP_researcher, "render", "end_year", ey);
        ga('send', 'event', unique_search, "create", sy + "-" + ey, sy-ey+1);

        var request_array = [resercher, sy, ey, timeline, user_ip];
        var request = JSON.stringify(request_array);

        self.model.generate_tree_structure(request);   
    });


    // open the dialog
    $( "#survey_dialog" ).dialog({
        autoOpen: false,
        height: 300,
        width: 500,
        modal: true,
        resizable: true
    });

    $( "#feedback" ).click(function() {
        $("#survey_dialog").dialog( "open" );
    });

    $( "#survey" ).click(function() {
        ga('send', 'event', user_ip, "survey");
    });

    
    this.render = new RenderingView({model: this.model, containerID: "#rendering"});
    this.animation = new AnimView({model: this.model, containerID: "#animating"});
    this.draw_tree = new DrawView({model: this.model, containerID: "#drawing"});
    this.interact_tree = new InteractView({model: this.model, containerID: "#drawing"});

    // d3.xml("http://dblp.uni-trier.de/pers/xx/m/Ma:Kwan=Liu.xml", function(error, data) {
    //     if (error) throw error;
    //     // Convert the XML document to an array of objects.
    //     // Note that querySelectorAll returns a NodeList, not a proper Array,
    //     // so we must use map.call to invoke array methods.
    //     console.log(data);
    // });

};

var myApp;
MyApp.getInstance = function() {
    if (myApp == null)
        myApp = new MyApp();
    return myApp;
};

// entry point of the whole js application
$(document).ready(function() {
    MyApp.getInstance();
});
