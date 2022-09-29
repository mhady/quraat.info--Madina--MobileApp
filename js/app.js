// Ionic Starter App
// var quraat_name = "shamarly"; // "shamarly"
var quraat_name = "madina"; // "madina"
var app_version_code = "7"; //

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                if (ionic.Platform == "iOS") cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            //alert(cordova.file.dataDirectory);
            //	  store = cordova.file.dataDirectory;
            // var base = document.createElement('base');
            //base.href = store;
            //document.getElementsByTagName('head')[0].appendChild(base);


        });
    })
    
.filter('unsafe', ['$sce', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
}])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            /*  .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
          })
         */


            .state('quraat', {
                url: '/quraat',

                templateUrl: 'templates/' + quraat_name + '.html',
                controller: quraat_name + 'Ctrl'

            })

            .state('quraathelp', {
                url: '/quraathelp',

                templateUrl: 'templates/' + quraat_name + '_help.html',
                controller: quraat_name + 'helpCtrl'

            })

            .state('quraatabout', {
                url: '/quraatabout',

                templateUrl: 'templates/quraatabout.html',
                controller: 'quraataboutCtrl'

            })

            .state('quraattables', {
                url: '/quraattables',

                templateUrl: 'templates/quraattables.html',
                controller: 'quraattablesCtrl'

            })


            ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/quraat');
    })
    
    .service('common_serv',  function ($location,$filter,$rootScope,$ionicPopup  ) {
        var self_com  = this;

        this.aya_data=[];
        this.self_com=[];
        this.intro_index_k=[];
        this.intro_index_s=[];
        this.read_aya_data=function(success_callback) {
            subCallback = function () {
                // console.log('aya loc:');
                //   console.log(aya_data);
                //**** map this shamarly data to  madina data => 
                //"ayah": "6" 
            //             "ayah_index": "13",
            //             "ayahtext": "إن الذين كفروا سواء عليهم أأنذرتهم أم لم تنذرهم لا يؤمنون",
            //             "page": "4",
            //             "sura": "2",
            //             "tafseer": "إن الذين جحدوا ما أُنزل إليك من ربك استكبارًا وطغيانًا، لن يقع منهم الإيمان، سواء أخوَّفتهم وحذرتهم من عذاب الله، أم تركت ذلك؛ لإصرارهم على باطلهم.",
            //             "x": "666",
            //             "y": "222" 
            // =>>>
            // {"ayah_number":"2",
            //"ayah_index":"13",
            // "line_number":"2"
            // ,"max_x":"321",
            // "max_y":"350",
            // "min_x":"142",
            // "min_y":"320",
            // "page_number":"2",
            // "position":"1",
            // "sura_number":"2"}
            // */
                if (quraat_name == 'shamarly') 
                {
                    self_com.aya_data  = aya_data.map(item => ({
                        ayah_number:item.ayah,
                        ayah:item.ayah,
                        ayah_index:item.ayah_index,
                        page_number:item.page, 
                        page:item.page,
                         sura_number:item.sura,
                         sura:item.sura,
                         x:item.x,
                         y:item.y,
                         ayahtext:item.ayahtext,
                         tafseer:item.tafseer,

                        
                      } ));

                }
                else
                {
                    self_com.aya_data = aya_data;
                }
              

              

                if(typeof success_callback=="function" ){
                    success_callback(self_com.aya_data);
                }
              
                return;
            }
            var script = document.createElement('script');
            script.type = 'text/javascript';
            //script.header='Content-Type: application/json; charset=utf-8';
            if (quraat_name == 'shamarly') {
                script.src = sh_more_data + "android_ayah_data.json";
            } else {
                // script.src = madina_more_data + "android_ayah_data.json";
                script.src = madina_more_data + "ayah_data_ma.json";
                // script.src = data_madina + "android_ayah_data.json"; // Test files
            }
            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            // script.onreadystatechange = subCallback;
            script.onload = subCallback;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }
        this.kobra_or_soghra_Addon=function() {
             selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            switch ( selected_reader_s_or_k) {
                case 0:
                    self_com.addon_s_or_k = 'AddonS/';
                    break;
                case 1:
                    self_com.addon_s_or_k = 'AddonK/';
            }
            return   self_com.addon_s_or_k;
            console.log('%c (s|k) : ' + addon_s_or_k, 'color: orange');
        }
        this.makeid=function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        /**
         * 
         */
          // --------------- { update_jsons } ---------------- //

          this.load_intro_data=function (){
            if (window.localStorage.getItem('intro.json')) {
                all_intro_data = (window.localStorage.getItem('intro.json')).toString();
                all_intro_data = all_intro_data.substring(all_intro_data.indexOf("=") + 1);
                all_intro_data = JSON.parse(all_intro_data);
                self_com.intro_index_k = $filter('filter')(all_intro_data, {
                    type:"!S", 
                }, true);
                self_com.intro_index_s = $filter('filter')(all_intro_data, {
                    type:"!K"
                }, true)
        }
    }
        

           this.update_jsons=function() {
         

            ///
            $.ajax({
                // url: 'http://www.quraat.info/4review/js/switch_n.json',    // website
                url: 'http://sound.quraat.info/common_files/switch_n.json'  +"?"+ self_com.makeid(), // server
            }).complete(function (data) {
                if (data.status == 200) {
                    console.log('%cDevice : online', 'color: green');

                    window.localStorage.setItem('switch_n.json', data.responseText);
                    console.log('%cFile : switch_n.json : updated', 'color: green');

                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML =data.responseText;
                    var head = document.getElementsByTagName('head')[0];
                    head.appendChild(script);

                    

                    self_com.check_update_in_silence();

                    function pull_and_replace(fileName) {
                        $.ajax({
                            url: 'http://sound.quraat.info/common_files/' + fileName  +"?"+ self_com.makeid(),
                        }).complete(function (data) {
                            if (data.status == 200) {
                                window.localStorage.setItem(fileName, data.responseText);
                                console.log('%cFile : ' + fileName + ' : updated', 'color: green');
                            } else {
                                console.log('%cFile : ' + fileName + ' : failed to update', 'color: red');
                            }
                        });
                    }

                
                      pull_and_replace('intro.json');
                    // pull_and_replace('HamadaK_to_fix.json');
                    // pull_and_replace('HamadaS_to_fix.json');
                    pull_and_replace('intro_k.json');
                    pull_and_replace('intro_s.json');

                    // Cancelled And Replaced
       
                    return;
                } else {
                    console.log('%cDevice : offline', 'color: red');
                    console.log('%cFiles : failed to update', 'color: red');
                }


             
            });


            if (!window.localStorage.getItem('switch_n.json')) {
                console.log('no local storage switch_n.json');
                function first_run_load_data_locally(local_file, local_storage_file) {
                    $.ajax({
                        url: common_files + local_file +"?"+ self_com.makeid(),
                    }).complete(function (data) {
                        if (data.status == 200) {
                            window.localStorage.setItem(local_storage_file, data.responseText);
                            console.log(local_storage_file,' switch_n.json loaded to storage ');
                           if( local_file=='switch_n.json')
                           {
                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.innerHTML =data.responseText;
                            var head = document.getElementsByTagName('head')[0];
                            head.appendChild(script);

                           
                          }
                   
                            if( local_file=='intro.json'){
                            if (window.localStorage.getItem('intro.json')) {
                                selected_reader_k = (window.localStorage.getItem('intro.json')).toString();
                                selected_reader_k = selected_reader_k.substring(selected_reader_k.indexOf("=") + 1);
                                selected_reader_k = JSON.parse(selected_reader_k);
                                self_com.intro_index_k = selected_reader_k;
                              //  console.log(intro_index);
                            }
                        }

                         
                        }
                    });
                }
                first_run_load_data_locally('switch_n.json', 'switch_n.json');
                // first_run_load_data_locally('Taha_to_fix.json', 'Taha_to_fix.json');
                // first_run_load_data_locally('Hany_to_fix.json', 'Hany_to_fix.json');
                // first_run_load_data_locally('A-Tolba_to_fix.json', 'A-Tolba_to_fix.json');
                // first_run_load_data_locally('MoyasaraS_to_fix.json', 'MoyasaraS_to_fix.json');
                // first_run_load_data_locally('MoyasaraK_to_fix.json', 'MoyasaraK_to_fix.json');
                //   first_run_load_data_locally('intro_soghra.json', 'intro_soghra.json');
                //   first_run_load_data_locally('intro_kobra.json', 'intro_kobra.json');
                  first_run_load_data_locally('intro.json', 'intro.json');
                // first_run_load_data_locally('HamadaK_to_fix.json', 'HamadaK_to_fix.json');
                // first_run_load_data_locally('HamadaS_to_fix.json', 'HamadaS_to_fix.json');
               // first_run_load_data_locally('intro_k.json', 'intro_k.json');
              //  first_run_load_data_locally('intro_s.json', 'intro_s.json');
                console.log('%cDevice loaded jsons locally', 'color: red');
            }

            
            self_com.load_intro_data();
            
          
           

        }
         this.check_update = function () {
            self_com.update_jsons();
            if (self_com.check_update_running == true) return;
            self_com.check_update_running = true;
            var timestamp = window.localStorage.getItem('timestamp')
            if (timestamp == null || isNaN(timestamp)) timestamp_param = '';
            else
                timestamp_param = '?timestamp=' + timestamp;
            self_com.uri = encodeURI(json_uri);
            if (quraat_name == 'shamarly')
                var infouri = encodeURI(cross_proxy + self_com.uri + "/data/getupdate.php" + timestamp_param);
            else
                var infouri = encodeURI(cross_proxy + self_com.uri + "/data_m/getupdate.php" + timestamp_param);

            $.getJSON(infouri, function (result) {
                if (timestamp_param == '') {
                    window.localStorage.setItem('timestamp', result.timestamp_now);
                } else {
                    self_com.downloadAllUpdatedAsset(result.FilesNeedUpdate);
                }
            }).fail(function () {
                console.log("error");
                console.log('ajaxComplete');
                $(".overlay_loader").remove();
                msg = "مشكلة في الاتصال بالانترنت ";
                // var alertPopup = $ionicPopup.alert({
                //     title: 'تحديث ',
                //     template: msg
                // });
                // alertPopup.then(function (res) {
                //     self_com.check_update_running = false;
                // });
            });

        }
        this.check_update_in_silence = function () {
            console.log('%ccheck_update_in_silence', 'color:orange');
            if (self_com.check_update_running == true) return;
            self_com.check_update_running = true;
            var timestamp = window.localStorage.getItem('timestamp')
            if (timestamp == null || isNaN(timestamp)) timestamp_param = '';
            else
                timestamp_param = '?timestamp=' + timestamp;
            self_com.uri = encodeURI(json_uri);
            if (quraat_name == 'shamarly')
                var infouri = encodeURI(cross_proxy + self_com.uri + "/data/getupdate.php" + timestamp_param);
            else
                var infouri = encodeURI(cross_proxy + self_com.uri + "/data_m/getupdate.php" + timestamp_param);

            $.getJSON(infouri, function (result) {
                if (timestamp_param == '') {
                    window.localStorage.setItem('timestamp', result.timestamp_now);
                } else {
                    self_com.downloadAllUpdatedAsset_in_silence(result.FilesNeedUpdate);
                }
            }).fail(function () {
                console.log("error");
                self_com.check_update_running = false;
            });
        }

          /***  @ Aliaa @***/
          this.downloadAllUpdatedAsset=function (Flist) {
            self_com.FilesToUpdate = Flist;

            if (Flist.length > 0) {
                msg = "تحتاج الي تحديث عدد" + Flist.length + " ملف ";
                // var alertPopup = $ionicPopup.alert({
                //     title: 'تحديث ',
                //     template: msg
                // });
                // alertPopup.then(function (res) {
                //     self_com.downloadAsset(0)
                //     console.log('ajaxStart');
                //     $('body').prepend('<div class="overlay_loader" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
                // });

                self_com.downloadAsset(0)
                // $('body').prepend('<div id="update_dialog_needs" class"update_dialog" title="Basic dialog"><h1>تحديث</h1><p>تحتاج الي تحديث عدد</p><button id="update_dialog_needs_button" onClick="update_dialog_needs_button_function();">حسناً</button></div>');
                // $('#update_dialog_needs').show();


            } else {
                msg = "لا تحتاج تحديثات الان !";
                // var alertPopup = $ionicPopup.alert({
                //     title: 'تحديث ',
                //     template: msg
                // });
                // alertPopup.then(function (res) {
                //     self_com.check_update_running = false;
                // });

                self_com.check_update_running = false;
                // $('body').prepend('<div id="update_dialog_needs_no_files" class="update_dialog" title="Basic dialog"><h1>تحديث</h1><p>لا تحتاج تحديثات الان !</p><button class="update_dialog_button" id="update_dialog_needs_no_button">حسناً</button></div>');
                // $('#update_dialog_needs_no_files').show();
                // document.getElementById("update_dialog_needs_no_button").addEventListener("click", update_dialog_needs_no_files_button_function())



                return
            }
        }

        this.downloadAllUpdatedAsset_in_silence=function (Flist) {
            self_com.FilesToUpdate = Flist;
            if (Flist.length > 0) {
                console.log('%cupdating data files...', 'color:orange');
                self_com.downloadAsset_in_silence(0)
            } else {
                self_com.check_update_running = false;
                return
            }
        }

        /*****
        * *** */
         this.pageToSura = function (pgnum) {
            page_to_sura = {};
            if (quraat_name == 'shamarly')
            {
                for (var pg = pgnum; pgnum >= 1; pgnum--) {
                    if ($filter('filter')(self_com.Suras, {
                        page_number_sh:''+pgnum+'',
                        }, true))
                        page_to_sura = $filter('filter')(self_com.Suras, {
                            page_number_sh: ''+pgnum+'',
                        }, true)[0];
                    if (page_to_sura) {
                        break;
                    }
                }

            }else
            {

                for (var pg = pgnum; pgnum >= 1; pgnum--) {
                    if ($filter('filter')(self_com.Suras, {
                        page_number_ma: ''+pgnum+'',
                        }, true))
                        page_to_sura = $filter('filter')(self_com.Suras, {
                            page_number_ma: ''+pgnum+'',
                        }, true)[0];
                    if (page_to_sura) {
                        break;
                    }
                }
            }
            
            return page_to_sura;
        }


        /************ */
         

        /***
          */
         this.read_sura_data=function (read_sura_data_callback) {

            if (typeof sura_data !== 'undefined') return;
            subCallback = function () {
               self_com.Suras = [];
               self_com.Sections = [];
               self_com.Hesbs = [];

                if (quraat_name == 'shamarly') {
                    window.localStorage.setItem('sura_data', JSON.stringify(sura_data));
                    var len = sura_data.length;
                    for (i = 0; i < len; i++) {
                        //sura_data[i].sura_name!="" &&   
                        if (!$filter('filter')(self_com.Suras, {
                                sura_name: sura_data[i].sura_name,
                            }, true)[0])self_com.Suras.push(sura_data[i]);
                        if (!$filter('filter')(self_com.Sections, {
                                section: sura_data[i].section,
                            }, true)[0]) 
                            { //aya_data=self_com.getAya_data(sura_data[i].sura_order,sura_data[i].);
                               self_com.Sections.push(sura_data[i]);
                            }

                        if (!$filter('filter')(self_com.Hesbs, {
                                hesb: sura_data[i].hesb,
                            }, true)[0])self_com.Hesbs.push(sura_data[i]);
                    }
                } else {
                    window.localStorage.setItem('sura_data', JSON.stringify(sura_data));
                    var len = sura_data.length;
                    for (i = 0; i < len; i++) {
                        if (!$filter('filter')(self_com.Suras, {
                                sura_name: sura_data[i].sura_name,
                            }, true)[0])self_com.Suras.push(sura_data[i]);
                        if (!$filter('filter')(self_com.Sections, {
                                section: sura_data[i].section,
                            }, true)[0])self_com.Sections.push(sura_data[i]);
                        if (!$filter('filter')(self_com.Hesbs, {
                                hesb: sura_data[i].hesb,
                            }, true)[0])self_com.Hesbs.push(sura_data[i]);
                    }
                }
                // scope.setTheSelectLists(self_com.pg.current_default_page);
                if(typeof read_sura_data_callback=="function") read_sura_data_callback();
                
            }
            var script = document.createElement('script');
            script.type = 'text/javascript';
            //script.header='Content-Type: application/json; charset=utf-8';
            if (quraat_name == 'shamarly')
                script.src = './' + 'common_files/'   + "sura_data_new.json";
            else
                script.src = './' + 'common_files/' + "sura_data_new.json";
            // script.src = data_madina + "sura_data.json"; // Test files

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            // script.onreadystatechange = subCallback;
            script.onload = subCallback;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);



        }
        /*****
         * 
         */

         this.read_aya_info= function () {
            //ayah_data_info
            subCallback = function () {
               self_com.ayah_data_info = ayah_data_info;
            };
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (quraat_name == 'shamarly')
                script.src = sh_more_data + "ayah_data_info.json?" +self_com.makeid();
            else
                script.src = madina_more_data + "ayah_data_info.json?" +self_com.makeid();
            script.onload = subCallback;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }


        this.getAya_data = function(sura,ayah){
            ayah_str = '' + ayah + '';
            sura_str = '' + sura + '';
            if (quraat_name == 'shamarly') {
                var found_ayah_data = $filter('filter')(self_com.aya_data, {
                    ayah: ayah_str,
                    sura: sura_str
                }, true)[0];
                if (ayah==1)// need last ayah in prev_ sura and last ayah
                {
                    if(sura>2)
                    {
                        sura_str = '' + sura -1 + ''; 
                        var prev_sura_ayahs = $filter('filter')(self_com.aya_data, {
                         
                        sura: sura_str
                        }, true) ;
                        prev_ayah_data=prev_sura_ayahs[prev_sura_ayahs.length-1];
                         
                    }

                }
                else{///need prev ayah in same sura 
                    prev_ayah_str = '' + ayah-1 + '';
                    var prev_ayah_data = $filter('filter')(self_com.aya_data, {
                        ayah: prev_ayah_str,
                        sura: sura_str
                    }, true)[0];
                }
               
                
                found_ayah_data=JSON.parse(JSON.stringify(found_ayah_data));
                shamarly_page_heught=1300;numberofLines=15;
                lineheight=shamarly_page_heught/numberofLines;
                if(found_ayah_data && prev_ayah_data) found_ayah_data.line_number=Math.ceil(parseInt(prev_ayah_data.y)/lineheight);
                if(found_ayah_data && prev_ayah_data) found_ayah_data.y=prev_ayah_data.y; 
                if(found_ayah_data && prev_ayah_data) found_ayah_data.x=prev_ayah_data.x; 
                if(found_ayah_data && prev_ayah_data) found_ayah_data.page=prev_ayah_data.page; 
                if(found_ayah_data && prev_ayah_data) found_ayah_data.page_number=prev_ayah_data.page_number; 
               // if(ayah_data) ayah_data.y= prev_ayah_data.y
               return  found_ayah_data;

            } else {
                var found_ayah_data = $filter('filter')(self_com.aya_data, {
                    ayah_number: ayah_str,
                    sura_number: sura_str
                }, true)[0];
                return  found_ayah_data;

            }
           
        }

       this.BrowseTo = function (sura, ayah) {
            // if (!$scope.aya_data) {
            //     return;
            // }
            var browse_to_data=self_com.getAya_data(parseInt(sura), parseInt(ayah));
            console.log(browse_to_data);
            // if (quraat_name == 'shamarly') {
            // current_p = parseInt(browse_to_data.page);
            // }else
            // {
            //     current_p = parseInt(browse_to_data.page_number);
            // }
 
            current_p = parseInt(browse_to_data.page_number);
            // ayah_str = '' + ayah + '';
            // sura_str = '' + sura + '';
            // if (quraat_name == 'shamarly') {
            //     var browse_to_data = $filter('filter')($scope.aya_data, {
            //         ayah: ayah_str,
            //         sura: sura_str
            //     }, true)[0];
            //     current_p = parseInt(browse_to_data.page);

            // } else {
            //     var browse_to_data = $filter('filter')($scope.aya_data, {
            //         ayah_number: ayah_str,
            //         sura_number: sura_str
            //     }, true)[0];
            //     current_p = parseInt(browse_to_data.page_number);

            // }
            console.log(browse_to_data);
            window.localStorage.setItem('current_page', current_p);

            self_com.current_page = parseInt(current_p);

            // $scope.setTheSelectLists(current_p);
            page_loc = NaN;//??
            scroll_to_str="page_"+current_p+"_line_"+browse_to_data.line_number+"_p_"+current_p;
            page_top=document.getElementById(current_p).offsetTop;
            if (quraat_name == 'shamarly') 
            page_loc=  page_top+(document.getElementById(current_p).offsetHeight /17)*browse_to_data.line_number;
            //page_loc=page_top+$("[ayah_index='"+browse_to_data.ayah_index+"']")[0].offsetTop;//page_top+(document.getElementById(current_p).offsetHeight/1770)*parseInt(browse_to_data.y);
            else  
            page_loc=  page_top+(document.getElementById(current_p).offsetHeight /17)*browse_to_data.line_number;
           
           
          //  document.getElementById($scope.current_page).offsetTop+browse_to_data.max_y;
            // loc_orientation	=window.localStorage.getItem('marke_orientation_'+num);
            scrollheight = document.getElementById('body_content').scrollHeight;
            //other_scrollheight=parseInt(window.localStorage.getItem('marke_orientation_height_'+num));

            args = {
                pageNum: current_p,
                pageLoc: page_loc
            };
            // args={pageNum:current_p};
             $rootScope.$broadcast('PageChanged', args);

            $rootScope.$broadcast('autoscrollpause', true);
            //start to select Aya and then play intro audio 
           


        }
        // this.BrowseTo = function (sura, ayah) {
        //     if (!self_com.aya_data) {
        //         return;
        //     }
        //     var browse_to_data=self_com.getAya_data(parseInt(sura), parseInt(ayah));
        //     console.log(browse_to_data);
        //     if (quraat_name == 'shamarly') {
        //     current_p = parseInt(browse_to_data.page);
        //     }else
        //     {
        //         current_p = parseInt(browse_to_data.page_number);
        //     }

            
            
        //     console.log(browse_to_data);
        //     window.localStorage.setItem('current_page', current_p);

        //    self_com.current_page = parseInt(current_p);

        //     //self_com.setTheSelectLists(current_p);
        //     page_loc = NaN;
        //     // loc_orientation	=window.localStorage.getItem('marke_orientation_'+num);
        //     scrollheight = document.getElementById('body_content').scrollHeight;
        //     //other_scrollheight=parseInt(window.localStorage.getItem('marke_orientation_height_'+num));

        //     args = {
        //         pageNum: current_p,
        //         pageLoc: page_loc
        //     };
        //     // args={pageNum:current_p};
        //     $rootScope.$broadcast('PageChanged', args);

        //     $rootScope.$broadcast('autoscrollpause', true);
        //     //start to select Aya and then play intro audio 
        //     // if (quraat_name == 'shamarly') {
        //     //     aya_options_srv.open_aya_options(browse_to_data.ayah_index);
        //     // } else {
        //     //     aya_options_srv.open_aya_options(browse_to_data.ayah_index);
        //     // }


        // }

        this.read_local_comments=function () {
            if (window.localStorage.getItem("to_fix_locally")) {
                self_com.to_fix = JSON.parse(window.localStorage.getItem("to_fix_locally"));
                return;
            }
            subCallback_to_fix = function () {

                self_com.to_fix = to_fix;
                //console.log($scope.to_fix);

            }


            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = subCallback_to_fix;
            if (quraat_name == 'shamarly') {
                script.src = './' + sh_more_data + 'to_fix.json';
            } else {
                script.src = './' + madina_more_data + 'to_fix.json';
            }
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }
      
        ///////////////
        ///********** */
        
        this.read_aya_comments_intro=function () {
            if (typeof intro !== 'undefined') return;
            subCallback_to_fix = function () {
                function to_fix_localStorage(to_fix_file) {

                    if(!(window.localStorage.getItem(to_fix_file))) return ;
                    to_fix_local = (window.localStorage.getItem(to_fix_file)).toString()
                    to_fix_local = to_fix_local.substring(to_fix_local.indexOf("=") + 1);
                    to_fix_local = JSON.parse(to_fix_local);
                    to_fix = to_fix_local;
                   self_com.to_fix = to_fix;
                    window.localStorage.setItem("to_fix_locally", JSON.stringify(to_fix));
                    console.log('%cto_fix_locally : updated', 'color:green');
                }
                setTimeout(function () {
                    to_fix_localStorage(selected_reader_name + '_to_fix.json');
                }, 5000);
            }
            subCallback_intro = function () {
               self_com.intro = intro;
                window.localStorage.setItem("local_data_intro", JSON.stringify(intro));
            }


            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (quraat_name == 'shamarly') {
                script.src = default_sound_server_shamarly + taha + "to_fix.json?" +self_com.makeid();
            } else {
                script.src = default_sound_server_shamarly + taha + "to_fix.json?" +self_com.makeid();
            }
            script.onload = subCallback_to_fix;
            script.onerror = function () {
               self_com.read_local_comments();
            };
            ///////////////////////////////////////////////////////////////////////
            var script_intro = document.createElement('script');
            script_intro.type = 'text/javascript';

            switch (parseInt(window.localStorage.getItem('selected_reader_s_or_k'))) {
                case 0:
                    script_intro.src = "http://sound.quraat.info/common_files/intro_s.json";
                    break;
                case 1:
                    script_intro.src = "http://sound.quraat.info/common_files/intro_k.json";
                    break;
            }

            script_intro.onload = subCallback_intro;
            script_intro.onerror = function () {
               self_com.read_local_intro();
            };
            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
            head.appendChild(script_intro);
        }

        ///////
        /******
         * 
         */
         this.read_local_intro=function () {
            if (window.localStorage.getItem("local_data_intro")) {
               self_com.intro = JSON.parse(window.localStorage.getItem("local_data_intro"));
                return;
            }
            subCallback_intro = function () {
                console.log(intro);
               self_com.intro = intro;
            }

            var script_intro = document.createElement('script');
            script_intro.type = 'text/javascript';
            script_intro.onload = subCallback_intro;

            // Main Code
            // script_intro.src = './' + sh_more_data + 'intro.json'
            // console.log('%c' + scrtipt_intro, 'color:red');

            // Test 2
            switch (parseInt(window.localStorage.getItem('selected_reader_s_or_k'))) {
                case 0:
                    script_intro.src = './' + common_files + 'intro_s.json'
                    break;
                case 1:
                    script_intro.src = './' + common_files + 'intro_k.json'
                    break;
            }
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script_intro);
        }

        /*************************** */
        this.get_telawa_reader=function (settings) {
           self_com.settings_t = $.extend(true, {}, settings);
            var alkobra_tosura = '';
            var alkobra_toaya = '';
            $.each(alkobra, function (indx, val) {
                if (self_com.settings_t.selectedreader == val.folder) {
                   self_com.alkobra_telawa_reader=val;
                    alkobra_tosura = val.tosura;
                    alkobra_toaya = val.toaya;
                    alkobra_local=val.local;
                    alkobra_local_folder=val.local_folder;
                }
            });

            parseInt(sura_num);
            parseInt(ayah_num);
            parseInt(alkobra_tosura);
            parseInt(alkobra_toaya);
            console.log('sura_num : ' + sura_num + ' , ayah_num : ' + ayah_num);
            console.log('alkobra_tosura : ' + alkobra_tosura + ' , alkobra_toaya : ' + alkobra_toaya);
            if (self_com.settings_t.selectedreader && (sura_num <= alkobra_tosura)) {
                console.log('jsut look at my line..');
                if (sura_num == alkobra_tosura && ayah_num > alkobra_toaya) {
                    console.log('jsut look at my line..');
                   self_com.telawa_reader = taha;
                    
                } else {
                    console.log('jsut look at my line..');
                   self_com.telawa_reader = "/" +self_com.settings_t.selectedreader + "/";
                }
            } else {
               self_com.telawa_reader = taha;
                console.log('jsut look at my line..');
            }
            get_local_reader_folder(self_com.telawa_reader);
            console.log('%cReader : ' +self_com.telawa_reader, 'color:red');
        }

        /*************** */
        this.read_alkobra_options=function () {
            read_alkobra_subCallback = function () {
                // Test : No Need Now
                // console.log('%c' + switch_file_online_offline, 'color:orange'); 

                //window.localStorage.setItem('alkobra_data',alkobra);
                /*window.localStorage.setItem('alkobra_tosura',alkobra[0].tosura);
                window.localStorage.setItem('alkobra_toaya',alkobra[0].toaya);*/


                 ///to check local folders exist or not 
           // document.addEventListener('deviceready', function() {    
            try {
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                console.log("check file system");
                console.log(window.requestFileSystem);
               // main storage 
               
               var PERSISTENT=window.PERSISTENT;//LocalFileSystem.PERSISTENT;
               if(window.cordova.platformId=='android') 
                window.requestFileSystem(PERSISTENT, 0,self_com.gotFS,self_com.getFSFail);
                // main SDCARD
                if(window.cordova.platformId=='android') 
               window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,self_com.gotFS_sd,self_com.getFSFail); 
          
              }
              catch(err) {
               console.log( err.message);
              }            
               //externalRootDirectory 
                //  }, false);

               self_com.alkobra=alkobra;
                return;
            }
            if(typeof(alkobra) !== 'undefined')return ;
            setTimeout(function () {
                console.log('reading switch file ....');
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.onload = read_alkobra_subCallback;

                // Main : offline
                // script.src = "js/switch_n.json";

                // Test 1 : Working but not sync
                // script.src = switch_file_online_offline;

                // Test 2 : localStorage
                // script.innerHTML = window.localStorage.getItem('switch_n.json');

                // Test 3 : localStorage + offline (1st run)
                if (!window.localStorage.getItem('switch_n.json')) {
                    script.src = "common_files/switch_n.json";
                    var head = document.getElementsByTagName('head')[0];
                    head.appendChild(script);
                } else {
                    script.innerHTML = window.localStorage.getItem('switch_n.json');
                    var head = document.getElementsByTagName('head')[0];
                    head.appendChild(script);
                    read_alkobra_subCallback();
                }

                // Fire the loading
               
            }, 5000);
        }

        this.stripScripts=function (s) {
            var div = document.createElement('div');
            div.innerHTML = s;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
              scripts[i].parentNode.removeChild(scripts[i]);
            }
            res=div.innerHTML;
            div.remove();
            return res;
          }

    } )

    
 
//angular.module('starter.controllers', []);
;