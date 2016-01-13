var util = {
    order_list: function(s, e){
		var gen_order = [];
		for(var c = 0; c < e; c++){
			gen_order.push(c);
		}
		return gen_order;
    },

    unique: function(itm, i, a){
		return i==a.indexOf(itm);
	},

    create_option: function(val, text, myclass, select){
        var option = $('<option></option>');
        option.attr("class", myclass).val(val).html(text).prop("selected", select);
        return option;
    },

    set_slider: function(researcher_period){
        $("#researcher_name").html(researcher_period[2]);
        DBLP_researcher = researcher_period[2];
        ga('send', 'event', "researcher", "search", DBLP_researcher);
        
        var slider = $("#period_slider").data("ionRangeSlider");
        // Call sliders update method with any params
        slider.update({
            min: researcher_period[0],
            max: researcher_period[1],
            from: researcher_period[0],
            to: researcher_period[1],
            // type: 'double',
            // step: 1,
            // min_interval: 3
        });
        $("#detail").show();
        $("#progress").hide();
        // $("#no_preview").show();
        $("#tree_result").hide();
        $("#draw_tree").removeAttr("disabled");
    },

    /*
    set_events: function(){
        // for general events        
        var save = $('#save_icon');
        var tree_anim = $('#tree_anim');
        var tree_pic = $('#tree_pic');
        var tree_pause = $('#tree_pause');
        var tree_backward = $('#tree_backward');
        var tree_forward = $('#tree_forward');

        var selectors = [$("#tree1_select"), $("#tree2_select"), $("#tree3_select"), $("#tree4_select")];
        
        save.click(function(){
            var save_link = "#" + view_ego + "_save";
            $(save_link)[0].click();
        });

        save.hover(function(){
            save.css("cursor", "pointer");
        });

        save.mouseout(function(){
            save.css("cursor", "");
        });

        tree_anim.click(function(){
            $("#tree_backward").removeAttr("disabled");
            $("#tree_forward").removeAttr("disabled");
            // highlight_list["selected"] = "None";
            anim.highlight_choose = 0;
            anim.backword = 0;
            anim.forward = 0;
            anim.anim_render(view_ego, anim.current_idx);
        });

        tree_pic.click(function(){
            // highlight_list["selected"] = "None"; // trigger selector change!!!
            anim.highlight_choose = 0;
            anim.static_img(view_ego);
        });

        tree_pause.click(function(){
            // highlight_list["selected"] = "None";
            anim.highlight_choose = 0;
            clearInterval(anim.timer);
        });

        tree_backward.click(function(){
            $("#tree_forward").removeAttr("disabled");
            anim.backword = 1;
            anim.forward = 0;
            anim.current_idx -= 1;
            anim.anim_render(view_ego, anim.current_idx);
        });

        tree_forward.click(function(){
            $("#tree_backward").removeAttr("disabled");
            if(anim.backword != 1){
                anim.current_idx += 1;
            }
            anim.forward = 1;
            anim.backword = 0;
            anim.anim_render(view_ego, anim.current_idx);
        });

        for(var i = 0; i < 4; i++){
            selectors[i].change(function(){
                //$('.btn-group').attr("disabled", true);
                highlight_list["selected"] = this.value;
                anim.highlight_choose = 1;
                if(this.value != 'None')
                    anim.fadeout = 0.5;
                else
                    anim.fadeout = 1;
                anim.highlight_img(view_ego);
            });
        }
    },
    */

    set_highlight_list: function(){
        var tree1_selection = $('#tree1_select');
        var tree2_selection = $('#tree2_select');
        var tree3_selection = $('#tree3_select');
        var tree4_selection = $('#tree4_select');
        
        $(".highlight_selector").empty();

        for(var a=0; a < highlight_list["authors"].length; a++){
            var author_name = highlight_list["authors"][a];
            var opt1 = $('<option></option>');
            opt1.val(author_name).html(author_name);

            var opt2 = $('<option></option>');
            opt2.val(author_name).html(author_name);
            
            tree1_selection.append(opt1);
            tree2_selection.append(opt2);
        }

        for(var p=0; p < highlight_list["papers"].length; p++){
            var paper_title = highlight_list["papers"][p];
            var opt3 = $('<option></option>');
            opt3.val(paper_title).html(paper_title);
            var opt4 = $('<option></option>');
            opt4.val(paper_title).html(paper_title);
            
            tree3_selection.append(opt3);
            tree4_selection.append(opt4);
        }
    }

};


