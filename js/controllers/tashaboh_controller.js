angular.module('starter')

    .service('tashaboh_srv',  function ($location, $filter,common_serv,setting_srv) {

        var self = this;
        console.log('audio_Ctrl');
    
       
       
       
         this.inint_tashaboh=function(){
           
        }
 

       
        /***
         *   this.read_data_file = function (file_path, i) {
         */
          this.read_tashaboh_data_file = function (file_path, i) {
            console.log(file_path, i);
            if (  !setting_srv.settings.tshabohat) return;
            var screenMax_x_sh = document.getElementById(i).clientWidth + 25; //45;
            var screenMax_y_sh = document.getElementById(i).clientHeight + 25; //45;
            var xration_sh = parseFloat(screenMax_x_sh / 574.517); //595//575;
            var yration_sh = parseFloat(screenMax_y_sh / 820.252); //822.44//820;
            var clientWidth = document.getElementById(i).clientWidth;
            var margin_x = clientWidth * 9.55 / 100;
            var screenMax_x = clientWidth + margin_x; //45;
            var clientHeight = document.getElementById(i).clientHeight;
            var margin_y = clientHeight * 6.9 / 100;
            var screenMax_y = clientHeight + margin_y;;
            subCallback_t_ma = function(data,data_i) {
                


                //self.fillRect(50, 50, 100, 50);
                var note = document.getElementById('notes_t' + data_i);
                if (note == null) return;
                note.innerHTML = ''
                //note.top=document.getElementById(i).top;
                //note.bottom=document.getElementById(i).getBoundingClientRect().bottom;
                for (var k in data) {
                    var d = data[k];
 
                   
                        //console.log(d);
                        var marker_t = document.createElement('div'); //img 
                        marker_t.setAttribute('T', d.T);
                        marker_t.setAttribute('P', d.P);
                        marker_t.setAttribute('A', d.A);
                        marker_t.setAttribute('S', d.S);
                        Xmpdf = 740; //760;
                        xration = parseFloat((screenMax_x) / Xmpdf); //595//575;//574.517
                        Ympdf = 980; //985;
                        yration = parseFloat((screenMax_y) / Ympdf); //822.44//820;917.252
                        d.s_loc

                        var Rect_str = d.s_loc.substring(1, d.s_loc.length - 1);
                        var Rect = Rect_str.split(","); //Rect= x,y ,x1,y1

                        ///maximum pdf y = 820.252    maximun pdf x=574.517
                        //"[20.2916, 812.191, 27.9371, 820.252]"
                        //"[566.872, 20.8218, 574.517, 28.8837]"


                        width = (Rect[2] - Rect[0]) * xration - 3;
                        height = (Rect[3] - Rect[1]) * yration - 3;
                        Ypdf = parseFloat(Rect[1]) + 7;
                        y = parseFloat(yration * (Ympdf - parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*(parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*parseFloat(Rect[1])-height); 
                        Xpdf = parseFloat(Rect[0]) - 38;
                        x = parseFloat(xration * parseFloat(Xpdf));
                        data[k].y = y;
                        data[k].x = x;
                        data[k].h = parseFloat(height);
                        //detect if right or left mark
                        //correct right or left location
                        right_x = (screenMax_x - margin_x) * 96 / 100; // %
                        left_x = 2.8; //%
                        left_start = 11;
                        right_start = (screenMax_x - margin_x) * 92 / 100;
                        if (x > right_start) x = right_x;
                        if (x < left_start) x = left_x;
                        style = "";
                        border = 2;
                        
                        // if (d.Name && d.Name == "/Star") //star-six
                        {
                            x = 10;//x - 1.4;
                             Star_color = "red";
                            ///star-fifth
                            starWidth =3;// width - 5;
                            d.NM=common_serv.makeid()
                            marker_t.id = 'star_' + d.NM;
                            
                            marker_t.className = 'blue_star'; // comment_area
                          
                            var dynamic_style = document.createElement('style'); //img
                            dynamic_style.type = 'text/css';
                            dstyle = "";
                            dstyle += '#star' + d.NM + ' {width: 0px; height: 0px; ';
                            dstyle += '  margin: ' + starWidth / 2 + 'px 0; position: relative; display: block;';
                            dstyle += ' color: ' + Star_color + ';   border-right:  ' + starWidth + 'px solid transparent;  border-bottom:' + starWidth * 70 / 100 + 'px  solid ' + Star_color + '; border-left:   ' + starWidth + 'px solid transparent;';
                            dstyle += ' -moz-transform:    rotate(35deg); -webkit-transform: rotate(35deg);  -ms-transform:     rotate(35deg);  -o-transform:      rotate(35deg); }';
                            dstyle += '#star' + d.NM + ':before {';
                            dstyle += '  border-bottom: ' + starWidth * 80 / 100 + 'px solid ' + Star_color + '; border-left: ' + starWidth * 30 / 100 + 'px solid transparent;  border-right: ' + starWidth * 30 / 100 + 'px solid transparent;'
                            dstyle += '  position: absolute;  height: 0;  width: 0;';
                            dstyle += ' top: -' + starWidth * 45 / 100 + 'px; left: -' + starWidth * 65 / 100 + 'px; display: block;  content: "";';
                            dstyle += ' -webkit-transform: rotate(-35deg);  -moz-transform:    rotate(-35deg); -ms-transform:     rotate(-35deg);  -o-transform:      rotate(-35deg);}';
                            dstyle += '#star' + d.NM + ':after {  position: absolute; display: block;';
                            dstyle += ' color: ' + Star_color + ';  top: ' + starWidth * 3 / 100 + 'px; left: -' + starWidth * 105 / 100 + 'px; width: 0px; height: 0px; border-right: ' + starWidth + 'px solid transparent;  border-bottom: ' + starWidth * 70 / 100 + 'px solid ' + Star_color + '; border-left:' + starWidth + 'px solid transparent;';
                            dstyle += '   -webkit-transform: rotate(-70deg); -moz-transform:    rotate(-70deg);  -ms-transform:     rotate(-70deg); -o-transform:      rotate(-70deg); content: ""; }';

                            //old star-six

                            /*dstyle+='#star'+d.NM+' {width: 0px; height: 0px; ';
                            dstyle+="border-left: "+width/2+"px solid transparent; ";
                            dstyle+="border-right: "+width/2+"px solid transparent;";
                            dstyle+="border-bottom: "+width+"px solid red;}";
                            dstyle+='#star'+d.NM+':after {width: 0px; height: 0px; ';
                            dstyle+="border-left: "+width/2+"px solid transparent;";
                            dstyle+="border-right: "+width/2+"px solid transparent;";
                            dstyle+="border-top: "+width+"px solid red;";
                            dstyle+="position: absolute;content: ''; top: "+height/3+"px; left: -"+height/2+"px;}";
                            */


                            dynamic_style.innerHTML = dstyle;
                            document.getElementsByTagName('head')[0].appendChild(dynamic_style);
                            style += " background-color: transparent;";
                        }  
   
                        style += "display:flex ;position: absolute;top:" + y + "px;left:" + x + "px; z-index:" + k + ";    ";
                        //console.log(style);
                        //img.style=style;
                        marker_t.style.cssText = style;
                        //console.log(img.style);
                        note.appendChild(marker_t);
                        //	document.getElementById(i).appendChild(note);
                        self.add_tshabohat_clikc_event();


                }

              //  all_pages_data[i] = data;
                /// in case of speed scroll should fill mon data with 
                // correct data 
               // mon_data = getMonitordData( this.current_page);
            
               
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            dataDirectory = '';
            if(file_path.search("_t")!=-1){
                $.ajax({
                    // 'async': false,
                    'global': false,
                    'url': file_path,
                    'dataType': "json",
                    'success': function(data) {
                      //json = data;
                      l1=this.url.indexOf("/");l2=this.url.indexOf(".");
                      this.i=this.url.substring(l1+1,l2)
                      subCallback_t_ma(data,this.i)
                    },
                    failure: function (response) {
                      //  alert("sdfjsdjf2222");
                        console.log('failure',response);
                    },
                    error: function (response) {
                        // console.log(response.responseText);
                        console.log('error',response);
                    }
                  });
            }
            console.log('%c' + script.src, 'font-size:34;');
            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            // if (window.cordova.platformId!='android')  {
            //     script.src  = script.src .replace(/^file:\/\//, '');
            //   }
            head.appendChild(script);
         }
        /**
         * add_tshabohat_clikc_event
         */

         this.add_tshabohat_clikc_event=function (){
            $(document).off('click', '.blue_star' );
            
            $(document).on('click', '.blue_star', function () {
             var T= $(this).attr('T');
             var P= $(this).attr('P');
             var A= $(this).attr('A');
             var S= $(this).attr('S');
             self.result_arr=[];
             self.show_motashbehat(T);
                console.log("blue_star clicked", this);

                  });
        }
        /**
         * 
         * call_get_tashabohat 
         *  
         */
         this.call_get_tashabohat=function(current_page){
             self.current_page=current_page;
            console.log('call_get_annotations' +  current_page);
           
            get_tashabohat( current_page - 1);
            get_tashabohat( current_page);
            get_tashabohat( current_page + 1);
            
           

        }



        /**
         * 
         * show_motashbehat
         */
         this.show_motashbehat=function(T){
            var note = document.getElementById('notes_t' +  self.current_page);
            if (note == null) return;
           // var motahsabehat_overlay_window = document.createElement('div'); 
           // motahsabehat_overlay_window.style.cssText = "width:80%;height:90%;";
                        //console.log(img.style);
            // motahsabehat_overlay_window.className="motahsabehat_overlay_window";
            // note.appendChild(motahsabehat_overlay_window);
            document.getElementById('tashaboh_result').innerHTML="";
            if (quraat_name == 'shamarly')
            file_path=data_shamarly_tashabohat+"T_"+T+'.json';
            else
            file_path=data_madina_tashabohat+"T_"+T+'.json';
            $.ajax({
                // 'async': false,
                'global': false,
                'url': file_path,
                'dataType': "json",
                'success': function(data) {
                  //json = data;
                  $(".motahsabehat_overlay_window").show();

                  
                  html="";
                  self.count=data.length;
                  for(var ii=0;ii<data.length;ii++)
                  {
                    if (quraat_name == 'shamarly')
                    get_cropped_image_sh(data[ii],ii+1 );
                    else
                    get_cropped_image(data[ii],ii+1 );
                  //  html+="Sora:"+data[ii].S+",aya:"+data[ii].A+"textm:"+data[ii].textm+"<br>";
                  }
                 // $(".motahsabehat_overlay_window").html(html);
                },
                failure: function (response) {
                  //  alert("sdfjsdjf2222");
                    console.log('failure',response);
                },
                error: function (response) {
                    // console.log(response.responseText);
                    console.log('error',response);
                }
              });
         

              $(document).off('click', '.motahsabehat_overlay_window' );
              $(document).on('click', '.motahsabehat_overlay_window', function () {
                $(".motahsabehat_overlay_window").hide();
              })
        }

        
        /**
         * 
         * get_tashabohat
         */
         function get_tashabohat(page_number){
            //data_madina_tashabohat
            if (page_number < 1 || page_number > allpages) return;
            var note = document.getElementById('notes_t' + page_number);
            if (note == null) return;
            note.innerHTML = ''
        if (quraat_name == 'shamarly') {
           //  this.read_data_file(data_shamarly_tashabohat+page_number + '.json', page_number);
           //  this.read_data_file(data_shamarly_tashabohat+page_number + '.json', page_number);
            self.read_tashaboh_data_file(data_shamarly_tashabohat+page_number+'.json', page_number);
      
        }
        else{
          //   this.read_data_file(data_madina_tashabohat+page_number + '.json', page_number);
             self.read_tashaboh_data_file(data_madina_tashabohat+page_number+'.json', page_number);
      
        }
        }
        self.result_arr=[];
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
        function append_out_arr(DATA_ITEM,pngUrl,text,order){

            self.result_arr.push({order:order,pngUrl:pngUrl,text:text,DATA_ITEM:DATA_ITEM});
            if(self.result_arr.length==self.count)
            {// do order printing 
                self.result_arr=sortByKey(self.result_arr,'order');
                for(o=0;o<self.result_arr.length;o++)
                {

                    DATA_ITEM=self.result_arr[o].DATA_ITEM;
                    pngUrl=self.result_arr[o].pngUrl;
                    text=self.result_arr[o].text;
                    order=self.result_arr[o].order;
                var img = document.createElement("img");                 // Create a <li> node
                img.id="croppied_"+Math.floor((Math.random() * 100) + 1);
                img.src=pngUrl;
    
                p=document.createElement("p");
                loc_data=  common_serv.getAya_data(parseInt(DATA_ITEM.S),parseInt(DATA_ITEM.A));
                p.id=DATA_ITEM.S+"_"+DATA_ITEM.A;
                var sora=''+parseInt(DATA_ITEM.S)+'';
                var sura_data_details = $filter('filter')(common_serv.Suras, {
                 sura_order: sora ,
                  }, true)[0];
              
                //  p.innerHTML=DATA_ITEM.text + "(page:"+DATA_ITEM.P+",sora:"+DATA_ITEM.S+",Aya:"+DATA_ITEM.A+",T:"+DATA_ITEM.T+")";
                //"\""+DATA_ITEM.text +"\""+ " - "+
                        
                
                p.innerHTML=text;
                //sura_data_details.sura_name+"("+DATA_ITEM.A+"), "+"ص("+DATA_ITEM.P+ "), موضع("+self.count+ "/"+order+") ";
                        
                p.addEventListener("click", function(){
                            var data=this.id.split('_');
                            sura=data[0];aya=data[1];
                            common_serv.BrowseTo(sura,aya);
                        }, false); //where func is your function name
                        
                    document.getElementById('tashaboh_result').appendChild(p);
                    document.getElementById('tashaboh_result').appendChild(img);
                    document.getElementById('tashaboh_result').appendChild(document.createElement("br"));
                }
              
            }
           
                
        }


        /*
        get_cropped_image_sh
        */ 
        function get_cropped_image_sh_oo(DATA_ITEM,order)
        { 
                Srect=DATA_ITEM.s_loc;
                Erect=DATA_ITEM.e_loc,
                page=parseInt(DATA_ITEM.P); 
                // original image size
                org_img_w=1110;//622;
                org_img_h=1602;//917;
                top_buttom_margin=145;//110;//هامش وبرواز
                left_right_mrgin=110;//55;
                line_height=(org_img_h-top_buttom_margin)/15;
               
                function calc_point_x(Xpdf ){
                    var clientWidth =org_img_w;// document.getElementById(i).clientWidth;
                    var margin_x =30;//left_right_mrgin;// clientWidth * 8 / 100;// clientWidth * 9.55 / 100;
                    var screenMax_x = clientWidth + margin_x; //45; 
                    Xmpdf =595;//595 ;//-77*2;//1110;//622;//750;// 740; //760;
                    xration = parseFloat((screenMax_x) / Xmpdf); //595//575;//574.517
                 
                     Xpdf = parseFloat(Xpdf)  ;
                     x = parseFloat(xration * parseFloat(Xpdf))  ;
                     console.log("Xpdf="+Xpdf,"x="+x);
                     return x;
                }
                function calc_point_y(Ypdf ){

                var clientHeight = org_img_h;//document.getElementById(i).clientHeight;
                var margin_y = clientHeight * 5  / 100;;//clientHeight * 6.9 / 100;
                var screenMax_y = clientHeight + margin_y;;
                Ympdf = 842;//3508;//980; //985;
                yration = parseFloat((screenMax_y) / Ympdf); //822.44//820;917.252
                    // Ypdf = parseFloat(Ypdf) + 7;
                    y =org_img_h- parseFloat(yration * Ypdf   );
                // y =org_img_h-Ypdf;// parseFloat(Ypdf)  ;
                    //  y = parseFloat(yration * (Ympdf - parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*(parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*parseFloat(Rect[1])-height); 

                return y;    
                }

                var canvas = document.createElement("canvas");                 // Create a <li> node
                canvas.id="croppie_"+Math.floor((Math.random() * 100) + 1);
                    canvas.style.cssText="display:none;";

                document.body.appendChild(canvas); 

                var image = new Image();
                
                  
                start_rect= Srect.substring(1, Srect.length - 1);   
                start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                end_rect= Erect.substring(1, Erect.length - 1); 
                end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                e_x=parseFloat(end_rect[0]);e_y=parseFloat(end_rect[1]);

                w=s_x-e_x;
                h=(org_img_h-top_buttom_margin)/15;//46;//-(s_y-e_y); 

                console.log("page"+page ,"DATA_ITEM.text"+DATA_ITEM.text);
                s_x=calc_point_x(s_x);s_y=calc_point_y(s_y);
                e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                //s_x=480;//s_y=220;
                //check if the select is not one line 
                const_margin_y=12;
                if(e_y<s_y+const_margin_y &&e_y>s_y-const_margin_y )
                {// same line 
                    image.same_line=true;
                }else
                {
                    image.same_line=false;
                }
                image.s_x=s_x;
                image.e_x=e_x;
                image.s_y=s_y;
                image.e_y=e_y;
                image.w=w;
                image.h=h;

                start_line=Math.ceil((s_y+line_height/2)/line_height)-1;
                if(start_line==1)image.first_line=true; else image.first_line=false;
                line_from=(start_line==1)?1:--start_line ;
                end_line=Math.ceil((e_y+line_height/2)/line_height)-1;
                if(end_line==15)image.last_line=true; else image.last_line=false;
                line_to=(end_line==15)?15:++end_line ;
                
                image.src = 'shamarly_images/'+page+'.jpg';
               
                image.id="img"+canvas.id;
                // Srect="[618.75, 815.05426, 621.75, 860.794006]";
                //         Erect="[536.25, 815.05426, 539.25, 860.794006]"; 
                // start_rect= Srect.substring(1, Srect.length - 1);   
                // start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                // s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                // end_rect= Erect.substring(1, Erect.length - 1); 
                // end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                // e_x=parseFloat(end_rect[2]);e_y=parseFloat(end_rect[3]);
                // w=s_x-e_x;
                // h=-(s_y-e_y);
                
                // s_x=calc_point_x(e_x);s_y=calc_point_y(s_y);
                // e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                //s_x=480;//s_y=220;
                image.id="img_"+canvas.id; 
                image.canvas=canvas;
                image.page=page;
                image.line_from=line_from;
                image.line_to=line_to;
               
                image.onerror=function(){
                     /// remove canvas and image ...
                     document.getElementById(this.canvas.id).remove();
                }
                image.onload = function(){
                    image=this;
                    console.log(image,image.e_x,image.s_y,image.w,image.h);
                    ctx = this.canvas.getContext('2d');
                    ctx.canvas.width  = org_img_w-2*left_right_mrgin;
                    line_height=(org_img_h-top_buttom_margin)/15;// 15 line in page
                    y=image.line_from*line_height;
                    if(image.first_line)   y=y-line_height;
                         
                    x= left_right_mrgin;
                    w=org_img_w-2*left_right_mrgin;
                    h=line_height*(image.line_to-image.line_from+1);//*(3);// all 3 lines 
                    if(image.first_line)h=h+line_height; 
                    if(image.last_line) h=h+line_height;
                    ctx.canvas.height = h;// this.h;
                    ctx.canvas.width  = w;//org_img_w-2*left_right_mrgin;//this.w;
                    ctx.drawImage(this,x,y,w,h,0,0,w,h);
                        // all image color to be gray ..
                        ctx.save();
                        ctx.globalAlpha=.50;
                        ctx.fillStyle="black";
                        ctx.fillRect(0,0,w, h);
                        ctx.restore();

                       
                            
                        ctx.save();
                        ctx.beginPath();
                        // ctx.clearRect(this.s_x,this.s_y,w,h);
                        // start heighliting 
                        if( image.same_line)
                        {
                            H_x=this.e_x-left_right_mrgin;
                            // if(image.first_line)
                            //      H_y=5;
                            //      else 
                                H_y=this.h-line_height+5;// one line before 
                            H_w=this.w+left_right_mrgin-5;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,this.h);
                            ctx.rect(H_x,H_y,H_w,this.h);
                            ctx.clip();
                        }
                        else
                        {// H heighlight two parts 
                            //first 
                            H_x=5;//this.e_x-left_right_mrgin;
                            H_y=this.h;// one line before 
                            H_w=this.s_x-left_right_mrgin;//+left_right_mrgin;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,line_height);
                            ctx.rect(H_x,H_y,H_w,line_height);
                          //  ctx.clip();
                           
                        // ctx.save();
                        // ctx.beginPath();
                            //second 
                            H_x=this.e_x-left_right_mrgin;
                            H_y=this.h+line_height;// one line before 
                            H_w=org_img_w-this.e_x-left_right_mrgin-5;//2*left_right_mrgin;// this.w;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,line_height);
                            ctx.rect(H_x,H_y,H_w,line_height);
                             ctx.clip();
                        }
                        
                        //  //ctx.drawImage(this,0,0,w,h);
                        
                        ctx.drawImage(this,x,y,w,h,0,0,w,h);
                
                        ctx.restore();


                    var pngUrl = this.canvas.toDataURL();
                    loc_data=  common_serv.getAya_data(parseInt(DATA_ITEM.S),parseInt(DATA_ITEM.A));
                    
                    var sora=''+parseInt(DATA_ITEM.S)+'';
                    var sura_data_details = $filter('filter')(common_serv.Suras, {
                     sura_order: sora ,
                      }, true)[0];
                    text=sura_data_details.sura_name+"("+DATA_ITEM.A+"), "+"ص("+DATA_ITEM.P+ "), موضع("+self.count+ "/"+order+") ";
                    text+=DATA_ITEM.text
                    append_out_arr(DATA_ITEM,pngUrl,text,order);
                    // var img = document.createElement("img");                 // Create a <li> node
                    //     img.id="croppied_"+Math.floor((Math.random() * 100) + 1);
                    //     img.src=pngUrl;
                     /// remove canvas and image ...
                      document.getElementById(this.canvas.id).remove();
                      //    this=null;
                    
                        
                }
            }
            function get_cropped_image_sh(DATA_ITEM,order)
            { 
                    Srect=DATA_ITEM.s_loc;
                    Erect=DATA_ITEM.e_loc,
                    page=parseInt(DATA_ITEM.P); 
                    // original image size
                    org_img_w=1110;//622;
                    org_img_h=1602;//917;
                    top_buttom_margin=120;//145;//110;//هامش وبرواز
                    left_right_mrgin=110;//55;
                    line_height=(org_img_h-2*top_buttom_margin)/15;
                   
                    function calc_point_x(Xpdf ){
                        var clientWidth =org_img_w;// document.getElementById(i).clientWidth;
                        var margin_x =30;//left_right_mrgin;// clientWidth * 8 / 100;// clientWidth * 9.55 / 100;
                        var screenMax_x = clientWidth + margin_x; //45; 
                        Xmpdf =595;//595 ;//-77*2;//1110;//622;//750;// 740; //760;
                        xration = parseFloat((screenMax_x) / Xmpdf); //595//575;//574.517
                     
                         Xpdf = parseFloat(Xpdf)  ;
                         x = parseFloat(xration * parseFloat(Xpdf))  ;
                         console.log("Xpdf="+Xpdf,"x="+x);
                         return x;
                    }
                    function calc_point_y(Ypdf ){
    
                    var clientHeight = org_img_h;//document.getElementById(i).clientHeight;
                    var margin_y = clientHeight * 14  / 100;;//clientHeight * 12  / 100;;//clientHeight * 6.9 / 100;
                    var screenMax_y = clientHeight + margin_y;;
                    Ympdf = 842;//3508;//980; //985;
                    yration = parseFloat((screenMax_y) / Ympdf); //822.44//820;917.252
                        // Ypdf = parseFloat(Ypdf) + 7;
                        y =org_img_h- parseFloat(yration * Ypdf   );
                    // y =org_img_h-Ypdf;// parseFloat(Ypdf)  ;
                        //  y = parseFloat(yration * (Ympdf - parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*(parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*parseFloat(Rect[1])-height); 
    
                    return y;    
                    }
                  
                    var canvas = document.createElement("canvas");                 // Create a <li> node
                    canvas.id="croppie_"+Math.floor((Math.random() * 100) + 1);
                        canvas.style.cssText="display:none;";
    
                    document.body.appendChild(canvas); 
    
                    var image = new Image();
                    
                      
                    start_rect= Srect.substring(1, Srect.length - 1);   
                    start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                    s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                    end_rect= Erect.substring(1, Erect.length - 1); 
                    end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                    e_x=parseFloat(end_rect[0]);e_y=parseFloat(end_rect[1]);
    
                    
                    h=(org_img_h-top_buttom_margin)/15;//46;//-(s_y-e_y); 
                    s_x=calc_point_x(s_x);s_y=calc_point_y(s_y);
                    e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                    //s_x=480;//s_y=220;
                    w=s_x-e_x;
                    //check if the select is not one line 
                    const_margin_y=16;//12;
                    if(e_y<s_y+const_margin_y &&e_y>s_y-const_margin_y )
                    {// same line 
                        image.same_line=true;
                    }else
                    {
                        image.same_line=false;
                    }
                    image.s_x=s_x;
                    image.e_x=e_x;
                    image.s_y=s_y;
                    image.e_y=e_y;
                    image.w=w;
                    image.h=h;
    
                    start_line=Math.ceil((s_y+line_height/2)/line_height)-1;
                    if(start_line==1)image.first_line=true; else image.first_line=false;
                    line_from=(start_line==1)?1:--start_line ;
                    end_line=Math.ceil((e_y+line_height/2)/line_height)-1;
                    if(end_line==15)image.last_line=true; else image.last_line=false;
                    line_to=(end_line==15)?15:++end_line ;
                   
                    image.src = 'shamarly_images/'+page+'.jpg';
                
                    image.id="img"+canvas.id;
                    // Srect="[618.75, 815.05426, 621.75, 860.794006]";
                    //         Erect="[536.25, 815.05426, 539.25, 860.794006]"; 
                    // start_rect= Srect.substring(1, Srect.length - 1);   
                    // start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                    // s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                    // end_rect= Erect.substring(1, Erect.length - 1); 
                    // end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                    // e_x=parseFloat(end_rect[2]);e_y=parseFloat(end_rect[3]);
                    // w=s_x-e_x;
                    // h=-(s_y-e_y);
                    
                    // s_x=calc_point_x(e_x);s_y=calc_point_y(s_y);
                    // e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                    //s_x=480;//s_y=220;
                    image.id="img_"+canvas.id; 
                    image.canvas=canvas;
                    image.page=page;
                    image.line_from=line_from;
                    image.line_to=line_to;
                   
                    image.onerror=function(){
                         /// remove canvas and image ...
                         document.getElementById(this.canvas.id).remove();
                    }
                    image.onload = function(){
                        image=this;
                        console.log(image,image.e_x,image.s_y,image.w,image.h);
                        ctx = this.canvas.getContext('2d');
                        ctx.canvas.width  = org_img_w-2*left_right_mrgin;
                        line_height=(org_img_h-2*top_buttom_margin)/15;//(org_img_h-top_buttom_margin)/15;// 15 line in page
                        y=image.line_from*line_height;
                        if(image.first_line)   y=y-line_height;
                             
                        x= left_right_mrgin;
                        w=org_img_w-2*left_right_mrgin;
                        h=line_height*(image.line_to-image.line_from+1);//*(3);// all 3 lines 
                        if(image.first_line)h=h+line_height; 
                        if(image.last_line) h=h+line_height;
                        ctx.canvas.height = h;// this.h;
                        ctx.canvas.width  = w;//org_img_w-2*left_right_mrgin;//this.w;
                        ctx.drawImage(this,x,y,w,h,0,0,w,h);
                            // all image color to be gray ..
                            ctx.save();
                            ctx.globalAlpha=.50;
                            ctx.fillStyle="black";
                            ctx.fillRect(0,0,w, h);
                            ctx.restore();
    
                           
                                
                            ctx.save();
                            ctx.beginPath();
                            // ctx.clearRect(this.s_x,this.s_y,w,h);
                            // start heighliting 
                            if( image.same_line)
                            {
                                H_x=this.e_x-left_right_mrgin;
                                // if(image.first_line)
                                //      H_y=5;
                                //      else 
                                    H_y=this.h;// one line before 
                                    if(image.line_from==15) H_y=5;
                                H_w=this.w;//-left_right_mrgin;
                                ctx.clearRect(H_x,H_y,H_w,this.h);
                                ctx.rect(H_x,H_y,H_w,this.h);
                                ctx.clip();
                            }
                            else
                            {// H heighlight two parts 
                                //first 
                                H_x=5;//this.e_x-left_right_mrgin;
                                H_y=this.h;// one line before 
                                H_w=this.s_x-left_right_mrgin;//+left_right_mrgin;//-left_right_mrgin;
                                ctx.clearRect(H_x,H_y,H_w,line_height);
                                ctx.rect(H_x,H_y,H_w,line_height);
                              //  ctx.clip();
                               
                            // ctx.save();
                            // ctx.beginPath();
                                //second 
                                H_x=this.e_x-left_right_mrgin;
                                H_y=this.h+line_height;// one line before 
                                H_w=org_img_w-this.e_x-left_right_mrgin-5;//2*left_right_mrgin;// this.w;//-left_right_mrgin;
                                ctx.clearRect(H_x,H_y,H_w,line_height);
                                ctx.rect(H_x,H_y,H_w,line_height);
                                 ctx.clip();
                            }
                            
                            //  //ctx.drawImage(this,0,0,w,h);
                            
                            ctx.drawImage(this,x,y,w,h,0,0,w,h);
                    
                            ctx.restore();
    
    
                        var pngUrl = this.canvas.toDataURL();
                        loc_data=  common_serv.getAya_data(parseInt(DATA_ITEM.S),parseInt(DATA_ITEM.A));
                        
                        var sora=''+parseInt(DATA_ITEM.S)+'';
                        var sura_data_details = $filter('filter')(common_serv.Suras, {
                         sura_order: sora ,
                          }, true)[0];
                        text=sura_data_details.sura_name+"("+DATA_ITEM.A+"), "+"ص("+DATA_ITEM.P+ "), موضع("+self.count+ "/"+order+") ";
                        text+=DATA_ITEM.text
                        append_out_arr(DATA_ITEM,pngUrl,text,order);
                        // var img = document.createElement("img");                 // Create a <li> node
                        //     img.id="croppied_"+Math.floor((Math.random() * 100) + 1);
                        //     img.src=pngUrl;
                         /// remove canvas and image ...
                          document.getElementById(this.canvas.id).remove();
                          //    this=null;
                        
                            
                    }
                }

        /*
        get_cropped_image
        */ 
        function get_cropped_image(DATA_ITEM,order)
        { 
                Srect=DATA_ITEM.s_loc;
                Erect=DATA_ITEM.e_loc,
                page=parseInt(DATA_ITEM.P); 
                // original image size
                org_img_w=622;
                org_img_h=917;
                top_buttom_margin=110;//هامش وبرواز
                left_right_mrgin=55;
                line_height=(org_img_h-top_buttom_margin)/15;
               
                function calc_point_x(Xpdf ){
                    var clientWidth =org_img_w;// document.getElementById(i).clientWidth;
                    var margin_x = clientWidth * 8 / 100;// clientWidth * 9.55 / 100;
                    var screenMax_x = clientWidth + margin_x; //45; 
                    Xmpdf =622;//750;// 740; //760;
                    xration =1;// parseFloat((screenMax_x) / Xmpdf); //595//575;//574.517
                 
                     Xpdf = parseFloat(Xpdf)  - 63;
                     x = parseFloat(xration * parseFloat(Xpdf));
                     console.log(Xpdf,x);
                     return x;
                }
                function calc_point_y(Ypdf ){

                var clientHeight = org_img_h;//document.getElementById(i).clientHeight;
                var margin_y = clientHeight * 5  / 100;;//clientHeight * 6.9 / 100;
                var screenMax_y = clientHeight + margin_y;;
                Ympdf = 980; //985;
                yration = parseFloat((screenMax_y) / Ympdf); //822.44//820;917.252
                    // Ypdf = parseFloat(Ypdf) + 7;
                    y =org_img_h- parseFloat(yration * Ypdf   );
                // y =org_img_h-Ypdf;// parseFloat(Ypdf)  ;
                    //  y = parseFloat(yration * (Ympdf - parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*(parseFloat(Ypdf))); //parseFloat(  screenMax_y-yration*parseFloat(Rect[1])-height); 

                return y;    
                }

                var canvas = document.createElement("canvas");                 // Create a <li> node
                canvas.id="croppie_"+Math.floor((Math.random() * 100) + 1);
                    canvas.style.cssText="display:none;";

                document.body.appendChild(canvas); 

                var image = new Image();
                
                  
                start_rect= Srect.substring(1, Srect.length - 1);   
                start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                end_rect= Erect.substring(1, Erect.length - 1); 
                end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                e_x=parseFloat(end_rect[0]);e_y=parseFloat(end_rect[1]);

                w=s_x-e_x;
                h=(org_img_h-top_buttom_margin)/15;//46;//-(s_y-e_y); 
                s_x=calc_point_x(s_x);s_y=calc_point_y(s_y);
                e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                //s_x=480;//s_y=220;
                //check if the select is not one line 
                const_margin_y=12;
                if(e_y<s_y+const_margin_y &&e_y>s_y-const_margin_y )
                {// same line 
                    image.same_line=true;
                }else
                {
                    image.same_line=false;
                }
                image.s_x=s_x;
                image.e_x=e_x;
                image.s_y=s_y;
                image.e_y=e_y;
                image.w=w;
                image.h=h;

                start_line=Math.ceil((s_y+line_height/2)/line_height)-1;
                if(start_line==1)image.first_line=true; else image.first_line=false;
                line_from=(start_line==1)?1:--start_line ;
                end_line=Math.ceil((e_y+line_height/2)/line_height)-1;
                if(end_line==15)image.last_line=true; else image.last_line=false;
                line_to=(end_line==15)?15:++end_line ;
               
                image.src = 'madina_images/'+page+'.png';
            
                image.id="img"+canvas.id;
                // Srect="[618.75, 815.05426, 621.75, 860.794006]";
                //         Erect="[536.25, 815.05426, 539.25, 860.794006]"; 
                // start_rect= Srect.substring(1, Srect.length - 1);   
                // start_rect = start_rect.split(","); //Rect= x,y ,x1,y1
                // s_x=parseFloat(start_rect[0]);s_y=parseFloat(start_rect[1]);
                // end_rect= Erect.substring(1, Erect.length - 1); 
                // end_rect = end_rect.split(","); //Rect= x,y ,x1,y1
                // e_x=parseFloat(end_rect[2]);e_y=parseFloat(end_rect[3]);
                // w=s_x-e_x;
                // h=-(s_y-e_y);
                
                // s_x=calc_point_x(e_x);s_y=calc_point_y(s_y);
                // e_x=calc_point_x(e_x); e_y=calc_point_y(e_y);
                //s_x=480;//s_y=220;
                image.id="img_"+canvas.id; 
                image.canvas=canvas;
                image.page=page;
                image.line_from=line_from;
                image.line_to=line_to;
               
                image.onerror=function(){
                     /// remove canvas and image ...
                     document.getElementById(this.canvas.id).remove();
                }
                image.onload = function(){
                    image=this;
                    console.log(image,image.e_x,image.s_y,image.w,image.h);
                    ctx = this.canvas.getContext('2d');
                    ctx.canvas.width  = org_img_w-2*left_right_mrgin;
                    line_height=(org_img_h-top_buttom_margin)/15;// 15 line in page
                    y=image.line_from*line_height;
                    if(image.first_line)   y=y-line_height;
                         
                    x= left_right_mrgin;
                    w=org_img_w-2*left_right_mrgin;
                    h=line_height*(image.line_to-image.line_from+1);//*(3);// all 3 lines 
                    if(image.first_line)h=h+line_height; 
                    if(image.last_line) h=h+line_height;
                    ctx.canvas.height = h;// this.h;
                    ctx.canvas.width  = w;//org_img_w-2*left_right_mrgin;//this.w;
                    ctx.drawImage(this,x,y,w,h,0,0,w,h);
                        // all image color to be gray ..
                        ctx.save();
                        ctx.globalAlpha=.50;
                        ctx.fillStyle="black";
                        ctx.fillRect(0,0,w, h);
                        ctx.restore();

                       
                            
                        ctx.save();
                        ctx.beginPath();
                        // ctx.clearRect(this.s_x,this.s_y,w,h);
                        // start heighliting 
                        if( image.same_line)
                        {
                            H_x=this.e_x-left_right_mrgin;
                            // if(image.first_line)
                            //      H_y=5;
                            //      else 
                                H_y=this.h;// one line before 
                            H_w=this.w;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,this.h);
                            ctx.rect(H_x,H_y,H_w,this.h);
                            ctx.clip();
                        }
                        else
                        {// H heighlight two parts 
                            //first 
                            H_x=5;//this.e_x-left_right_mrgin;
                            H_y=this.h;// one line before 
                            H_w=this.s_x-left_right_mrgin;//+left_right_mrgin;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,line_height);
                            ctx.rect(H_x,H_y,H_w,line_height);
                          //  ctx.clip();
                           
                        // ctx.save();
                        // ctx.beginPath();
                            //second 
                            H_x=this.e_x-left_right_mrgin;
                            H_y=this.h+line_height;// one line before 
                            H_w=org_img_w-this.e_x-left_right_mrgin-5;//2*left_right_mrgin;// this.w;//-left_right_mrgin;
                            ctx.clearRect(H_x,H_y,H_w,line_height);
                            ctx.rect(H_x,H_y,H_w,line_height);
                             ctx.clip();
                        }
                        
                        //  //ctx.drawImage(this,0,0,w,h);
                        
                        ctx.drawImage(this,x,y,w,h,0,0,w,h);
                
                        ctx.restore();


                    var pngUrl = this.canvas.toDataURL();
                    loc_data=  common_serv.getAya_data(parseInt(DATA_ITEM.S),parseInt(DATA_ITEM.A));
                    
                    var sora=''+parseInt(DATA_ITEM.S)+'';
                    var sura_data_details = $filter('filter')(common_serv.Suras, {
                     sura_order: sora ,
                      }, true)[0];
                    text=sura_data_details.sura_name+"("+DATA_ITEM.A+"), "+"ص("+DATA_ITEM.P+ "), موضع("+self.count+ "/"+order+") ";
                    text+=DATA_ITEM.text
                    append_out_arr(DATA_ITEM,pngUrl,text,order);
                    // var img = document.createElement("img");                 // Create a <li> node
                    //     img.id="croppied_"+Math.floor((Math.random() * 100) + 1);
                    //     img.src=pngUrl;
                     /// remove canvas and image ...
                      document.getElementById(this.canvas.id).remove();
                      //    this=null;
                    
                        
                }
            }

    } )