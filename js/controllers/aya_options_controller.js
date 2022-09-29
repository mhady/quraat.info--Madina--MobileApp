angular.module('starter')

    .service('aya_options_srv',  function ($location,$rootScope,$http ,$filter,common_serv,setting_srv) {
 


        self=this;
          /*******
         * 
         */
           this.hide_msgs1=function () {
            $("#msgdiv1").hide();
            $("#msgdiv1").html('');
            if (setting_srv.settings.msgBox == true) {
                $("#msgdiv").hide();
            }
        }

        this.hide_msgs=function hide_msgs() {
            $("#msgdiv").html(''); //<div id="font_change"><div class="increase"> + </div><div class="decrease"> - </div></div>
            if (setting_srv.settings.msgBox == true) {
                $("#msgdiv").hide();
            }
        }


        

        /**********
         * 
         */
         this.open_aya_options = function (a_index) {
            is_aya_selected = true;
            self.hide_msgs();
            self.hide_msgs1();
            if ($("#msgdiv").css('display') === 'none') {
                $("#msgdiv").show();
            }
            document.getElementById('aya_farsh_icon').style.display = "none";
            document.getElementById('aya_farsh_icon_blocked').style.display = "none";
            //unselect the old aya if exist 
            if (self.current_clicked_ayah) {
                if (quraat_name == 'shamarly') {
                    $("[ayah_index='" + self.current_clicked_ayah.ayah_index + "']").css({
                        backgroundColor: "rgba(0, 255, 50, 0)"
                    });
                    $("[ayah_index='" + self.current_clicked_ayah.ayah_index + "']").removeClass("current_clicked_aya");
                }
                else{
                    $("[sura_number='" + self.current_clicked_ayah.sura_number + "'][ayah='" + self.current_clicked_ayah.ayah_number + "']").css({
                        backgroundColor: "rgba(0, 255, 50, 0)"
                    });
                    $("[ayah_index='" + self.current_clicked_ayah.ayah_index + "']").removeClass("current_clicked_aya");
                }
           
            }

          
            index_sts = '' + a_index + '';
            self.now_intro_playing_index = 0;
           self.current_clicked_ayah = $filter('filter')(common_serv.aya_data, {
                ayah_index: a_index
            }, true)[0];
            self.intro_audio_src = '';
            self.comments_txt = '';
            if (quraat_name == 'shamarly') {
                var sura = parseInt(self.current_clicked_ayah.sura);
                var ayah = parseInt(self.current_clicked_ayah.ayah);
              
            }
            else
            { var sura = parseInt(self.current_clicked_ayah.sura_number);
                var ayah = parseInt(self.current_clicked_ayah.ayah_number);
                }

                if (quraat_name == 'shamarly')
                var ayahtext =   self.current_clicked_ayah.ayahtext;
            else {
                var ayahtext = $filter('filter')(common_serv.ayah_data_info, {
                    ayah: self.current_clicked_ayah.ayah_number,
                    sura: self.current_clicked_ayah.sura_number
                }, true)[0].ayahtext;
            }
            $('.aya_option_bar_text').html(ayahtext);

           if (self.current_clicked_ayah) {
                var sura_from_curr_pg = common_serv.pageToSura(self.current_clicked_ayah.page_number);//common_serv.current_page);
                var sura_name = sura_from_curr_pg.sura_name;
                console.log('  open_aya_options  sura_name=' + sura_name);

                var local_sound_path = window.localStorage.getItem('general_settings_m');

                var awgoh_sound_server = default_sound_server_shamarly;
                if (local_sound_path !== null && local_sound_path != '') {

                    if (local_sound_path.indexOf("http://127.0.0.1") == 0) {
                        awgoh_sound_server = local_sound_path;

                    }
                }
             //   awgoh_sound_server = awgoh_sound_server.replace('http://127.0.0.1', '');
             //   awgoh_sound_server = "wagh_url_" + awgoh_sound_server.replace(':', '__');



                // //change selected ayah colo
                // Test code
                var ajax_url = farshiat_tool_api_url + '/get_farsh_position_details/' ;// + sura_name + "/" + ayah + "/" + awgoh_sound_server;
                audio_player = document.getElementById('audio');
                audio_player.pause();
                document.getElementById('tayseer_moalem_playaudio_icon').src = './images/audioplay_tayseer_moalem.png';

                
                if (quraat_name == 'shamarly') {
                    $("[ayah_index='" + self.current_clicked_ayah.ayah_index + "'][ayah='" + self.current_clicked_ayah.ayah + "']").css({
                        backgroundColor: "rgba(81, 160, 55, 0.28)"
                    });
                    $("[ayah_index='" + self.current_clicked_ayah.ayah_index + "'][ayah='" + self.current_clicked_ayah.ayah + "']").addClass('current_clicked_aya');
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                    document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
              


                } else {
                    $("[sura_number='" + self.current_clicked_ayah.sura_number + "'][ayah='" + self.current_clicked_ayah.ayah_number + "']").css({
                        backgroundColor: "rgba(155, 80, 50, 0.4)"
                    });
                    document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                    document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                }
                setTimeout(function () {
                    self.is_has_comment();
                    if (self.aya_has_comment == true) {
                        self.hide_aya_text_option = true;
                        $('#get_aya_text').hide();
                    } else {
                        $('#get_aya_text').show();
                        self.hide_aya_text_option = false;
                    }

                    common_serv.get_telawa_reader(setting_srv.settings);
                    self.is_has_intro_audio();
                    $rootScope.$broadcast('init_audio_controller');
                }, 50);
                $('#ayah_option_audio_player').show();
                if (sura == 2 && ayah >= 6 && ayah < 44) {
                    self.hide_aya_text_option = true;
                    $('#get_aya_text').hide();
                } else {
                    $('#get_aya_text').show();
                    self.hide_aya_text_option = false;
                }
                // Test code : End
                // Test code
                //Check tayseer moalem for awel rob3en
                if ((sura == 1 || sura == 2) && (ayah >= 1 && ayah < 44)) {
                    document.getElementById('aya_tayseer_moalem_icon').style.display = "inline";
                    self.hide_aya_text_option = true;
                    $('#get_aya_text').hide();
                } else {
                    document.getElementById('aya_tayseer_moalem_icon').style.display = "none";
                    $('#get_aya_text').show();
                    self.hide_aya_text_option = false;
                    self.hide_aya_marks = false;
                    $('#get_aya_marks').show();
                }

                
                $.getJSON('./' + 'common_files/' + 'positions.json', function (data) {
                    for (i = 0; i < data.positions.length; i++) {
                        if (data.positions[i].sura_name == sura_name && data.positions[i].aya_number == ayah) {
                            console.log('%c Fashiat Data : ' + data.positions[i].aya_text, 'color: orange');
                            $('#get_aya_marks').hide();
                            self.hide_aya_marks = true;
                            // $("#single_position_view").html(response.data);
                            document.getElementById('aya_farsh_icon_blocked').style.display = "inline";
                            // try get farshiat from online 
                        }
                    }
                        if(document.getElementById('aya_farsh_icon_blocked').style.display == "inline" )
                        {
                            var wagh_path = encodeURIComponent(awgoh_sound_server +addon_s_or_k+"Awgoh/");
                            var ajax_url =   farshiat_tool_api_url+'/get_farsh_position_details'+'/'+ sura_name + "/" + ayah + "/" + awgoh_sound_server; 		  
                             $http({
                                method: 'POST',
                                url: ajax_url, 
                                dataType: 'json', 
                                data : "sura_name="+sura_name+"&ayah="+ayah+"&wagh_url="+wagh_path+'&mobile_ver=0',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                 
                            }).then(function successCallback(response) {
         
                             console.log(response);
                             if (response.data != "no_farsh") {
                                 $('#get_aya_marks').hide();
                                 self.hide_aya_marks = true;
                                 $("#single_position_view").html( common_serv.stripScripts(response.data));
                                ;
                                 document.getElementById('aya_farsh_icon_blocked').style.display = "none";
                                 document.getElementById('aya_farsh_icon').style.display = "inline";
                             } else {
                                 self.hide_aya_marks = false;
                                 $('#get_aya_marks').show();
                                 document.getElementById('aya_farsh_icon').style.display = "none";
                             }
         
         
                         }, function errorCallback(response) {
                             document.getElementById('aya_farsh_icon').style.display = "none";
                             document.getElementById('aya_farsh_icon_blocked').style.display = "inline";
                             // or server returns response with an error status.
                             console.log(response.responseText);
         
                             // old method
                             // msg = "تعذر الإتصال بالإنترنت لتحميل الفرشيات ";
                             // var alertPopup = $ionicPopup.alert({
                             //     title: 'تحميل الفرشيات ',
                             //     template: msg
                             // });
         
                             // new method
                         
                         });


                        }
                 
                });
                
              
            }
           
        }


        /*************** */
        this.is_has_comment = function () {
            if (quraat_name == 'shamarly') {
                sura_num = zeroFilled = ('000' + self.current_clicked_ayah.sura).substr(-3);
                ayah_num = zeroFilled = ('000' + self.current_clicked_ayah.ayah).substr(-3);;
            } else {
                sura_num = zeroFilled = ('000' + self.current_clicked_ayah.sura_number).substr(-3);
                ayah_num = zeroFilled = ('000' + self.current_clicked_ayah.ayah_number).substr(-3);;
            }
            fileName = "S" + sura_num + "A" + ayah_num + ".txt";

            exist_comment = $filter('filter')(common_serv.to_fix, {
                $: fileName
            });

            if (exist_comment != null && exist_comment != undefined) {

                if (exist_comment.length > 0) {
                    self.aya_has_comment = true;
                    document.getElementById('aya__comment_icon').style.display = "inline";

                    // Test 10
                    if (quraat_name == 'shamarly') {
                        var local_sound_path = window.localStorage.getItem('general_settings');
                    } else {
                        var local_sound_path = window.localStorage.getItem('general_settings_m');
                    }
                    console.log('%c' + local_sound_path, 'color: blue, font-size:20');


                    console.log(to_fix);

                    if (local_sound_path != null && local_sound_path != '') {
                        if (local_sound_path.indexOf("http://127.0.0.1") == 0) {
                            if (local_sound_path.substr(-1) != '/') local_sound_path += '/';
                            if (local_sound_path.indexOf("Taha") > 0)
                                self.comments_src = local_sound_path + "S" + sura_num + ".cmn/" + fileName;
                            else
                                self.comments_src = local_sound_path + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
                        } else {
                            self.comments_src = default_sound_server_shamarly + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
                        }
                    } else {
                        self.comments_src = default_sound_server_shamarly + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
                    }
                    console.log('%c' + self.comments_src, 'font-size:34;');

                    $.ajax({
                        // The proxy url expects as first URL parameter the URL to be bypassed
                        // https://cors-anywhere.herokuapp.com/{my-url-to-bypass}
                        url: self.comments_src,
                        complete: function (data) {
                            self.comments_txt = data.responseText;
                            if (self.comments_txt === '')
                                self.comments_txt = 'لا يتوفر اتصال بالانترنت';
                            else document.getElementById('aya__comment_icon').style.display = "inline";

                        }
                    });

                    /* var jqxhr = $.get( self.comments_src, function(comm_txt) {
                             self.comments_txt=comm_txt;
                            if(self.comments_txt==='')   self.comments_txt='لا يتوفر اتصال بالانترنت';//document.getElementById('aya__comment_icon').style.display = "none" ; //case of empty or internet error 
                          else     document.getElementById('aya__comment_icon').style.display = "inline"; 
                       })
                         .done(function(res) {
                            //return true;
                         })
                         .fail(function(res) {
                              self.comments_txt='لا يتوفر اتصال بالانترنت';
                          // document.getElementById('aya__comment_icon').style.display = "none"; 
                         })
                            */
                } else {
                    self.aya_has_comment = false;
                    document.getElementById('aya__comment_icon').style.display = "none";
                }
            } else {
                self.aya_has_comment = false;
                document.getElementById('aya__comment_icon').style.display = "none";
            }



        }



        //
        /******************************
         * 
         */
         this.is_has_intro_audio = function () {
            //  http://sound.quraat.info/Taha/S037.int/S037A104I.mp3

            if (quraat_name == 'shamarly') {
                sura_num = zeroFilled = ('000' + self.current_clicked_ayah.sura).substr(-3);
                ayah_num = zeroFilled = ('000' + self.current_clicked_ayah.ayah).substr(-3);;
            } else {
                sura_num = zeroFilled = ('000' + self.current_clicked_ayah.sura_number).substr(-3);
                ayah_num = zeroFilled = ('000' + self.current_clicked_ayah.ayah_number).substr(-3);;
            }
            fileName = "S" + sura_num + "A" + ayah_num + "I.mp3";
            exist_intro_audio = $filter('filter')(common_serv.intro, {
                $: fileName
            });

            if (exist_intro_audio != 'undefinded' && exist_intro_audio.length > 0) {

                document.getElementById('aya__intro_icon').style.display = "inline";
 
                if (quraat_name == 'shamarly') {
                    var local_sound_path = window.localStorage.getItem('general_settings');
                } else {
                    var local_sound_path = window.localStorage.getItem('general_settings_m');
                }
                if (local_sound_path !== null && local_sound_path != '') {
                    if (local_sound_path == '' || local_sound_path == 'undefinded' || local_sound_path == undefined) {
                        str_src = default_sound_server_shamarly + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    } else {
                        if (local_sound_path.substr(-1) != '/') local_sound_path += '/';
                        if (local_sound_path.indexOf("Taha") > 0 || local_sound_path.indexOf("Hany") > 0)
                            str_src = local_sound_path + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                        else str_src = local_sound_path + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    }
                    console.log(str_src);
                } else
                    // self.intro_audio_src = default_sound_server_shamarly + taha + "S" + sura_num + ".int/" + fileName;
                    {
                        //if($scope.telawa_reader_local)  
                        selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k')); 

                            if( selected_reader_s_or_k==0 )//&& $scope.is_local_intro_s
                            {
                                
                                //self.intro_audio_src  =  addon_s_or_k +  fileName;
                               // self.intro_audio_src  =  window.rootFS.fullPath +local_intro_s_path+"/" +  fileName;
                             if(navigator.userAgent.indexOf('Android')>0)
                             //  if(window.cordova.platformId=='android') 
                                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                                        window.rootFS = fileSystem.root;
                                        self.intro_audio_src  =  window.rootFS.fullPath +local_intro_s_path+"/" +  fileName;
                                        fileSystem.root.getFile(self.intro_audio_src, { create: false }, function(fileEntry){//exist in local
                                            
                                            self.intro_audio_src  =fileEntry.nativeURL;
                                            //  window.rootFS.fullPath +local_intro_s_path+"/" +  fileName; 
                                            if (quraat_name == 'shamarly')  
                                            document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i_L.png';
                                             else
                                            document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i_L.png';
                                            self.intro_file_local=true;
                                        },
                                        function(){//not in local thin try online 
                                            self.intro_audio_src = default_sound_server_shamarly + addon_s_or_k +  fileName;
                                            if (quraat_name == 'shamarly')
                                            document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                                            else
                                            document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                                            self.intro_file_local=false;
                                        });
                                    }, function (evt) {//getFSFail
                                        console.log(evt.target.error.code);
                                    }); //of requestFileSystem
                                    else
                                    {
                                        self.intro_audio_src = default_sound_server_shamarly + addon_s_or_k +  fileName;
                                        if (quraat_name == 'shamarly') 
                                          document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                                          else
                                          document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                                          self.intro_file_local=false;
                                    }

                        
                              
                            }
                           else if( selected_reader_s_or_k==1 ) //&&$scope.is_local_intro_k
                           {
                                    //self.intro_audio_src  =  window.rootFS.fullPath +local_intro_k_path+"/" +  fileName;
                                
                                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                                        window.rootFS = fileSystem.root;
                                        self.intro_audio_src  =  window.rootFS.fullPath +local_intro_k_path+"/" +  fileName;
                                
                                        
                                        fileSystem.root.getFile(self.intro_audio_src, { create: false }, function(fileEntry){//exist in local
    
                                            self.intro_audio_src  =fileEntry.nativeURL;
                                            //  window.rootFS.fullPath +local_intro_s_path+"/" +  fileName; 
                                            if (quraat_name == 'shamarly') 
                                            document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i_L.png';
                                            else
                                            document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i_L.png';
                                            self.intro_file_local=true;
                                        },
                                        function(){//not in local thin try online 
                                            self.intro_audio_src = default_sound_server_shamarly + addon_s_or_k +  fileName;
                                            if (quraat_name == 'shamarly') 
                                            document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                                            else
                                            document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                                            self.intro_file_local=false;
                                        });
                                    }, function (evt) {//getFSFail
                                        console.log(evt.target.error.code);
                                    }); //of requestFileSystem
                        
                            }
                            // /local_folder
                            // $scope.telawa_reader_local_folder+
                          
                         else
                        self.intro_audio_src = default_sound_server_shamarly + addon_s_or_k +  fileName;
                 console.log(self.intro_audio_src);
                    }
            } else {
                document.getElementById('aya__intro_icon').style.display = "none";
            }



        }





    } )