var tree_util = {
    fadeout: 1,
    
    tree_fruit: function(ctx, posx, posy, r){
        ctx.globalAlpha = this.fadeout;
        ctx.fillStyle = mapping_color.fruit;//fill color
        // ctx.strokeStyle = mapping_color.fruit;;//line's color
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ED3C3C';
        ctx.beginPath();
        var cx = posx;
        var cy = posy;
        var radius = r;
        // this.circle(ctx, cx, cy, radius);
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 8;
        ctx.globalAlpha = 1;
    },


    leaf_style: function(ctx, cx, cy, angle, radius, color) {
        ctx.globalAlpha = this.fadeout;
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = mapping_color.leaf_stork;//line's color
        ctx.fillStyle = color;

        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
                
        ctx.quadraticCurveTo(radius, radius, radius*2.5, 0);
        ctx.quadraticCurveTo(radius, -radius, 0, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 1;
    },

    leaf_highlight_style: function(ctx, cx, cy, angle, radius, color, blinking) {
        ctx.save();
        ctx.lineWidth = 10;
        if(blinking == 0)
            ctx.strokeStyle = "#FFF80F";//yellow color
        else
            ctx.strokeStyle = "#ACA977";//dark's color
       
        ctx.fillStyle = color;
        
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);

        radius = 50; //*=2

        ctx.quadraticCurveTo(radius, radius, radius*2.5, 0);
        ctx.quadraticCurveTo(radius, -radius, 0, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
    },

    draw_highlight_leaf: function(ego, blinking){
        var selected_leaves = tree_points[ego]["all_leaves"][highlight_list["selected"]];
        var context =  drawing_canvas.anim_canvas.getContext('2d');
        context.restore();
        // highlight leaves
        for(var i = 0, len = selected_leaves.length; i < len; i += 5){
            tree_util.leaf_highlight_style(context,
                                           selected_leaves[i],
                                           selected_leaves[i+1],
                                           selected_leaves[i+2],
                                           selected_leaves[i+3],
                                           selected_leaves[i+4], 
                                           blinking);
        }
    },

    set_anim_canvas: function(ego_id, alters){
        img_id = "#" + ego_id;
        // var anim_id = img_id + "_anim";
        // var cnt_id = img_id + "_cnt";
        // var pic_id = img_id + "_pic";
        // console.log("total_alters", alters);
        var anim_cnt_h = $("#anim_container").height();
        var anim_cnt_w = $("#anim_container").height() * ($(img_id).width()/$(img_id).height());

        if (anim_cnt_w > $("#anim_container").width()){
            anim_cnt_w = $("#anim_container").width();
            anim_cnt_h = $("#anim_container").width() * ($(img_id).height()/$(img_id).width());
        }

        var snap_scale = 1;
        var snap_width = tree_boundary[img_id.slice(1, 6)][0];
        var snap_height = tree_boundary[img_id.slice(1, 6)][1];
        // var anim_cnt_w = $(window).width()-100;
        // var anim_cnt_h = $(window).height()-100;
        
        if(snap_width > anim_cnt_w || snap_height > anim_cnt_h){
            while(snap_width*snap_scale > anim_cnt_w || snap_height*snap_scale > anim_cnt_h){
                snap_scale = Math.round((snap_scale-0.001)*1000)/1000;
            }
        }
        else{
            snap_scale = 10;
            while(snap_width*snap_scale > anim_cnt_w || snap_height*snap_scale > anim_cnt_h){
                snap_scale = Math.round((snap_scale-0.001)*1000)/1000;
            }
        }

        tree_snap_scale[img_id.slice(1, 6)] = snap_scale;

        // if(ego_id == view_ego){
        //     anim.static_img(view_ego);
        // }
    }
};

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2)) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2)) + "px");
    return this;
};
