var anim = {
	timer: null,
	forward: 0,
	backword: 0,
	tree_height: 0,
	current_idx: 0,
	blinking_timer: null,
	blinking: 0,
    fadeout: 1,
    highlight_choose: 0,

    generate_frames: function(ego){
        var amin_frame = [];
        
        for(layer in tree_points[ego]){
        	if(layer == "all_leaves")
        		continue;
        	var obj_trunk = {"type":"trunk", "pos":{"left":[], "right":[]}};
        	obj_trunk["pos"]["left"] = tree_points[ego][layer]["left"]["trunk"];
        	obj_trunk["pos"]["right"] = tree_points[ego][layer]["right"]["trunk"];
        	amin_frame.push(obj_trunk);
			// draw sticks
            var finish_mark_left = 0;
            var finish_mark_right = 0;
            var len = tree_points[ego][layer]["left"]["sticks"].length;
            if(tree_points[ego][layer]["right"]["sticks"].length > len)
            	len = tree_points[ego][layer]["right"]["sticks"].length;

            for(var s = 0; s < len; s += 24){ // set time interval
            	var obj_sticks = {"type":"sticks", "pos":[]};
            	for(var i = s; i < s+24; i += 8){ 
	            	if(finish_mark_left != 1){
	            		if(tree_points[ego][layer]["left"]["sticks"].length < i || tree_points[ego][layer]["left"]["sticks"][i] == "end")
	            			finish_mark_left = 1;
	            	}
	            	if(finish_mark_right != 1){
	            		if(tree_points[ego][layer]["right"]["sticks"].length < i || tree_points[ego][layer]["right"]["sticks"][i] == "end")
	            			finish_mark_right = 1;
	            	}

	            	if(finish_mark_right == 1 && finish_mark_left == 1)
	            		break;

	            	if(finish_mark_left != 1 && tree_points[ego][layer]["left"]["sticks"][i] != "none"){
	            		for(var j = i; j < i+8; j ++){
	            			obj_sticks["pos"].push(tree_points[ego][layer]["left"]["sticks"][j]);
	            		}
	            	}
	            	
	            	if(finish_mark_right != 1 && tree_points[ego][layer]["right"]["sticks"][i] != "none"){
	            		for(var j = i; j < i+8; j ++){
	            			obj_sticks["pos"].push(tree_points[ego][layer]["right"]["sticks"][j]);
	            		}
	            	}
            	}
            	amin_frame.push(obj_sticks);                 
            }

            var obj_fruits = {"type":"fruit", "pos":[]};
            for(var i = 0, len = tree_points[ego][layer]["fruit"].length; i < len; i++)
        		obj_fruits["pos"].push(tree_points[ego][layer]["fruit"][i]);
        	amin_frame.push(obj_fruits);

            for(var order in tree_points[ego][layer]["leaf"]){
	        	for(var i = 0, len = tree_points[ego][layer]["leaf"][order].length; i < len; i += 24){
	            	var obj_leaf = {"type":"leaf", "pos":[]};
	            	var sub_len = i+24;
	            	if(sub_len > len)
	            		sub_len = len;
		        	for(var j = i; j < sub_len; j ++){
		        		obj_leaf["pos"].push(tree_points[ego][layer]["leaf"][order][j]);
		        	}
		        	amin_frame.push(obj_leaf);
		        }
	        }

            /*
            var obj_leaf = {"type":"leaf", "pos":[]};
        	for(var i = 0, len = tree_points[ego][layer]["leaf"].length; i < len; i++)
        		obj_leaf["pos"].push(tree_points[ego][layer]["leaf"][i]);
        	amin_frame.push(obj_leaf);
	        
	        var obj_fruits = {"type":"fruit", "pos":[]};
            for(var i = 0, len = tree_points[ego][layer]["fruit"].length; i < len; i++)
        		obj_fruits["pos"].push(tree_points[ego][layer]["fruit"][i]);
        	amin_frame.push(obj_fruits);
        	*/

            /*
            for(var i = 0, len = tree_points[ego][layer]["leaf"].length; i < len; i += 20){
            	var obj_leaf = {"type":"leaf", "pos":[]};
	        	for(var j = i; j < i+20; j ++)
	        		obj_leaf["pos"].push(tree_points[ego][layer]["leaf"][j]);
	        	amin_frame.push(obj_leaf);
	        }

	        
            for(var i = 0, len = tree_points[ego][layer]["fruit"].length; i < len; i += 6){
            	var obj_fruits = {"type":"fruit", "pos":[]};
	        	for(var j = i; j < i+6; j ++)
	        		obj_fruits["pos"].push(tree_points[ego][layer]["fruit"][j]);
	        	amin_frame.push(obj_fruits);
	        }
	        */	        
        }

        tree_amin_frame[ego] = amin_frame;
    },

    anim_render: function(ego, idx){
        clearInterval(this.blinking_timer);
    	var amin_frame = tree_amin_frame[ego];
    	var context =  drawing_canvas.anim_canvas.getContext('2d');

        context.lineWidth = 5; // set the style

        context.setTransform(1, 0, 0, 1, 0, 0);
        if(idx == 0 || this.backword == 1){
        	context.clearRect(0, 0, drawing_canvas.anim_canvas.width, drawing_canvas.anim_canvas.height);
        	// context.save();
	        drawing_canvas.anim_canvas.height = $("#anim_tree").height() - 10;
	        drawing_canvas.anim_canvas.width = $("#anim_tree").width() - 10;
	    }

        context.translate(0.5, 0.5);
        context.scale(tree_snap_scale[ego], tree_snap_scale[ego]);

    	function draw_trunk(points) {
        	if(points.length == 18){
        		context.moveTo(points[0], points[1]);
        		context.quadraticCurveTo(points[2], points[3], points[4], points[5]);
        		context.quadraticCurveTo(points[6], points[7], points[8], points[9]);
        		context.closePath();
        		context.moveTo(points[10], points[11]);
        		context.lineTo(points[12], points[13]);
        		context.lineTo(points[14], points[15]);
        		context.lineTo(points[16], points[17]);
        		context.closePath();
        	}
        	else{
        		context.moveTo(points[0], points[1]);
        		context.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
        		context.lineTo(points[8], points[9]);
        		context.bezierCurveTo(points[10], points[11], points[12], points[13], points[14], points[15]);
        		context.closePath();
        		context.moveTo(points[16], points[17]);
        		context.lineTo(points[18], points[19]);
        		context.lineTo(points[20], points[21]);
        		context.lineTo(points[22], points[23]);
        		context.closePath();
        	}
        };

        function draw_sticks(points){
        	for(var i = 0; i < points.length; i += 8){ 
        		context.beginPath();
            	context.moveTo(points[i], points[i+1]);
        		for(var j = i+2; j < i+8; j += 2){
        			if(points[j] != "none"){
        				context.lineTo(points[j], points[j+1]);
        			}
        		}
        		context.closePath();
                context.stroke();//draw line
                context.fill();//fill colo
        	}
        };

    	// var idx = 0;
        // var height = 0;
        if(this.timer != null){
        	clearInterval(this.timer);
        }

        // draw to specific idx
        if(this.backword == 1){
        	if(idx === -1){
				$('#tree_backward').attr("disabled", true);	
				this.current_idx = 0;
				return 0;	
			}
			this.tree_height = 0;
        	for(var f = 0; f < idx; f++){
        		var frame = amin_frame[f];
        		mapping_color.trunk = "rgb(" + (125-(this.tree_height+1)*3).toString() + "," + (96-(this.tree_height+1)*3).toString() + "," + (65-(this.tree_height+1)*3).toString() + ")";
            
				switch(frame["type"]) {
					case 'trunk':
		                context.fillStyle = mapping_color.trunk;
			            context.strokeStyle = mapping_color.trunk;
			            context.lineCap = 'round';
			            context.lineWidth = 5;
			            context.beginPath();

			            draw_trunk(frame["pos"]["left"]);
			            context.stroke();//draw line
			            context.fill();//fill color
			            draw_trunk(frame["pos"]["right"]);
			            context.stroke();//draw line
			            context.fill();//fill color

			            
			            this.tree_height ++;
		                break;
		            case 'sticks':
		                context.fillStyle = mapping_color.trunk;
			            context.strokeStyle = mapping_color.trunk;
			            context.lineCap = 'round';
		                context.lineWidth = 8;

		                draw_sticks(frame["pos"]);

		                break;
		            case 'leaf':
		                for(var i = 0, len = frame["pos"].length; i < len; i += 6){
                            if(frame["pos"][i+5] == highlight_list["selected"])
                                continue;
				        	this.leaf_style(context, frame["pos"][i], frame["pos"][i+1], frame["pos"][i+2], 
		        					   		frame["pos"][i+3], frame["pos"][i+4]);
				        }

		                break;
		            case 'fruit':
		                for(var i = 0, len = frame["pos"].length; i < len; i += 3){
				        	this.tree_fruit(context, frame["pos"][i], frame["pos"][i+1], frame["pos"][i+2]);
				        }
		                
		                break;
		        } // end switch
        	}

        	return 0; 
        }
        
        // for animation playing
        this.timer = setInterval(function (){
			var frame = amin_frame[idx];
						
			if(idx === amin_frame.length){
                if(highlight_list["selected"] != "None" && this.highlight_choose == 0){
                    this.draw_highlight_leaf(ego);
                }
				clearInterval(this.timer);
				$('#tree_forward').attr("disabled", true);
				this.current_idx = amin_frame.length;
			}
			// var action = frame["type"];
			mapping_color.trunk = "rgb(" + (125-(this.tree_height+1)*3).toString() + "," + (96-(this.tree_height+1)*3).toString() + "," + (65-(this.tree_height+1)*3).toString() + ")";
            
			switch(frame["type"]) {
				case 'trunk':
	                context.fillStyle = mapping_color.trunk;
		            context.strokeStyle = mapping_color.trunk;
		            context.lineCap = 'round';
		            context.lineWidth = 5;
		            context.beginPath();

		            draw_trunk(frame["pos"]["left"]);
		            context.stroke();//draw line
		            context.fill();//fill color
		            draw_trunk(frame["pos"]["right"]);
		            context.stroke();//draw line
		            context.fill();//fill color

		            
		            this.tree_height ++;
	                break;
	            case 'sticks':
	                context.fillStyle = mapping_color.trunk;
		            context.strokeStyle = mapping_color.trunk;
		            context.lineCap = 'round';
	                context.lineWidth = 8;

	                draw_sticks(frame["pos"]);

	                break;
	            case 'leaf':
	                for(var i = 0, len = frame["pos"].length; i < len; i += 6){
                        if(frame["pos"][i+5] == highlight_list["selected"])
                            continue;
			        	this.leaf_style(context, frame["pos"][i], frame["pos"][i+1], frame["pos"][i+2], 
	        					   		frame["pos"][i+3], frame["pos"][i+4]);
			        }

	                break;
	            case 'fruit':
	                for(var i = 0, len = frame["pos"].length; i < len; i += 3){
			        	this.tree_fruit(context, frame["pos"][i], frame["pos"][i+1], frame["pos"][i+2]);
			        }
	                
	                break;
	        } // end switch
			
			if(this.forward == 0 && this.backword == 0){
				this.current_idx = idx;
				idx++;
			}
			else
				clearInterval(this.timer);
			
			if(idx === amin_frame.length){
                if(highlight_list["selected"] != "None" && this.highlight_choose == 0){
                    this.draw_highlight_leaf(ego);
                }
				clearInterval(this.timer);
				anim.current_idx = 0;
	            anim.forward = 0;
	            anim.backword = 0;
	            anim.tree_height = 0;
				// context.restore();
			}			
		}.bind(this), 30);
    },

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
        this.circle(ctx, cx, cy, radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 8;
        ctx.globalAlpha = 1;
    },

    circle: function(ctx, cx, cy, radius){
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
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

    leaf_highlight_style: function(ctx, cx, cy, angle, radius, color) {
        ctx.save();
        ctx.lineWidth = 10;
        if(this.blinking == 0)
        	ctx.strokeStyle = "#FFF80F";//line's color
       	else
       		ctx.strokeStyle = "#ACA977";//line's color

        /*
        if(this.highlight_choose == 0){
            ctx.strokeStyle = "#FFF80F";//line's color
            ctx.lineWidth = 20;
        } 
        */
        ctx.fillStyle = color;
        
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);

        // if(this.highlight_choose == 1)
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

    highlight_img: function(ego){
    	this.static_img(ego);
    	if(highlight_list["selected"] == "None" || this.highlight_choose == 0){
    		return;
    	}
    	this.blinking_timer = setInterval(function (){
    		if(this.blinking == 0) this.blinking = 1;
    		else this.blinking = 0;
    		this.draw_highlight_leaf(ego);
    	}.bind(this), 100);    	
    },

    draw_highlight_leaf: function(ego){
    	var selected_leaves = tree_points[ego]["all_leaves"][highlight_list["selected"]];
    	var context =  drawing_canvas.anim_canvas.getContext('2d');
    	context.restore();
    	// highlight leaves
        for(var i = 0, len = selected_leaves.length; i < len; i += 5){
    		this.leaf_highlight_style(context,
			    					  selected_leaves[i],
			    					  selected_leaves[i+1],
			    					  selected_leaves[i+2],
			    					  selected_leaves[i+3],
			    					  selected_leaves[i+4]);
        }
    },

    static_img: function(ego){
    	clearInterval(this.timer);
    	clearInterval(this.blinking_timer);
    	var context =  drawing_canvas.anim_canvas.getContext('2d');
        // console.log(ego, tree_points[ego]);

        context.lineWidth = 5; // set the style

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, drawing_canvas.anim_canvas.width, drawing_canvas.anim_canvas.height);
        context.save();

        drawing_canvas.anim_canvas.height = $("#anim_tree").height() - 10;
        drawing_canvas.anim_canvas.width = $("#anim_tree").width() - 10;

        // var current_trans = this.model.get("canvas_translate");
        context.translate(0.5, 0.5);
        context.scale(tree_snap_scale[ego], tree_snap_scale[ego]);
        var amin_frame = [];

        anim.current_idx = 0;
        anim.forward = 0;
        anim.backword = 0;
        anim.tree_height = 0;
        
        var height = 0;
        var selected_leaves = [];
        var display_text = "";
        $("#highlight_info").hide();
        // this.fadeout = 1;
        if(highlight_list["selected"] != "None"){
        	selected_leaves = tree_points[ego]["all_leaves"][highlight_list["selected"]];
            display_text = "Leaf size: " + selected_leaves[3] + " out of 100 <br> Leaf count: " + (selected_leaves.length/5);
            $("#highlight_info").show();
            $("#highlight_info").html(display_text);
            // if(this.highlight_choose == 1)
            // this.fadeout = 0.5;
        }        
    	
        for(layer in tree_points[ego]){ 
        	if(layer == "all_leaves")
        		continue;
        	mapping_color.trunk = "rgb(" + (125-(height+1)*3).toString() + "," + (96-(height+1)*3).toString() + "," + (65-(height+1)*3).toString() + ")";
            var obj_trunk = {"type":"trunk", "pos":{"left":[], "right":[]}};
        	context.fillStyle = mapping_color.trunk;
            context.strokeStyle = mapping_color.trunk;
            context.lineCap = 'round';
            context.lineWidth = 5;
            context.beginPath();
        	if(tree_points[ego][layer]["left"]["type"] == "nobranch"){
        		context.moveTo(tree_points[ego][layer]["left"]["trunk"][0], tree_points[ego][layer]["left"]["trunk"][1]);
        		context.quadraticCurveTo(tree_points[ego][layer]["left"]["trunk"][2], tree_points[ego][layer]["left"]["trunk"][3], 
        							tree_points[ego][layer]["left"]["trunk"][4], tree_points[ego][layer]["left"]["trunk"][5]);
        		context.quadraticCurveTo(tree_points[ego][layer]["left"]["trunk"][6], tree_points[ego][layer]["left"]["trunk"][7], 
        							tree_points[ego][layer]["left"]["trunk"][8], tree_points[ego][layer]["left"]["trunk"][9]);
        		context.closePath();
        		context.moveTo(tree_points[ego][layer]["left"]["trunk"][10], tree_points[ego][layer]["left"]["trunk"][11]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][12], tree_points[ego][layer]["left"]["trunk"][13]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][14], tree_points[ego][layer]["left"]["trunk"][15]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][16], tree_points[ego][layer]["left"]["trunk"][17]);
        		context.closePath();
        	}
        	else{
        		context.moveTo(tree_points[ego][layer]["left"]["trunk"][0], tree_points[ego][layer]["left"]["trunk"][1]);
        		context.bezierCurveTo(tree_points[ego][layer]["left"]["trunk"][2], tree_points[ego][layer]["left"]["trunk"][3], 
        							tree_points[ego][layer]["left"]["trunk"][4], tree_points[ego][layer]["left"]["trunk"][5], 
        							tree_points[ego][layer]["left"]["trunk"][6], tree_points[ego][layer]["left"]["trunk"][7]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][8], tree_points[ego][layer]["left"]["trunk"][9]);
        		context.bezierCurveTo(tree_points[ego][layer]["left"]["trunk"][10], tree_points[ego][layer]["left"]["trunk"][11], 
        							tree_points[ego][layer]["left"]["trunk"][12], tree_points[ego][layer]["left"]["trunk"][13], 
        							tree_points[ego][layer]["left"]["trunk"][14], tree_points[ego][layer]["left"]["trunk"][15]);
        		context.closePath();
        		context.moveTo(tree_points[ego][layer]["left"]["trunk"][16], tree_points[ego][layer]["left"]["trunk"][17]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][18], tree_points[ego][layer]["left"]["trunk"][19]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][20], tree_points[ego][layer]["left"]["trunk"][21]);
        		context.lineTo(tree_points[ego][layer]["left"]["trunk"][22], tree_points[ego][layer]["left"]["trunk"][23]);
        		context.closePath();
        	}
        	context.stroke();//draw line
            context.fill();//fill color
            context.beginPath();
        	if(tree_points[ego][layer]["right"]["type"] == "nobranch"){
        		context.moveTo(tree_points[ego][layer]["right"]["trunk"][0], tree_points[ego][layer]["right"]["trunk"][1]);
        		context.quadraticCurveTo(tree_points[ego][layer]["right"]["trunk"][2], tree_points[ego][layer]["right"]["trunk"][3], 
        							tree_points[ego][layer]["right"]["trunk"][4], tree_points[ego][layer]["right"]["trunk"][5]);
        		context.quadraticCurveTo(tree_points[ego][layer]["right"]["trunk"][6], tree_points[ego][layer]["right"]["trunk"][7], 
        							tree_points[ego][layer]["right"]["trunk"][8], tree_points[ego][layer]["right"]["trunk"][9]);
        		context.closePath();
        		context.moveTo(tree_points[ego][layer]["right"]["trunk"][10], tree_points[ego][layer]["right"]["trunk"][11]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][12], tree_points[ego][layer]["right"]["trunk"][13]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][14], tree_points[ego][layer]["right"]["trunk"][15]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][16], tree_points[ego][layer]["right"]["trunk"][17]);
        		context.closePath();
        	}
        	else{
        		context.moveTo(tree_points[ego][layer]["right"]["trunk"][0], tree_points[ego][layer]["right"]["trunk"][1]);
        		context.bezierCurveTo(tree_points[ego][layer]["right"]["trunk"][2], tree_points[ego][layer]["right"]["trunk"][3], 
        							tree_points[ego][layer]["right"]["trunk"][4], tree_points[ego][layer]["right"]["trunk"][5], 
        							tree_points[ego][layer]["right"]["trunk"][6], tree_points[ego][layer]["right"]["trunk"][7]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][8], tree_points[ego][layer]["right"]["trunk"][9]);
        		context.bezierCurveTo(tree_points[ego][layer]["right"]["trunk"][10], tree_points[ego][layer]["right"]["trunk"][11], 
        							tree_points[ego][layer]["right"]["trunk"][12], tree_points[ego][layer]["right"]["trunk"][13], 
        							tree_points[ego][layer]["right"]["trunk"][14], tree_points[ego][layer]["right"]["trunk"][15]);
        		context.closePath();
        		context.moveTo(tree_points[ego][layer]["right"]["trunk"][16], tree_points[ego][layer]["right"]["trunk"][17]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][18], tree_points[ego][layer]["right"]["trunk"][19]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][20], tree_points[ego][layer]["right"]["trunk"][21]);
        		context.lineTo(tree_points[ego][layer]["right"]["trunk"][22], tree_points[ego][layer]["right"]["trunk"][23]);
        		context.closePath();
        	}
        	context.stroke();//draw line
            context.fill();//fill color            

			// draw sticks
            var finish_mark_left = 0;
            var finish_mark_right = 0;
            var len = tree_points[ego][layer]["left"]["sticks"].length;
            if(tree_points[ego][layer]["right"]["sticks"].length > len)
            	len = tree_points[ego][layer]["right"]["sticks"].length;

            for(var s = 0; s < len; s += 24){ // set time interval
            	for(var i = s; i < s+24; i += 8){ 
            		context.beginPath();
	            	context.lineWidth = 8;
	            	if(finish_mark_left != 1){
	            		if(tree_points[ego][layer]["left"]["sticks"].length < i || tree_points[ego][layer]["left"]["sticks"][i] == "end")
	            			finish_mark_left = 1;
	            	}
	            	if(finish_mark_right != 1){
	            		if(tree_points[ego][layer]["right"]["sticks"].length < i || tree_points[ego][layer]["right"]["sticks"][i] == "end")
	            			finish_mark_right = 1;
	            	}

	            	if(finish_mark_right == 1 && finish_mark_left == 1)
	            		break;

	            	if(finish_mark_left != 1 && tree_points[ego][layer]["left"]["sticks"][i] != "none"){
	            		context.moveTo(tree_points[ego][layer]["left"]["sticks"][i], tree_points[ego][layer]["left"]["sticks"][i+1]);
	            		for(var j = i+2; j < i+8; j += 2){
	            			if(tree_points[ego][layer]["left"]["sticks"][j] != "none"){
	            				context.lineTo(tree_points[ego][layer]["left"]["sticks"][j], tree_points[ego][layer]["left"]["sticks"][j+1]);
	            			}
	            		}
	            	}
	            	
	            	if(finish_mark_right != 1 && tree_points[ego][layer]["right"]["sticks"][i] != "none"){
	            		context.moveTo(tree_points[ego][layer]["right"]["sticks"][i], tree_points[ego][layer]["right"]["sticks"][i+1]);
	            		for(var j = i+2; j < i+8; j += 2){
	            			if(tree_points[ego][layer]["right"]["sticks"][j] != "none"){
	            				context.lineTo(tree_points[ego][layer]["right"]["sticks"][j], tree_points[ego][layer]["right"]["sticks"][j+1]);
	            			}
	            		}
	            	}
	            	context.closePath();
	                context.stroke();//draw line
	                context.fill();//fill color
            	}
                 
            }

            // context.globalAlpha = this.fadeout;
            for(var i = 0, len = tree_points[ego][layer]["fruit"].length; i < len; i += 3){
	        	this.tree_fruit(context,
	        					tree_points[ego][layer]["fruit"][i],
	        					tree_points[ego][layer]["fruit"][i+1],
	        					tree_points[ego][layer]["fruit"][i+2]);
	        }

	        /*
            for(var i = 0, len = tree_points[ego][layer]["leaf"].length; i < len; i += 5){
	        	this.leaf_style(context,
	        					tree_points[ego][layer]["leaf"][i],
	        					tree_points[ego][layer]["leaf"][i+1],
	        					tree_points[ego][layer]["leaf"][i+2],
	        					tree_points[ego][layer]["leaf"][i+3],
	        					tree_points[ego][layer]["leaf"][i+4]);
	        }
	        */

            //context.globalAlpha = this.fadeout;
	        for(var order in tree_points[ego][layer]["leaf"]){
	        	for(var i = 0, len = tree_points[ego][layer]["leaf"][order].length; i < len; i += 6){
	        		if(tree_points[ego][layer]["leaf"][order][i+5] == highlight_list["selected"])
	        			continue;
	        		this.leaf_style(context,
		        					tree_points[ego][layer]["leaf"][order][i],
		        					tree_points[ego][layer]["leaf"][order][i+1],
		        					tree_points[ego][layer]["leaf"][order][i+2],
		        					tree_points[ego][layer]["leaf"][order][i+3],
		        					tree_points[ego][layer]["leaf"][order][i+4]);
		        }
	        }
            context.globalAlpha = 1;
        
            height ++; 
        }

        if(highlight_list["selected"] != "None" && this.highlight_choose == 0){
            this.draw_highlight_leaf(ego);
        }

        context.restore();

    }



};