// ---- Starter Controller ---- //
angular.module('starter.controllers')
    // ---- Tables Controller ---- //
    .controller('quraattablesCtrl', function ($scope, $rootScope, $filter, $state, $ionicSideMenuDelegate, $http,$ionicScrollDelegate) {

        $ionicSideMenuDelegate.canDragContent(false)
      

        // ---- Open Tables ---- //
        $scope.$on('$ionicView.enter', function () {
            // time stamp for today !!
            $scope.current_timestamp = new Date(new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate()).getTime();
            //window.localStorage.getItem('timestamp');
            $scope.my_view=this;
            $rootScope.$broadcast('autoscrollpause', true);
            $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            // if($scope.selected_reader_s_or_k==1)
            // {/// change asool to zyadat
            //     $($('.tab-title')[0]).html('زيادات');
            //     $('#Zyadat').show();
            //     $('#Ososol').hide();
            // }
            // ---- Tables Json(s) : Read ---- //
           
            $(document).off('click', '.osol_table span');
            $(document).on('click', '.osol_table span', function () {
                image_filename = this.parentNode.id;
                $scope.play_osol(image_filename, this.parentNode);
            });
 
           
            $(document).off('click', '.intro_table span');
            
            $(document).on('click', '.intro_table_s ', function () {
                $scope.getIntros(0);
            })
            $(document).on('click', '.intro_table_k ', function () {
                $scope.getIntros(1);
            })
            $(document).on('click', '.intro_table span', function () {
                console.log(this);
                s_or_k=0;//soghra
                var element=this;
                if(this.classList.contains("intro_s"))    s_or_k=0;
                if(this.classList.contains("intro_k"))    s_or_k=1;
              //  if (window.localStorage.getItem('selected_reader_s_or_k')) {
                 //   $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
                  //  switch ($scope.selected_reader_s_or_k) {

                   switch (s_or_k) {

                        
                        case 0:
                            addon_s_or_k = 'AddonS/';
                            break;
                        case 1:
                            addon_s_or_k = 'AddonK/';
                    }
                    console.log('%c (s|k) : ' + addon_s_or_k, 'color: orange');
              //  }
              
                SA = this.parentNode.parentNode.id.split('|');
                S = SA[0];
                A = SA[1];
                sura_num = zeroFilled = ('000' + S).substr(-3);
                ayah_num = zeroFilled = ('000' + A).substr(-3);;
                  fileName = "S" + sura_num + "A" + ayah_num + "I.mp3";
                //   if($scope.telawa_reader_local){
                //     $scope.intro_audio_src = default_sound_server_shamarly + addon_s_or_k + "S" + sura_num + ".int/" + fileName;

                // }else
               // if ($scope.selected_reader_s_or_k==0) 
                if(s_or_k==0)letter="S"; else  letter="K";
                 
                //
                 // $scope.intro_audio_src = default_sound_server_shamarly + addon_s_or_k +  fileName;
                 //check if file exist local or not 
                 //
                 //
                 //
                 
                 
                                
                 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    window.rootFS = fileSystem.root;
                    if(s_or_k==0) 
                        $scope.intro_audio_src = window.rootFS.fullPath +local_intro_s_path+"/" +  fileName;
                        else 
                        $scope.intro_audio_src = window.rootFS.fullPath +local_intro_k_path+"/" +  fileName;
                    fileSystem.root.getFile($scope.intro_audio_src, { create: false }, function(fileEntry){//exist in local
                        
                        $scope.intro_audio_src  =fileEntry.nativeURL;
                        $scope.intro_local=true;
                        //  window.rootFS.fullPath +local_intro_s_path+"/" +  fileName; 
                        $scope.play_intro(fileName, element);
                        
                    },
                    function(){//not in local thin try online 
                        $scope.intro_audio_src = default_sound_server_shamarly +addon_s_or_k+"/" +  fileName;
                        $scope.intro_local=false;
                        $scope.play_intro(fileName, element);
                    });
                }, function (evt) {//getFSFail
                    console.log(evt.target.error.code);
                }); //of requestFileSystem
                /////
                //
                //
                
            });
        })


         

        $scope.getZyadat=function(){
            $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            if($scope.selected_reader_s_or_k==1)
            {/// show zyadat  hide ossol
                $('#Zyadat').show();
                $('#Ososol').hide();
            }else
            if($scope.selected_reader_s_or_k==0)
            {/// show osool  hide zyadat
                $('#Ososol').show();
                $('#Zyadat').hide();
            } 

        }
        // ---- Audio Player : osool : Play ---- //
        $scope.play_osol = function (filename, el) {
            if ($scope.selected_reader_s_or_k==0) letter="S"; else  letter="K";
            // ---- Audio Player : osool : onPlay ---- //
            $('.osol_table').find(".ossol_span_play").addClass("ossol_span ");
            $('.osol_table').find(".ossol_span_play").removeClass("ossol_span_play");
            audio_player = document.getElementById('audio');
            // ---- Audio Player : osool : onEnd ---- //
            audio_player.onended = function () {
                $(el).find(".ossol_span_play").addClass("ossol_span ");
                $(el).find(".ossol_span_play").removeClass("ossol_span_play");
            }
            // ---- Audio Player : osool : onError ---- //
            audio_player.onerror = function (event) {
                console.log('error:', event);
                audio_player.pause();
                $(el).find(".ossol_span_play").addClass("ossol_span ");
                $(el).find(".ossol_span_play").removeClass("ossol_span_play");
            }
            // ---- Files : Handling ---- //
            if (quraat_name == 'shamarly') {
                var local_sound_path = window.localStorage.getItem('general_settings');
            } else {
                var local_sound_path = window.localStorage.getItem('general_settings_m');
            }
            if (local_sound_path !== null && local_sound_path != '') { // ... if localStorage not null
                if (local_sound_path == '' || local_sound_path == 'undefinded' || local_sound_path == undefined) {
                    str_src = default_sound_server_shamarly + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                } else {
                    if (local_sound_path.substr(-1) != '/') { local_sound_path += '/'; }
                    if (local_sound_path.indexOf("Taha") > 0 || local_sound_path.indexOf("Hany") > 0) {
                        str_src = local_sound_path + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    } else {
                        str_src = local_sound_path + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    }
                }
                // } else { str_src = default_sound_server_shamarly + taha + osool + filename + ".mp3"; }

            } else { str_src = default_sound_server_shamarly  + osool+letter+"/" + filename + ".mp3"; }
            if (audio_player.src != str_src) { // ... make sure audio_player.src = str_src
                audio_player.src = str_src;
            }
            // ---- Audio Player : osool : onPaused ---- //
            if (audio_player.paused) {
                audio_player.oncanplay = function () { }
                audio_player.play();
                $(el).find(".ossol_span").addClass("ossol_span_play");
                $(el).find(".ossol_span").removeClass("ossol_span");
            } else { audio_player.pause(); }
        }

        //-----         -------------//
        $scope.getTelawah = function () {
            if (typeof alkobra == 'undefined') {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                if (!window.localStorage.getItem('switch_n.json')) { script.src = "common_files/switch_n.json"; } else { script.innerHTML = window.localStorage.getItem('switch_n.json'); }

                // Fire the loading
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(script);
            }

            $("#audioPlayer").hide();

            // From - To
            
            setTimeout(function () {
                if($('#rwah_list').html()=='')
                {
                            $('#rwah_list').html('');
                        var rawy_options = ' <option value="0"> اختر القارئ</option>';
                    //$('#rwah_list').html(rawy_options);
                        $('#rwah_list').append(rawy_options);
                        $.each(alkobra, function (indx, val) {
                                    if (val.active_sound == 1) {
                                        if(val.local) local=" [محليا] "; else local="";
                                        rawy_options = '<option class="'+val.file_name_format+'" value="' + val.folder + '" type="' + val.Type + '" tosura="' + val.tosura + '" toaya="' + val.toaya + '"> ' + val.shikh + ' / ' + val.khatma + ' / ' + val.text +local+ '</option>';
                                        $('#rwah_list').append(rawy_options);
                                    }
                                });
                    }
                    }, 300);
                

        }
        // ---- Get Introductions ---- //
        $scope.getIntros = function (type) {
            console.log(type);
            setTimeout(function () { $scope.read_intro_data(type); }, 120);
            return true;
        };

        // ---- Replace Alphabets ---- //
        $scope.arquery = function (text) {
            var replace_arr = [
                "أ",
                "ا",
                "إ",
                "آ",
                "ي",
                "ى",
                "ه",
                "ة",
            ];
            var with_arr = ["(أ|ا|آ|إ)",
                "(أ|ا|آ|إ)",
                "(أ|ا|آ|إ)",
                "(أ|ا|آ|إ)",
                "(ي|ى)",
                "(ي|ى)",
                "(ه|ة)",
                "(ه|ة)",
            ];
            var new_arr = {};
            var ret_urn = '';
            for (var i = 0; i < replace_arr.length; i++)
                new_arr[replace_arr[i]] = with_arr[i];
            var len = text.length;
            var current = '';
            for (var i = 0; i < len; i++) {
                current = text.substr(i, 1);
                if (new_arr[current]) {
                    ret_urn += new_arr[current];
                } else {
                    ret_urn += current;
                }
            }
            return ret_urn;
        };

        // ---- Get Farshiat : Handling ---- //
        $scope.read_farshiat_data = function () {
            subCallback = function () {
                var infradat_settings = JSON.parse(window.localStorage.getItem('setting'));
                console.log('setting : ' + infradat_settings.infradat);
                // var ajax_url = farshiat_tool_api_url + '/index/' + infradat_settings.infradat;
                var ajax_url = farshiat_tool_api_url + '/index/' + true;
                console.log("read_farshiat_data called");
                console.log('ajaxStart');
                $('body').prepend('<div class="overlay_loader" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');

                $http({
                    method: 'POST',
                    url: ajax_url,
                    data: {}
                }).then(function successCallback(response) {
                    console.log('ajaxComplete');
                    $(".overlay_loader").remove();
                    // console.log(response.data);
                    $("#position_item_view").html('');
                    $("#position_item_view").hide('');
                    $("#farshiat_content ").html(response.data);
                    $("#farshiat_content").css('display', 'block');
                    $("#farshiat_contaner").css('display', 'block');
                    
                   // $(".tables_tab .tab-content").css('height', $(window).height() - 50);
                    $("form input[type=submit]").click(function () {
                        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
                        $(this).attr("clicked", "true");
                    });
                    $("#readers_form").submit(function (event) {
                        event.preventDefault();
                        $('.farshiat_table').removeClass('agree_dis_agree')
                        $('#farshiat_request_message').removeClass('success');
                        $('#farshiat_request_message').removeClass('error');
                        var ajax_url = farshiat_tool_api_url + "/get_agree_disagree_readers";
                        var data_type = $("input[type=submit][clicked=true]").attr('data_type');
                        if(data_type=="infradat")
                        ajax_url = farshiat_tool_api_url +"/get_single_rawy_infradat_list";
                        var option1_parent = $('.readers1').find("option:selected").attr('class');
                        var option2_parent = $('.readers2').find("option:selected").attr('class');
                        $.ajax({
                            type: 'POST',
                            url: ajax_url,
                            dataType: "json",
                            data: $(this).serialize() + "&data_type=" + data_type + "&option1_parent=" + option1_parent + "&option2_parent=" + option2_parent,
                            success: function (result) {
                                console.log("submit readers form");
                                $('#farshiat_request_message').addClass(result.message_type);
                                $('#farshiat_request_message').html('<p>' + result.message + '</p>');

                                // Test code
                                
                                var response_divs = document.getElementsByClassName('farshiat_table item');
                                // console.log(response_divs[1]);
                                // console.log(response_divs[1].id);
                                for (var i = 0; i < response_divs.length; i++) {
                                    for (var j = 0; j < result.content.length; j++) {
                                        // console.log('%c' + result.content[j], 'color: red');
                                        if (response_divs[i].id == result.content[j]) {
                                            console.log('%c' + response_divs[i], 'color: red');
                                            console.log('%c' + response_divs[i].className, 'color: red');
                                            response_divs[i].className = 'farshiat_table item has_all_pos agree_dis_agree';
                                            console.log('%c' + response_divs[i].className, 'color: red');
                                            // break;
                                        }
                                    }
                                }
                                if (result.message_type == 'success') {

                                    $.each(result.content, function (indx, val) {
                                        $('.farshiat_table#' + val).addClass('agree_dis_agree')
                                    });
                                }

                            },
                            error: function (e) {
                                alert(e);
                            }

                        });
                    });

                   
                    
                }, function errorCallback(response) { // ... Farshiat : onGet : Error
                    console.log('ajaxComplete');
                    $(".overlay_loader").remove();
                    alert('عفواً ، لقد حدث خطأ أثناء احضار البيانات ، يرجى اعادة المحاولة');
                });

                // ---- Farshiat : Search ---- //
                $(document).on('click', '#farshiat_srch_btn', function () {
                    var keword_val = $("#farshiat_srch_input").val();
                    if (keword_val == '' || keword_val == undefined) {
                        alert('اكتب كلمة  على الأقل لبدء البحث');
                        return false;
                    }
                    $("div.farshiat_table").removeClass("search_match");
                    //
                    $("div.farshiat_table a:contains('" + keword_val + "')").parent().addClass("search_match");
                    var res = $scope.arquery(keword_val);
                    var regex = new RegExp(res); // expression here
                    console.log('arquery res');
                    $('.farshiat_table a').each(function () {
                        var title = $(this).attr("title");
                        if (regex.test(title) !== false) {
                            $(this).parent().addClass("search_match");
                            console.log($(this).text() + '-' + regex.test(title));
                        }

                    });
                });

                // ---- Farshiat : Click : one ---- //
                $(document).on('click', '.farshiat_table', function () {
                    var f_id = $(this).attr('id');

                    var ajax_url = farshiat_tool_api_url + '/get_farsh_data/' + f_id;
                    $http({
                        method: 'POST',
                        url: ajax_url,
                        data: {}
                    }).then(function successCallback(response) {
                        console.log(response);
                        $ionicScrollDelegate.scrollTop();
                        //$scope.my_view.content.scrollToTop();
                        $("#position_item_view").html(response.data);
                        $("#position_item_view").css('display', 'block');
                        $("#farshiat_content").css('display', 'none');
                        $("#farshiat_contaner").css('display', 'none');
                       // $(".tables_tab .tab-content").css('height', $(window).height() - 50);
                       $('.wagh_audio_player').off('click');
                       $('.wagh_sound_play').off('click');
                       
                       $('.wagh_audio_player').remove();
                       
                    }, function errorCallback(response) {
                        alert('عفواً ، لقد حدث خطأ أثناء احضار البيانات ، يرجى اعادة المحاولة');
                    });
                });

            }

            // ---- Farshiat : Click : Cancel ---- //
            $(document).on('click', '.cancel_modal', function () {
                $("#single_position_view").css('display', 'none');
                $("#single_position_view").html('');
                $("#position_item_view").css('display', 'none');
                $("#position_item_view").html('');
                $("#farshiat_content").css('display', 'block');
                $("#farshiat_contaner").css('display', 'block');
            });
            subCallback();
        };

        // ---- Get Farshiat ---- //
        $scope.getfarshiat = function () {
            setTimeout(function () { $scope.read_farshiat_data(); }, 120);
            return true;
        };

        // ---- Get Tables ---- //
        $scope.getTables = function () {
            $scope.read_tables_data();
            return true;
        }
        $scope.intro_content = null;

      
        $scope.getKhatama_details=function (jsonPath,name,type){
            var Khatamat_html="";
            var back_name=type+"_back";
            var item_name=type+"_item";
            Khatamat_html='<div class="khatma_header item" ng-click=" "> '+
            '<div class="" style="height: 20px;    width: 100%;">  ' +
            '<a>  '+name+'</a> </div>'+
            '<div class="'+back_name+'" style="height: 20px;    width: 100%;">  ' +
            '<a>   << الرجوع</a> </div>'+
            
            ' </div>';
          //  jsonPath="http://www.quraat.info/khatma/khatma_moyasra/api_controller/index";
            $.ajax({
                type: 'get',
                url: jsonPath,
                dataType: "json",
                data: '',
                success: function (result) {
                   
                   
                    console.log(result);
                    
                  
                    for (var k = 0; k <  result.length ; k++) {
                        console.log(result[k]);
                        if(result[k].text=="")result[k].text=result[k].file;
                         Khatamat_html+='<div id="'+result[k].file_id+'" text="'+result[k].text+'" class="'+item_name+' item" ng-click=""> <div style="height: 20px;    width: 100%;">  ' +
                       '<a>  '+result[k].text+'</a> </div>'+
                       '<div style="margin-right: 30%;  width: 70px; margin-left: auto;">   </div></div>';
    
    
                    }
                  document.getElementById(type).innerHTML=Khatamat_html;

                 
                  $(document).off('click', '.'+back_name+'');
                  $(document).on('click', '.'+back_name+'', function () {
                    $scope.getKhatamat(type);
                  })
                  $(document).off('click', '.'+item_name+'');
                  $(document).on('click', '.'+item_name+'', function () {
                      file_id=this.id;
                      text=this.getAttribute('text'),
                      
                      $("#myModal1 .quarter_name").html(text);
                      audio_url=" https://drive.google.com/uc?export=mp3&id="+file_id;
                      var audio_player = $("#myModal1 #q_audioPlayer");
                      audio_player.attr('src',audio_url);
                      $('#myModal1').modal();
                      //$('.modal-backdrop').remove();
                    //   $( ".request_overlay" ).remove( );
                      if(document.getElementById('audio'))document.getElementById('audio').pause(); 
         

                      audio_player[0].play();
                  })

                 
                },
                error: function errorCallback(response) { // ... Farshiat : onGet : Error
                    console.log('ajaxComplete');
                    console.log(response);
                 
                    alert('عفواً ، لقد حدث خطأ أثناء احضار البيانات ، يرجى اعادة المحاولة');
                }

            });

        }
        //khatamat or khadmat
        $scope.getKhatamat =function(type=""){
            if(type=="") type="khatma_content" ;
               
            get_khatamat_data=function(){

                if(type=="khatma_content")
                data_list=eval('khatma');
                else  if(type=="khedma_content")
                data_list=eval('khedma');

                var Khatamat_html="";
                for (var k = 0; k <  data_list.length ; k++) {
                    console.log(data_list[k]);
                     Khatamat_html+='<div id="'+data_list[k].path+'" name="'+data_list[k].name+'"  type="'+type+'" class="khatamat_table item" ng-click=""> <div style="height: 20px;    width: 100%;">  ' +
                   '<a>  '+data_list[k].name+'</a> </div>'+
                   '<div style="margin-right: 30%;  width: 70px; margin-left: auto;">   </div></div>';


                }
              
              document.getElementById(type).innerHTML=Khatamat_html;
              $(document).off('click', '.'+type+' .khatamat_table.item');
              $(document).on('click', '.'+type+' .khatamat_table.item', function () {
                var path ='http://'+this.id+"/MP3Files.json";// this.id;
                console.log(path);
                katama_name=this.getAttribute('name');
                type=this.getAttribute('type');
                $scope.getKhatama_details(path,katama_name,type);
               // $scope.open_intro_aya(SuraAya);
            });

            }
            //get khatamat from online 
            if(type=="khatma_content")
            khatamat_online_json="https://quraat.info/sound//common_files/khatma.json"+ "?ver=" + $scope.current_timestamp; 
            else  if(type=="khedma_content")
            khatamat_online_json="https://quraat.info/sound//common_files/khedma.json"+ "?ver=" + $scope.current_timestamp; 
           ///or  get khtamat from local 
            var script = document.createElement('script');
            script.type = 'text/javascript';
            dataDirectory = '';
            script.src=khatamat_online_json;
            script.onerror = function(){
                $(".overlay_loader").remove();
                alert('عفواً ، لقد حدث خطأ أثناء احضار البيانات ، يرجى اعادة المحاولة');
              }
            // if (quraat_name == 'shamarly') {
            //     script.src = dataDirectory + common_files + 'khatma.json' + "?ver=" + $scope.current_timestamp;
            // } else {
            //     script.src = dataDirectory + madina_more_data + 'khatma.json' + "?ver=" + $scope.current_timestamp;
            //     // script.src = dataDirectory + data_madina + 'tables.json' + "?ver=" + $scope.current_timestamp;
            // }

            script.onload = get_khatamat_data;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }
        $scope.getMoyasara = function(){

            $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            Moyasara_url="http://www.quraat.info/khatma/khatma_moyasra/api_controller/index";
            $.ajax({
                type: 'get',
                url: Moyasara_url,
                dataType: "json",
                data: '',
                success: function (result) {
                   
                   
                    console.log(result);
                    if(result.result_status=='success')
                    {
                        html_result='';
                        len=result.data.length;

                        for(i=0;i<len;i++)
                        { 
                          
                            item=result.data[i];
                            if(i%8==0) {
                              
                                html_result+='<div class="moyasar_item">'+item.part_name+'</div>';
                            }
                          //person_name  console.log('selected_reader_s_or_k=',$scope.selected_reader_s_or_k);
                            if($scope.selected_reader_s_or_k==0) {
                              
                                    html_result+='<div id="moyasara_'+item.soghra_id+'" class="moyasar_click moyasar_item">'+item.q_name+'</div>';
                            }
                           else if($scope.selected_reader_s_or_k==1) {
                                    html_result+='<div id="moyasara_'+item.kobra_id+'" class="moyasar_click moyasar_item">'+item.q_name+'</div>';

                             }
                             
                           

                        }

                        document.getElementById('moyasara_content').innerHTML=html_result;

                    }
                   
                   
                },
                error: function errorCallback(response) { // ... Farshiat : onGet : Error
                    console.log('ajaxComplete');
                    $(".overlay_loader").remove();
                    alert('عفواً ، لقد حدث خطأ أثناء احضار البيانات ، يرجى اعادة المحاولة');
                }

            });
            $(document).off('click', '.moyasar_click');
            $(document).on('click', '.moyasar_click', function () {
                var moyasar_item = this.id;
                qd_id=moyasar_item.split('_')[1];
                console.log(moyasar_item);
               //qd_id=1;
                var khatma_tool_api="http://www.quraat.info/khatma/khatma_moyasra/api_controller/";
                var personsfolder ='http://sound.quraat.info/info/names/';
                var imagesfolder ='http://sound.quraat.info/info/images/';
                    $("#myModal1 img.additional_img").hide();
                    $("#myModal1 img.additional_img").attr('src', '');	
                    $("#myModal1 a > img").unwrap();						
                    $('body').prepend('<div class="request_overlay" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
                    $('.rob3_info').html('');
                    jQuery.ajax({
                    url:  khatma_tool_api+"get_single_quarter_details/"+qd_id,
                     type : "POST",
                     dataType: "json",
                     data :  '',
                     success : function(result){
                      if(result.result_status=='success')
                      {  var audio_player = $("#myModal1 #q_audioPlayer");
                       $item = result.data; 
                       var default_img = 'images/quraan2.png';
                       $("#myModal1 .modal-title span").text($item.q_name);
                        $("#myModal1 #reader_area .person_area span").html("<a class='person_link' person-name='"+$item.reader_name+"' href='"+personsfolder+$item.reader_name+".txt'"+">"+$item.reader_name+"</a>");
                        t = imagesfolder+$item.reader_name+'.jpg';
                        $("#myModal1 #reader_area img.main_img").attr('src', t);
                        $("#myModal1 #reader_area img").addClass('real_img');   
                        $("#myModal1 #reader_area img.main_img").wrap($('<a class="person_link" person-name="'+$item.reader_name+'" href="'+ personsfolder+$item.reader_name+".txt" +'">',{
                        }));
                        $("#myModal1 #reader_area .additional_person_area span").html('');
                        if($item.additional_reader_data!='')
                           {     
                              additional = imagesfolder+$item.additional_reader_data+'.jpg';
                               $("#myModal1 #reader_area img.additional_img").attr('src', additional); 
                               $("#myModal1 #reader_area img.additional_img").show();
                               $("#myModal1 #reader_area .additional_person_area span").append("<a class='person_link additional' person-name='"+$item.additional_reader_data+"' href='"+personsfolder+$item.additional_reader_data+".txt'"+">"+$item.additional_reader_data+"</a>");
                               $("#myModal1 #reader_area img.additional_img").wrap($('<a class="person_link" person-name="'+$item.additional_reader_data+'" href="'+ personsfolder+$item.additional_reader_data+".txt" +'">',{
                               }));
                           }
                           $robb3_file = $item.rob3_txt_url;
                       $('body').prepend('<div class="request_overlay" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
                       $.ajax({
                        url: cross_proxy+ $robb3_file,
                        type: 'GET',
                        success: function (data, textStatus) {	
                         if (textStatus == 'success') {
                          $('request_overlay').remove('');
                          $('.rob3_info').html(data.replace(/\n/g, "<br /><br />"));
                         }
                        },
                        error: function (data) {
                         $('.rob3_info').html('');
                   
                        }
                       });
                       var res = $item.auditor_name.split("-");
                       $("#myModal1 #auditor_area .person_area span").html("<a  class='person_link' person-name='"+$item.auditor_name+"' href='"+personsfolder+$item.auditor_name+".txt'"+">"+$item.auditor_name+"</a>");
                       t2 = imagesfolder+$item.auditor_name+'.jpg';
                       $("#myModal1 #auditor_area img.main_img").attr('src', t2);
                       $("#myModal1 #auditor_area img").addClass('real_img');
                       $("#myModal1 #auditor_area img.main_img").wrap($('<a class="person_link" person-name="'+$item.auditor_name+'" href="'+ personsfolder+$item.auditor_name+".txt" +'">',{
                       }));
                       $("#myModal1 #auditor_area  .additional_person_area span").html();
                       if($item.additional_auditor_data!='')
                           {     
                              additional = imagesfolder+$item.additional_auditor_data+'.jpg';
                               $("#myModal1 #auditor_area img.additional_img").attr('src', additional);
                               $("#myModal1 #auditor_area img.additional_img").show();
                               $("#myModal1 #auditor_area img.additional_img").wrap($('<a class="person_link" person-name="'+$item.additional_auditor_data+'" href="'+ personsfolder+$item.additional_auditor_data+".txt" +'">',{
                               }));
                               $("#myModal1 #auditor_area  .additional_person_area span").append("<a  class='person_link additional' person-name='"+$item.additional_auditor_data+"' href='"+personsfolder+$item.additional_auditor_data+".txt'"+">"+$item.additional_auditor_data+"</a>");
                   
                              } 
                       audio_player.attr('src',$item.link);
                       $('#myModal1').modal();
                       //$('.modal-backdrop').remove();
                       $( ".request_overlay" ).remove( );
                       document.getElementById('audio') .pause(); 
          
 
                       audio_player[0].play();
                       $('body').on('click',' .person_link',function(e){
                        e.preventDefault();
                        var obj = $(this);
                        var person_link = obj.attr('href');
                        var person_name = obj.attr('person-name');
                        if(!obj.hasClass('disabled_person_link')){
                          $('body').prepend('<div class="request_overlay" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
                         $.ajax({
                          url: cross_proxy + person_link,
                          type: 'GET',
                          success: function (data, textStatus) {
                           if (textStatus == 'success') {
                            $('#personModal #person_modal .modal-title span.reader').html(person_name);
                            $('#personModal #person_modal #person_info_data').html(data.replace(/\n/g, "<br /><br />"));
                           $('#personModal #person_modal .person_img img').attr('src' , imagesfolder+person_name+".jpg");
                           $('#personModal #person_modal .person_img img').show();
                           $('#personModal').modal();
                           $('#personModal').show()

                           $(".request_overlay").remove();
                   
                           } else {
                            obj.attr('href', '#');
                            $(".request_overlay").remove();
                           }
                          },
                          error: function (data) {
                           // alert('woops!'); //or whatever
                           obj.attr('href','') ;
                           obj.addClass('disabled_person_link') ;
                          $(".request_overlay").remove();
                   
                   
                          }
                         });
                        }
                       });
                      }
                     },error:function(e){
                      alert(e);
                     }
                   
                    });
                   
                   
                   


            });
            
        }
        

        /////////////
        $scope.play_intro = function (filename, el) {

            s_or_k=0;//soghra
            if(el.classList.contains("intro_s"))    s_or_k=0;
            if(el.classList.contains("intro_k"))    s_or_k=1;
            // ---- Audio Player : intro : onPlay ---- //
        $('.intro_table ').find(".intro_k.intro_k_play_span_play").addClass("intro_k_play_span");
        $('.intro_table ').find(".intro_k.intro_k_play_span_play").removeClass("intro_k_play_span_play");

        $('.intro_table ').find(".intro_s.intro_s_play_span_play").addClass("intro_s_play_span");
        $('.intro_table ').find(".intro_s.intro_s_play_span_play").removeClass("intro_s_play_span_play");
            audio_player = document.getElementById('audio');
            // ---- Audio Player : osool : onEnd ---- //
            audio_player.onended = function () {
                if(s_or_k==0)
                {
                    $(el).addClass("intro_s_play_span");
                    $(el).removeClass("intro_s_play_span_play");
                }else
                {
                    $(el).addClass("intro_k_play_span ");
                    $(el).removeClass("intro_k_play_span_play");
                }
              
            }
            // ---- Audio Player : osool : onError ---- //
            audio_player.onerror = function (event) {
                console.log('error:', event);
                audio_player.pause();
                // $(el).find("span").addClass("intro_k_play_span ");
                // $(el).find("span").removeClass("intro_k_play_span_play");
                if(s_or_k==0)
                {
                    $(el).addClass("intro_s_play_span");
                    $(el).removeClass("intro_s_play_span_play");
                }else
                {
                    $(el).addClass("intro_k_play_span ");
                    $(el).removeClass("intro_k_play_span_play");
                }
            }
            // ---- Files : Handling ---- //
            str_src=$scope.intro_audio_src;
       
            if (audio_player.src != str_src) { // ... make sure audio_player.src = str_src
                audio_player.src = str_src;
            }
            // ---- Audio Player : osool : onPaused ---- //
            if (audio_player.paused) {
                audio_player.oncanplay = function () { }
                audio_player.play();
                // $(el).find("span").addClass("intro_k_play_span_play");
                // $(el).find("span").removeClass("intro_k_play_span");
                if(s_or_k==0)
                { 
                    if($scope.intro_local)
                    { 
                        $(el).removeClass("intro_s_play_span");
                     $(el).removeClass("intro_s_L_play_span");
                    $(el).addClass("intro_s_L_play_span_play");

                    }
                    else {
                        $(el).removeClass("intro_s_play_span");
                        $(el).addClass("intro_s_play_span_play");
                    }
                  
                }else
                {
                    if($scope.intro_local)
                    {
                        $(el).removeClass("intro_k_play_span");
                        $(el).removeClass("intro_k_L_play_span");
                        $(el).addClass("intro_k_L_play_span_play");

                    }
                    else{
                       // $(el).removeClass("intro_k_L_play_span ");
                        $(el).removeClass("intro_k_play_span");
                        $(el).addClass("intro_k_play_span_play");
                    }
                  
                }
            } else { 
                // $(el).find("span").addClass("intro_k_play_span");
                // $(el).find("span").removeClass("intro_k_play_span_play");
                if(s_or_k==0)
                {
                    $(el).addClass("intro_s_play_span");
                    $(el).removeClass("intro_s_play_span_play");
                }else
                {
                    $(el).addClass("intro_k_play_span");
                    $(el).removeClass("intro_k_play_span_play");
                }
                audio_player.pause();
            
            }
        }
        ////////////////////
    
        // ---- Get Intro : Handling ---- //
        $scope.read_intro_data = function (type) {
            $scope.intro_play_s_k=type;
            subCallback = function () {
                str = "";
                for (var i = 0; i < intro_index.length; i++) {
                    var item = intro_index[i];
                    var S = item.sura_order;
                    var A = item.aya_number;
                    if(item.type=="B")
                    var inro_audio=' <span  class="intro_s_play_span  intro_s"></span><span  class="intro_k_play_span intro_k"></span> ';
                    else if(item.type=="S")
                    var inro_audio=' <span  class="intro_s_play_span  intro_s"></span><span  class="  intro_k"></span> ';
                  
                    else if(item.type=="K")
                    var inro_audio=' <span  class="   intro_s" ></span><span  class="intro_k_play_span intro_k"></span> ';
                  
                    
                    str += "<div  id=" + S + "|" + A + " class='intro_table item'    ng-click=''   > <div style='height: 20px;'>  <a  > " + item.ayahtext + "  (" + A + ")</a> </div><div style='margin-right: 30%;  width: 70px; margin-left: auto;'> "+inro_audio+"</div></div>";
                }
                $scope.intro_content = document.getElementById('intro_content');
                if ($scope.intro_content) {
                //     if ($scope.intro_play_s_k==0)// Soghra
                //     var kobra_soghra_buttons="<div class='intro_tap_switch' style=''> <div  class='intro_table_s intro_table item intro_selected ' ng-click='getIntros(0)'>صغرى</div>   <div  class='intro_table_k intro_table item' ng-click='getIntros(1)'>كبرى</div></div>"
                //    else
                //    var kobra_soghra_buttons="<div class='intro_tap_switch' style=''> <div  class='intro_table_s intro_table item  ' ng-click='getIntros(0)'>صغرى</div>   <div  class='intro_table_k intro_table item intro_selected' ng-click='getIntros(1)'>كبرى</div></div>"

                    $scope.intro_content.innerHTML = str; //kobra_soghra_buttons+
                }
                else console.log("no intro_content ");
                $(document).off('click', '.intro_table a');
                $(document).on('click', '.intro_table a', function () {
                    var SuraAya =this.parentNode.parentNode.id;// this.id;
                    $scope.open_intro_aya(SuraAya);
                });
            };

            $scope.open_intro_aya = function (SuraAya) {
                window.localStorage.setItem('browse_to_data', SuraAya);
                $scope.close_tables();
            }

            // Main Code
            // $scope.current_timestamp = window.localStorage.getItem('timestamp');
            // var script = document.createElement('script');
            // script.type = 'text/javascript';
            // dataDirectory = '';
            // if (quraat_name == 'shamarly') {
            //     script.src = default_sound_server_shamarly + taha + 'intro_index.json' + "?ver=" + $scope.current_timestamp;
            // } else {
            //     script.src = default_sound_server_shamarly + taha + 'intro_index.json' + "?ver=" + $scope.current_timestamp;
            // }
            // script.onload = subCallback;



            // Test 1 : selected kobra or soghra
            // if ($scope.selected_reader_s_or_k != 1) $scope.selected_reader_s_or_k = 0;
            // console.log('%c' + $scope.selected_reader_s_or_k, 'color: blue');
            // if ($scope.selected_reader_s_or_k == 1) {
            //     script.src = 'http://sound.quraat.info/common_files/intro_kobra.json';
            //     // console.log('%c' + script.src, 'color: blue');
            // } else if ($scope.selected_reader_s_or_k == 0) {
            //     script.src = 'http://sound.quraat.info/common_files/intro_soghra.json';
            //     // console.log('%c' + script.src, 'color: blue');
            // }
            // console.log('%c' + script.src, 'color: blue');

            // Test 2
            $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            console.log('%cselected_reader_s_or_k 0=s 1=k : ' + $scope.selected_reader_s_or_k, 'color: orange');
            //switch ($scope.selected_reader_s_or_k) {
                switch (type) {
                
                case 0:   
                    if (window.localStorage.getItem('intro_s.json')) {
                        selected_reader_s_or_k = (window.localStorage.getItem('intro.json')).toString();
                        selected_reader_s_or_k = selected_reader_s_or_k.substring(selected_reader_s_or_k.indexOf("=") + 1);
                        selected_reader_s_or_k = JSON.parse(selected_reader_s_or_k);
                        // selected_reader_s_or_k=$filter('filter')(selected_reader_s_or_k, {
                        //     type:"!K", 
                        // }, true);
                        intro_index = selected_reader_s_or_k;
                        console.log(intro_index);
                    }
                    break;
                case 1:
                    if (window.localStorage.getItem('intro_k.json')) {
                        selected_reader_s_or_k = (window.localStorage.getItem('intro.json')).toString();
                        selected_reader_s_or_k = selected_reader_s_or_k.substring(selected_reader_s_or_k.indexOf("=") + 1);
                        selected_reader_s_or_k = JSON.parse(selected_reader_s_or_k);
                        // selected_reader_s_or_k=$filter('filter')(selected_reader_s_or_k, {
                        //                             type:"!S", 
                        //                         }, true);
                        intro_index = selected_reader_s_or_k;
                        console.log(intro_index);
                    }
                    break;
            }
            // console.log(intro_index);

            subCallback();


            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            if (typeof intro_index === 'undefined' || intro_index === null) head.appendChild(script);
            else subCallback();
        }

        // ---- Get Tables : Handling ---- //
        $scope.read_tables_data = function () {
            subCallback = function () {
                var table_content = document.getElementById('tables_content');
                table_content.innerHTML = '';
                for (var i = 0; i < tables_data.length; i++) {
                    var item = tables_data[i];
                    str = "<div  id=" +
                        item.image_name +
                        " class='tables_table item'    ng-click='showTable(" +
                        item.image_name +
                        ")'   > <a  > " +
                        item.table_display +
                        "</a></div>";
                    if (table_content) { table_content.innerHTML += str; } else { console.log("no table_content "); }
                }
            }

            // ---- Close Table : Handling ---- //
            $scope.CloseTable = function (image_filename) {
                var table_image = document.getElementById('table_image');
                var tables_content = document.getElementById('tables_content');
                $(table_image).css('display', 'none');
                $(tables_content).css('display', 'block');
            }

            $scope.showTable = function (image_filename) {

                var table_image = document.getElementById('table_image');
                var tables_content = document.getElementById('tables_content');

                table_image.src = 'http://quraat.info/4review/images/' + image_filename + '.png';
                $(table_image).css('display', 'block');
                $(tables_content).css('display', 'none');
                console.log(image_filename);
            }
            $(document).off('click', '.tables_table')
            $(document).on('click', '.tables_table', function () {
                var image_filename = this.id;
               // $scope.my_view.content.scrollToTop();
                $ionicScrollDelegate.scrollTop();

                $scope.showTable(image_filename);
            });
            $(document).off('click', '#table_image');
            $(document).on('click', '#table_image', function () {
                var image_filename = this.id;
                $scope.CloseTable(image_filename);
            });
            $scope.current_timestamp = window.localStorage.getItem('timestamp');
            var script = document.createElement('script');
            script.type = 'text/javascript';
            dataDirectory = '';
            if (quraat_name == 'shamarly') {
                script.src = dataDirectory + common_files + 'tables.json' + "?ver=" + $scope.current_timestamp;
            } else {
                script.src = dataDirectory + madina_more_data + 'tables.json' + "?ver=" + $scope.current_timestamp;
                // script.src = dataDirectory + data_madina + 'tables.json' + "?ver=" + $scope.current_timestamp;
            }

            script.onload = subCallback;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }

        $scope.close_tables = function () {
            $scope.opened = false;
            console.log('tables is closed!')
         
            //stop all audios 
             if(document.getElementById('audio'))document.getElementById('audio').pause(); 
            $("#myModal1 #q_audioPlayer")[0].pause();
            $state.go('quraat', {}, { reload: true });
        }


    })