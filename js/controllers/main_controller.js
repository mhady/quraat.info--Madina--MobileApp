// ---- Starter Controller ---- //
angular.module('starter.controllers',['starter'])
    .controller(quraat_name + 'Ctrl', function ($scope, $rootScope, $filter, $state, $ionicSideMenuDelegate, $window, $ionicPopup, $compile, $ionicPlatform, $http,tashaboh_srv,common_serv,aya_options_srv,setting_srv) {
        $ionicSideMenuDelegate.canDragContent(false)

      
  
        common_serv.check_update();
        

        function kobra_or_soghra_Addon() {
            addon_s_or_k= common_serv.kobra_or_soghra_Addon();
            addon_s_or_k=common_serv.addon_s_or_k;

            // $scope.selected_reader_s_or_k = parseInt(window.localStorage.getItem('selected_reader_s_or_k'));
            // switch ($scope.selected_reader_s_or_k) {
            //     case 0:
            //         addon_s_or_k = 'AddonS/';
            //         break;
            //     case 1:
            //         addon_s_or_k = 'AddonK/';
            // }
            console.log('%c (s|k) : ' + addon_s_or_k, 'color: orange');
        }
        if (window.localStorage.getItem('selected_reader_s_or_k')) {
            kobra_or_soghra_Addon();
        }
        // --------------------        { end }         -------------------- //
        // -------------------- Creative Mohamed Sayed -------------------- //


        setTimeout(function () {
            $rootScope.$broadcast('autoscrollinit', true);
        }, 1000);
        
        
        setting_srv.init(); 
        $scope.pages = [];
        $scope.pg = {
            current_default_page: parseInt(window.localStorage.getItem('current_page')),
            current_sura: '',
            current_section: '',
            current_hesb: ''
        }; //parseInt(window.localStorage.getItem('current_page'));
        $scope.current_page = parseInt(window.localStorage.getItem('current_page'));

        $scope.local_data_jsons = JSON.parse(window.localStorage.getItem("local_data_jsons"));
        if ($scope.local_data_jsons == null) {
            $scope.local_data_jsons = {};
            for (var i = 1; i <= allpages; i++) {
                $scope.local_data_jsons[i] = false;
            }
            window.localStorage.setItem("local_data_jsons", JSON.stringify($scope.local_data_jsons));
        }
        for (var i = 1; i <= allpages; i++) {
            $scope.pages.push(i);


        }


        document.addEventListener("pause", onPause, false);

        function onPause() {
            // Handle the pause event
            $rootScope.$broadcast('autoscrollpause', true);
        }
        document.addEventListener("resume", onResume, false);

        function onResume() {
            // Handle the resume event
            $rootScope.$broadcast('autoscrollplay', true);
        }

        //initiat the mark places

        $scope.places = {};

        
        var page_to_section = '';
        var page_to_hesb = '';
        $scope.pageToSection = function (pgnum) {
            for (var pg = pgnum; pgnum >= 1; pgnum--) {
                if ($filter('filter')($scope.Sections, {
                        page_number: pgnum,
                    }, true))
                    page_to_section = $filter('filter')($scope.Sections, {
                        page_number: pgnum,
                    }, true)[0];
                if (page_to_section) {
                    break;
                }
            }
            return page_to_section;
            //$filter('filter')(common_serv.Suras, {page_number: page_number,},true)[0];
            /*  
                   page_to_hesb=$filter('filter')(common_serv.Hesbs, {page_number: page_number,},true)[0];
                  if(page_to_hesb) $scope.pg.current_hesb=page_to_hesb;
                  */
        }
        $scope.pageToHesb = function (pgnum) {
            for (var pg = pgnum; pgnum >= 1; pgnum--) {
                if ($filter('filter')(common_serv.Hesbs, {
                        page_number: pgnum,
                    }, true))
                    page_to_hesb = $filter('filter')(common_serv.Hesbs, {
                        page_number: pgnum,
                    }, true)[0];
                if (page_to_hesb) {
                    break;
                }
            }
            return page_to_hesb;
        }
        $scope.setPlace = function (p) {
            pgnum = parseInt($scope.current_page)
            if (!isNaN(pgnum)) {
                page_to_sura = common_serv.pageToSura(pgnum);
                page_to_sura_str = " - " + page_to_sura.sura_name;

                $scope.places['mark_place' + p] = " ص " + pgnum + page_to_sura_str;
            } else $scope.places['mark_place' + p] = "";
        }
        $scope.setPlaces = function () {
 
            for (var p = 1; p <= 4; p++) {
                pgnum = parseInt(window.localStorage.getItem('marke_page_' + p))
                if (!isNaN(pgnum)) {
                    page_to_sura = common_serv.pageToSura(pgnum);
                    page_to_sura_str = " - " + page_to_sura.sura_name;

                    $scope.places['mark_place' + p] = " صفحة " + pgnum + page_to_sura_str;
                } else $scope.places['mark_place' + p] = "";
            }
        }


        $scope.$watch(function () {
                return $ionicSideMenuDelegate.isOpenLeft();
            },
            function (isOpen) {
                if (isOpen) {
                    //$state.reload() 


                    $rootScope.$broadcast('autoscrollpause', true);
                    console.log("menu open");
                } else {
                    console.log($scope.myPopup_opended);
                    if (!$scope.myPopup_opended) $rootScope.$broadcast('autoscrollplay', true);
                    else
                        $rootScope.$broadcast('autoscrollpause', true);
                }

            });

        $scope.$on('tell_PageChanged', function (event, args) {
            $scope.pg.current_default_page = args;
            $scope.setTheSelectLists(args);
            $scope.current_page = args;
            console.log('tell_PageChanged' + $scope.current_page);
        })

        $scope.setTheSelectLists = function (page_number) {

            if (!page_number) {
                page_number = 1;
                $scope.pg.current_default_page = page_number;
                return;
            }
            $scope.pg.current_default_page = page_number;

            page_to_sura = common_serv.pageToSura(page_number);
            if (page_to_sura) $scope.pg.current_sura = page_to_sura;

            page_to_section = $scope.pageToSection(page_number);
            if (page_to_section) $scope.pg.current_section = page_to_section;

            page_to_hesb = $scope.pageToHesb(page_number);;
            if (page_to_hesb) $scope.pg.current_hesb = page_to_hesb;

        }
        $scope.onPageChange = function (current_p) {

            $scope.current_page = current_p;
            window.localStorage.setItem('current_page', parseInt(current_p));

            $scope.setTheSelectLists(current_p);
            $rootScope.$broadcast('PageChanged', current_p);
            console.log('init $scope.current_page' + current_p);
            $scope.myPopup_loc.close();

        };

        $scope.onSuraChange = function (current_Sura) {
            $scope.current_page = current_Sura.page_number;
            window.localStorage.setItem('current_page', parseInt(current_Sura.page_number));

            $rootScope.$broadcast('PageChanged', current_Sura.page_number);
            $scope.setTheSelectLists(current_Sura.page_number);
            $scope.myPopup_loc.close();

        };

        $scope.onSectionChange = function (current_Section) {
            $scope.current_page = current_Section.page_number;
            window.localStorage.setItem('current_page', parseInt(current_Section.page_number));
            $rootScope.$broadcast('PageChanged', current_Section.page_number);
            $scope.setTheSelectLists(current_Section.page_number);
            $scope.myPopup_loc.close();

        };
        $scope.onHesbChange = function (current_hesb) {
            $scope.current_page = current_hesb.page_number;
            window.localStorage.setItem('current_page', parseInt(current_hesb.page_number));

            $rootScope.$broadcast('PageChanged', current_hesb.page_number);
            $scope.setTheSelectLists(current_hesb.page_number);
            $scope.myPopup_loc.close();
        };


        
        //////////
        $scope.AddMark = function (num) {


            //current_page=parseInt(window.localStorage.getItem('current_page'));
            window.localStorage.setItem('marke_page_' + num, parseInt($scope.current_page));

            page_loc = parseFloat(document.getElementById('body_content').scrollTop);
            window.localStorage.setItem('marke_pageloc_' + num, page_loc);
            //window.localStorage.setItem('marke_orientation_'+num,window.orientation);
            window.localStorage.setItem('marke_orientation_height_' + num, document.getElementById('body_content').scrollHeight);



            $scope.setPlace(num);

            $scope.myPopup_fav.close();
            //$rootScope.$broadcast('tell_PageChanged', current_page); 
        }
        $scope.clearMark = function (num) {

            window.localStorage.removeItem('marke_page_' + num);
            window.localStorage.removeItem('marke_pageloc_' + num);
            $scope.setPlaces();
            $scope.myPopup_fav.close();
        }
        $scope.Gotoplace = function (num) {

            current_p = parseInt(window.localStorage.getItem('marke_page_' + num));
            $scope.current_page = parseInt(current_p);
            window.localStorage.setItem('current_page', parseInt(current_p));
            $scope.setTheSelectLists(current_p);
            page_loc = parseInt(window.localStorage.getItem('marke_pageloc_' + num));
            // loc_orientation	=window.localStorage.getItem('marke_orientation_'+num);
            scrollheight = document.getElementById('body_content').scrollHeight;
            other_scrollheight = parseInt(window.localStorage.getItem('marke_orientation_height_' + num));
            if (other_scrollheight != scrollheight) {

                //if(scrollheight>other_scrollheight)
                page_loc = page_loc * (scrollheight / other_scrollheight);
                //else
                //	page_loc=page_loc*(other_scrollheight/scrollheight);

            }
            args = {
                pageNum: current_p,
                pageLoc: page_loc
            };
            $rootScope.$broadcast('PageChanged', args);
            $scope.myPopup_fav.close();
            //$ionicSideMenuDelegate.toggleLeft();
        }

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return true; // $scope.shownGroup === group;
        };

        $scope.group = 'deals';
            // // $scope.settings={};
            // $scope.$watch(function () {
            //     return setting_srv.settings;
            // }, function () {
            //     console.log('var changed !!  scope.settings');
            //     console.log(setting_srv.settings);
            // }, true);
        /////////

        $scope.$on('on_open_setting', function (event, args) {
            //this to insure event call only one times 
            if ($scope.$$listenerCount["on_open_setting"] > 1) {
                $scope.$$listenerCount["on_open_setting"] = 0;
            }
            console.log('on_open_setting called...........');
            setting_srv.open_setting($scope);
        });


        $scope.open_setting=function(){
            setting_srv.open_setting($scope);
            $scope.settings_t=Object.assign({}, setting_srv.settings); 
            //setting_srv.settings;
        } 
        $scope.open_location_old = function () {
            console.log('{} called...........');
            $scope.myPopup_opended = true;
            $rootScope.$broadcast('autoscrollpause', true);

            setTimeout(function () {
                // $rootScope.$broadcast('autoscrollpause',true);

                $scope.myPopup_loc = $ionicPopup.show({
                    template: '  <ion-list class="setting"> ' +
                        '<ion-item>' +
                        ' <label class="item item-input item-select">' +
                        ' <div class="input-label">' +
                        '   صفحة  ' +
                        ' </div>' +
                        ' <select 	 ng-model="pg.current_default_page" ng-options="x for x in pages" ng-change="onPageChange(pg.current_default_page)">' +
                        '    <!-- <option repeat="x in pages">{{X}}</option>-->' +
                        '   </select>' +
                        ' </label>' +
                        '</ion-item>' +
                        '    <ion-item  >' +
                        '  <label class="item item-input item-select">' +
                        '<div class="input-label">' +
                        '   السورة  ' +
                        '</div>' +
                        '  <select   ng-model="pg.current_sura" ng-options="item.sura_name for item in Suras" ng-change="onSuraChange(pg.current_sura)">' +
                        '  <!-- <option repeat="x in pages">{{X}}</option>-->' +
                        '   </select>' +
                        ' </label>' +
                        '     </ion-item>' +
                        '     <ion-item  >' +
                        '	   <label class="item item-input item-select">' +
                        '   <div class="input-label">' +
                        '    الجزء  ' +
                        '  </div>' +
                        '   <select   ng-model="pg.current_section" ng-options="item.section for item in Sections" ng-change="onSectionChange(pg.current_section)">' +
                        '  <!-- <option repeat="x in pages">{{X}}</option>-->' +
                        ' </select>' +
                        ' </label>' +
                        '     </ion-item>' +
                        '  <ion-item >  ' +
                        '	   <label class="item item-input item-select">' +
                        ' <div class="input-label">' +
                        '   الحزب  ' +
                        ' </div>' +
                        ' <select   ng-model="pg.current_hesb" ng-options="item.hesb for item in Hesbs" ng-change="onHesbChange(pg.current_hesb)">' +
                        '   <!-- <option repeat="x in pages">{{X}}</option>-->' +
                        ' </select>' +
                        ' </label>' +
                        '      </ion-item>   ' +
                        '</ion-list>',

                    /* title: 'الضبط',*/
                    title: 'الفهرس',
                    scope: $scope,
                    cssClass: 'setting-popup',
                    buttons: [{
                        text: 'تراجع',
                        onTap: function () {
                            $scope.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                        }
                    }]
                });
                // Custom popup
                $scope.myPopup_loc.then(function (res) {
                    if (res) {
                        console.log(res);
                        $rootScope.$broadcast('init_quraat', args);
                    }
                });
            }, 100);

        }

        $scope.close_location = function () {
            $scope.index_is_opend = false;
            console.log($scope.myPopup_loc);
            $scope.myPopup_loc.close();
            $scope.myPopup_opended = false;
            $rootScope.$broadcast('autoscrollplay', true);
        }

        $scope.index_is_opend = false;
        $scope.open_location = function () {
            console.log('{index location is opend} called...........');
            $scope.myPopup_opended = true;
            $rootScope.$broadcast('autoscrollpause', true);
            setTimeout(function () {
                // $rootScope.$broadcast('autoscrollpause',true);
                var window_height = $(window).height();
                var window_width = $(window).width();
                $scope.myPopup_loc = $ionicPopup.show({
                    template: '  <ion-tabs class="index_tabs tabs-positive tabs-icon-top loc_tabs"> ' +

                        '<ion-tab title="السور"  >' +
                        ' <!-- Tab 2 content --><div id="suras"  style="height: ' + (window_height - 80) + 'px" ng-bind-html="suras_index"> </div>' +
                        '   </ion-tab>' +
                        '  <ion-tab title="الأجزاء و الأحزاب"  >' +
                        '     <!-- Tab 3 content --><div id="parts"  style="height: ' + (window_height - 80) + 'px" ng-bind-html="parts_index"> </div>' +
                        '   </ion-tab>' +
                      //  '  <ion-tab title="الأحزاب"  ><div id="hizbs"  style="height: ' + (window_height - 80) + 'px" ng-bind-html="hizbs_index"> </div>' +
                      //  '   </ion-tab>' +
                        '<ion-tab title="الصفحات"  >' +
                        ' <!-- Tab 1 content --><div id="pages" style="height: ' + (window_height - 80) + 'px" ng-bind-html="pages_index  |unsafe"> </div>' +
                        '   </ion-tab>' +

                        ' </ion-tabs>' +
                        '<img src="images/close-icon.png" style="width: 24px;height: 24px;margin: auto 5px;position: absolute;left: 0;top: 9px;z-index: 99;" ng-click="close_location()">' +
                        '<style>{{index_style}} </style>' +
                        '<script> </script>',

                    /* title: 'الضبط',
                     title: 'الفهرس',*/
                    scope: $scope,
                    cssClass: 'loc-popup',
                    buttons: [
                        /*{ text: 'تراجع' ,
                          onTap:function(){  $scope.myPopup_opended=false;$rootScope.$broadcast('autoscrollplay',true);}
                           } */
                    ]
                });
                $scope.index_is_opend = true;
                //  .then(function(){
                //		   $('.sura_index_item').css('width',w/5);
                //	  });
                // Custom popup
                //  common_serv.Suras_index='';
                $scope.Calc_index();

                $scope.index_style = index_style;

                $scope.myPopup_loc.then(function (res) {
                    if (res) {
                        console.log(res);

                        //   window.localStorage.setItem('setting',JSON.stringify($scope.settings));
                        //    args={newsettings:$scope.settings};
                        $rootScope.$broadcast('init_quraat', args);
                    }
                });
                
            }, 100);

        }
      
        $scope.Calc_index = function () {
            if ($scope.index_is_opend == false) return;
            w = window.innerWidth;
            h = window.innerHeight;
            // alert ('width='+w);
            // alert ('Height='+h);
            
            var index_cols = 5;
            if (w > h)
                var index_cols = 7;
            if(w<=600 )var index_cols = 3;
            var sura_col_width=65;//px min col width in sura index 
            index_cols=Math.floor(w/(sura_col_width+6));
            

            $scope.suras_index = '';

            var index_rows = Math.floor(common_serv.Suras.length / index_cols);
            var index_rows_remaining = common_serv.Suras.length - index_rows * index_cols;
            if (index_rows_remaining > 0) index_rows++;

            //('Calc_index index_rows='+index_rows);
            var col_each = index_rows;
            for (var i = 0, l = common_serv.Suras.length; i < l; i++) {
                var s = common_serv.Suras[i];
                if(quraat_name == 'shamarly') 
                    var page_num= s.page_number_sh;
                    else
                    var page_num= s.page_number_ma;

                      if(i %col_each ==0)   {
                        $scope.suras_index += '</div><div class="index_col">';
                        $scope.suras_index += '<div class="sura_index_item ' + i + '" ><span>' +page_num + '</span>' + s.sura_name + '</div>';

                    }else
                    {
                        $scope.suras_index += '<div class="sura_index_item ' + i + '" ><span>' +page_num + '</span>' + s.sura_name + '</div>';

                    }
                    if(i==common_serv.Suras.length)common_serv.Suras_index += '</div>';
            }
        

            $scope.parts_index = '';
             
             
            var index_cols = 5;
            if (w > h)
                var index_cols = 7;
            if(w<=600 )var index_cols = 3;
            //col_width_percentage=(100/index_cols).toFixed(2)+"%";
           // $('.index_part_col').css('width',col_width_percentage);
            var index_rows = Math.floor(30 / index_cols);
            var index_rows_remaining = 30 % index_cols;
            console.log('index_cols0:' + index_cols);
            console.log('index_rows0:' + index_rows);
            console.log('index_rows_remaining0:' + index_rows_remaining);
            if (index_rows_remaining > 0) index_rows++;


            console.log('index_rows00:' + index_rows);
            
            for (var i = 1; i <= 30; i++) 
            {
                var p = "الجزء " + i;
                var hesp_1=common_serv.Hesbs[(i - 1)*2].hesb_text;
                var hesp_2=common_serv.Hesbs[(i - 1)*2+1].hesb_text;
                // var value = $scope.Sections[i - 1].page_number;
                if(quraat_name == 'shamarly')
                {
                var value_1 = common_serv.Hesbs[(i - 1)*2].hesb_page_sh;
                var value_2=  common_serv.Hesbs[(i - 1)*2+1].hesb_page_sh;
                }
                else
                {
                var value_1 = common_serv.Hesbs[(i - 1)*2].hesb_page_ma;
                var value_2=  common_serv.Hesbs[(i - 1)*2+1].hesb_page_ma;
                }

                if (i == 1) {
                $scope.parts_index += '<div class="index_part_col index_col "  >';
                // $scope.parts_index += '<div class="part_index_item" value=' + value + '>' + p + '</div>';
                $scope.parts_index += '<div class="part_index_item">'; 
                $scope.parts_index += '<div class="part_item">' + p + '</div>';
                $scope.parts_index +='<div class="p_hesb " value=' + value_1 + '>' + hesp_1 + '</div>';
                $scope.parts_index += '<div class="p_hesb_line"></div>';
                $scope.parts_index += '<div class="p_hesb" value=' + value_2 + '>' + hesp_2 + '</div></div>';
                } else if (i % (index_rows) == 0) {
                //   $scope.parts_index += '<div class="part_index_item" value=' + value + '>' + p + '</div>';
                $scope.parts_index += '<div class="part_index_item">';
                $scope.parts_index += '<div class="part_item">' + p + '</div> ';
                $scope.parts_index +='<div class="p_hesb  " value=' + value_1 + '>' + hesp_1 + '</div> ';
                $scope.parts_index += '<div class="p_hesb_line"></div>';
                $scope.parts_index += '<div class="p_hesb" value=' + value_2 + '>' + hesp_2 + '</div></div>';

                $scope.parts_index += '</div><div class="index_part_col index_col"   >';
                } else
                { 
                // $scope.parts_index += '<div class="part_index_item" value=' + value + '>' + p + '</div>';
                $scope.parts_index += '<div class="part_index_item">';
                $scope.parts_index += '<div class="part_item">' + p + '</div> ';
                $scope.parts_index +='<div class="p_hesb  " value=' + value_1 + '>' + hesp_1 + '</div>';
                $scope.parts_index += '<div class="p_hesb_line"></div>';
                $scope.parts_index += '<div class="p_hesb" value=' + value_2 + '>' + hesp_2 + '</div> </div>';


                }
            }
            $scope.parts_index += '</div>';
          

            $scope.pages_index = '';
            var index_cols2 = Math.floor(w / 46);
            var index_rows = Math.floor(allpages / index_cols2);
            var index_rows_remaining = allpages % index_cols2;
            if (index_rows_remaining > 0) index_rows++;
            console.log('index_cols2>>>' + index_cols2);
            console.log('index_rows>>>' + index_rows);


            var col_each = index_rows - 1;
            console.log('index_rows_remaining>>>' + index_rows_remaining);
          
            $scope.pages_index +='<div class="page_num_input" >';
           // $scope.pages_index +=' <IonInput value={Page_num} placeholder="رقم الصفحة" onIonChange={e => setText(e.detail.value!)}></IonInput>';

            $scope.pages_index +='<input id="Page_num" name="Page_num" class="Page_num" type="number"     ></div>';
            $scope.pages_index += '<div class="scrolled_pages">';
            for (var p = 1; p <= allpages;) {
                for (var col = 1; col <= index_cols2; col++) {
                    $scope.pages_index += '<div class="index_col">';
                    for (var rows = 1; rows <= index_rows; rows++) {
                        $scope.pages_index += '<div class="page_index_item">' + p + '</div>';
                        p++;
                        if (p > allpages) break;
                    }
                    $scope.pages_index += '</div>';
                }
            }
            /*** Aliaa **/
            $scope.pages_index += '</div>';
            $scope.pages_index += '</div>'; //scrollled pages 
            $scope.index_style = index_style;
            /// find element and wait until founded !!!
            var f = function () {
                var a = document.getElementById('suras');
                var p = document.getElementById('parts'); ////
                var hi = document.getElementById('hizbs');
                var pg = document.getElementById('pages');
                if (a || p || hi || pg) {
                    if (a) a.innerHTML = $scope.suras_index;
                    if (p) p.innerHTML = $scope.parts_index;
                    if (hi) hi.innerHTML = $scope.hizbs_index;
                    if (pg) pg.innerHTML = $scope.pages_index;
                    if (a) $(a).css("height", h - 80);
                    if (p) $(p).css("height", h - 80);
                    if (hi) $(hi).css("height", h - 80);
                    if (pg) $(pg).css("height", h - 80);

                    $('.index_col').css('width',sura_col_width+'px');

                } else {
                    console.log('not founded');
                    if ($scope.index_is_opend == false) 
                    {
                       
                        return;
                    }
                    setTimeout(arguments.callee, 150); // call myself again in 50 msecs
                }
            }
            f();
    

            ///

        }

        $scope.open_favorites = function () {
            console.log('{} called...........');
            $rootScope.$broadcast('autoscrollpause', true);
            $scope.myPopup_opended = true;


            setTimeout(function () {
                // $rootScope.$broadcast('autoscrollpause',true);

                $scope.myPopup_fav = $ionicPopup.show({
                    template: '  <ion-list class="setting"> ' +
                        '<ion-item style="background: #ffc6c6;" class="item-accordion"' +
                        '     ng-show="isGroupShown(group)">' +
                        '<a menu-close href="#" ng-click="clearMark(1)"><img class="icon" src="./images/mark_remove.gif"></a></a> <a menu-close href="#" ng-click="AddMark(1)"><img class="icon plus" src="./images/mark_add.gif"></a> <div class="mark_place_label " ng-click="Gotoplace(1)">{{places["mark_place"+1]}}</div> ' +
                        '</ion-item> ' +
                        '<ion-item style="background: #bdeafd;" class="item-accordion"' +
                        '         ng-show="isGroupShown(group)">' +
                        ' <a menu-close href="#" ng-click="clearMark(2)"><img class="icon "" src="./images/mark_remove.gif"></a>  <a menu-close href="#/app/food" ng-click="AddMark(2)"><img class="icon plus" src="./images/mark_add.gif"></a>  <div class="mark_place_label " ng-click="Gotoplace(2)">{{places["mark_place"+2]}}</div>  ' +
                        '</ion-item>' +
                        '<ion-item style="background: #c2fbbe;" class="item-accordion"' +
                        '          ng-show="isGroupShown(group)">' +
                        '   <a menu-close href="#" ng-click="clearMark(3)"><img class="icon" src="./images/mark_remove.gif"></a>  <a menu-close href="#/app/drink" ng-click="AddMark(3)"><img class="icon plus" src="./images/mark_add.gif"> </a>  <div class="mark_place_label " ng-click="Gotoplace(3)">{{places["mark_place"+3]}}</div>  ' +
                        '</ion-item> ' +
                        '<ion-item style="background: #fbf9a2;" class="item-accordion"' +
                        '          ng-show="isGroupShown(group)">' +
                        '   <a menu-close href="#" ng-click="clearMark(4)"><img class="icon" src="./images/mark_remove.gif"></a>  <a menu-close href="#/app/drink" ng-click="AddMark(4)"><img class="icon plus" src="./images/mark_add.gif"> </a>  <div class="mark_place_label " ng-click="Gotoplace(4)" >{{places["mark_place"+4]}}</div>  ' +
                        '</ion-item>' +
                        '</ion-list>',

                    /* title: 'الضبط',*/
                    title: 'المفضلات',
                    scope: $scope,
                    cssClass: 'setting-popup',
                    buttons: [{
                        text: 'تراجع',
                        onTap: function () {
                            $scope.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                        }
                    }]
                });
                // Custom popup
                $scope.myPopup_fav.then(function (res) {
                    if (res) {
                        console.log(res);

                        //   window.localStorage.setItem('setting',JSON.stringify($scope.settings));
                        //    args={newsettings:$scope.settings};
                        $rootScope.$broadcast('init_quraat', args);
                    }
                });
            }, 100);

        }

         
        
//////////////////////////
        $scope.checkIfFileExists=function(path,index){
            console.log(path);
            try {
                var PERSISTENT=window.PERSISTENT;//LocalFileSystem.PERSISTENT;
                    window.requestFileSystem(PERSISTENT, 0, function(fileSystem){
                        fileSystem.root.getDirectory(path, {create: false, exclusive: false}, 
                        $scope.fileExists.bind(null,index),
                        $scope.fileDoesNotExist.bind(null,index));

                        // fileSystem.root.getFile(path, { create: false },  
                        //     $scope.fileExists.bind(null,index),  
                        // $scope.fileDoesNotExist.bind(null,index));
                    },  $scope.getFSFail); //of requestFileSystem
              }
              catch(err) {
                console.log( err.message);
              }

           
        }
        $scope.checkIfFileExists_sd=function(path,index){
            console.log(path);
            try {
                window.resolveLocalFileSystemURL(path,$scope.fileExists.bind(null,index),
                $scope.fileDoesNotExist.bind(null,index)); 
              }
              catch(err) {
                console.log( err.message);
              }
          
          
            // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            //     fileSystem.root.getDirectory(path, {create: false, exclusive: false}, 
            //     $scope.fileExists.bind(null,index),
            //     $scope.fileDoesNotExist.bind(null,index));

                // fileSystem.root.getFile(path, { create: false },  
                //     $scope.fileExists.bind(null,index),  
                // $scope.fileDoesNotExist.bind(null,index));
          //  },  $scope.getFSFail); //of requestFileSystem
        }
         $scope.fileExists=function(index,fileEntry){
           // alert("File " + fileEntry.fullPath + " exists!");
           console.log("file is exist & kobra index="+index);
           console.log(fileEntry);
           alkobra[index].local=true;
           alkobra[index].local_folder=fileEntry.nativeURL;//fullPath;
        }
          $scope.fileDoesNotExist=function(index,fileError){
            console.log("file does not exist & kobra index="+index);
            console.log(fileError);
            alkobra[index].local=false;
        }
         $scope.getFSFail=function(evt) {
            console.log(evt.target.error.code);
        }
        $scope.gotFS_sd=function(fs){

            console.log("got filesystem sd");
            // save the file system for later access
            console.log(fs);
           // window.rootFS = fileSystem.root;

            $.each(alkobra, function (indx, val) {
                if (val.active_sound == 1) {
                  
                    $scope.checkIfFileExists_sd(fs.fullPath +"Tayseer/Sound/"+ val.folder,indx );
                }
            });

            $scope.checkIfFileExists_sd(fs.fullPath +"Tayseer/Sound/"+ val.folder,indx );


        }
        $scope.check_intro_local=function(fileSystem){
            var path=window.rootFS.fullPath +local_intro_s_path;
            try {
                var PERSISTENT=window.PERSISTENT;//LocalFileSystem.PERSISTENT;
                    window.requestFileSystem(PERSISTENT, 0, function(fileSystem){
                        fileSystem.root.getDirectory(path, {create: false, exclusive: false}, 
                        function(){/**folder exist  */ $scope.is_local_intro_s=true;},
                        function(){/**folder NOT exist  */$scope.is_local_intro_s=false;});

                        // fileSystem.root.getFile(path, { create: false },  
                        //     $scope.fileExists.bind(null,index),  
                        // $scope.fileDoesNotExist.bind(null,index));
                    },  $scope.getFSFail); //of requestFileSystem
              }
              catch(err) {
                console.log( err.message);
              }
              path=window.rootFS.fullPath +local_intro_k_path;
              try {
                  var PERSISTENT=window.PERSISTENT;//LocalFileSystem.PERSISTENT;
                  if(window.cordova.platformId=='android') 
                      window.requestFileSystem(PERSISTENT, 0, function(fileSystem){
                          fileSystem.root.getDirectory(path, {create: false, exclusive: false}, 
                          function(){/**folder exist  */ $scope.is_local_intro_k=true;},
                          function(){/**folder NOT exist  */$scope.is_local_intro_k=false;});
  
                          // fileSystem.root.getFile(path, { create: false },  
                          //     $scope.fileExists.bind(null,index),  
                          // $scope.fileDoesNotExist.bind(null,index));
                      },  $scope.getFSFail); //of requestFileSystem
                      else
                      $scope.is_local_intro_k=false;
                }
                catch(err) {
                  console.log( err.message);
                }
        }
         $scope.gotFS=function(fileSystem) {
            if(window.cordova.platformId!='android') return ;
            console.log("got filesystem internal ");
            // save the file system for later access
            console.log(fileSystem.root.fullPath);
            window.rootFS = fileSystem.root;
            $scope.check_intro_local(fileSystem);
            $.each(alkobra, function (indx, val) {
                if (val.active_sound == 1) {
                    // const fs = fileSystem;//require("fs"); // Or `import fs from "fs";` with ESM
                    // if (fs.existsSync(window.rootFS.fullPath +"Tayseer/Sound/"+ val.folder)) {
                    //     alkobra[index].local=true;
                    // }
                    // else
                    // {
                    //     alkobra[index].local=false;
                    // }
                    $scope.checkIfFileExists(window.rootFS.fullPath +"Tayseer/Sound/"+ val.folder,indx );
                }
            });
        }
        
      
           // how to use 
          // $scope.checkIfFileExists(window.rootFS +"Tayseer/Sound/readerfolder" );

         
        ////////////////////////////////////

          efrad_f=function(efrad_num){
            console.log(efrad_num);
            $(".gam3").hide()
            console.log($scope.settings_t);
        }
        gam3=function( ){
            console.log($scope.settings_t);
            $(".gam3").show()
        }

        $scope.add_download_event=function(eventName){
            document.addEventListener(eventName, function(event)
            {
                 var data = event.data;  
                 console.log(eventName+"-"+ JSON.stringify(data)+data[0]+"%"); 
                 if(eventName=="DOWNLOADER_downloadProgress")
                 {
                    // console.log(eventName+data[0]+"%");
                    $scope.loading_in_progress_progress(data[0]+"%");
                    
                 }
                if(eventName=="DOWNLOADER_unzipSuccess")
                {
                    if(!$scope.efrad)
                    {
                        msg = "  تم تحميل الافراد بنجاح ";
                        if(!$scope.Efrad_alertPopup || $scope.Efrad_alertPopup==null)
                        {
                                $scope.Efrad_alertPopup = $ionicPopup.alert({
                                title: 'تحميل الافراد ',
                                template: msg
                            });
                            $scope.Efrad_alertPopup.then(function (res) {
                            $scope.loading_in_progress_stop();
                            window.localStorage.setItem('efrad',true);
                            $scope.efrad=true;
                            setting_srv.efrad=$scope.efrad;
                            
                            });

                        }
                       
                    }
                    downloader.abort();

                }
                 if(eventName=="DOWNLOADER_downloadSuccess")
                 {
                 
                    
                 }
                
                 if(eventName=="DOWNLOADER_error" || eventName=="DOWNLOADER_getFileErro" 
                   ||eventName== "DOWNLOADER_downloadError" || eventName=="DOWNLOADER_unzipError"  )
                   if(!$scope.Efrad_error_alertPopup || $scope.Efrad_alertPopup==null)
                  { 
                   msg = " مشكلة في الاتصال بالانترنت - نرجو التجربه بعد قليل ";
                   $scope.Efrad_error_alertPopup = $ionicPopup.alert({
                       title: 'تحميل الافراد ',
                       template: msg
                   });
                   $scope.Efrad_error_alertPopup.then(function (res) {
                    $scope.loading_in_progress_stop();
                     });

                     downloader.abort();
                    }
                  
                });
               
        }
        $scope.efrad_download=function(){
        if(window.cordova.platformId!='android') return;
               /// test download plugin  
               setting_srv.myPopup_opended = false;
               $scope.myPopup_opended = false;
               $rootScope.$broadcast('autoscrollplay', true);
               setting_srv.myPopup.close();
               $scope.add_download_event("DOWNLOADER_initialized");
               $scope.add_download_event("DOWNLOADER_downloadProgress");

               $scope.add_download_event("DOWNLOADER_error");
               $scope.add_download_event("DOWNLOADER_getFileErro");
               $scope.add_download_event("DOWNLOADER_downloadError");
               $scope.add_download_event("DOWNLOADER_unzipError");
               
               
               $scope.add_download_event("DOWNLOADER_downloadSuccess");
               $scope.add_download_event("DOWNLOADER_unzipSuccess");
               $scope.add_download_event("DOWNLOADER_fileCheckSuccess");
               
              
               var folder="efrad";//"Tayseer";//cordova.file.dataDirectory+

               downloader.init({fileSystem : cordova.file.dataDirectory,
                folder: folder, 
                unzip: true,
                delete: true,});
               //,check: true
                
               downloader.get("http://www.quraat.info/4review/efrad_files.zip");
               $scope.loading_in_progress_start();
             //   downloader.get("http://www.quraat.info/4review/tmp.zip");
               
              

        }
        $scope.loading_in_progress_progress=function(msg=''){
            $('#progress_percentage').html(msg);
            
             }
        $scope.loading_in_progress_start=function(msg=''){
           
                $('body').prepend('<div class="overlay_loader" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;">'+
                ' <span id="progress_percentage" style="z-index: 999999; border-radius: 100%;  width: 100px;'+
            '  height: 100  px ;position: relative;vertical-align: middle;top: 50%;left: 15%;"></span> '+
                 '<img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
            
        }
        $scope.loading_in_progress_stop=function(){
           
            $(".overlay_loader").remove();
        
    }
 

        /////////
        $scope.open_tables = function () {

            $rootScope.$broadcast('autoscrollpause', true);
            $state.go('quraattables');


        }


        $scope.open_about = function () {
            // $ionicSideMenuDelegate.toggleLeft();
            $rootScope.$broadcast('autoscrollpause', true);
            // 	var mvp = document.getElementById('viewport_to_scal');
            // mvp.setAttribute('content',"user-scalable=yes, initial-scale=1,minimum-scale=1, width=device-width");
            $state.go('quraatabout');

        }

        /////////
        $scope.open_help = function () {
            // $ionicSideMenuDelegate.toggleLeft();
            $rootScope.$broadcast('autoscrollpause', true);
            var mvp = document.getElementById('viewport_to_scal');
            mvp.setAttribute('content', "user-scalable=yes, initial-scale=1,minimum-scale=1, width=device-width");
            $state.go('quraathelp');

        }
        /** aliaa help
        
                                                                                }
                                                                                */

        $scope.search_settings = {};
        if (window.localStorage.getItem('search_settings'))
            $scope.search_settings = window.localStorage.getItem('search_settings');
        else {
            $scope.search_settings.keyword = '';
        }
        var options = '';
        $scope.search = function (newinputid) {
            

            // stop audio and hide results 
            $("#audio_paly_option").hide();
            audio_player = document.getElementById('audio'); 
            audio_player.pause();
            $scope.radioValue = $("input[name='search_item']:checked").val();
            var keyword_val = $("#keyword").val();
            var file_url = '';
            if (keyword_val == '') {
                alert('من فضلك قم بكتابة كلمة لبدء البحث ');
                return false;
            }
            
            if ( $scope.radioValue == 'aya') {
                    // file_url = "common_files/search/empty.js";
                    
                    if (quraat_name == 'shamarly')  
                    file_url = "sh_more_data/android_ayah_data.json";
                    else
                    file_url = "data_m/ayah_data_info.json";
                    

            } else //if( $scope.radioValue=='shatbia' ||  $scope.radioValue=='dora')
            {
                file_url = "common_files/search/" +  $scope.radioValue + ".js";

            }
            var myExp = new RegExp(keyword_val, "i");
            $('.close_search_btn').hide();
            var aya_number = '';
           
            $.get(file_url, function (data,status) {
                var output = '<div class="easy-autocomplete-container">';
                //  output += '<i class="fa fa-times close_search_btn"></i>';
                output += '<div class="easy-autocomplete eac-plate-dark eac-description">';
                output += '<ul class="searchresults">';
                if( $scope.radioValue =='aya')
                {
                    if (quraat_name == 'shamarly')  
                    data=data.substr("aya_data=".length);
                    else
                    data=data.substr("ayah_data_info=".length);
                }
                data = $.parseJSON(data);
                // if ( $scope.radioValue == 'aya') 
                // data=$scope.aya_data;
                var i = 0;
                $.each(data, function (index, value) {
                    if ( $scope.radioValue == 'aya') {
                        val = value.ayahtext;
                        if ((val.search(myExp) != -1)) {
                            i++;
                            // if (quraat_name == 'shamarly') {
                            output += '<li page_number="' + value.page + '"   sura_number="' + value.sura + '"  id="' + value.ayah + '">' + '<div class="eac-item">' + val + '</div></li>';
                            // } else {
                            //     output += '<li page_number="' + value.page + '"   sura_number="' + value.sura + '"  id="' + value.ayah + '">' + '<div class="eac-item">' + val + '</div></li>';
                            // }
                        }
                    } else {
                        val = value.search_text;
                        if ((val.search(myExp) != -1)) {
                            i++;
                            output += '<li id="' + value.number + '">' + '<div class="eac-item">' + val + '</div></li>';
                        }
                    }
                    if (i == 8) return false;

                });
                output += '</ul>';
                output += '</div>';
                output += '</div>';
                $('#search_result').show();
                $('#search_result').html(output);
                $('.searchresults').slideDown();
                $('#search_result li').click(function () {
                    var selected_text = $(this).text();
                 
                    // $('#keyword').val(selected_text);    // Main code
                    $('#keyword').val(''); // Clear Field
                    $('#item_details').addClass( $scope.radioValue);
                    var sura_number, sura_name, page_number = '';
                    if ( $scope.radioValue == 'aya') {
                        sura_number = $(this).attr('sura_number');
                        page_number = $(this).attr('page_number');
                        aya_number =$(this).attr("id");
                        if (quraat_name == 'shamarly') {
                            if (typeof sura_data !== 'undefined') {
                                $.each(sura_data, function (indx, val) {
                                    if (val.sura_order == sura_number) {
                                        sura_name = val.sura_name;
                                    }
                                });
                            }
                        } else {
                            if (typeof sura_data !== 'undefined') {
                                $.each(sura_data, function (indx, val) {
                                    if (val.sura_order == sura_number) {
                                        sura_name = val.sura_name;
                                    }
                                });
                            }
                        }
                        $('#item_details').html('<span  > ' + sura_name + "</span><span> (  " + $(this).attr("id") + ' ) </span>' + '<br><br><span>' + selected_text + '</span>');
                        $('#item_details').attr('sura_number',sura_number);
                        $('#item_details').attr('aya_number',aya_number);
                    } else
                    {
                        $scope.get_matn_results($(this).attr("id"));
                        // $('#item_details').html('<br><span>' + $(this).attr("id") + '- ' + selected_text + '</span>');
                    }
                       
                    $('.searchresults').slideUp();
                    $('#search_result').html('');
                    $('#search_result').hide();
                     
                });
                $scope.get_matn_results=function(id){
                    $("#audio_paly_option").show();
                    id=parseInt(id);
                    before_after=5;
                    matn_result="";
                    $.get(file_url, function (data,status) {
                        data = $.parseJSON(data);
                        // for(ix=id-before_after;ix<id+before_after;ix++ )
                        for(ix=0;ix<=data.length;ix++ )
                        {   if(ix>0 && ix<=data.length)
                            {
                                item=data[ix-1];
                            selcted_class= (ix==id) ?"heilighted":"";
                            matn_result+='<li class="'+selcted_class+'"><span >' + item.number + '- ' + item.text + '</span>'+
                                        '<i  data-type="'+ $scope.radioValue+'" id="' + item.number + '" class="fa fa-headphones"></i>'+
                                            '</li>'
                            // $('#item_details').html();
                            }
                            
                        }
                        $('#item_details').html(matn_result);
                        $(".heilighted").get(0).scrollIntoView();
                        $(document).on('click',  '#item_details li i', function(){
                            $scope.playSoundMatn($(this));
                           });
                    // $.each(data, function (index, value) {
                       
                    // }
                   // )
                })

                }

                 $scope.playSoundMatn=function(element){
                    $("#item_details li").removeClass("heilighted");
                    element.parent().addClass("heilighted");
                    $(".heilighted").get(0).scrollIntoView();
                    $scope.continousPlaying_matn=$("#continousPlaying_matn").prop("checked");
                                    var matnType = element.data('type');//shatbia or dorra
                        var matnNumber = element.attr('id'); 
                             
                            matn_reader =setting_srv.settings.selectedreader_matn
                            
                        if(matnType=='shatbia')
                            matnPath = default_sound_server_shamarly+matn_reader+"/shatebia/";
                        else matnPath = default_sound_server_shamarly+matn_reader+"/doraa/";
                        matnFilePath = matnPath+matnNumber+".mp3";
                            audio_player = document.getElementById('audio'); 
                            audio_player.src =matnFilePath; 
                            matnNextNumber =parseInt(matnNumber)+1;
                        //for continous playing 
                            audio_player.onended = function () {
                                if($scope.continousPlaying_matn){
                                            matnNextNumber =parseInt(matnNumber)+1;
                                                matnNextElement=$("#item_details li #"+matnNextNumber);
                                               
                                    // if(matnNextNumber<= parseInt($("ul#item_details li.selectedRow:last-child").attr('id')))
                                    if(matnNextElement.length==1)
                                    {
                                       
                                            $scope.playSoundMatn(matnNextElement);
                                                }
                                                                        
                    
                                        }
                                    }
                            audio_player.onerror = function (event) { 
                                        audio_player.pause();               
                                    }
                    
                            audio_player.oncanplay = function () {audio_player.play();
                                        console.log('Matn playing src:'+audio_player.src); 
                                    }
                        
                            
                            }
                $(".item_element #item_details").click(function(){
                    if ( $scope.radioValue == 'aya') {
                      sura_number = $('#item_details').attr('sura_number');
                      aya_number = $('#item_details').attr('aya_number');
                    $scope.BrowseTo(sura_number,aya_number);
                    $('.searchresults').slideUp();
                    $('#search_result').html('');
                    $('#ayah_details').html('');
                    $('#search_result').hide();
                    $scope.myPopup.close();
                    
                    }
                })
                // $(".item_element").click(function(){
                //     if ( $scope.radioValue == 'aya') {
                //       sura_number = $('#item_details').attr('sura_number');
                //       aya_number = $('#item_details').attr('aya_number');
                //     // $scope.BrowseTo(sura_number,aya_number);
                //     $('.searchresults').slideUp();
                //     $('#search_result').html('');
                //     $('#ayah_details').html('');
                //     }
                // })
                $(".close_search_btn").click(function () {
                    $('.searchresults').slideUp();
                    $('#search_result').html('');
                    $('#search_result').hide();
                    $('#ayah_details').html('');
                });
            },
            "text");

        }
        $scope.open_search_settings = function () {
            var keyword = '';
            $rootScope.$broadcast('autoscrollpause', true);
            console.log('open_search_settings called...........');
            $scope.myPopup_opended = true;
            console.log('keyword = ' + $scope.keyword);
            var search_settings = window.localStorage.getItem('search_settings');
            if (window.localStorage.getItem("search_settings") !== null) {
                keyword = $scope.search_settings.keyword;
            }

            setTimeout(function () {
                $scope.myPopup = $ionicPopup.show({
                    template: ' <ul class="search_settings"> ' +
                        '<form>' + '<input   value="' + keyword + '" style="text-align:right" id="keyword" name="keyword" type="text" placeholder="اكتب كلمة  البحث">' +
                        '<label for="aya">الآيات</label><input id="aya" type="radio" value="aya"  class="search_item" name="search_item">' +
                        '<label for="shatbia">الشاطبية</label><input id="shatbia" type="radio" value="shatbia" name="search_item" class="search_item">' +
                        '<label for="dora">الدرة</label><input id="dora" type="radio" value="dora" class="search_item" name="search_item"></form>' +
                        '<li class="ayah_details"></li><li class="srch_btn">ابدأ البحث  <i id="keyword_search_btn" class="fa fa-search search_text_btn"> </i></li>' +
                        '<li class="item_element" style="position:relative;"> ' +

                        '<div id="search_result"></div> '+
                        ' <div id="audio_paly_option" style="display:none; float: right; width: 100%; height: 28px;"><input type="checkbox" id="continousPlaying_matn"  style="width: 50px;"  >استماع متواصل </div>  '+
                        ' <h4 id="item_details"></h4> </li>',
                    title: 'البحث ',
                    scope: $scope,
                    cssClass: 'search_settings-popup setting-popup',
                    buttons: [{
                        text: 'تراجع',
                        onTap: function () {
                            $scope.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                        }
                    }]
                });

                $scope.$on('on_open_open_search_settings', function (event, args) {
                    //this to insure event call only one times 
                    if ($scope.$$listenerCount["on_open_open_search_settings"] > 1) {
                        $scope.$$listenerCount["on_open_open_search_settings"] = 0;
                    }

                    console.log('on_open_open_search_settings called...........');

                    $scope.open_search_settings();
                });
                $scope.myPopup.then(function (res) {
                    if (res) {
                        console.log(res);
                        window.localStorage.setItem('search_settings', JSON.stringify($scope.search_settings));
                    }
                });
            }, 100);


        }

        /************ farshiat audio play */
        
        $('.wagh_audio_player').off('click');
        $('.wagh_sound_play').off('click');
        
        $('.wagh_audio_player').remove();
        $(document).off('click', '.wagh_sound_play');
        $(document).on('click', '.wagh_sound_play', function () {
            console.log($(this).attr("file_name") );
                audio_player = document.getElementById('audio');   
                audio_player.onended = function () {
                  
                }
                // ---- Audio Player : osool : onError ---- //
                audio_player.onerror = function (event) {
                    console.log('error:', event);
                    $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
                    audio_player.pause();
                   
                }
                audio_player.src = $(this).attr("file_name");
             
                    audio_player.oncanplay = function () { }
                    audio_player.play();
                    console.log('play src:'+audio_player.src);
                  
        })


        /************* */
        /*** Aliaa ***/
        $(document).on('change', '.search_item', function () {
            $('#search_result').html('');
            $('#ayah_details').html('');
            $('#search_result').hide();
        });
        $(document).on('click', '.srch_btn', function () {
            $('#item_details').html(''); // Clear search result
             $scope.radioValue = $("input[name='search_item']:checked").val();
            var keyword_val = $("#keyword").val();
            if ( $scope.radioValue == false ||  $scope.radioValue == '' ||  $scope.radioValue == undefined) {
                alert('من فضلك قم باختيار نوع البحث ايات / شاطبية / درة ');
                return false;
            }
            if (keyword_val == '') {
                alert('من فضلك قم بكتابة كلمة لبدء البحث ');
                return false;
            }

            $scope.search();
        });
        $(document).ajaxStart(function () {
            console.log('ajaxStart');
            $('body').prepend('<div class="overlay_loader" style="text-align: center;position: absolute;background: #63b5b617;height: 100%;width: 100%;z-index: 999999;"><img style="z-index: 999999; border-radius: 100%;width: 100px;height: 100px;position: relative;vertical-align: middle;top: 50%;" src="images/ajax-loader.gif" alt="Loadding..." /></div>');
        });
        $(document).ajaxComplete(function () {
            console.log('ajaxComplete');
            $(".overlay_loader").remove();
        });
        $(document).on('click', '.cancel_modal', function () {
            $("#single_position_view").css('display', 'none');
            $("#single_position_view").html('');
            $("#position_item_view").css('display', 'none');
            $("#position_item_view").html('');
            $("#farshiat_content").css('display', 'block');
        });
        var pause_snd = true;
        $(document).on('click', '.sound_play', function () {
            // if(pause_snd==true) pause_snd=false; else pause_snd = true;
            var sound = document.getElementById("wagh_audio");
            var sound_filename = $(this).attr('file_name');
            var audio_now_playing = $("#wagh_audio").attr("src");
            $("#wagh_audio").attr("src", sound_filename);
            if (sound.paused && pause_snd == true) {
                sound.play();
                pause_snd = false;
            } else {
                sound.pause();
                pause_snd = true;
            }
        });
 
        // $(window).resize(function () {
        //     var notes = $('*[id^="notes"]');
        //     notes.html('test');
        //     if (quraat_name == 'shamarly') {
        //         init_shamarly();
        //     } else {
        //         init_madina();
        //     }
        //     read_aya_data();
        //     if (aya_options_srv.current_clicked_ayah != null || aya_options_srv.current_clicked_ayah != undefined) {
        //         if ('ayah_index' in aya_options_srv.current_clicked_ayah) {
        //             if (quraat_name == 'shamarly') {
        //                 $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "'][ayah='" + aya_options_srv.current_clicked_ayah.ayah + "']").css({
        //                     backgroundColor: "rgba(81, 160, 55, 0.28)"
        //                 });
        //             } else {
        //                 $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "'][ayah='" + aya_options_srv.current_clicked_ayah.ayah_number + "']").css({
        //                     backgroundColor: "rgba(155, 80, 50, 0.4)"
        //                 });
        //             }
        //         }
        //         if (quraat_name == 'shamarly') {
        //             $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "'][ayah='" + aya_options_srv.current_clicked_ayah.ayah + "']").addClass('current_clicked_aya');
        //         } else {
        //             $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "'][ayah='" + aya_options_srv.current_clicked_ayah.ayah_number + "']").addClass('current_clicked_aya');
        //         }
        //     }
        //     $scope.Calc_index();
        //     //$(".tables_tab .tab-content").css('height',$(window).height()-50) ; 

        // });
        $(document).on('click', '#send_email', function () {
            app_name = ' مصحف المدينة ';
            if (quraat_name == 'shamarly') {
                app_name = '   مصحف الشمرلي - ';
            } else {
                app_name = ' مصحف المدينة - '
            }
            if(window.cordova.platformId=='android'){
                var win_ver = 'تيسير القراءات - نسخة أندرويد ';
            }else
            {  var win_ver = 'تيسير القراءات - نسخة ابل iOS  ';

            }
          
            subject = '(' + $scope.current_page + ')رقم صفحة ' + app_name + win_ver;
            body = 'اقتراح من تطبيق ' + win_ver;
            window.location.href = "mailto:quraat@quraat.info?body=" + body + '&subject=' + subject;

            /* $.ajax({
                   type: "POST",
                   url: "email.php",
                   data: {'subject':subject , 'body':body},
                   success: function(res_data){
                       //alert(res_data);
                   //$('.success').fadeIn(1000);
                   }
               });*/

        });

        $(document).on('click', '#speed_range', function () {
            $scope.autoscrollspeed = this.value;
            $scope.autoscroll();
            $scope.speednum1();
            $('.speednum1').html(this.value);
        });
        $(document).on('click', '.audio_play_close_button img', function () {
            $scope.close_aya_options();
        });



      
        // function makeid() {
        //     var text = "";
        //     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //     for (var i = 0; i < 5; i++)
        //         text += possible.charAt(Math.floor(Math.random() * possible.length));

        //     return text;
        // }

        is_file_in_local = function (file_number /*file.json*/ ) {
            if (!$scope.local_data_jsons)
                $scope.local_data_jsons = JSON.parse(window.localStorage.getItem("local_data_jsons"));
            return $scope.local_data_jsons[file_number];
        }

        function add_local_file(file_number) {
            if (!$scope.local_data_jsons)
                $scope.local_data_jsons = JSON.parse(window.localStorage.getItem("local_data_jsons"));
            $scope.local_data_jsons[file_number] = true;
            window.localStorage.setItem("local_data_jsons", JSON.stringify($scope.local_data_jsons));

        }

        function downloadAsset(index) {
            // alert(store);
            store = cordova.file.dataDirectory;
            if (index >= $scope.FilesToUpdate.length) {
                console.log('ajaxComplete');
                $(".overlay_loader").remove();
                msg = "تم التحديث بنجاح";
                var alertPopup = $ionicPopup.alert({
                    title: 'تحديث ',
                    template: msg
                });
                alertPopup.then(function (res) {
                    $scope.check_update_running = false;
                    //need to call	init_shamarly();
                    $rootScope.$broadcast('init_quraat');
                });
                return
            }
            // if(asset_num > allpages) return; // all pages loaded

            var fileName = $scope.FilesToUpdate[index].name + ".json";
            if (fileName.toLowerCase() != 'tables.json') {
                if (quraat_name == 'shamarly') {
                    var assetURL = $scope.uri + data_shamarly + fileName;
                    var tempName = store + data_shamarly + common_serv.makeid();
                    var Target = store + data_shamarly + fileName;
                } else {
                    var assetURL = $scope.uri + data_madina + fileName;
                    var tempName = store + data_madina + common_serv.makeid();
                    var Target = store + data_madina + fileName;
                }

                //asset_num=asset_num+1;

                // else return;
                var fileTransfer = new FileTransfer();

                window.resolveLocalFileSystemURL(tempName, function (fileEntry) {
                    console.log("file exist ??:" + tempName);;
                }, function () { /// file not exit
                    fileTransfer.download(assetURL, tempName,
                        function (entry) {
                            console.log("Success!");
                            //$('.radial-progress').attr('display',"none");
                            /// copy tempName  to Target
                            // remove old file
                            window.resolveLocalFileSystemURL(Target, function (Fentry) {
                                /* Target file exist*/
                                Fentry.remove(function (file) {
                                    /* remove sucess*/
                                    entry.getParent(function (parentEntry) {
                                        entry.moveTo(parentEntry, fileName, function () {
                                            /* moveTO success*/
                                            window.localStorage.setItem('timestamp', $scope.FilesToUpdate[index].lasttimestamp);

                                            add_local_file($scope.FilesToUpdate[index].name);
                                            /*get next file*/
                                            downloadAsset(index + 1);

                                        }, function (error) {
                                            /* moveTOfail*/
                                            console.log('moveTO fail !!');
                                            console.log(error);
                                        });
                                    });
                                }, function (error) {
                                    /*remove fail*/
                                    console.log('remove fail');
                                    console.log(error);
                                })

                            }, function () {
                                /*Target not exist*/

                                console.log('Target not exist');
                                entry.getParent(function (parentEntry) {
                                    entry.moveTo(parentEntry, fileName, function () {
                                        /* moveTOsuccess*/
                                        /* moveTO success*/
                                        window.localStorage.setItem('timestamp', $scope.FilesToUpdate[index].lasttimestamp);
                                        add_local_file($scope.FilesToUpdate[index].name);
                                        /*get next file*/
                                        downloadAsset(index + 1);

                                    }, function (error) {
                                        /* moveTOfail*/
                                        console.log('moveTO fail !!');
                                        console.log(error);
                                    });
                                });

                            });


                        },
                        function (err) {
                            //$('.radial-progress').attr('display',"none");
                            console.log("Error");
                            console.dir(err);

                            downloadAsset(index);
                            // downloadAsset(type, index);
                        });


                });

            }
        }

        function downloadAsset_in_silence(index) {
            // alert(store);
            store = cordova.file.dataDirectory;
            if (index >= $scope.FilesToUpdate.length) {
                $scope.check_update_running = false;
                //need to call	init_shamarly();
                $rootScope.$broadcast('init_quraat');
                return
            }
            var fileName = $scope.FilesToUpdate[index].name + ".json";
            if (fileName.toLowerCase() != 'tables.json') {
                if (quraat_name == 'shamarly') {
                    var assetURL = $scope.uri + data_shamarly + fileName;
                    var tempName = store + data_shamarly + common_serv.makeid();
                    var Target = store + data_shamarly + fileName;
                } else {
                    var assetURL = $scope.uri + data_madina + fileName;
                    var tempName = store + data_madina + common_serv.makeid();
                    var Target = store + data_madina + fileName;
                }
                var fileTransfer = new FileTransfer();
                window.resolveLocalFileSystemURL(tempName, function (fileEntry) {
                    console.log("file exist ??:" + tempName);;
                }, function () { /// file not exit
                    fileTransfer.download(assetURL, tempName,
                        function (entry) {
                            console.log("Success!");
                            window.resolveLocalFileSystemURL(Target, function (Fentry) {
                                /* Target file exist*/
                                Fentry.remove(function (file) {
                                    /* remove sucess*/
                                    entry.getParent(function (parentEntry) {
                                        entry.moveTo(parentEntry, fileName, function () {
                                            /* moveTO success*/
                                            window.localStorage.setItem('timestamp', $scope.FilesToUpdate[index].lasttimestamp);

                                            add_local_file($scope.FilesToUpdate[index].name);
                                            /*get next file*/
                                            downloadAsset_in_silence(index + 1);

                                        }, function (error) {
                                            /* moveTOfail*/
                                            console.log('moveTO fail !!');
                                            console.log(error);
                                        });
                                    });
                                }, function (error) {
                                    /*remove fail*/
                                    console.log('remove fail');
                                    console.log(error);
                                })

                            }, function () {
                                /*Target not exist*/

                                console.log('Target not exist');
                                entry.getParent(function (parentEntry) {
                                    entry.moveTo(parentEntry, fileName, function () {
                                        /* moveTOsuccess*/
                                        /* moveTO success*/
                                        window.localStorage.setItem('timestamp', $scope.FilesToUpdate[index].lasttimestamp);
                                        add_local_file($scope.FilesToUpdate[index].name);
                                        /*get next file*/
                                        downloadAsset_in_silence(index + 1);

                                    }, function (error) {
                                        /* moveTOfail*/
                                        console.log('moveTO fail !!');
                                        console.log(error);
                                    });
                                });

                            });


                        },
                        function (err) {
                            //$('.radial-progress').attr('display',"none");
                            console.log("Error");
                            console.dir(err);

                            downloadAsset(index);
                            // downloadAsset(type, index);
                        });


                });

            }
        }
        $ionicPlatform.ready(function () {
            // Put code here
            // $scope.check_update(); // Test code

        })

        $scope.$on('$ionicView.loaded', function () {
            // 
        });


        // function read_sura_data() {

        //     var script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     //script.header='Content-Type: application/json; charset=utf-8';
        //     if (quraat_name == 'shamarly')
        //         script.src = sh_more_data + "sura_data_new.json";
        //     else
        //         script.src = madina_more_data + "sura_data_new.json";
        //     // script.src = data_madina + "sura_data.json"; // Test files

        //     // Then bind the event to the callback function.
        //     // There are several events for cross browser compatibility.
        //     // script.onreadystatechange = subCallback;
        //     script.onload = subCallback;

        //     // Fire the loading
        //     var head = document.getElementsByTagName('head')[0];
        //     head.appendChild(script);
        // }

        // function read_sura_data() {

        //     if (typeof sura_data !== 'undefined') return;
        //     subCallback = function () {
        //         common_serv.Suras = [];
        //         $scope.Sections = [];
        //         common_serv.Hesbs = [];

        //         if (quraat_name == 'shamarly') {
        //             window.localStorage.setItem('sura_data', JSON.stringify(sura_data));
        //             var len = sura_data.length;
        //             for (i = 0; i < len; i++) {
        //                 //sura_data[i].sura_name!="" &&   
        //                 if (!$filter('filter')(common_serv.Suras, {
        //                         sura_name: sura_data[i].sura_name,
        //                     }, true)[0]) common_serv.Suras.push(sura_data[i]);
        //                 if (!$filter('filter')($scope.Sections, {
        //                         section: sura_data[i].section,
        //                     }, true)[0]) 
        //                     { //aya_data=$scope.getAya_data(sura_data[i].sura_order,sura_data[i].);
        //                         $scope.Sections.push(sura_data[i]);
        //                     }

        //                 if (!$filter('filter')(common_serv.Hesbs, {
        //                         hesb: sura_data[i].hesb,
        //                     }, true)[0]) common_serv.Hesbs.push(sura_data[i]);
        //             }
        //         } else {
        //             window.localStorage.setItem('sura_data', JSON.stringify(sura_data));
        //             var len = sura_data.length;
        //             for (i = 0; i < len; i++) {
        //                 if (!$filter('filter')(common_serv.Suras, {
        //                         sura_name: sura_data[i].sura_name,
        //                     }, true)[0]) common_serv.Suras.push(sura_data[i]);
        //                 if (!$filter('filter')($scope.Sections, {
        //                         section: sura_data[i].section,
        //                     }, true)[0]) $scope.Sections.push(sura_data[i]);
        //                 if (!$filter('filter')(common_serv.Hesbs, {
        //                         hesb: sura_data[i].hesb,
        //                     }, true)[0]) common_serv.Hesbs.push(sura_data[i]);
        //             }
        //         }
        //         // scope.setTheSelectLists($scope.pg.current_default_page);
        //          $scope.setPlaces();
        //     }
        //     var script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     //script.header='Content-Type: application/json; charset=utf-8';
        //     if (quraat_name == 'shamarly')
        //         script.src = './' + 'common_files/'   + "sura_data_new.json";
        //     else
        //         script.src = './' + 'common_files/' + "sura_data_new.json";
        //     // script.src = data_madina + "sura_data.json"; // Test files

        //     // Then bind the event to the callback function.
        //     // There are several events for cross browser compatibility.
        //     // script.onreadystatechange = subCallback;
        //     script.onload = subCallback;

        //     // Fire the loading
        //     var head = document.getElementsByTagName('head')[0];
        //     head.appendChild(script);



        // }

        common_serv.read_sura_data( $scope.setPlaces );




        ///////////////////////////////////////////////////// end from app controller

        $scope.$on('$ionicView.enter', function () {
            $rootScope.$broadcast('autoscrollplay', true);
            init_shamarly();
        })
        //console.log = function(){};
        $scope.settings = {};
        if (window.localStorage.getItem('setting')) $scope.settings = JSON.parse(window.localStorage.getItem('setting'));
        else {
            $scope.settings.alamat7 = true;
            $scope.settings.efrad_gam3 = "gam3";
            $scope.settings.shawahed3 = true;
            $scope.settings.shawahed7 = true;
            $scope.settings._3adalayat = true;
            $scope.settings.intro_kobra_v=true;
            $scope.settings.intro_soghra_v=true;
            $scope.settings.msgBox = false;
            $scope.settings.alamat3mwafaqa = true;
            $scope.settings.tshabohat = true;
            $scope.settings.alamat3 = true;
            $scope.settings.tawgehqraat = true;
            $scope.settings.keepAwake = false;
            window.localStorage.setItem('setting', JSON.stringify($scope.settings));
        }

        var first_load = false;
        var uri = encodeURI("http://quraat.info/4review/");


        $scope.pages = [];


        //window.onload = start;

        $scope.$on('$ionicView.enter', function () {
            // Code you want executed every time view is opened
            console.log('Opened!');

        });
        document.addEventListener('deviceready', onDeviceReady, false);
        if(typeof(cordova)!='object') onDeviceReady();
        onDeviceReady_b();
        $scope.current_page = parseInt(window.localStorage.getItem('current_page'));
        for (var i = 1; i <= allpages; i++) {
            $scope.pages[i] = i;
        }
        $scope.$on('$ionicView.loaded', function (event) {});

        progrerss_move = function () {
            var n = parseInt($('.radial-progress').attr('data-progress')) + 1;
            if (isNaN(n)) n = 0;
            if (n >= 100) n = 0;
            $('.radial-progress').attr('data-progress', Math.floor(n));
            if ($("#progress").css('display') == 'block') setTimeout(progrerss_move, 500);

        }

        function onDeviceReady_b() {
            if (window.localStorage.getItem(appNeedInstall_str) != "NO") {
                if (quraat_name == 'shamarly') {
                    $scope.current_page = 2;
                    window.localStorage.setItem('current_page', 2);
                } else {
                    $scope.current_page = 1;
                    window.localStorage.setItem('current_page', 1);
                }
                setTimeout(function () {
                    $rootScope.$broadcast('autoscrollplay_ft', true);
                }, 1000);
            } else $scope.autoscrollspeed = 0;
            window.localStorage.setItem("orientation", window.orientation);
        }


        $scope.read_data_file = function (file_path, i) {

            console.log(file_path, i);
            /*if(document.getElementById('the-img'+i) !=null)
            {var screenMax_x_sh=document.getElementById('the-img'+i).clientWidth+25;//45;
            var screenMax_y_sh=document.getElementById('the-img'+i).clientHeight+25;//45;
            var xration_sh=parseFloat(screenMax_x_sh/574.517);//595//575;
            var yration_sh=parseFloat(screenMax_y_sh/820.252);//822.44//820;
            }*/
            var screenMax_x_sh = document.getElementById(i).clientWidth + 25; //45;
            var screenMax_y_sh = document.getElementById(i).clientHeight + 25; //45;
            var xration_sh = parseFloat(screenMax_x_sh / 574.517); //595//575;
            var yration_sh = parseFloat(screenMax_y_sh / 820.252); //822.44//820;


            subCallback_sh = function (is_efrad_file,e) {

                var folder='.';
                //self.fillRect(50, 50, 100, 50);
                var note = document.getElementById('notes' + i);
                if (note == null) return;
               // note.innerHTML = ''
                //note.top=document.getElementById(i).top;
                //note.bottom=document.getElementById(i).getBoundingClientRect().bottom;
                if(is_efrad_file)
                {
                    //entry.toURL()
                    if (  cordova && cordova.file && cordova.file.dataDirectory) folder = cordova.file.dataDirectory + "efrad/efrad_files/";
                    if (window.cordova.platformId!='android')  {folder ="efrad/efrad_files/";}
                
                        if($scope.settings.efrad_gam3=="efrad_k")
                    {
                        workdata=data_k;
                        folder=folder+"/data_k";
                    }else
                    if($scope.settings.efrad_gam3=="efrad_a")
                    {
                        workdata=data_a;
                        folder=folder+"/data_a";
                    }else
                    if($scope.settings.efrad_gam3=="efrad_b")
                    {
                        workdata=data_b;
                        folder=folder+"/data_b";
                    }else
                    if($scope.settings.efrad_gam3=="efrad_s")
                    {
                        workdata=data_s;
                        folder=folder+"/data_s";
                    }else
                    if($scope.settings.efrad_gam3=="efrad_j")
                    {
                        workdata=data_j;
                        folder=folder+"/data_j";
                    }
                }
                else
                workdata=data;

               

                for (var k in workdata) {
                    var d = workdata[k];
                    //if (k>0) continue;
                    if($scope.settings.efrad_gam3!="gam3")
                    {// efrad setting 
                        // allow efrad only lines
                                    if (!is_efrad_file && d.Subtype == "/Line" ) continue; //&& !$scope.settings.alamat7
                                
                                  if (d.Subtype == "/Circle" && d.IC )  continue;//&& !$scope.settings.alamat3 
                                // //brown_circle 
                                //  if (d.Name && d.Name == "/Circle"  ) continue; //!$scope.settings.shawahed3
                                // if (d.Name && d.Name == "/Comment" ) continue; //!$scope.settings.shawahed7
                                 if (d.Subtype == "/Circle" && !d.IC ) continue;//!$scope.settings.alamat3mwafaqa
                                    
                    }
                    ///stars
                    if (d.Name && d.Name == "/Star" && !$scope.settings.tshabohat) continue;
                   
                    if($scope.settings.efrad_gam3=="gam3")
                    {
                    //Lines 
                    if (d.Subtype == "/Line" && !$scope.settings.alamat7) continue;
                    }
                    
                   



                    //Solid color circiles  
                    if (d.Subtype == "/Circle" && d.IC && !$scope.settings.alamat3)
                        continue;

                    //brown_circle 
                    if (d.Name && d.Name == "/Circle" && !$scope.settings.shawahed3)
                        continue;


                    //empty circil 
                    if (d.Subtype == "/Circle" && !d.IC && !$scope.settings.alamat3mwafaqa)
                        continue;

                    //key
                    if (d.Name && d.Name == "/Key" && !$scope.settings.tawgehqraat) continue;

                    //Yellow_mark
                    if (d.Name && d.Name == "/Comment" && !$scope.settings.shawahed7) continue;

                    
                    if (d.Name && d.Name == "/UpArrow" && !$scope.settings._3adalayat) continue;

                    if (d.Name && d.Name == "/Star"  ) continue; // green star tremoved after adding Motashabehat
                 

                    if (d.AP == "Dictionary") {
                        //console.log(d);
                        var img = document.createElement('div'); //img
                        //img.src="read.png";
                        //img.onshow=createHandler(img,d);//"showtext('"+img+","+d.body+"')"; 
                        img.id = d.NM;
                        //img.onmouseover=createHandler(img,d);
                        //img.addEventListener("onmouseover", "alert( 'd.body');", false);
                        //img.onmouseover="alert('d.body')";//"showtext('"+img+","+d.body+"')";//"showtext('"+img+","+d.body+"')";

                        efrad_image_sheft=0;
                        if(d.Name=="/#23clipboard")
                        {
                            var image = document.createElement('img');
                            image.src=folder+"/images/"+img.id+".Jpeg";
                            image.style="width:100%;";
                            //img.append(image);
                            img.appendChild(image);
                            
                            if(i%2==0){
                                //even
                                efrad_image_sheft=-18;
                            }else
                            {//odd
                                efrad_image_sheft=10
                            }
                            
                        }
                        ///ration x  document.getElementById('img1').clientWidth: 575     :  
                        //				y    document.getElementById('img1').clientHight:  820 


                        var color_str = d.C.substring(1, d.C.length - 1);
                        var color = color_str.split(","); //color= 1,2,3  

                        color[0] = Math.floor(color[0] * 255);
                        color[1] = Math.floor(color[1] * 255);
                        color[2] = Math.floor(color[2] * 255);

                        var Rect_str = d.Rect.substring(1, d.Rect.length - 1);
                        var Rect = Rect_str.split(","); //Rect= x,y ,x1,y1
                        //console.log(Rect);

                        //first item correct location value   y=top: 351.016px;  x=left: 538.549px;
                        //real values   672.365479    ,  240.225815
                        //y ratio 672.365479/351.016px=1.915483849739043
                        // y
                        //
                        // if (d.Subtype == "/Circle" && color[0] == 0 && color[1] == 0 && color[2] == 0) {
                        //     color[2] = 255;
                        // }



                        ///maximum pdf y = 820.252    maximun pdf x=574.517
                        //"[20.2916, 812.191, 27.9371, 820.252]"
                        //"[566.872, 20.8218, 574.517, 28.8837]"
                        if (d.Subtype == "/Circle" && color[0] == 0 && color[1] == 0 && color[2] == 0) {
                            color[2] = 255;
                        }


                        width = (Rect[2] - Rect[0]) * xration_sh - 3;
                        height = (Rect[3] - Rect[1]) * yration_sh - 3;
                        y = parseFloat(screenMax_y_sh - yration_sh * parseFloat(Rect[1]) - height);
                        x = parseFloat(xration_sh * parseFloat(Rect[0] - 20)) + efrad_image_sheft;
                        workdata[k].y = y;
                        workdata[k].x = x;
                        workdata[k].h = parseFloat(height);
                        border = 2;
                        if (d.Name && d.Name == "/Circle") {
                            // Main
                            width = width - 5;
                            height = height - 5;
 
                            // width = width;
                            // height = height;
                            border = 2
                        }
                        if (d.Name && d.Name == "/UpArrow") {
                            width = width + 5;
                            height = height + 5;
                        }
                        style = "";
                        if (d.Name != "/Key" && d.Name != "/UpArrow") style += " background-color: rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                        if (d.Subtype == "/Circle" || d.Name == "/Circle") {
                            width=width<5?5:width;
                            height=height<5?5:height;
                            style += "border-radius: 50%;";
                            if (d.IC) { //
                                var icolor_str = d.IC.substring(1, d.IC.length - 1);
                                var icolor = icolor_str.split(","); //color= 1,2,3 
                                icolor[0] = Math.floor(icolor[0] * 255);
                                icolor[1] = Math.floor(icolor[1] * 255);
                                icolor[2] = Math.floor(icolor[2] * 255);
                                style += " ";
                                style += " background-color: rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                            } else {
                                style += "border: " + border + "px solid rgb(" + color[0] + "," + color[1] + "," + color[2] + ");    background-color: transparent;";
                                if (border == 2 && color[0] == 164 && color[1] == 42 && color[2] == 0) {
                                    img.className = 'circle'; // comment_area
                                }
                            }

                        }
                        if (d.Subtype == "/Line") {
                            height = 2; //height-1;
                        }

                        if (d.Name && d.Name == "/Star") //star-six
                        {
                            if (d.C) { //
                                var icolor_str = d.C.substring(1, d.C.length - 1);
                                var icolor = icolor_str.split(","); //color= 1,2,3 
                                icolor[0] = Math.floor(icolor[0] * 255);
                                icolor[1] = Math.floor(icolor[1] * 255);
                                icolor[2] = Math.floor(icolor[2] * 255);

                                Star_color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
                            } else Star_color = "red";
                            ///star-fifth
                            starWidth =  width - 5;
                            if(starWidth<7)starWidth=7;
                            img.id = 'star' + d.NM;
                            if (Star_color == "rgb(49,205,49)") {
                                console.log('green star');
                                img.className = 'star'; // comment_area
                            }
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
                        } else {
                            style += "width:" + width + "px;height:" + height + "px; ";
                        }

                        if (d.Name && d.Name == "/Comment") {
                            style += " background-image: url(./images/annotation-note.svg); background-repeat: no-repeat;  background-size: 100% 100%;";
                            img.className = 'comment'; // comment_area
                        }
                        if (d.Name && d.Name == "/Key") {
                            style += " background-image: url(./images/key.png); background-repeat: no-repeat;  background-size: 140% 140%;";
                            img.className = 'key'; // comment_area
                        }

                        //_3adalayat image 
                        if (d.Name && d.Name == "/UpArrow") {
                          //  style += " background-image: url(./images/_3adalayat.png); background-repeat: no-repeat;  background-size: 140% 140%;";
                            img.className = '_3adalayat'; // comment_area
                            y=y-10;
                        }
                        


                        style += "display:flex ;position: absolute;top:" + y + "px;left:" + x + "px; z-index:" + k + ";    ";
                        //console.log(style);
                        //img.style=style;
                        img.style.cssText = style;
                        //console.log(img.style);
                        note.appendChild(img);
                        //	document.getElementById(i).appendChild(note);
                    }


                }
                if(!is_efrad_file)
                {
                    all_pages_data[i] = workdata;
                    /// in case of speed scroll should fill mon data with 
                    // correct data 
                    mon_data = getMonitordData($scope.current_page);
                }
               

            }
            var clientWidth = document.getElementById(i).clientWidth;
            var margin_x = clientWidth * 9.55 / 100;
            var screenMax_x = clientWidth + margin_x; //45;
            var clientHeight = document.getElementById(i).clientHeight;
            var margin_y = clientHeight * 6.9 / 100;
            var screenMax_y = clientHeight + margin_y;;
            subCallback_ma = function () {


                //self.fillRect(50, 50, 100, 50);
                var note = document.getElementById('notes' + i);
                if (note == null) return;
                note.innerHTML = ''
                //note.top=document.getElementById(i).top;
                //note.bottom=document.getElementById(i).getBoundingClientRect().bottom;
                for (var k in data) {
                    var d = data[k];


                    ///stars
                    if (d.Name && d.Name == "/Star" && !$scope.settings.tshabohat) continue;
                    //Lines 
                    if (d.Subtype == "/Line" && !$scope.settings.alamat7) continue;

                    //Solid color circiles  
                    if (d.Subtype == "/Circle" && d.IC && !$scope.settings.alamat3)
                        continue;
                    //key
                    if (d.Name && d.Name == "/Key" && !$scope.settings.tawgehqraat) continue;

                    //brown_circle 
                    if (d.Name && d.Name == "/Circle" && !$scope.settings.shawahed3)
                        continue;


                    //empty circil 
                    if (d.Subtype == "/Circle" && !d.IC && !$scope.settings.alamat3mwafaqa)
                        continue;

                    //key
                    if (d.Name && d.Name == "/Key" && !$scope.settings.tawgehqraat) continue;

                    //Yellow_mark
                    if (d.Name && d.Name == "/Comment" && !$scope.settings.shawahed7) continue;

 
                    if (d.Name && d.Name == "/UpArrow" && !$scope.settings._3adalayat) continue;

                    if (d.Name && d.Name == "/Star"  ) continue; // green star tremoved after adding Motashabehat
                    
                    if (d.AP == "Dictionary") {
                        //console.log(d);
                        var img = document.createElement('div'); //img
                        //img.src="read.png";
                        //img.onshow=createHandler(img,d);//"showtext('"+img+","+d.body+"')"; 
                        img.id = d.NM;
                        //img.onmouseover=createHandler(img,d);
                        //img.addEventListener("onmouseover", "alert( 'd.body');", false);
                        //img.onmouseover="alert('d.body')";//"showtext('"+img+","+d.body+"')";//"showtext('"+img+","+d.body+"')";

                        ///ration x  document.getElementById('img1').clientWidth: 575     :  
                        //				y    document.getElementById('img1').clientHight:  820 


                        //document.getElementById('the-img'+i).clientHeight+margin_y;//45;
                        Xmpdf = 740; //760;
                        xration = parseFloat((screenMax_x) / Xmpdf); //595//575;//574.517
                        Ympdf = 980; //985;
                        yration = parseFloat((screenMax_y) / Ympdf); //822.44//820;917.252
                        var color_str = d.C.substring(1, d.C.length - 1);
                        var color = color_str.split(","); //color= 1,2,3  

                        color[0] = Math.floor(color[0] * 255);
                        color[1] = Math.floor(color[1] * 255);
                        color[2] = Math.floor(color[2] * 255);

                        var Rect_str = d.Rect.substring(1, d.Rect.length - 1);
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
                        /*if(d.NM=='c299f285-ff73-42f9-becc8b3d89e9a7a3')
                        {
                            console.log('screenMax_y='+screenMax_y);
                            console.log('yration='+yration);
                            console.log('Rect[1]='+parseFloat(Rect[1]));
                            console.log('yration*parseFloat(Rect[1])='+ yration*parseFloat(Rect[1]));
                            
                            
                            console.log('y='+y);
                        }*/
                        border = 2;
                        if (d.Name && d.Name == "/Circle") {
                            width = width - 5;
                            height = height - 5;
                         
                            // width = width - 10;
                            // height = height - 10;
                            border = 2
                        }
                        if (d.Name && d.Name == "/UpArrow") {
                            width = width + 5;
                            height = height + 5;
                        }
                        style = "";
                        if (d.Name != "/Key" && d.Name != "/UpArrow") style += " background-color: rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";

                        if (d.Subtype == "/Circle" || d.Name == "/Circle") {
                            width=width<5?5:width;
                            height=height<5?5:height;

                            style += "border-radius: 50%;";
                            if (d.IC) { //
                                var icolor_str = d.IC.substring(1, d.IC.length - 1);
                                var icolor = icolor_str.split(","); //color= 1,2,3 
                                icolor[0] = Math.floor(icolor[0] * 255);
                                icolor[1] = Math.floor(icolor[1] * 255);
                                icolor[2] = Math.floor(icolor[2] * 255);
                                style += " ";
                                style += " background-color: rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                            } else {
                                style += "border: " + border + "px solid rgb(" + color[0] + "," + color[1] + "," + color[2] + ");    background-color: transparent;";
                                if (border == 2 && color[0] == 164 && color[1] == 42 && color[2] == 0) {
                                    img.className = 'circle'; // comment_area
                                }
                            }


                        }
                        if (d.Subtype == "/Line") {
                            height = 2; //height-1;
                        }

                        if (d.Name && d.Name == "/Star") //star-six
                        {
                            x = x - 1.4;
                            if (d.C) { //
                                var icolor_str = d.C.substring(1, d.C.length - 1);
                                var icolor = icolor_str.split(","); //color= 1,2,3 
                                icolor[0] = Math.floor(icolor[0] * 255);
                                icolor[1] = Math.floor(icolor[1] * 255);
                                icolor[2] = Math.floor(icolor[2] * 255);

                                Star_color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
                            } else Star_color = "red";
                            ///star-fifth
                            starWidth =  width - 5;
                            if(starWidth<7)starWidth=7;
                            img.id = 'star' + d.NM;
                            if (Star_color == "rgb(49,205,49)") {
                                console.log('green star');
                                img.className = 'star'; // comment_area
                            }
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
                        } else {
                            style += "width:" + width + "px;height:" + height + "px; ";
                        }

                        if (d.Name && d.Name == "/Comment") {
                            style += " background-image: url(./images/annotation-note.svg); background-repeat: no-repeat;  background-size: 100% 100%;";
                            img.className = 'comment'; // comment_area
                        }

                        if (d.Name && d.Name == "/Key") {
                            style += " background-image: url(./images/key.png); background-repeat: no-repeat;  background-size: 140% 140%;";
                            img.className = 'key'; // comment_area
                        }

                          //_3adalayat image  madina
                          if (d.Name && d.Name == "/UpArrow") {
                            //  style += " background-image: url(./images/_3adalayat.png); background-repeat: no-repeat;  background-size: 140% 140%;";
                              img.className = '_3adalayat'; // comment_area
                              y=y-5;//-10;
                          }
                        style += "display:flex ;position: absolute;top:" + y + "px;left:" + x + "px; z-index:" + k + ";    ";
                        //console.log(style);
                        //img.style=style;
                        img.style.cssText = style;
                        //console.log(img.style);
                        note.appendChild(img);
                        //	document.getElementById(i).appendChild(note);
                    }


                }

                all_pages_data[i] = data;
                /// in case of speed scroll should fill mon data with 
                // correct data 
                mon_data = getMonitordData($scope.current_page);
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            dataDirectory = '';
            
            if(file_path.search("data_")==-1)
            {
                if (is_file_in_local(i)) {
                    if (cordova && cordova.file && cordova.file.dataDirectory) dataDirectory = cordova.file.dataDirectory;
                } else {
                    if (cordova && cordova.file && cordova.file.applicationDirectory) dataDirectory = cordova.file.applicationDirectory + "www/";
                    if (window.cordova.platformId!='android')  {dataDirectory ="";}
                }
            }
           
            if (quraat_name == 'shamarly') {
                isefrad=false ;
                if(file_path.search("data_")==0)   isefrad=true; else isefrad=false 
                if (isefrad && cordova && cordova.file && cordova.file.dataDirectory) dataDirectory = cordova.file.dataDirectory + "efrad/efrad_files/";
                if (isefrad && window.cordova.platformId!='android')  {dataDirectory ="efrad/efrad_files/";}
                script.src = dataDirectory +  file_path + "?ver=" + $scope.current_timestamp;
                script.onreadystatechange = subCallback_sh;
                script.onload = subCallback_sh.bind(isefrad,isefrad);
            } else {
                
                script.src = dataDirectory +  file_path + "?ver=" + $scope.current_timestamp;
                script.onreadystatechange = subCallback_ma;
                script.onload = subCallback_ma;
            }
            console.log('%c' + script.src, 'font-size:34;');
            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            // if (window.cordova.platformId!='android')  {
            //     script.src  = script.src .replace(/^file:\/\//, '');
            //   }
            head.appendChild(script);

        };


        function onDeviceReady() {
            store = cordova.file.dataDirectory;
            if (window.localStorage.getItem(appNeedInstall_str) != "NO") {
                console.log("INSTALLING >>>>>>>>>>>>>>>>>>>>>>>>>>>");

                $scope.settings.alamat7 = true;
                $scope.settings.efrad_gam3 = "gam3";
                $scope.settings.shawahed3 = true;
                $scope.settings.shawahed7 = true;

                $scope.settings._3adalayat = true;
                $scope.settings.intro_kobra_v=true;
                $scope.settings.intro_soghra_v=true;

                $scope.settings.msgBox = false;
                $scope.settings.alamat3mwafaqa = true;
                $scope.settings.tshabohat = true;
                $scope.settings.alamat3 = true;
                $scope.settings.tawgehqraat = true;
                $scope.settings.taha = true;
                $scope.settings.hany = true;
                $scope.settings.keepAwake = false;
                
                $scope.settings.selectedreader = "Taha";//alkobra[2].folder; // Default : Taha
                    
                window.localStorage.setItem('setting', JSON.stringify($scope.settings));
                var timestamp_for_php = 1638642910; //5/2/2020 deployment time from php http://json.quraat.info/data/getupdate.php

                window.localStorage.setItem('timestamp', timestamp_for_php);
                if (quraat_name == 'shamarly') {
                    init_shamarly();
                } else {
                    init_madina();
                }
                window.localStorage.setItem(appNeedInstall_str, 'NO');

                console.log('INSTALL FINISHED <<<<<<<<<<<<<<<<<<<<<<<<<');
              //  $rootScope.$broadcast('on_open_setting');
                //$rootScope.$broadcast('on_open_general_setting');
                $state.go('quraathelp');

            }

            if(window.cordova.platformId=='android')
            {
                if($scope.settings.keepAwake)
                {
                     // --------------- { keepAwake } --------------- //
                        window.plugins.insomnia.keepAwake();
                        console.log('%cscreen always on', 'color:green');
                        document.addEventListener("pause", onPause, false);
                        document.addEventListener("resume", onResume, false);

                        function onPause() {
                            window.plugins.insomnia.allowSleepAgain();
                            console.log('%cscreen not always on', 'color:red');
                        }

                        function onResume() {
                            window.plugins.insomnia.keepAwake();
                            console.log('%cscreen always on', 'color:green');
                        }
                }
                       

              }
            $scope.settings = JSON.parse(window.localStorage.getItem('setting'));
            //else
            if (quraat_name == 'shamarly') {
                init_shamarly();
            } else {
                init_madina();
            }
        }
        $scope.$on('init_quraat', function (event, args) {

            if (args && args.hasOwnProperty('newsettings')) {

                $scope.settings = args.newsettings;

            }
            if (quraat_name == 'shamarly') {
                init_shamarly();
            } else {
                init_madina();
            }
        })
        // to open the new page
        $scope.$on('PageChanged', function (event, args) {
            //this to insure event call only one times 
            if ($scope.$$listenerCount["PageChanged"] > 1) {
                $scope.$$listenerCount["PageChanged"] = 0;
            }
            console.log('PageChanged', args);
            page_location = NaN;
            if (args && args.hasOwnProperty('pageLoc')) {
                $scope.current_page = args.pageNum;
                $scope.new_page_location = args.pageLoc;
                //Do this
            } else {
                $scope.current_page = args;
                $scope.new_page_location = NaN;
            }

            //fill_page($scope.current_page+2);
            fill_page($scope.current_page + 1);
            fill_page($scope.current_page);
            fill_page($scope.current_page - 1);
            //fill_page($scope.current_page-2);
            //scroll_to_page
            ///scroll to page location 
            page_height=document.getElementById('5').offsetTop-document.getElementById('4').offsetTop;
            if ($scope.new_page_location) {
                   //document.getElementById('body_content').scrollTop = $scope.new_page_location;
                   diff=Math.abs($scope.new_page_location- document.getElementById('body_content').scrollTop );
                   if(diff>page_height)
                   document.getElementById('body_content').scrollTop = document.getElementById($scope.current_page).offsetTop;


                   number_of_steps=20;
                   scrollTop=document.getElementById('body_content').scrollTop;
                   step=($scope.new_page_location- scrollTop )/number_of_steps;
                   clearInterval($scope.scroll_interval);$scope.scroll_interval=null;
                   $scope.scroll_interval=setInterval(function(){
                    document.getElementById('body_content').scrollTop =document.getElementById('body_content').scrollTop +step;
                    diff=Math.abs($scope.new_page_location- document.getElementById('body_content').scrollTop );
                    if(diff<=Math.abs(step))
                    step=5;
                    if(step>0&&document.getElementById('body_content').scrollTop >=$scope.new_page_location)
                    {
                        clearInterval($scope.scroll_interval);$scope.scroll_interval=null;
                        document.getElementById('body_content').scrollTop = $scope.new_page_location;
                    }

                    if(step<0&&document.getElementById('body_content').scrollTop <=$scope.new_page_location)
                    {
                        clearInterval($scope.scroll_interval);$scope.scroll_interval=null;
                        document.getElementById('body_content').scrollTop = $scope.new_page_location;
                    }

                   },50);

                  
                    }
            else if (document.getElementById($scope.current_page))
                document.getElementById('body_content').scrollTop = document.getElementById($scope.current_page).offsetTop;

            call_get_annotations();
            //$rootScope.$emit("Call_get_tashabohat",$scope.current_page);
            tashaboh_srv.call_get_tashabohat($scope.current_page);

            mon_data = getMonitordData($scope.current_page);
            bscroll();

            /* get_annotations(current_page);
             get_annotations(current_page-1);
              get_annotations(current_page-2);
             get_annotations(current_page+1);
             get_annotations(current_page+2);
             */


            /* 
             fill_page(current_page+2);
            fill_page(current_page+1);
            fill_page(current_page);
            fill_page(current_page-1);
            fill_page(current_page-2);
            */
        });

        function init_setting() {

            set_menu_dimentions();
           common_serv.read_alkobra_options();

            if (!$scope.settings.shawahed3 && !$scope.settings.shawahed7 && !$scope.settings.tawgehqraat && !$scope.settings.tshabohat && !$scope.settings._3adalayat) {
                $("#msgdiv").hide();
            } else {
                if ($scope.settings.msgBox == false) {
                    $("#msgdiv").show();
                    $("#msg-waypoint").css("background-color", 'rgba(0, 0, 0, 0.1)');
                    $("#msg-waypoint").css("border", 'rgba(0, 0, 0, 0.1)');
                } else {
                    $("#msgdiv").hide();
                    $("#msg-waypoint").css("background-color", 'transparent');
                    $("#msg-waypoint").css("border", 'transparent');
                }
            }

           
        }

        function set_menu_dimentions() {
            // set initial height
            //left:-20vh;

            // width:12vh;
            if (window.innerHeight > window.innerWidth) {
                document.getElementById("leftmenuitems").style.width = (12 * window.innerHeight / 100) + "px";
                document.getElementById("leftmenuitems").style.left = "-" + (20 * window.innerHeight / 100) + "px";
                document.getElementById('leftmenuitems').className = 'leftmenuitems';
            } else {
                document.getElementById("leftmenuitems").style.width = "100%";
                document.getElementById("leftmenuitems").style.height = (11.7647 * window.innerWidth / 100) + "px";
                document.getElementById("leftmenuitems").style.left = "0";
                document.getElementById('leftmenuitems').className = 'topmenuitems';
            }
            //  height: 11.7647vh;
            if (window.innerHeight > window.innerWidth)
                var cssh = (11.7647 * window.innerHeight / 100);
            else
                var cssh = (11.5647 * window.innerWidth / 100);
            console.log('window.innerHeight=' + window.innerHeight);
            $("#leftmenuitems img").css('height', cssh + "px");
            console.log($("#leftmenuitems img").css('height'));
            //    margin-top: 0.9vh;
            $("#leftmenuitems img").css('margin-top', (0.9 * window.innerHeight / 100) + "px");
            console.log($("#leftmenuitems img").css('margin-top'));

        }


        function init_shamarly() {
            console.log('init_shamarly  start');
            
           
            if (quraat_name == 'shamarly')
            {
                if(  window.cordova.platformId!='android') {
                    $scope.efrad=true;
                    window.localStorage.setItem('efrad',true);
                }
                else
                $scope.efrad=Boolean(window.localStorage.getItem('efrad')); 

                setting_srv.efrad=$scope.efrad;

                read_1st_aya_data(); // read_aya_data(); called internally 
            }
              
            else {
                read_1st_aya_data();
                //common_serv.read_aya_data();
                common_serv.read_aya_info();
            }
            common_serv.load_intro_data();
            $rootScope.$emit("Call_init_tashaboh", {});
            common_serv.read_aya_comments_intro();
            // $scope.setPlaces();

            if ($scope.settings.msgBox == false) {
                $("#msgdiv").show();
                $("#msg-waypoint").css("background-color", 'rgba(0, 0, 0, 0.1)');
                $("#msg-waypoint").css("border", 'rgba(0, 0, 0, 0.1)');
                $('#onScreenControlsBtn').hide();
            } else {
                $("#msgdiv").hide();
                $("#msg-waypoint").css("background-color", 'transparent');
                $("#msg-waypoint").css("border", 'transparent');
                $('#onScreenControlsBtn').show();
            }

            if (!window.localStorage.getItem('selected_reader_s_or_k')) { //default value 
                // window.localStorage.setItem('selected_reader_s_or_k', '1'); // kobra
                window.localStorage.setItem('selected_reader_s_or_k', '0'); // soghra
            }
            kobra_or_soghra_Addon();
            init_setting();
            w = window.innerWidth;
            h = window.innerHeight;
            console.log('w:' + w);
            console.log('h:' + h);
            if (w > h) {
                $(".sura_index_item, .part_index_item, .hizb_index_item").css("width", w / 7.5);
                /*** khodeer ***/
                var sura_index_h = (h - 88 - (4 * 17)) / 17;
                var part_index_h = (h - 88 - (4 * 5)) / 5;
                var hizb_index_h = (h - 88 - (4 * 9)) / 9;
                var page_index_cell_count_per_row = Math.floor(w / 44) - 1;
                var page_index_cell_rows_count = Math.ceil(allpages / page_index_cell_count_per_row);
                var page_index_h = (h - 88 - (4 * page_index_cell_rows_count)) / page_index_cell_rows_count;
                /*** khodeer# ***/
            } else {
                $(".sura_index_item, .part_index_item, .hizb_index_item").css("width", w / 5.5);
                /*** khodeer ***/
                var sura_index_h = (h - 88 - (4 * 23)) / 23;
                var part_index_h = (h - 88 - (4 * 6)) / 6;
                var hizb_index_h = (h - 88 - (4 * 12)) / 12;
                var page_index_cell_count_per_row = Math.floor(w / 44) - 1;
                var page_index_cell_rows_count = Math.ceil(allpages / page_index_cell_count_per_row);
                var page_index_h = (h - 88 - (4 * page_index_cell_rows_count)) / page_index_cell_rows_count;
                /*** khodeer# ***/
            }
            if (sura_index_h < 15) sura_index_h = 20;
            if (part_index_h < 15) part_index_h = 20;
            if (hizb_index_h < 15) hizb_index_h = 20;
            if (page_index_h < 15) page_index_h = 20;
            $scope.current_timestamp = window.localStorage.getItem('timestamp');
            ratio = w / image_width;
            index_style = "";//".sura_index_item{height:" + sura_index_h + "px;line-height:" + sura_index_h + "px;}.part_index_item{height:" + part_index_h + "px;line-height:" + part_index_h + "px;}.hizb_index_item{height:" + hizb_index_h + "px;line-height:" + hizb_index_h + "px;}.page_index_item{height:" + page_index_h + "px;line-height:" + page_index_h + "px;}";
            $('.sura_index_item').height(sura_index_h).css('line-height', sura_index_h + 'px');
            $('.part_index_item').height(part_index_h).css('line-height', part_index_h + 'px');
            $('.hizb_index_item').height(hizb_index_h).css('line-height', hizb_index_h + 'px');
            $('.page_index_item').height(page_index_h).css('line-height', page_index_h + 'px');

            img_h = ratio * image_height;
            $('.image').css('height', img_h + 'px');
            first_load = true;
            h_10 = (h * 20 / 100); /// 10 % or 20 % ....

            $("#msgdiv").css("height", (h * 20 / 100) * 1.5 + 'px');
            $(".ayah_option_audio_player").css("top", (h * 68 / 100) - 120 + 'px');
            $(".ayah_option_audio_player").css("height", 120 + 'px');
            $("#timeline").css("width", ((w * 80 / 100) - 130) + 'px');
            $("#msgdiv1").css("height", (h * 20 / 100) + 'px');
            $("#msg-waypoint").css("top", 0 + 'px');
            $("#msg-waypoint").css("height", h_10 + 'px');
            $('.image').html('');
            $('#msgdiv').html('');

            $scope.current_page = parseInt(window.localStorage.getItem('current_page'));
            $scope.page_location = parseInt(window.localStorage.getItem('current_page_location'));

            if (parseInt(window.localStorage.getItem("orientation")) != window.orientation) {

                window.localStorage.setItem("orientation", window.orientation);
                h_o = parseInt(window.localStorage.getItem("m_scrollHeight"));
                h_n = document.getElementById('body_content').scrollHeight;
                r = h_n / h_o;
                $scope.page_location = $scope.page_location * r;
                window.localStorage.setItem("m_scrollHeight", document.getElementById('body_content').scrollHeight);

            }

            if ($scope.current_page == null || isNaN($scope.current_page)) $scope.current_page = 1;
            if ($scope.current_page < 1) {
                $scope.current_page = 1;
                window.localStorage.setItem('current_page', parseInt($scope.current_page));
            }
            //console.log('init current_page'+$scope.current_page);

            //fill_page($scope.current_page+2);
            fill_page($scope.current_page + 1);
            fill_page($scope.current_page);
            fill_page($scope.current_page - 1);
            //fill_page($scope.current_page-2);


            document.getElementById('body_content').addEventListener("scroll", bscroll);
            document.getElementById('body_content').addEventListener("touchstart", mouse_move);
            document.getElementById('body_content').addEventListener("click", touch_not_move);
            document.getElementById('on-screen-control').addEventListener("touchstart", mouse_move);
            document.getElementById('body_content').scrollTop = document.getElementById($scope.current_page).offsetTop
            if ($scope.page_location) document.getElementById('body_content').scrollTop = $scope.page_location;
            call_get_annotations();
           // $rootScope.$emit("Call_get_tashabohat",$scope.current_page);
            tashaboh_srv.call_get_tashabohat($scope.current_page);

            if (typeof navigator.splashscreen !== "undefined") navigator.splashscreen.hide();

            $(document).on('click','#msgdiv .copyicon' , function(e){
                console.log("copy operation "); 
                ready_to_copy_text=$scope.HtmlToText($('#msgdiv').html());
                $scope.copyToClipboard(ready_to_copy_text);
               

            })
            
            $(document).on('click', '#msgdiv', function (e) {
                $(document).on('click', '#msgdiv .increase', function (e) {
                    e.preventDefault();
                    var curr_font_size = parseInt($('#msgdiv li').css('font-size'));
                    $('#msgdiv li').css('font-size', curr_font_size + 1 + 'px');
                    $('#font_change').show();
                    return false;
                });

                $(document).on('click', '#msgdiv .decrease', function (e) {
                    e.preventDefault();
                    var curr_font_size = parseInt($('#msgdiv li').css('font-size'));
                    $('#msgdiv li').css('font-size', curr_font_size - 1 + 'px');
                    $('#font_change').show();
                    return false;
                });
                $('#font_change').toggle();

            });

            $scope.notificationMsg=function(text){
                $("#notify_user_msg").html(text);
                $("#notify_user_msg").show();
                setTimeout(function () {
                    $("#notify_user_msg").html('');
                    $("#notify_user_msg").hide();
                }, 400);
            }
            $scope.copyToClipboard=function (text) {
               
                
                if (window.clipboardData && window.clipboardData.setData) {
                    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
                    // return window.clipboardData.setData("Text", text);
                    res= window.clipboardData.setData("Text", text);
                    $scope.notificationMsg('تم النسخ');
                    return res;
            
                }
                else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                    var textarea = document.createElement("textarea");
                    textarea.textContent = text;
                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        // return document.execCommand("copy");  // Security exception may be thrown by some browsers.
                        res= document.execCommand("copy");  // Security exception may be thrown by some browsers.
                        $scope.notificationMsg('تم النسخ');
                            return res;
                    }
                    catch (ex) {
                        console.warn("Copy to clipboard failed.", ex);
                        return prompt("Copy to clipboard: Ctrl+C, Enter", text);
                    }
                    finally {
                        document.body.removeChild(textarea);
                    }
                }
            }
            $('#speed_range').on('input', function () {
                $scope.autoscrollspeed = this.value;
                $scope.autoscroll();
                $scope.speednum1();
                $('.speednum1').html(this.value);
            });


            if (window.localStorage.getItem('browse_to_data')) {
                browse_to_data = window.localStorage.getItem('browse_to_data');
                SA = browse_to_data.split('|');
                S = SA[0];
                A = SA[1];
                window.localStorage.removeItem('browse_to_data');
                window.localStorage.removeItem('current_page_location');
                $scope.BrowseTo(S, A);


            }
            console.log('init_shamarly  done');
        }

        function init_madina() {
            init_shamarly();
            return;
        }

        $scope.HtmlToText=function(htmldata){

            result_text=''
            const  Elements= $.parseHTML(htmldata);
            if(Elements!=null)
            {
                 for(var i=0;i<Elements.length;i++) 
                {  val=Elements[i];
                    if (val.nodeName=="#text")  result_text+= val.textContent;
                    if (val.nodeName=="BR")  result_text+="\r\n";
                    if($(val).html()!="" )result_text+= $scope.HtmlToText($(val).html());
                    
                } 
            }
            

            return result_text;
        }
        // var $scope.interval_val;
        $scope.$on('autoscrollplay_ft', function (event, args) {
            $scope.autoscrollspeed = 0;
            // aliaa  
            $scope.autoscroll();
            $('#speed_range').val($scope.autoscrollspeed)
            $('.speednum1').html($scope.autoscrollspeed)
            //$scope.autoscroll();
        });
        $scope.$on('autoscrollplay', function (event, args) {
            $scope.autoscroll_play()
        })

        $scope.$on('autoscrollpause', function (event, args) {
            $scope.autoscroll_pause()
        })

        $scope.$on('autoscrollinit', function (event, args) {
            $scope.autoscrollspeed = 0;
            $('#speed_range').val($scope.autoscrollspeed)
            $('.speednum1').html($scope.autoscrollspeed)
            $('#pause_button').removeClass('fa-pause-circle');
            $('#pause_button').addClass('fa-play-circle');
        });
        $scope.autoscroll_is_pause = true;
        $scope.autoscroll_pause = function () {
            $scope.cancelEvent = true;
            clearInterval($scope.interval_val);

        }
        $scope.autoscroll_play = function () {
            $scope.cancelEvent = false;
            if (!$scope.autoscroll_is_pause)
                $scope.autoscroll();
        }
        if (!$scope.autoscrollspeed) $scope.autoscrollspeed = 0;
        $scope.speednum1 = function () {
            $('.speednum1').css('opacity', 1);
            if ($scope.speednum1time) clearTimeout($scope.speednum1time);
            $scope.speednum1time = setTimeout(function () {
                /*$('.speednum1').css('opacity',0)*/
            }, 200);
        }
        $scope.speednum2 = function () {
            $('.speednum2').css('opacity', 1);
            if ($scope.speednum2time) clearTimeout($scope.speednum2time);
            $scope.speednum2time = setTimeout(function () {
                $('.speednum2').css('opacity', 0)
            }, 200);
        }
        $scope.pause_cliked = function () {
            if ($scope.autoscroll_is_pause) {
                $scope.autoscroll_is_pause = false;
                $scope.autoscroll();
                $('#pause_button').removeClass('fa-play-circle');
                $('#pause_button').addClass('fa-pause-circle');

            } else {
                $scope.autoscroll_is_pause = true;
                $scope.autoscroll_pause();

                $('#pause_button').removeClass('fa-pause-circle');
                $('#pause_button').addClass('fa-play-circle');
            }
        }
        $scope.autoscroll = function ( /*speed per second*/ ) {
            //$scope.autoscrollspeed=0;
            //clearTimeout(fo);
            $scope.autoscroll_is_pause = false;
            $('#pause_button').removeClass('fa-play-circle');
            $('#pause_button').addClass('fa-pause-circle');


            start = 0;

            function smoothscroll() {

                document.getElementById('body_content').scrollTop = document.getElementById('body_content').scrollTop + 1;
                start = start - 1;
                console.log(start + '---------- at time ' + new Date());
                //if(start>=0) setTimeout(smoothscroll,1000/$scope.autoscrollspeed);
            }

            function fo() {
                start = $scope.autoscrollspeed;
                //smoothscroll();
                clearInterval($scope.interval_val);
                if ($scope.autoscrollspeed > 0) {
                    $scope.interval_val = setInterval(smoothscroll, Math.floor(1000 / $scope.autoscrollspeed));
                    //setTimeout(fo,1000);

                }
            }

            fo();

        }

        $(window).on('orientationchange', function () {

            //alert('oriantion changed ');
            delay = 1000;
            //window.localStorage.setItem("orientation",window.orientation);
            switch (window.orientation) {
                case -90:
                case 90:
                    //alert('landscape');
                    //	 h_new = window.innerWidth;
                    //    h_old = window.innerHeight;
                    // r=h_new/h_old;
                    //	 $scope.page_location=$scope.page_location*r;
                    setTimeout(function () {
                        if (quraat_name == 'shamarly') {
                            init_shamarly();
                        } else {
                            init_madina();
                        }
                        $scope.Calc_index();
                    }, delay);
                    break;
                default:
                    //alert('portrait');
                    // h_new = window.innerWidth;
                    // h_old = window.innerHeight;
                    // r=h_new/h_old;
                    //	 $scope.page_location=$scope.page_location*r;
                    setTimeout(function () {
                        if (quraat_name == 'shamarly') {
                            init_shamarly();
                        } else {
                            init_madina();
                        }
                        $scope.Calc_index();
                    }, delay);
                    break;
            }

        });
        //window.addEventListener('orientationchange', orientationChangeHandler);

        var orientationChangeHandler = function () {
            //alert('oriantion changed ');
            switch (window.orientation) {
                case -90:
                case 90:
                    //alert('landscape');
                    if (quraat_name == 'shamarly') {
                        init_shamarly();
                    } else {
                        init_madina();
                    }
                    break;
                default:
                    //alert('portrait');
                    if (quraat_name == 'shamarly') {
                        init_shamarly();
                    } else {
                        init_madina();
                    }
                    break;
            }

        }

        function fill_page(i) {

            if (document.getElementById('the-img' + i) != null) return
            if (quraat_name == 'shamarly') {
                var div_str = ' <img id="the-img' + i + '" style="z-index:2;border:0px  solid black; width:100%;Height:' + img_h + 'px;"  src="shamarly_images/' + i + '.jpg"  >   <div class="overlay" id="notes' + i + '">  </div>  <div class="overlay" id="notes_t' + i + '">  </div>  <div id="aya_selector_p_' + i + '"></div>';



                //add aya selection divs 

            } else {
                var div_str = ' <img id="the-img' + i + '" style="z-index:2;border:0px  solid black; width:90%;margin-left: 5%;Height:' + img_h + 'px;"  src="madina_images/' + i + '.png"  >   <div class="overlay" id="notes' + i + '">  </div> <div class="overlay" id="notes_t' + i + '">  </div>    <div id="aya_selector_p_' + i + '"></div>';
            }

            /////
            $('#' + i).append(div_str);

            if (quraat_name == 'shamarly') {
                add_Page_aya_rects_sh(i);
            } else {
                add_Page_aya_rects(i);

            }

        }
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function () {
                this.parentNode.removeChild(this);
            };
        }

        var proxy = ""; //http://localhost:8080/proxy.php/";
        $scope.now_playing_index = 0;
        $scope.telawa_reader = taha;

        function get_local_reader_folder(reader){
            reader=reader.split("/").join("");// remove any /
            $.each(alkobra, function (indx, val) {
                if (reader == val.folder) {
                   
                    $scope.telawa_reader_local=val.local;
                    $scope.telawa_reader_local_folder=val.local_folder;
                }
            });
        }
        // function get_telawa_reader() {
        //     $scope.settings_t = $.extend(true, {}, $scope.settings);
        //     var alkobra_tosura = '';
        //     var alkobra_toaya = '';
        //     $.each(alkobra, function (indx, val) {
        //         if ($scope.settings_t.selectedreader == val.folder) {
        //             $scope.alkobra_telawa_reader=val;
        //             alkobra_tosura = val.tosura;
        //             alkobra_toaya = val.toaya;
        //             alkobra_local=val.local;
        //             alkobra_local_folder=val.local_folder;
        //         }
        //     });

        //     parseInt(sura_num);
        //     parseInt(ayah_num);
        //     parseInt(alkobra_tosura);
        //     parseInt(alkobra_toaya);
        //     console.log('sura_num : ' + sura_num + ' , ayah_num : ' + ayah_num);
        //     console.log('alkobra_tosura : ' + alkobra_tosura + ' , alkobra_toaya : ' + alkobra_toaya);
        //     if ($scope.settings_t.selectedreader && (sura_num <= alkobra_tosura)) {
        //         console.log('jsut look at my line..');
        //         if (sura_num == alkobra_tosura && ayah_num > alkobra_toaya) {
        //             console.log('jsut look at my line..');
        //             $scope.telawa_reader = taha;
                    
        //         } else {
        //             console.log('jsut look at my line..');
        //             $scope.telawa_reader = "/" + $scope.settings_t.selectedreader + "/";
        //         }
        //     } else {
        //         $scope.telawa_reader = taha;
        //         console.log('jsut look at my line..');
        //     }
        //     get_local_reader_folder($scope.telawa_reader);
        //     console.log('%cReader : ' + $scope.telawa_reader, 'color:red');
        // }
        var playhead = document.getElementById("playhead");


               // Example functions
            $scope.play_audio_continues = function(ix) {
                 console.log('Long press');
                 audio_player = document.getElementById('audio');
                 if (!audio_player.paused) 
                 { $scope.play_audio(ix);// 
                    $scope.continues_audio_play=false;
                    return ;
                 }
                //تلاوة مستمرة 
                $scope.continues_audio_play=true;
                $scope.play_audio(ix);
            }

            $scope.itemOnTouchEnd = function(event) {
            	console.log('Touch end');
              
          //  event.stopPropagation()
            }

                    /*************8 */

        //playhead.om('');
        $scope.continues_audio_play=false;

        //////////////////////////////////////////////////
        $scope.play_audio = function (ix) {
            console.log('play_audio(ix)');

            $scope.telawa_reader=setting_srv.settings.selectedreader+"/";
            //$scope.settings.selectedreader;
           if( $scope.continues_audio_play== true)
             $("#continues_audio_play_image").show()
           else 
            $("#continues_audio_play_image").hide();
            // document.getElementById('intro_implement_playaudio_icon').src = "./images/audioplay_implement.png";
            if (!aya_options_srv.current_clicked_ayah) {
                index_sts = '' + ix + '';
                aya_options_srv.current_clicked_ayah = $filter('filter')($scope.aya_data, {
                    ayah_index: index_sts
                }, true)[0];
            }

            console.log(aya_options_srv.current_clicked_ayah);
            audio_player = document.getElementById('audio');
            audio_player.onended = function () {
                if (quraat_name == 'shamarly') {
                    document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                } else {
                    document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                }
                if( $scope.continues_audio_play)
                {
                    //console.log(aya_options_srv );
                    //play next ayah 
                    if (aya_options_srv.current_clicked_ayah) {
                        // if (quraat_name == 'shamarly') 
                        //    {
                        //        ayah_number=aya_options_srv.current_clicked_ayah.ayah;
                        //      sura_number=aya_options_srv.current_clicked_ayah.sura;
                        //      next_ayah_number=""+(parseInt(ayah_number)+1);
                        //         sura_number=""+(parseInt(sura_number) );
                        //         next_clicked_ayah = $filter('filter')($scope.aya_data, {
                        //             sura:sura_number,
                        //             ayah: next_ayah_number,
                        //         }, true)[0]; 
                        // } 
                            
                        // else
                        //     {  } 

                                ayah_number=aya_options_srv.current_clicked_ayah.ayah_number;
                            sura_number=aya_options_srv.current_clicked_ayah.sura_number;
                            next_ayah_number=""+(parseInt(ayah_number)+1);
                        sura_number=""+(parseInt(sura_number) );
                        next_clicked_ayah = $filter('filter')($scope.aya_data, {
                            sura_number:sura_number,
                            ayah_number: next_ayah_number,
                        }, true)[0]; 
                          
                      
                        if(next_clicked_ayah )
                        {// end or sora
                             $scope.BrowseTo(next_clicked_ayah.sura_number,next_clicked_ayah.ayah_number  );
                             aya_options_srv.open_aya_options(next_clicked_ayah.ayah_index) ;

                        $scope.play_audio(ix);
                        }
                        else return ;
                       
                     
                    }
                }
            }
            audio_play_try_count=0;
            audio_player.onerror = function (event) {
                console.log('error:', event);
                        if(event.target.error.code==event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED)
                        {// change to default reader and try again 
                            src_parts=event.target.src.split("/");
                            file_name=src_parts[src_parts.length-1];
                            if(file_name=="") return;
                            file_ext=file_name.split('.')[1];
                            if(file_ext.toLowerCase()=="mp3" && audio_play_try_count<3)
                            { 
                                audio_play_try_count++;
                                new_src="";
                                slash="/";
                                for(p=0;p<src_parts.length;p++)
                                {
                                    if(p==src_parts.length-1) slash="";
                                    if(p==3)
                                    new_src+=taha  ;
                                    else
                                    new_src+=src_parts[p]+slash;
                                }
                                audio_player = document.getElementById('audio');
                                audio_player.src=new_src;
                                audio_player.play();
                                return;
                           }
                        }
                $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
                audio_player.pause();
                if (quraat_name == 'shamarly') {
                    document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                } else {
                    document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                }
            }
            //if($scope.now_playing_index!=ix){ //new playing 
            $scope.now_playing_index = ix;
            ///example http://sound.quraat.info/Taha/S002/S002A003.mp3
            if (quraat_name == 'shamarly') {
                sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura).substr(-3);
                ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah).substr(-3);
            } else {
                sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura_number).substr(-3);
                ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah_number).substr(-3);
            }
            var alkobra_tosura, alkobra_toaya = '';
            if (quraat_name == 'shamarly') {
                var local_sound_path = window.localStorage.getItem('general_settings');
            } else {
                var local_sound_path = window.localStorage.getItem('general_settings_m');
            }
            if($scope.telawa_reader_local){
                // /local_folder
                if(common_serv.alkobra_telawa_reader.file_name_format=="qmp3")
                {
                     
                    str_src =  $scope.telawa_reader_local_folder + sura_num  + ayah_num + ".mp3";
                }
                else
                {
                    
                str_src =  $scope.telawa_reader_local_folder + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                
                }
              //windows.resolveLocalFilesystemUrl(str_src,function(entry){},function(err){})
                
            } else if (local_sound_path !== null && local_sound_path != '') {
                //local server 127.0.0.1

                if (local_sound_path == '' || local_sound_path == 'undefinded' || local_sound_path == undefined) {
                    console.log('%cReader : ' + $scope.telawa_reader, 'color:red');
                    str_src = default_sound_server_shamarly + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                } else {
                    if (local_sound_path.substr(-1) != '/') local_sound_path += '/';
                    if (local_sound_path.indexOf("Taha") > 0 || local_sound_path.indexOf("Hany") > 0)
                        str_src = local_sound_path + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    else {
                        console.log('%cReader : ' + $scope.telawa_reader, 'color:red');
                        str_src = local_sound_path + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                    }
                }

            }  
            else{
                ///online
                console.log('%cReader : ' + $scope.telawa_reader, 'color:red');
                if(common_serv.alkobra_telawa_reader.file_name_format=="qmp3")
                {
                    str_src =common_serv.alkobra_telawa_reader.url + sura_num  + ayah_num + ".mp3";
                }
                else
                {
                    str_src = default_sound_server_shamarly + $scope.telawa_reader + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
                }
            }
            if (audio_player.src != str_src) {
                audio_player.src = str_src;
                if (quraat_name == 'shamarly') {
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                } else {
                    document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                }
                // document.getElementById('intro_implement_playaudio_icon').src = './images/audioplay_implement.png';
                document.getElementById('tayseer_moalem_playaudio_icon').src = './images/audioplay_tayseer_moalem.png';
            }
            //}


            // audio_player.oncanplay = function (event) {audio_player.load();}
            //if(audio_player.networkState==3) {console.log('not ready ....No internet !!!');return;}
            if (audio_player.paused) {
                audio_player.oncanplay = function () {}
                audio_player.play();
                if (quraat_name == 'shamarly') {
                    document.getElementById('playaudio_icon').src = './images/shamarly/pause.png';
                } else {
                    document.getElementById('playaudio_icon').src = './images/madina/pause.png';
                }
            } else {
                $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
                audio_player.pause();
                if (quraat_name == 'shamarly') {
                    document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                } else {
                    document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                }
            }

            //};



        }
        $scope.comments_src = '';
        $scope.comments_txt = '';
        $scope.aya_has_comment = false;

        aya_options_srv.current_clicked_ayah = null;
        //aya_options_srv.current_clicked_ayah.ayahtext='';
        // $scope.is_has_comment = function () {
        //     if (quraat_name == 'shamarly') {
        //         sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura).substr(-3);
        //         ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah).substr(-3);;
        //     } else {
        //         sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura_number).substr(-3);
        //         ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah_number).substr(-3);;
        //     }
        //     fileName = "S" + sura_num + "A" + ayah_num + ".txt";

        //     exist_comment = $filter('filter')($scope.to_fix, {
        //         $: fileName
        //     });

        //     if (exist_comment != null && exist_comment != undefined) {

        //         if (exist_comment.length > 0) {
        //             $scope.aya_has_comment = true;
        //             document.getElementById('aya__comment_icon').style.display = "inline";

        //             // Test 10
        //             if (quraat_name == 'shamarly') {
        //                 var local_sound_path = window.localStorage.getItem('general_settings');
        //             } else {
        //                 var local_sound_path = window.localStorage.getItem('general_settings_m');
        //             }
        //             console.log('%c' + local_sound_path, 'color: blue, font-size:20');


        //             console.log(to_fix);

        //             if (local_sound_path != null && local_sound_path != '') {
        //                 if (local_sound_path.indexOf("http://127.0.0.1") == 0) {
        //                     if (local_sound_path.substr(-1) != '/') local_sound_path += '/';
        //                     if (local_sound_path.indexOf("Taha") > 0)
        //                         $scope.comments_src = local_sound_path + "S" + sura_num + ".cmn/" + fileName;
        //                     else
        //                         $scope.comments_src = local_sound_path + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
        //                 } else {
        //                     $scope.comments_src = default_sound_server_shamarly + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
        //                 }
        //             } else {
        //                 $scope.comments_src = default_sound_server_shamarly + selected_reader_name + "/S" + sura_num + ".cmn/" + fileName;
        //             }
        //             console.log('%c' + $scope.comments_src, 'font-size:34;');

        //             $.ajax({
        //                 // The proxy url expects as first URL parameter the URL to be bypassed
        //                 // https://cors-anywhere.herokuapp.com/{my-url-to-bypass}
        //                 url: $scope.comments_src,
        //                 complete: function (data) {
        //                     $scope.comments_txt = data.responseText;
        //                     if ($scope.comments_txt === '')
        //                         $scope.comments_txt = 'لا يتوفر اتصال بالانترنت';
        //                     else document.getElementById('aya__comment_icon').style.display = "inline";

        //                 }
        //             });

        //             /* var jqxhr = $.get( $scope.comments_src, function(comm_txt) {
        //                      $scope.comments_txt=comm_txt;
        //                     if($scope.comments_txt==='')   $scope.comments_txt='لا يتوفر اتصال بالانترنت';//document.getElementById('aya__comment_icon').style.display = "none" ; //case of empty or internet error 
        //                   else     document.getElementById('aya__comment_icon').style.display = "inline"; 
        //                })
        //                  .done(function(res) {
        //                     //return true;
        //                  })
        //                  .fail(function(res) {
        //                       $scope.comments_txt='لا يتوفر اتصال بالانترنت';
        //                   // document.getElementById('aya__comment_icon').style.display = "none"; 
        //                  })
        //                     */
        //         } else {
        //             $scope.aya_has_comment = false;
        //             document.getElementById('aya__comment_icon').style.display = "none";
        //         }
        //     } else {
        //         $scope.aya_has_comment = false;
        //         document.getElementById('aya__comment_icon').style.display = "none";
        //     }



        // }
        $scope.now_intro_playing_index = 0;

        $scope.tayseer_moalem_playing = 0;

        $scope.get_aya_tayseer_moalem_audio = function (ix) {
            audio_player = document.getElementById('audio');
            audio_player.onended = function () {
                document.getElementById('tayseer_moalem_playaudio_icon').src = './images/audioplay_tayseer_moalem.png'
            }
            $scope.tayseer_moalem_playing = ix;
            if (quraat_name == 'shamarly') {
                sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura).substr(-3);
                ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah).substr(-3);;
            } else {
                sura_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.sura_number).substr(-3);
                ayah_num = zeroFilled = ('000' + aya_options_srv.current_clicked_ayah.ayah_number).substr(-3);;
            }
            fileName = "S" + sura_num + "A" + ayah_num + "M.mp3";
            console.log(fileName);
            if (quraat_name == 'shamarly') {
                var local_sound_path = window.localStorage.getItem('general_settings');
            } else {
                var local_sound_path = window.localStorage.getItem('general_settings_m');
            }
            console.log(local_sound_path);
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
            } else {
                // $scope.tayseer_moalem_audio_src = default_sound_server_shamarly + taha + osool + fileName;
                addon_s_or_k=common_serv.addon_s_or_k;
                $scope.tayseer_moalem_audio_src = default_sound_server_shamarly + addon_s_or_k + osool +"/"+ fileName;
                console.log($scope.tayseer_moalem_audio_src);
            }
            if ($scope.tayseer_moalem_audio_src != '')
                if (audio_player.src != $scope.tayseer_moalem_audio_src) {
                    audio_player.src = $scope.tayseer_moalem_audio_src;
                    if (quraat_name == 'shamarly') {
                        document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                        document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                    } else {
                        document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                        document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                    }
                    // document.getElementById('intro_implement_playaudio_icon').src = './images/audioplay_implement.png';

                }
            if (audio_player.paused) {
                audio_player.oncanplay = function () {}
                audio_player.play();
                document.getElementById('tayseer_moalem_playaudio_icon').src = './images/pause_tayseer_moalem.png';
                if (quraat_name == 'shamarly') {
                    document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                } else {
                    document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                    document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                }

            }
        }


        $scope.get_intro_audio = function (ix) {
            audio_player = document.getElementById('audio');
            audio_player.onended = function () {
                if (quraat_name == 'shamarly') {
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                } else {
                    document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                }
            }

            audio_player.onerror = function (event) {
                console.log('error:', event);
                // if local file not working try to get intro from online 
                //
            }

            $scope.now_intro_playing_index = ix;
            if (aya_options_srv.intro_audio_src != '')
                if (audio_player.src != aya_options_srv.intro_audio_src) {
                    audio_player.src = aya_options_srv.intro_audio_src;
                    if (quraat_name == 'shamarly') {
                        document.getElementById('playaudio_icon').src = './images/shamarly/audioplay.png';
                    } else {
                        document.getElementById('playaudio_icon').src = './images/madina/audioplay.png';
                    }
                    // document.getElementById('intro_implement_playaudio_icon').src = './images/audioplay_implement.png';
                    document.getElementById('tayseer_moalem_playaudio_icon').src = './images/audioplay_tayseer_moalem.png';

                }
            //}

            if (audio_player.paused) {
                audio_player.oncanplay = function () {}
                audio_player.play();
                if (quraat_name == 'shamarly') {
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/pause_i.png';
                } else {
                    document.getElementById('intro_playaudio_icon').src = './images/madina/pause_i.png';
                }
            } else {
                $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
                audio_player.pause();
                if (quraat_name == 'shamarly') {
                    document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i.png';
                    if(  aya_options_srv.intro_file_local==true)   
                       document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i_L.png';
                        else   if(  aya_options_srv.intro_file_local==false) 
                        document.getElementById('intro_playaudio_icon').src = './images/shamarly/audioplay_i_W.png';
                      

                } else {
                    document.getElementById('intro_playaudio_icon').src = './images/madina/audioplay_i.png';
                }
            }

        }
        aya_options_srv.intro_audio_src = '';
      

        $scope.get_comment_view = false;
        $scope.get_comment = function () {
		 $("#msgdiv").show();
            document.getElementById('msgdiv').innerHTML = $scope.comments_txt;
        }

        $scope.get_aya_marks = function () {
		 $("#msgdiv").show();
            //str_li='<span class="ayah_icon" ></span><br>';
            console.log('in : get_aya_marks');
            console.log($scope.aya_marks);
            document.getElementById('msgdiv').innerHTML = $scope.aya_marks;
        }
        $scope.aya_marks = '';
        $scope.get_aya_text = function () {
            str_li = '<span class="ayah_icon" ></span><br>';
			$("#msgdiv").show();
            if (quraat_name == 'shamarly')
                document.getElementById('msgdiv').innerHTML = str_li + aya_options_srv.current_clicked_ayah.ayahtext;
            else {
                var ayahtext = $filter('filter')(common_serv.ayah_data_info, {
                    ayah: aya_options_srv.current_clicked_ayah.ayah_number,
                    sura: aya_options_srv.current_clicked_ayah.sura_number
                }, true)[0].ayahtext;
                document.getElementById('msgdiv').innerHTML = str_li + ayahtext;
            }
        }
        $scope.get_tafseer_view = false;
        $scope.get_tafseer = function () {
            if (!aya_options_srv.current_clicked_ayah) {
                return;
                //	index_sts=''+ix+'';
                //	aya_options_srv.current_clicked_ayah=$filter('filter')($scope.aya_data, {ayah_index:index_sts },true)[0] ;
            }
            //if(!$scope.get_tafseer_view){
            var aya_text = '';
			 $("#msgdiv").show();
            if (quraat_name == 'shamarly') {
                str_li = '<span class="question_mark_icon" ></span><br>';
                if ($scope.hide_aya_text_option == true) //aliaa 17-2-2019 means hide elemnt  and merge with tafseer
                {
                    str_li2 = '<span class="ayah_icon" ></span> ';

                    aya_text = str_li2 + "<span style='padding-right: 25px;color: #564b3f;'>" + aya_options_srv.current_clicked_ayah.ayahtext + "</span><hr>";
                }
                document.getElementById('msgdiv').innerHTML = aya_text + str_li + aya_options_srv.current_clicked_ayah.tafseer;
            } else {
                console.log('tafsesr ayah_data_info');
                console.log(common_serv.ayah_data_info);
                var tafseer = $filter('filter')(common_serv.ayah_data_info, {
                    ayah: aya_options_srv.current_clicked_ayah.ayah_number,
                    sura: aya_options_srv.current_clicked_ayah.sura_number
                }, true)[0].tafseer;
                if ($scope.hide_aya_text_option == true) //aliaa 17-2-2019 means hide elemnt  and merge with tafseer
                {
                    str_li2 = '<span class="ayah_icon" ></span> ';
                    aya_text = str_li2 + "<span style='padding-right: 25px;color: #564b3f;'>" + $filter('filter')(common_serv.ayah_data_info, {
                        ayah: aya_options_srv.current_clicked_ayah.ayah_number,
                        sura: aya_options_srv.current_clicked_ayah.sura_number
                    }, true)[0].ayahtext + "</span><hr>";

                }
                str_li = '<span class="question_mark_icon" ></span><br>';
                document.getElementById('msgdiv').innerHTML = aya_text + "<br/>" + str_li + tafseer;
            }
            console.log(aya_options_srv.current_clicked_ayah);

        }

        $scope.close_aya_options = function () {
            is_aya_selected = false;
            if ($scope.settings.msgBox == false) {
                // do nothing
            } else {
                $("#msgdiv").hide();
            }
            $scope.now_playing_index = 0;
            audio_player = document.getElementById('audio');
            $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
            audio_player.pause();
            audio_player.src = '';
            if (aya_options_srv.current_clicked_ayah != null) {
                if ('ayah_index' in aya_options_srv.current_clicked_ayah)
                    $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "']").css({
                        backgroundColor: "rgba(0, 255, 0, 0)"
                    });
                $("[ayah_index='" + aya_options_srv.current_clicked_ayah.ayah_index + "']").removeClass('current_clicked_aya');
            }
            aya_options_srv.current_clicked_ayah = null;
            document.getElementById('aya_select_control').style.display = 'none';
            $('#ayah_option_audio_player').hide();
            // $scope.myPopup_aya_options.close(); 
            $state.go('quraat', {}, {
                reload: true
            });

        }

        $scope.open_farsh_details = function () {
            var div_len = $("#single_position_view").text().length;
            if (div_len == 0) {
                var ayah =parseInt(aya_options_srv.current_clicked_ayah.ayah_number) ;// $('.current_clicked_aya').attr('ayah');
                var sura_from_curr_pg = common_serv.pageToSura($scope.current_page);
                var sura_name = sura_from_curr_pg.sura_name;
                if (quraat_name == 'shamarly') {
                    var local_sound_path = window.localStorage.getItem('general_settings');
                } else {
                    var local_sound_path = window.localStorage.getItem('general_settings_m');
                }
                var awgoh_sound_server = default_sound_server_shamarly;
                if (local_sound_path !== null && local_sound_path != '') {

                    if (local_sound_path.indexOf("http://127.0.0.1") == 0) {
                        awgoh_sound_server = local_sound_path;
                    }
                }
                awgoh_sound_server = awgoh_sound_server.replace('http://127.0.0.1', '');
                awgoh_sound_server = "wagh_url_" + awgoh_sound_server.replace(':', '__');
                var wagh_path = encodeURIComponent(awgoh_sound_server +addon_s_or_k+"Awgoh/");
                var ajax_url = farshiat_tool_api_url + '/get_farsh_position_details/' + sura_name + "/" + ayah + "/" + awgoh_sound_server;
                $http({
                    method: 'POST',
                    url: ajax_url,
                    dataType: 'json',
                    data : "sura_name="+sura_name+"&ayah="+ayah+"&wagh_url="+wagh_path+'&mobile_ver=0',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                }).then(function successCallback(response) {
                   // console.log(response);
                    if (response.data != "no_farsh") {
                        $("#single_position_view").html(  common_serv.stripScripts(response.data));
                        $("#single_position_view").show();
                    }
                }, function errorCallback(response) {
                    document.getElementById('aya_farsh_icon').style.display = "none";
                    document.getElementById('aya_farsh_icon_blocked').style.display = "inline";
                   // console.log(response.responseText);
                    // or server returns response with an error status.
                    // msg = "حدث خطأ اثناء إعداد البيانات ";
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'إحضار البيانات ',
                    //     template: msg
                    // });

                    // return false;
                });
            }
            else{
                $("#single_position_view").show();
            }
           

        }
        $scope.hide_aya_text_option = false;
        $scope.hide_aya_marks = false;
         
        $scope.pressTimer = 0;


        $scope.aya_long_click_event = function () {
            function handler(event) {
                $scope.continues_audio_play=false; $("#continues_audio_play_image").hide();
                if (quraat_name == 'shamarly') {
                    aya_options_srv.open_aya_options($(event.target).attr('ayah_index'));
                } else {
                    aya_options_srv.open_aya_options($(event.target).attr('ayah_index'));
                }
            }
            //aliaa
            $(document).on('touchstart', '.aya_line_part', function (ev) {
                // $(document).on('touchstart click', '.aya_line_part', function(ev) {
                console.log("touchstart", ev.target);
                if ($scope.settings.msgBox == true) {
                   // if (is_aya_selected == false) {
                    aya_options_srv.hide_msgs();
                    aya_options_srv.hide_msgs1();
                 //   }
                    hide_onscreencontrol();
                }
                $scope.pressTimer = window.setTimeout(handler.bind(null, ev), 1200);

            });

            $(document).on('touchmove', '.aya_line_part', function () {
                console.log("touchmove");
                clearTimeout($scope.pressTimer);

            });
            $(document).on('touchend', '.aya_line_part', function () {
                console.log("touchend");
                clearTimeout($scope.pressTimer);

            });


        }
        window.setTimeout(function () {
            $scope.aya_long_click_event();
        }, 200);

        function get_last_ayah(sora_num) {

            var sora=''+sora_num+'';
            var sura_data = $filter('filter')(common_serv.Suras, {
                sura_order: sora,
            }, true)[0]
            //var all_sora_ayas=$filter('filter')($scope.aya_data, {sura:sora },true) ;
            return sura_data.ayat;
        }
        //var int_add_Page_aya_rects=0;
        function add_Page_aya_rects(i) {

            if (i > allpages || i < 1) return;

            if (!$scope.aya_data) {
                return;
            }
            //console.log('ready ............. ');
            if (document.getElementById('aya_selector_internal_p_' + i) != null) return;

            var div_str = "";
            var last_aya_founded_a = {};
            var last_aya_founded = 0; // should come for previus page
            var last_aya_founded_at_line = -1;
            var last_aya_founded_index = 0;
            var prev_sura = 0;

            if (i > 2) {
                page_str = '' + i - 1 + '';
                prev_page_ayas = $filter('filter')($scope.aya_data, {
                    page_number: page_str
                }, true)
                last_aya_founded_a = prev_page_ayas[prev_page_ayas.length - 1];
                prev_sura = parseInt(last_aya_founded_a.sura);
                last_aya_founded = parseInt(last_aya_founded_a.ayah);
                last_aya_founded_index = parseInt(last_aya_founded_a.ayah_index);
            }
            var  page_aya_intro_s=$filter('filter')(common_serv.intro_index_s, {
                md_pg: i
            }, true)
            var  page_aya_intro_k=$filter('filter')(common_serv.intro_index_k, {
                md_pg: i
            }, true)




            var page_aya_data = {};

            page_str = '' + i + '';
            if ($filter('filter')($scope.aya_data, {
                    page_number: page_str
                }, true)) {
                //plh=window.innerWidth/18;
                mark_w = window.innerWidth / 28;
                p_lines = 15;

                line_left = window.innerWidth * 0.105;
                p_t_margin = window.innerWidth * 0.067; // top  margin 				
                p_b_margin = window.innerWidth * 0.095; //bottom margin 				
                p_margin = window.innerWidth * 0.06; // left and right margin 
                p_height = window.innerWidth * 1.444;
                p_top = p_height - (p_t_margin);


                xr = ((window.innerWidth) / 666); //0.339;
                yr = window.innerWidth / 612; //0.333;// window.innerHeight/1980;//0.333;


                if (i == 1 || i == 2) {
                    line_left = window.innerWidth * 0.125;
                    p_t_margin = window.innerWidth * 0.207; // top  margin 	
                    xr = ((window.innerWidth) / 676); //0.339;

                    yr = window.innerWidth / 662; //0.333;// window.innerHeight/1980;//0.333;					
                }
                page_aya_parts_data = $filter('filter')($scope.aya_data, {
                    page_number: page_str
                }, true);



                console.log('i=' + i, page_aya_data);
                p_lines = page_aya_parts_data.length;
                var line_parts = {};
                var lpstr_ps = ''
                for (var page_parts = 0; page_parts < p_lines; page_parts++) {
                    /// for any line not have ayah 
                    ///{"ayah_number":"1","ayah_index":"1","line_number":"1","max_x":"340","max_y":"315","min_x":"174","min_y":"285","page_number":"1","position":"1","sura_number":"1"}
                    line_p_left = page_aya_parts_data[page_parts].min_x;
                    line_p_width = page_aya_parts_data[page_parts].max_x - line_p_left;
                    line_p_top = page_aya_parts_data[page_parts].min_y;
                    line_p_height = page_aya_parts_data[page_parts].max_y - line_p_top;
                    aya_num = page_aya_parts_data[page_parts].ayah_number;
                    line_number = page_aya_parts_data[page_parts].line_number;
                    aya_index = page_aya_parts_data[page_parts].ayah_index;
                    sura_number = page_aya_parts_data[page_parts].sura_number;
                    ////
                    line_p_left = line_p_left * xr + line_left;
                    line_p_width = line_p_width * xr;

                    line_p_top = line_p_top * yr + p_t_margin;
                    line_p_height = line_p_height * yr;

/////////////////////////////////
                    intro_top=line_p_top+line_p_height/2;
                    aya_num=parseInt(aya_num);
                    if($scope.settings.intro_kobra_v)
                    {
                        introkobra=$filter('filter')(page_aya_intro_k, {
                            aya_number: aya_num
                        }, true);
                        page_aya_intro_k= page_aya_intro_k.filter(function(value, index, arr){ return value.aya_number !=aya_num})
                  
                        if(introkobra.length>0){
                            lpstr_ps += '<div class="intro_m into_k_m"  id="page_' + i + '_intro_k_' + line_number + '_p_' + i + '"  ayah="' + aya_num + /*'"  ayah_index="' + line_parts[lp].ayah_index +*/ '"  	  class="overlay aya_line_part"  style=" border-width: 0px;  border-style: solid; border-color: black;top:' + intro_top + 'px;left:95%;"></div>'
                           

                            //2- add the intro mark 
                        }

                    }
                    if($scope.settings.intro_soghra_v)
                    {

                        introsoghra=$filter('filter')(page_aya_intro_s, {
                            aya_number: aya_num
                        }, true);
                        page_aya_intro_s= page_aya_intro_s.filter(function(value, index, arr){ return value.aya_number !=aya_num})
                    
                        if(introsoghra.length>0){
                     
                            lpstr_ps += '<div class="intro_m into_s_m"  id="page_' + i + '_intro_s_' + line_number + '_p_' + i + '"  ayah="' + aya_num +/* '"  ayah_index="' + line_parts[lp].ayah_index +*/ '"  	  class="overlay aya_line_part"  style=" border-width: 0px;  border-style: solid; border-color: black;top:' + intro_top + 'px;left:3%;"></div>'
                            //2- add the intro mark 
                        }
                    }
////////////////////////////////////////////
                    // line_parts[page_parts]={"left":line_left,"width":line_width,"ayah":(aya_num),"page":i,"line":line_number,"ayah_index":aya_index};
                    ///color yellow-------- 0.3 to 0 
                    lpstr_ps += '<div  id="page_' + i + '_line_' + line_number + '_p_' + i + '"  ayah="' + aya_num + '"  ayah_index="' + aya_index + '"  sura_number="' + sura_number + '"  class="overlay aya_line_part"  style="background-color: rgba(255, 255, 0, 0);border-width: 0px;  border-style: solid; border-color: black;height:' + line_p_height + 'px;width:' + line_p_width + 'px;top:' + line_p_top + 'px;left:' + line_p_left + 'px;"></div>'

                }


            }

            //console.log(line_part_d);

            var line_part_str = '<div id="aya_selector_internal_p_' + i + '"  >';

            line_part_str += lpstr_ps + '</div>';





            div_str = line_part_str;

            $('#aya_selector_p_' + i).append(div_str);

            // window.setTimeout(function(){$scope.aya_long_click_event();},200);
        }

        function add_Page_aya_rects_sh(i) {

            if (i > allpages || i < 2) return;
            //int_add_Page_aya_rects++;
            //console.log('add_Page_aya_rects calles #=' ,int_add_Page_aya_rects);
            if (!$scope.aya_data) { // console.log(i);
                //console.log('not ready need waiting ');
                //console.log( arguments ,Date.now()	);
                //setTimeout(function(){arguments.callee(arguments[0])}  , 5000);
                return;
            }
            //console.log('ready ............. ');
            if (document.getElementById('aya_selector_internal_p_' + i) != null) return;

            var div_str = "";
            var last_aya_founded_a = {};
            var last_aya_founded = 0; // should come for previus page
            var last_aya_founded_at_line = -1;
            var last_aya_founded_index = 0;
            var prev_sura = 0;

            if (i > 2) {
                page_str = '' + i - 1 + '';
                prev_page_ayas = $filter('filter')($scope.aya_data, {
                    page: page_str
                }, true)
                last_aya_founded_a = prev_page_ayas[prev_page_ayas.length - 1];
                prev_sura = ''+parseInt(last_aya_founded_a.sura)+'';
                last_aya_founded = parseInt(last_aya_founded_a.ayah);
                last_aya_founded_index = parseInt(last_aya_founded_a.ayah_index);
            }
            var  page_aya_intro_s=$filter('filter')(common_serv.intro_index_s, {
                sh_pg: i
            }, true)
            var  page_aya_intro_k=$filter('filter')(common_serv.intro_index_k, {
                sh_pg: i
            }, true)

         


            var page_aya_data = {};
            var line_part_d = new Array();
            page_str = '' + i + '';
            if ($filter('filter')($scope.aya_data, {
                    page: page_str
                }, true)) {
                //plh=window.innerWidth/18;
                mark_w = window.innerWidth / 28;
                p_lines = 15;

                line_left = window.innerWidth * 0.105;
                p_t_margin = window.innerWidth * 0.115; // top  margin 				
                p_b_margin = window.innerWidth * 0.095; //bottom margin 				
                p_margin = window.innerWidth * 0.06; // left and right margin 
                p_height = window.innerWidth * 1.444;
                p_top = p_height - (p_t_margin);

                plh = ((p_height - (2 * p_t_margin)) / p_lines);

                if (i == 2 || i == 3) {
                    p_lines = 7;
                    line_left = window.innerWidth * 0.2;
                    p_t_margin = window.innerWidth * 0.395; //0.36;// top  margin 	
                    p_b_margin = window.innerWidth * 0.377; //bottom margin 	
                    p_margin = window.innerWidth * 0.06 * 2.2; // left and right margin 
                    p_height = window.innerWidth * 1.443;
                    p_top = p_height - (p_t_margin);
                    plh = ((p_height - (2 * (window.innerWidth * 0.115) * 3.53)) / p_lines);

                    last_aya_founded = 0;
                }
                xr = (window.innerWidth / 1125); //0.339;
                yr = window.innerWidth / 1125; //0.333;// window.innerHeight/1980;//0.333;

                page_aya_data = $filter('filter')($scope.aya_data, {
                    page: page_str
                }, true);



                console.log('i=' + i, page_aya_data);
                page_number_of_ayahs = page_aya_data.length;
                var ayah_page_number = 0;

                var prev_ayah = 0; ///get last aya in previus page +1
                var prev_ayah_line = 0;
                /// all 15 lines 
                for (var page_lines = 0; page_lines < p_lines; page_lines++) {
                    /// for any line not have ayah 
                    var foundAyahInThisLine = false;
                    var fline_ayat = [];
                    var lpstr_ps = '';
                    //console.log('-------------- new line =',page_lines);
                    line_top = p_t_margin + plh * page_lines;
                    next_line_top = line_top + plh;

                    //line_width=window.innerWidth-line_left-(2.2*p_margin);
                    line_width = window.innerWidth - line_left - (1.6 * p_margin);
                    //if(i==41 && page_lines==14)
                    //	console.log('ff');
                    var linrpart_no = 0;
                    var line_parts = new Array();
                    h = plh;
                    if (i == 2 || i == 3) {
                        //	 line_parts[linrpart_no]={"left":line_left,"width":line_width,"ayah":"(last_aya_founded+1)","page":i,"line":page_lines,"ayah_index":last_aya_founded_index+1};
                        //	 linrpart_no++;

                        for (var p_aya_n = ayah_page_number; p_aya_n < page_number_of_ayahs; p_aya_n++) {

                            ayah_to_test = page_aya_data[p_aya_n];
                            //console.log('-test for aya ',ayah_to_test);

                            if (ayah_to_test) {
                                h = plh;
                                lp_top = ayah_to_test.y * yr + window.innerWidth * 0.087; //32 ;//  
                                lp_top = lp_top + (plh / 3);
                                lp_left = (ayah_to_test.x * xr + window.innerWidth * 0.145) - mark_w;
                                w = window.innerWidth - lp_left - (2 * p_margin); //(lp.x2-lp.x1)*xr;
                                ayah = parseInt(ayah_to_test.ayah, 10);

                                //console.log('lp_top ',lp_top);
                                //console.log('line_top= '+line_top+",next_line_top",next_line_top);


                                // ayah is in this line or not 
                                if (lp_top > (line_top) && lp_top < next_line_top) { //ayah founded in this line

                                    ///if last_aya_founded is smaller than new founded it mean this is new sura
                                    if (p_aya_n > 0)
                                        if (ayah < parseInt(page_aya_data[p_aya_n - 1].ayah))
                                            last_aya_founded = 0;

                                    line_parts[linrpart_no] = {
                                        "left": line_left,
                                        "width": line_width,
                                        "ayah": (last_aya_founded + 1),
                                        "page": i,
                                        "line": page_lines,
                                        "ayah_index": last_aya_founded_index + 1
                                    };
                                    //line_parts[linrpart_no].ayah=ayah;
                                    foundAyahInThisLine = true;
                                    // fline_ayat[fline_ayat.length]=linrpart_no;
                                    last_aya_founded = ayah;
                                    last_aya_founded_a = ayah_to_test;
                                    last_aya_founded_index = parseInt(ayah_to_test.ayah_index);
                                    line_parts[linrpart_no].left = lp_left;
                                    line_parts[linrpart_no].width = line_width * 1.13 - lp_left + p_margin;
                                    if (linrpart_no > 0) {
                                        // line_parts[linrpart_no-1].width=lp_left-mark_w-4;
                                        line_parts[linrpart_no].width = line_parts[linrpart_no - 1].left - lp_left - 2;

                                    }
                                    linrpart_no++;

                                    //console.log('aya founded page='+ayah_to_test.page+' aya =',ayah);
                                    //console.log('at line ',page_lines);

                                    //should be is last ayah in sura 
                                    // make next 3 lines empty 
                                    if (ayah < prev_ayah) {
                                        //new page should keep 3 previous  line empty 
                                        if (prev_ayah_line >= 0 && prev_ayah_line < 15) {
                                            line_part_d[prev_ayah_line + 1] = {
                                                "str": '',
                                                "show": false
                                            };
                                            line_part_d[prev_ayah_line + 2] = {
                                                "str": '',
                                                "show": false
                                            };
                                            if (i != 153) //التوبة
                                                line_part_d[prev_ayah_line + 3] = {
                                                    "str": '',
                                                    "show": false
                                                };


                                        }

                                    }
                                    if (page_lines > 11) {
                                        sura = parseInt(ayah_to_test.sura);
                                        last_ayah = parseInt(get_last_ayah(sura));
                                        if (last_ayah == ayah) // this last ayah in surah 
                                        // next 3 lines should be empty
                                        {

                                            for (var pl = page_lines + 1; pl < p_lines; pl++) {
                                                line_part_d[pl] = {
                                                    "str": '',
                                                    "show": false
                                                };
                                            }


                                        }

                                    }

                                    prev_ayah = ayah;
                                    prev_ayah_line = page_lines;
                                    ayah_page_number++;
                                }

                                if (foundAyahInThisLine) {
                                    //for(var a=0;a<fline_ayat.length;a++){

                                    var prev_lp_left = (last_aya_founded_a.x * xr + window.innerWidth * 0.145) - mark_w;
                                    line_part_width = line_parts[linrpart_no - 1].left - line_left - 2;
                                    if (line_part_width > 5)
                                        line_parts[linrpart_no] = {
                                            "left": line_left,
                                            "width": line_part_width,
                                            "ayah": (last_aya_founded + 1),
                                            "page": i,
                                            "line": page_lines,
                                            "ayah_index": last_aya_founded_index + 1
                                        };
                                    //}

                                } else {
                                    line_parts[linrpart_no] = {
                                        "left": line_left,
                                        "width": line_width,
                                        "ayah": (last_aya_founded + 1),
                                        "page": i,
                                        "line": page_lines,
                                        "ayah_index": last_aya_founded_index + 1
                                    };
                                }

                            }

                        }
                    }

                    if (i != 2 && i != 3) {
                        //if line 1 or 2 or 3 or 4
                        if (page_lines == 0 || page_lines == 1 || page_lines == 2 || page_lines == 3) {
                            var mFirst_aya_data = $filter('filter')($scope.First_aya_data, {
                                page_number: i
                            }, true);
                            // if sora start in first of this page 
                            if (mFirst_aya_data.length > 0) { // this page is start with sura
                                //page_linesC=page_lines+1;
                                if (mFirst_aya_data[0].line - 1 > page_lines)
                                    line_part_d[page_lines] = {
                                        "str": '',
                                        "show": false
                                    };

                            }
                        }
                        if (ayah_page_number < page_number_of_ayahs) {
                            //check if ayah in this line 


                            // all page ayahs 
                            for (var p_aya_n = ayah_page_number; p_aya_n < page_number_of_ayahs; p_aya_n++) {

                                ayah_to_test = page_aya_data[p_aya_n];
                                //console.log('-test for aya ',ayah_to_test);

                                if (ayah_to_test) {
                                    h = plh;
                                    lp_top = ayah_to_test.y * yr + window.innerWidth * 0.087; //32 ;//  
                                    lp_top = lp_top + (plh / 3);
                                    lp_left = (ayah_to_test.x * xr + window.innerWidth * 0.145) - mark_w;
                                    w = window.innerWidth - lp_left - (2 * p_margin); //(lp.x2-lp.x1)*xr;
                                    ayah = parseInt(ayah_to_test.ayah, 10);
                                    sura = parseInt(ayah_to_test.sura, 10);
                                    var sora=''+sura+'';
                                    //console.log('lp_top ',lp_top);
                                    //console.log('line_top= '+line_top+",next_line_top",next_line_top);
                                    if (ayah_to_test.ayah_index == 1708)
                                        console.log('ggg');



                                    // ayah is in this line or not 
                                    if (lp_top > (line_top) && lp_top < next_line_top) { //ayah founded in this line
                                        ///////////// FOUNDED ////////////////////////
                                        //console.log(ayah_to_test.ayah_index);
                                        ///if last_aya_founded is smaller than new founded it mean this is new sura
                                        if (p_aya_n > 0) {
                                            if (ayah < parseInt(page_aya_data[p_aya_n - 1].ayah)) {
                                                last_aya_founded = 0;

                                            }
                                        } else {
                                            if (ayah == 1) {
                                               
                                                var sura_data = $filter('filter')(common_serv.Suras, {
                                                    sura_order: sora,
                                                }, true)[0];
                                                if (sura_data.ayat == last_aya_founded) {
                                                    last_aya_founded = 0;
                                                    prev_sura = sora
                                                }

                                            }
                                        }


                                        line_parts[linrpart_no] = {
                                            "left": line_left,
                                            "width": line_width,
                                            "ayah": (last_aya_founded + 1),
                                            "page": i,
                                            "line": page_lines,
                                            "ayah_index": last_aya_founded_index + 1
                                        };
                                        //line_parts[linrpart_no].ayah=ayah;
                                        foundAyahInThisLine = true;
                                        // fline_ayat[fline_ayat.length]=linrpart_no;
                                        last_aya_founded = ayah;
                                        var sura_data = $filter('filter')(common_serv.Suras, {
                                            sura_order: sora,
                                        }, true)[0];
                                        if (sura_data.ayat == last_aya_founded) {
                                            last_aya_founded = 0;
                                            // this is last ayah in sura so need to go next line 
                                            last_aya_founded_at_line = page_lines;
                                        }
                                        last_aya_founded_a = ayah_to_test;
                                        last_aya_founded_index = parseInt(ayah_to_test.ayah_index);
                                        line_parts[linrpart_no].left = lp_left;
                                        line_parts[linrpart_no].width = line_width * 1.13 - lp_left;
                                        if (linrpart_no > 0) {
                                            // line_parts[linrpart_no-1].width=lp_left-mark_w-4;
                                            line_parts[linrpart_no].width = line_parts[linrpart_no - 1].left - lp_left - 2;

                                        }
                                        linrpart_no++;

                                        //console.log('aya founded page='+ayah_to_test.page+' aya =',ayah);
                                        //console.log('at line ',page_lines);

                                        //should be is last ayah in sura 
                                        // make next 3 lines empty 
                                        if (ayah < prev_ayah) {
                                            //new page should keep 3 previous  line empty 
                                            if (prev_ayah_line >= 0 && prev_ayah_line < 15) {
                                                line_part_d[prev_ayah_line + 1] = {
                                                    "str": '',
                                                    "show": false
                                                };
                                                line_part_d[prev_ayah_line + 2] = {
                                                    "str": '',
                                                    "show": false
                                                };
                                                if (i != 153) //التوبة
                                                    line_part_d[prev_ayah_line + 3] = {
                                                        "str": '',
                                                        "show": false
                                                    };


                                            }

                                        }
                                        if (page_lines > 11) {
                                            sura = parseInt(ayah_to_test.sura);
                                            last_ayah = parseInt(get_last_ayah(sura));
                                            if (last_ayah == ayah) // this last ayah in surah 
                                            // next 3 lines should be empty
                                            {

                                                for (var pl = page_lines + 1; pl < p_lines; pl++) {
                                                    line_part_d[pl] = {
                                                        "str": '',
                                                        "show": false
                                                    };
                                                }


                                            }

                                        }

                                        prev_ayah = ayah;
                                        prev_ayah_line = page_lines;
                                        ayah_page_number++;
                                    }

                                    if (foundAyahInThisLine) {
                                        //for(var a=0;a<fline_ayat.length;a++){

                                        var prev_lp_left = (last_aya_founded_a.x * xr + window.innerWidth * 0.145) - mark_w;
                                        line_part_width = line_parts[linrpart_no - 1].left - line_left - 2;
                                        if (line_part_width > 5)
                                            line_parts[linrpart_no] = {
                                                "left": line_left,
                                                "width": line_part_width,
                                                "ayah": (last_aya_founded + 1),
                                                "page": i,
                                                "line": page_lines,
                                                "ayah_index": last_aya_founded_index + 1
                                            };
                                        if (last_aya_founded_at_line == page_lines)
                                            if (line_parts[linrpart_no]) line_parts[linrpart_no].width = 0;
                                        //}

                                    } else {
                                        var sura_data = $filter('filter')(common_serv.Suras, {
                                            sura_order: prev_sura,
                                        }, true)[0];
                                        if (sura_data.ayat == last_aya_founded) last_aya_founded = 0;
                                        line_parts[linrpart_no] = {
                                            "left": line_left,
                                            "width": line_width,
                                            "ayah": (last_aya_founded + 1),
                                            "page": i,
                                            "line": page_lines,
                                            "ayah_index": last_aya_founded_index + 1
                                        };

                                    }

                                }

                            }




                        } else {
                            line_parts[linrpart_no] = {
                                "left": line_left,
                                "width": line_width,
                                "ayah": (last_aya_founded + 1),
                                "page": i,
                                "line": page_lines,
                                "ayah_index": last_aya_founded_index + 1
                            };
                        }
                    }

                    /*lpstr='<div    id="page_'+i+'_line_'+page_lines+'"   class="overlay"  style="background-color: rgba(0, 255, 0, 0.38);border-width: 1px;  border-style: solid; border-color: black;height:'+h+'px;width:'+line_width+'px;top:'+line_top+'px;left:'+line_left+'px;"></div>';
                     */
                    //if we neet left part or not ??
                    /*line_parts[linrpart_no]={"left":0,"width":0};
                     line_parts[linrpart_no].left=line_left;
                     line_parts[linrpart_no].width=line_width;
                     */



                    lpstr_ps = ''
                    for (var lp = 0; lp < line_parts.length; lp++) {
                        ///color yellow-------- 0.3 to 0 
                        intro_top=line_top+h/2;
                        if($scope.settings.intro_kobra_v)
                        {
                            introkobra=$filter('filter')(page_aya_intro_k, {
                                aya_number: line_parts[lp].ayah
                            }, true);
                            page_aya_intro_k= page_aya_intro_k.filter(function(value, index, arr){ return value.aya_number !=line_parts[lp].ayah})
                      
                            if(introkobra.length>0){
                                lpstr_ps += '<div class="intro_m into_k_m"  id="page_' + i + '_intro_k_' + page_lines + '_p_' + lp + '"  ayah="' + line_parts[lp].ayah + /*'"  ayah_index="' + line_parts[lp].ayah_index +*/ '"  	  class="overlay aya_line_part"  style=" border-width: 0px;  border-style: solid; border-color: black;top:' + intro_top + 'px;left:98%;"></div>'
                               
    
                                //2- add the intro mark 
                            }

                        }
                        if($scope.settings.intro_soghra_v)
                        {

                            introsoghra=$filter('filter')(page_aya_intro_s, {
                                aya_number: line_parts[lp].ayah
                            }, true);
                            page_aya_intro_s= page_aya_intro_s.filter(function(value, index, arr){ return value.aya_number !=line_parts[lp].ayah})
                        
                            if(introsoghra.length>0){
                         
                                lpstr_ps += '<div class="intro_m into_s_m"  id="page_' + i + '_intro_s_' + page_lines + '_p_' + lp + '"  ayah="' + line_parts[lp].ayah +/* '"  ayah_index="' + line_parts[lp].ayah_index +*/ '"  	  class="overlay aya_line_part"  style=" border-width: 0px;  border-style: solid; border-color: black;top:' + intro_top + 'px;left:1%;"></div>'
                                //2- add the intro mark 
                            }
                        }
                       
                        /// remove founded itemn
                       
                     
                        //
                       
                        
                        
                        
                        lpstr_ps += '<div  id="page_' + i + '_line_' + page_lines + '_p_' + lp + '"  ayah="' + line_parts[lp].ayah + '"  ayah_index="' + line_parts[lp].ayah_index + '"  	  class="overlay aya_line_part"  style="background-color: rgba(255, 255, 0, 0);border-width: 0px;  border-style: solid; border-color: black;height:' + h + 'px;width:' + line_parts[lp].width + 'px;top:' + line_top + 'px;left:' + line_parts[lp].left + 'px;"></div>'
                    }


                    /*if(!foundAyahInThisLine)
                            {
                                lpstr_ps+='<div id="page_'+i+'_line_'+page_lines+'_p_'+lp+'"  ayah="'+(last_aya_founded+1)+'" class="overlay"  style="background-color: rgba(0, 255, 0, 0.38);border-width: 1px;  border-style: solid; border-color: black;height:'+h+'px;width:'+ line_width+'px;top:'+line_top+'px;left:'+ line_left+'px;"></div>';
                        }
                        */


                    if (!line_part_d[page_lines]) line_part_d[page_lines] = {
                        "str": lpstr_ps,
                        "show": true
                    };


                }
                //console.log(line_part_d);

                var line_part_str = '<div id="aya_selector_internal_p_' + i + '"  >';
                for (var page_lines = 0; page_lines < p_lines; page_lines++) {
                    if (line_part_d[page_lines].show) {
                        line_part_str += line_part_d[page_lines].str;
                    }
                }
                line_part_str += '</div>';



                /*	var line_part_str='';
                for (var line_part=0;line_part< page_aya_data.length;line_part++){
                    lp=page_aya_data[line_part];
                    
                    
                    h=plh;//(lp.y2-lp.y1)*yr;
                    lp_top=lp.y*yr+window.innerWidth*0.087;//32 ;// +window.innerHeight*0.19;window.innerHeight*0.049;//
                    lp_left=(lp.x*xr+window.innerWidth*0.145)-mark_w;//54;//window.innerWidth*0.10;
                    w=window.innerWidth-lp_left-(2*p_margin) ;//(lp.x2-lp.x1)*xr;
                    ayah=lp.ayah;
                line_part_str+='<div    id="ayaloc_'+ayah+'_'+line_part+'" data="x='+lp.x+',y='+lp.y+'" class="overlay  '+ayah+'_class" style="background-color: rgba(255, 0, 0, 0.38);border-width: 1px;  border-style: solid; border-color: black;height:'+h+'px;width:'+w+'px;top:'+lp_top+'px;left:'+lp_left+'px;"></div>'
                }*/

                div_str = div_str + line_part_str;
            }

            $('#aya_selector_p_' + i).append(div_str);

            // window.setTimeout(function(){$scope.aya_long_click_event();},200);
        }

      

        // function read_local_intro() {
        //     if (window.localStorage.getItem("local_data_intro")) {
        //         $scope.intro = JSON.parse(window.localStorage.getItem("local_data_intro"));
        //         return;
        //     }
        //     subCallback_intro = function () {
        //         console.log(intro);
        //         $scope.intro = intro;
        //     }

        //     var script_intro = document.createElement('script');
        //     script_intro.type = 'text/javascript';
        //     script_intro.onload = subCallback_intro;

        //     // Main Code
        //     // script_intro.src = './' + sh_more_data + 'intro.json'
        //     // console.log('%c' + scrtipt_intro, 'color:red');

        //     // Test 2
        //     switch (parseInt(window.localStorage.getItem('selected_reader_s_or_k'))) {
        //         case 0:
        //             script_intro.src = './' + common_files + 'intro_s.json'
        //             break;
        //         case 1:
        //             script_intro.src = './' + common_files + 'intro_k.json'
        //             break;
        //     }
        //     var head = document.getElementsByTagName('head')[0];
        //     head.appendChild(script_intro);
        // }


        // function read_aya_comments_intro() {
        //     if (typeof intro !== 'undefined') return;
        //     subCallback_to_fix = function () {
        //         function to_fix_localStorage(to_fix_file) {

        //             if(!(window.localStorage.getItem(to_fix_file))) return ;
        //             to_fix_local = (window.localStorage.getItem(to_fix_file)).toString()
        //             to_fix_local = to_fix_local.substring(to_fix_local.indexOf("=") + 1);
        //             to_fix_local = JSON.parse(to_fix_local);
        //             to_fix = to_fix_local;
        //             $scope.to_fix = to_fix;
        //             window.localStorage.setItem("to_fix_locally", JSON.stringify(to_fix));
        //             console.log('%cto_fix_locally : updated', 'color:green');
        //         }
        //         setTimeout(function () {
        //             to_fix_localStorage(selected_reader_name + '_to_fix.json');
        //         }, 5000);
        //     }
        //     subCallback_intro = function () {
        //         $scope.intro = intro;
        //         window.localStorage.setItem("local_data_intro", JSON.stringify(intro));
        //     }


        //     var script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     if (quraat_name == 'shamarly') {
        //         script.src = default_sound_server_shamarly + taha + "to_fix.json?" + common_serv.makeid();
        //     } else {
        //         script.src = default_sound_server_shamarly + taha + "to_fix.json?" + common_serv.makeid();
        //     }
        //     script.onload = subCallback_to_fix;
        //     script.onerror = function () {
        //         self.read_local_comments();
        //     };
        //     ///////////////////////////////////////////////////////////////////////
        //     var script_intro = document.createElement('script');
        //     script_intro.type = 'text/javascript';

        //     switch (parseInt(window.localStorage.getItem('selected_reader_s_or_k'))) {
        //         case 0:
        //             script_intro.src = "http://sound.quraat.info/common_files/intro_s.json";
        //             break;
        //         case 1:
        //             script_intro.src = "http://sound.quraat.info/common_files/intro_k.json";
        //             break;
        //     }

        //     script_intro.onload = subCallback_intro;
        //     script_intro.onerror = function () {
        //         read_local_intro();
        //     };
        //     // Fire the loading
        //     var head = document.getElementsByTagName('head')[0];
        //     head.appendChild(script);
        //     head.appendChild(script_intro);
        // }
        // $scope.getAya_data=function(sura,ayah){
        //     ayah_str = '' + ayah + '';
        //     sura_str = '' + sura + '';
        //     if (quraat_name == 'shamarly') {
        //         var ayah_data = $filter('filter')($scope.aya_data, {
        //             ayah: ayah_str,
        //             sura: sura_str
        //         }, true)[0];
        //        return  ayah_data;

        //     } else {
        //         var ayah_data = $filter('filter')($scope.aya_data, {
        //             ayah_number: ayah_str,
        //             sura_number: sura_str
        //         }, true)[0];
        //         return  ayah_data;

        //     }
           
        // }
        $scope.BrowseTo = function (sura, ayah) {
            var browse_to_data=common_serv.getAya_data(parseInt(sura), parseInt(ayah));
                console.log(browse_to_data);
                if (quraat_name == 'shamarly') {
                current_p = parseInt(browse_to_data.page);
                }else
                {
                    current_p = parseInt(browse_to_data.page_number);
                }
                $scope.current_page = parseInt(current_p);
                common_serv.BrowseTo(sura, ayah);
                if (quraat_name == 'shamarly') {
                    aya_options_srv.open_aya_options(browse_to_data.ayah_index);
                } else {
                    aya_options_srv.open_aya_options(browse_to_data.ayah_index);
                }
        }
        // $scope.BrowseTo = function (sura, ayah) {
        //     if (!$scope.aya_data) {
        //         return;
        //     }
        //     var browse_to_data=common_serv.getAya_data(parseInt(sura), parseInt(ayah));
        //     console.log(browse_to_data);
        //     if (quraat_name == 'shamarly') {
        //     current_p = parseInt(browse_to_data.page);
        //     }else
        //     {
        //         current_p = parseInt(browse_to_data.page_number);
        //     }
 
        //     // ayah_str = '' + ayah + '';
        //     // sura_str = '' + sura + '';
        //     // if (quraat_name == 'shamarly') {
        //     //     var browse_to_data = $filter('filter')($scope.aya_data, {
        //     //         ayah: ayah_str,
        //     //         sura: sura_str
        //     //     }, true)[0];
        //     //     current_p = parseInt(browse_to_data.page);

        //     // } else {
        //     //     var browse_to_data = $filter('filter')($scope.aya_data, {
        //     //         ayah_number: ayah_str,
        //     //         sura_number: sura_str
        //     //     }, true)[0];
        //     //     current_p = parseInt(browse_to_data.page_number);

        //     // }
        //     console.log(browse_to_data);
        //     window.localStorage.setItem('current_page', current_p);

        //     $scope.current_page = parseInt(current_p);

        //     // $scope.setTheSelectLists(current_p);
        //     page_loc = NaN;//??
        //     scroll_to_str="page_"+current_p+"_line_"+browse_to_data.line_number+"_p_"+current_p;
        //     page_top=document.getElementById(current_p).offsetTop;
        //     page_loc=  page_top+(document.getElementById(current_p).offsetHeight /17)*browse_to_data.line_number;
        //   //  document.getElementById($scope.current_page).offsetTop+browse_to_data.max_y;
        //     // loc_orientation	=window.localStorage.getItem('marke_orientation_'+num);
        //     scrollheight = document.getElementById('body_content').scrollHeight;
        //     //other_scrollheight=parseInt(window.localStorage.getItem('marke_orientation_height_'+num));

        //     args = {
        //         pageNum: current_p,
        //         pageLoc: page_loc
        //     };
        //     // args={pageNum:current_p};
        //      $rootScope.$broadcast('PageChanged', args);

        //     $rootScope.$broadcast('autoscrollpause', true);
        //     //start to select Aya and then play intro audio 
        //     if (quraat_name == 'shamarly') {
        //         aya_options_srv.open_aya_options(browse_to_data.ayah_index);
        //     } else {
        //         aya_options_srv.open_aya_options(browse_to_data.ayah_index);
        //     }


        // }


        function read_1st_aya_data() {
            if (typeof FirstAya_data !== 'undefined') return;
            subCallback = function () {
                $scope.First_aya_data = FirstAya_data;
                common_serv.read_aya_data(function(aya_data){
                    $scope.aya_data=aya_data;
                    if (quraat_name == 'shamarly') {
                        //add_Page_aya_rects($scope.current_page-3);
                        //add_Page_aya_rects($scope.current_page-2);
                        add_Page_aya_rects_sh($scope.current_page - 1);
                        add_Page_aya_rects_sh($scope.current_page);
                        add_Page_aya_rects_sh($scope.current_page + 1);
                        //add_Page_aya_rects($scope.current_page+2);
                    } else {
                        //add_Page_aya_rects($scope.current_page-3);
                        //add_Page_aya_rects($scope.current_page-2);
                        add_Page_aya_rects($scope.current_page - 1);
                        add_Page_aya_rects($scope.current_page);
                        add_Page_aya_rects($scope.current_page + 1);
                        //add_Page_aya_rects($scope.current_page+2);
                    }
                 });
            }
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (quraat_name == 'shamarly') {
                script.src = sh_more_data + "1stAya_sh.json";
            } else {
                script.src = madina_more_data + "1stAya_ma.json";
            }


            if (quraat_name == 'shamarly') {
                script.src = sh_more_data + "1stAya_sh.json";
            } else {
                script.src = madina_more_data + "1stAya_ma.json";
            }
            script.onload = subCallback;

            // Fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }

     
       

        function empty_page(i) {
            if (document.getElementById('the-img' + i) != null) document.getElementById('the-img' + i).remove();
            if (document.getElementById('notes' + i) != null) document.getElementById('notes' + i).remove();
            if (document.getElementById('notes_t' + i) != null) document.getElementById('notes_t' + i).remove();
        }

        function call_get_annotations() {

            console.log('call_get_annotations');

            first_load = false;
            console.log('call_get_annotations' + $scope.current_page);
            get_annotations($scope.current_page);
            get_annotations($scope.current_page - 1);
            //	get_annotations($scope.current_page-2);
            get_annotations($scope.current_page + 1);
            //	get_annotations($scope.current_page+2);
            //	$(window).scrollTop(document.getElementById($scope.current_page).offsetTop);   

        }
        var loaded_pages = {};

        var all_pages_data = {};
        var mon_data = [];
        $scope.current_page = 1; ///p2  


        function get_current_page() {
            if ($scope.current_page == null) $scope.current_page = 1;
            //var current_scroll_top=parseFloat(  $(window).scrollTop());//-img_height;

            var current_scroll_top = parseFloat(document.getElementById('body_content').scrollTop); //-img_height;
            //var element_height=parseFloat(document.getElementById($scope.current_page).clientHeight);
            if ($scope.current_page == undefined)
                $scope.current_page = 1;
            var element_height = document.getElementById($scope.current_page).getBoundingClientRect().bottom - document.getElementById($scope.current_page).getBoundingClientRect().top;
            console.log('element_height=' + element_height);
            console.log('current_scroll_top=' + current_scroll_top);
            console.log(current_scroll_top / element_height);
            var pag_num = parseInt(current_scroll_top / element_height) + 1;
            //console.log(pag_num);
            if ($scope.current_page != pag_num) {
                if ($scope.current_page < pag_num) {
                    empty_page(pag_num - 3);
                    empty_page(pag_num - 2);
                    fill_page(pag_num - 1);
                    fill_page(pag_num);
                    fill_page(pag_num + 1);
                    //fill_page(pag_num+2);
                } else {
                    empty_page(pag_num + 3);
                    // empty_page(pag_num + 2); // Test code : un commented
                    fill_page(pag_num + 1);
                    fill_page(pag_num);
                    fill_page(pag_num - 1);
                    //fill_page(pag_num-2);

                }
            }

            if (pag_num > allpages) pag_num = allpages;

            return pag_num;
        }
        $scope._initial = new Date();

        function mouse_move(ev) {
            $scope._initial = new Date();
            // if($scope.settings.msgBox == false){
            //     show_onscreencontrol();	
            // }
            return ev;
        }

        function touch_not_move(ev) {
            if ($scope.settings.msgBox == false) {
                //show_onscreencontrol();
                    if($scope.show_onscreencontrol)
                    {
                        hide_onscreencontrol();
                       
                    }
                    else
                    {
                        show_onscreencontrol();
                        
                    }
                
            }
            return ev;
        }
        $(document).on('click', '#onScreenControlsBtn', function () {
            show_onscreencontrol();
           
        });
        $scope.show_onscreencontrol_settimeout_id = false;

        function show_onscreencontrol() {
            $scope.show_onscreencontrol=true;
            document.getElementById('on-screen-control').className = 'on-screen-control show_onscreencontrol';

            //document.getElementById('on-screen-help').className = 'helponscreen show_onscreencontrol_top';

            document.getElementById('speedcontrol').className = 'speedcontrol show_onscreencontrol_right';
            if (window.innerHeight > window.innerWidth)
                document.getElementById('leftmenuitems').className = 'leftmenuitems show_onscreencontrol_left';
            else
                document.getElementById('leftmenuitems').className = 'topmenuitems show_onscreencontrol_top';
            document.getElementById('finger_up_down').className = "show_opacity";



            //$('.on-screen-control').show(3000)
            // document.getElementById('speedcontrol').className = 'speedcontrol show_onscreencontrol';
            if ($scope.show_onscreencontrol_settimeout_id) {
                clearTimeout($scope.show_onscreencontrol_settimeout_id);
                show_onscreencontrol_settimeout_id = false;
            }
            $scope.show_onscreencontrol_settimeout_id = setTimeout(function () {
                hide_onscreencontrol();
            }, 4000);


        }

        function hide_onscreencontrol() {
            $scope.show_onscreencontrol=false;
            var _final = new Date();

            var dif = _final.getTime() - $scope._initial.getTime();
            console.log(_final.getTime() + '-' + $scope._initial.getTime() + '=' + dif);

            // document.getElementById('speedcontrol').className = 'speedcontrol';
            document.getElementById('on-screen-control').className = 'on-screen-control';
            //document.getElementById('on-screen-help').className = 'helponscreen';
            document.getElementById('speedcontrol').className = 'speedcontrol';
            if (window.innerHeight > window.innerWidth)
                document.getElementById('leftmenuitems').className = 'leftmenuitems';
            else
                document.getElementById('leftmenuitems').className = 'topmenuitems';
            document.getElementById('finger_up_down').className = "";




            //$('.on-screen-control').hide(300)

        }

        var last_scroll_value = 0;
        $scope.send_pageChanged = function (page_num) {
            if (isNaN(page_num)) page_num = 1;
            $scope.$broadcast('tell_PageChanged', page_num);
        }

        function getClickedItemData(itemId, pageNum) {

            data = all_pages_data[pageNum];
            // console.log(data);
            var array = $.map(data, function (value, index) {
                return [value];
            });
            if (allpages > parseInt(pageNum) + 1) {
                data1 = all_pages_data[pageNum + 1];
                var array1 = $.map(data1, function (value, index) {
                    return [value];
                });
                var array2 = array.concat(array1);
            } else {
                var array2 = array;
            }
            itemId = itemId.replace("star", "");
            // console.log(itemId);
            var dataResult = $filter('filter')(array2, {
                NM: itemId,
            }, true)[0];
            console.log(dataResult);
            return dataResult;
        }

        function getMonitordData(pageNum) {
            var dataResult = [];
            tmp_mon_data = all_pages_data[pageNum];
            for (var k in tmp_mon_data) {
                var d = tmp_mon_data[k];
                if (d.Name == "/Comment" || d.Name == "/Circle" || d.Name == "/Star" || d.Name == "/Key" || d.Name=="/UpArrow" ) {
                    dataResult.push(d);
                }
            }
            /*	 data=all_pages_data[pageNum+1];
            for(var k in data){
               var d=data[k];
             if (d.Name=="/Comment" || d.Name =="/Circle" || d.Name =="/Star"){
                   dataResult.push	(d);  }
                }*/

            return dataResult;
        }
        $scope.cancelEvent = false;

        function bscroll() {
            //alert('ss');

            //save current_page
            if ($scope.cancelEvent) true;
            //  var current_page=$scope.current_page;
            if ($scope.current_page != get_current_page()) {

                $scope.current_page = get_current_page();
                $scope.current_page = $scope.current_page;
                get_annotations($scope.current_page - 1);
                //get_annotations($scope.current_page-2);
                get_annotations($scope.current_page);
                get_annotations($scope.current_page + 1);
                //get_annotations($scope.current_page+2);
                
               // $rootScope.$emit("Call_get_tashabohat",$scope.current_page);
                tashaboh_srv.call_get_tashabohat($scope.current_page);

                window.localStorage.setItem('current_page', parseInt($scope.current_page));
                $rootScope.$broadcast('tell_PageChanged', $scope.current_page);
                //$scope.send_pageChanged($scope.current_page);

              

                //mon_data=all_pages_data[$scope.current_page];
                mon_data = getMonitordData($scope.current_page);
                //data1=all_pages_data[current_page+1];
                //document.getElementById('pagenumber').value=current_page;

            }

            $scope.page_location = parseFloat(document.getElementById('body_content').scrollTop);
            window.localStorage.setItem('current_page_location', $scope.page_location);
            i = $scope.current_page;
            if ($('#' + $scope.current_page).length == 0) return;

            pos_v = true;
            if ($(window).scrollTop() > last_scroll_value) pos_v = true;
            if ($(window).scrollTop() < last_scroll_value) pos_v = false;
            last_scroll_value = document.getElementById('body_content').scrollTop;
            var element_height = parseInt(document.getElementById($scope.current_page).clientHeight);
            //console.log('offsetTop='+document.getElementById(current_page).offsetTop)
            var element_y = parseInt(document.getElementById($scope.current_page).offsetTop);
            var element_yh = parseInt(element_y + element_height);
            var current_scroll_top = parseInt(document.getElementById('body_content').scrollTop);
            console.log('current_page=' + $scope.current_page);


            if ($scope.autoscrollspeed == 0 && $scope.autoscroll_is_pause == true) {
                if (is_aya_selected == false) {
                    aya_options_srv.hide_msgs();
                    aya_options_srv.hide_msgs1();
                }
            }

            // Main code
            if ($scope.settings.msgBox == false) {
			  $("#msgdiv").html('');
               $("#msgdiv1").html('');
                for (var k in mon_data) {
                    var d = mon_data[k];
                    if (d.AP == "Dictionary") {
                        if (current_scroll_top + h_10 > (element_y + d.y) && current_scroll_top < (element_y + d.y + d.h)) {
                          
                            if (d.Name == "/Comment" || d.Name == "/Circle") {
                                if (d.Name == "/Comment") {
                                    console.log('writing to box');
                                    show_msg(d.Subj, d.Contents, "black"); //Contents
                                }
                                if (d.Name == "/Circle") {
                                    console.log('writing to box');
                                    show_msg(d.Subj, d.Contents, "brown"); //Contents
                                }
                            } else if (d.Name == "/Key" || d.Name == "/Star" ||d.Name == "/UpArrow") {
                                if (d.Name == "/Key") {
                                    console.log('writing to box');
                                    show_msg1(d.Subj, d.Contents, "teal"); //Contents
                                }
                                if (d.Name == "/Star") {
                                    console.log('writing to box');
                                    show_msg1(d.Subj, d.Contents, "Green"); //Contents
                                }
                                if (d.Name == "/UpArrow") {
                                    console.log('writing to box');
                                    show_msg1(d.Subj, d.Contents, "Blue"); //Contents
                                }

                                
                            }
                        }
                    }
                }
            }

        }


        $(document).on('click', '.comment', function () {
            console.log('clicked : comment');
            if ($scope.settings.msgBox == true) {
                $("#msgdiv").html('');
                $("#msgdiv1").html('');
                $scope.clickedItemData = getClickedItemData(this.id, $scope.current_page);
                show_msg($scope.clickedItemData.Subj, $scope.clickedItemData.Contents, "black");

            }
        });
        $(document).on('click', '.circle', function () {
            console.log('clicked : circle');
            // if (is_aya_selected == false) {
            if ($scope.settings.msgBox == true) {
                $("#msgdiv").html('');
                $("#msgdiv1").html('');
                $scope.clickedItemData = getClickedItemData(this.id, $scope.current_page);
                show_msg($scope.clickedItemData.Subj, $scope.clickedItemData.Contents, "brown");

            }
            // }
        });
        $(document).on('click', '.key', function () {
            console.log('clicked : key');
            // if (is_aya_selected == false) {
            if ($scope.settings.msgBox == true) {
                $("#msgdiv").html('');
                $("#msgdiv1").html('');
                $scope.clickedItemData = getClickedItemData(this.id, $scope.current_page);
                show_msg1($scope.clickedItemData.Subj, $scope.clickedItemData.Contents, "teal");

            }
            // }
        });
        $(document).on('click', '.star', function () {
            console.log('clicked : star');
            // if (is_aya_selected == false) {
            if ($scope.settings.msgBox == true) {
                $("#msgdiv").html('');
                $("#msgdiv1").html('');
                $scope.clickedItemData = getClickedItemData(this.id, $scope.current_page);
                show_msg1($scope.clickedItemData.Subj, $scope.clickedItemData.Contents, "Green");

            }
            // }
        });

        /*** khodeer ***/
        $(document).on('keyup', '.Page_num', function () {
           // console.log($('#Page_num').val());
            var val=parseInt($('#Page_num').val());
            var val_s=(""+val);
            var position=val_s.length;
            if($('#Page_num').val()=="") { $(".page_index_item").show();return;}
           
            if (val>allpages)  {$('#Page_num').val(val_s.substring(0, 2) );return;}
            $(".page_index_item").show();
            $(".page_index_item").filter(":not(:contains('"+val+"'))").hide();
        })
        $(document).on('click', '.page_index_item', function () {
            $scope.index_is_opend = false;
            index_page_number = $(this).text();
            console.log('page_number:' + index_page_number);
            $scope.$broadcast('PageChanged', parseInt(index_page_number));
            $scope.close_location();
        });

        $(document).on('click', '.sura_index_item', function () {
            $scope.index_is_opend = false;
            index_page_number = $(this).find('span').text();
            console.log('page_number:' + index_page_number);
            $scope.$broadcast('PageChanged', parseInt(index_page_number));
            $scope.close_location();
        });

        $(document).on('click', '.p_hesb', function () {
            $scope.index_is_opend = false;
            console.log('common_serv.Suras');
            console.log(common_serv.Suras);
            index_page_number = $(this).attr('value');
            console.log('page_number:' + index_page_number);
            $scope.$broadcast('PageChanged', parseInt(index_page_number));
            $scope.close_location();
        });
        $(document).on('click', '.hizb_index_item', function () {
            $scope.index_is_opend = false;
            console.log('common_serv.Suras');
            console.log(common_serv.Suras);
            index_page_number = $(this).attr('value');
            console.log('page_number:' + index_page_number);
            $scope.$broadcast('PageChanged', parseInt(index_page_number));
            $scope.close_location();
        });
 


        function get_annotations(page_number) {
            starttime = new Date().getTime();
            //  
            if (page_number < 1 || page_number > allpages) return;
                var note = document.getElementById('notes' + page_number);
                if (note == null) return;
                note.innerHTML = ''
            if (quraat_name == 'shamarly') {
                $scope.read_data_file(data_shamarly+page_number + '.json', page_number);
                if($scope.settings.efrad_gam3=="efrad_k")
                {
                    $scope.read_data_file(data_shamarly_k+page_number + '.json', page_number);
                }else if($scope.settings.efrad_gam3=="efrad_a")
                {
                    $scope.read_data_file(data_shamarly_a+page_number + '.json', page_number);
                }
                else if($scope.settings.efrad_gam3=="efrad_b")
                {
                    $scope.read_data_file(data_shamarly_b+page_number + '.json', page_number);
                }
                else if($scope.settings.efrad_gam3=="efrad_j")
                {
                    $scope.read_data_file(data_shamarly_j+page_number + '.json', page_number);
                }
                else if($scope.settings.efrad_gam3=="efrad_s")
                {
                    $scope.read_data_file(data_shamarly_s+page_number + '.json', page_number);
                }
            } else {
                $scope.read_data_file(data_madina+page_number + '.json', page_number);
            }
         
          

        }

        function createHandler(image, item_data) {
            return function () {
                showtext(image, item_data.Contents);
            }

        }
        showtext = function (imag, text) {
            alert(text);
        }

        function show_msg(subject, str, color) {
            if( $("#msgdiv").html()==''){
                
                $("#msgdiv").html('<i class="copyicon  fa fa-copy "></i>')
            }
            $("#msgdiv").show();
            var icon = "";
            var padding = "";
            if (color == "black") {
                icon = "<span class='note_icon'></span>";
                padding = 40;
            } else if (color == "brown") {
                icon = "<span class='brown_icon'></span>";
                padding = 28
            }
            c_str = str.replace(/\r/g, "<br />");
            currenthtml = $("#msgdiv").html();
            $scope.aya_marks = currenthtml + icon + "<li style=\"font-size: 16px;color:" + color + ";padding-right:" + padding + "px;\"> " + c_str;
            $("#msgdiv").html($scope.aya_marks);
        }

        function show_msg1(subject, str, color) {
            $("#msgdiv").show();
            var icon = "";
            var padding = "";
            if (color == "teal") {
                icon = "<span class='teal_icon'></span>";
                padding = 28;
            } else if (color == "Green") {
                icon = "<span class='star_icon'></span>";
                padding = 28;
            } else if (color == "Blue") {
                icon = "<span class='_3adalayat'></span>";
                padding = 28;
            }
            
            c_str = str.replace(/\r/g, "<br />");
            $("#msgdiv").append(icon + "<li style=\"font-size: 16px;color:" + color + ";padding-right:" + padding + "px;\"> " + c_str);
            if (color == "Green" || color == "teal")
                $scope.aya_marks = $("#msgdiv").html();
        }

        // function hide_msgs1() {
        //     $("#msgdiv1").hide();
        //     $("#msgdiv1").html('');
        //     if ($scope.settings.msgBox == true) {
        //         $("#msgdiv").hide();
        //     }
        // }

        // function hide_msgs() {
        //     $("#msgdiv").html(''); //<div id="font_change"><div class="increase"> + </div><div class="decrease"> - </div></div>
        //     if ($scope.settings.msgBox == true) {
        //         $("#msgdiv").hide();
        //     }
        // }


        function check_file(i) {
            if (quraat_name == 'shamarly')
                site_url = "http://localhost:8080/shamarly/alshamarly/platforms/android/assets/www/data/" + i + ".json";
            else
                site_url = "http://localhost:8080/shamarly/alshamarly/platforms/android/assets/www/data_m/" + i + ".json";

            console.log('site_url:' + site_url);
            $.get(site_url, function (d, s) {
                //alert(data);
                //alert(s)
                console.log('response:');
                console.log(d);
                console.log('status:');
                console.log(s);

            }, "text");


        }
        if (quraat_name == 'shamarly') {
            init_shamarly();
        } else {
            init_madina();
        }


        /////////////////////////////////////////////////////////
        //////////////////////// FILE COPY AND SAVE LOCALLY 	
        ////////////////////////////////////////////////////////////

        //moveFileUriFromTemporaryToPersistent(from,to,function(result){alert(result);});

        getFilesFromAssets = function () {

            moveFileUriFromTemporaryToPersistent = function (fromURI, newFileName, callbackFunction) {
                window.resolveLocalFileSystemURI(fromURI, function (temporaryEntry) {
                    var PERSISTENT=window.PERSISTENT;//LocalFileSystem.PERSISTENT;
                    window.requestFileSystem(PERSISTENT, 0, function (persistentFileSys) {
                        persistentFileSys.root.getDirectory('PersistentDir2', {
                            create: true,
                            exclusive: false
                        }, function (persistentDirectory) {
                            persistentDirectory.getDirectory('subdir1', {
                                create: true,
                                exclusive: false
                            }, function (photoDirectory) {
                                photoDirectory.getFile(newFileName, {
                                    create: true,
                                    exclusive: false
                                }, function (persistentEntry) {
                                    temporaryEntry.file(function (oldFile) {
                                        var reader = new FileReader();
                                        reader.onloadend = function (evt) {
                                            persistentEntry.createWriter(function (writer) {
                                                writer.onwrite = function (evt) {
                                                    temporaryEntry.remove();
                                                    callbackFunction(persistentEntry.toURL());
                                                };
                                                writer.write(evt.target.result);
                                            }, fail);
                                        };
                                        reader.readAsArrayBuffer(oldFile);
                                    }, fail);
                                }, fail);
                            }, fail);
                        }, fail);
                    }, fail);
                }, fail);
            }



            fromAssestsToStorage = function (source, Target, type, asset_num) {
                if (asset_num >= 11) return;
                if (type == "image") {

                    type = "data";
                    var fileName = asset_num + ".jpg";
                    if (quraat_name == 'shamarly') {
                        var assetURL = source + "shamarly_images/" + fileName;
                        var Target_file = Target + "shamarly_images/" + fileName;
                    } else {
                        var assetURL = source + "madina_images/" + fileName;
                        var Target_file = Target + "madina_images/" + fileName;
                    }
                } else
                if (type == "data") {
                    type = "image";
                    var fileName = asset_num + ".json";
                    if (quraat_name == 'shamarly') {
                        var assetURL = source + data_shamarly + fileName;
                        var Target_file = Target + data_shamarly + fileName;
                    } else {
                        var assetURL = source + data_madina + fileName;
                        var Target_file = Target + data_madina + fileName;
                    }
                    asset_num = asset_num + 1;
                } else return;
                window.resolveLocalFileSystemURL(Target_file, function () {
                    console.log("file exist:" + Target);
                    fromAssestsToStorage(source, store, type, asset_num);
                }, /*not exist*/ function () {

                    moveFileUriFromTemporaryToPersistent(assetURL, Target_file, function (result) {
                        /*alert(result);*/
                        fromAssestsToStorage(source, store, type, asset_num);

                    })

                });
            }


            CopyFolder = function (Source, Target) {
                function removeFolder(entry) {
                    function success(parent) {
                        console.log("Remove Recursively Succeeded");
                        start_copy();
                    }

                    function fail(error) {
                        console.log("Failed to remove directory or it's contents: " + error.code);
                    }

                    // remove the directory and all it's contents
                    entry.removeRecursively(success, fail);
                }

                function success(entries) {
                    window.resolveLocalFileSystemURL(Target, /*exist directory*/ function (trg_dirEntry) {

                        var i;
                        for (i = 0; i < entries.length; i++) {
                            //onsole.log(entries[i].name);
                            if (entries[i].isFile) {
                                entries[i].copyTo(trg_dirEntry);
                            }
                        }
                    }, /*need copy*/ function (trg_dirEntry) {
                        var i;
                        for (i = 0; i < entries.length; i++) {
                            //onsole.log(entries[i].name);
                            if (entries[i].isFile) {
                                entries[i].copyTo(trg_dirEntry);
                            }
                        }
                    })

                }

                function fail(error) {
                    alert("Failed to list directory contents: " + error.code);
                }

                // in case of setup as update need to remove old data first
                window.resolveLocalFileSystemURL(Target, /*exist folder*/ function (Target_dirEntry) {
                    removeFolder(Target_dirEntry);
                }, /*not exist (first time)*/ function (err) {
                    console.log('folder', Target, ' not exist yet');
                    start_copy();
                })

                function start_copy() {
                    window.resolveLocalFileSystemURL(Source, function (src_dirEntry) {

                        // Get a directory reader
                        //var directoryReader = src_dirEntry.createReader();
                        // Get a list of all the entries in the directory
                        window.resolveLocalFileSystemURL(store, /*exist directory*/ function (trg_dirEntry) {
                            src_dirEntry.copyTo(trg_dirEntry, src_dirEntry.name, function (success) {
                                console.log('dir copy sucess ->');
                                console.log(success);
                                window.localStorage.setItem(appNeedInstall_str, 'NO');

                                $("#progress").css('display', 'none');

                                if (quraat_name == 'shamarly') {
                                    init_shamarly();
                                } else {
                                    init_madina();
                                }
                                console.log('INSTALL FINISHED <<<<<<<<<<<<<<<<<<<<<<<<<');
                                $rootScope.$broadcast('on_open_setting');
                                $rootScope.$broadcast('on_open_general_setting');
                            }, function (err) {
                                console.log('dir copy faillll!!!');
                                console.log(err)
                            });
                        })

                        //directoryReader.readEntries(success,fail);


                    });
                }
            }



            var source = cordova.file.applicationDirectory + "www/";
            //fromAssestsToStorage(source,store,"image",1);	
            if (quraat_name == 'shamarly') {
                //  CopyFolder(source+"/data/",store+"/data/");
            } else {
                //CopyFolder(source+"/data_m/",store+"/data_m/");
            }
            if (quraat_name == 'shamarly') {
                init_shamarly();
            } else {
                init_madina();
            }
            //CopyFolder(source+"/images/",store+"/images/");
            //CopyFolder(source+"/shamarly_images/",store+"/shamarly_images/");
            //CopyFolder(source+"/css/",store+"/css/");

        }


        /////////////////////////////////////////////////////////
        //////////////////////// FILE DOWNLOAD AND SAVE LOCALLY 	
        ////////////////////////////////////////////////////////////

        getFilesFirstTime = function () {
            var fileTransfer = new FileTransfer();
            /*
            fileTransfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                
                var n=progressEvent.loaded / progressEvent.total;
                $('.radial-progress').attr('data-progress', Math.floor(n * 100));
                
                    //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                } else {
                    //loadingStatus.increment();
                //	var n=progressEvent.loaded / progressEvent.total;
                n= parseInt($('.radial-progress').attr('data-progress'))+1; 
                if(n>=100)n=0;
                $('.radial-progress').attr('data-progress',n);
                }
            };*/


            //Check for the file. 




            //downloadAsset('image',1);  

            function downloadAsset(type, asset_num, replace) {
                // alert(store);
                if (asset_num > allpages) return; // all pages loaded

                var n = asset_num / allpages;
                $('.radial-progress').attr('data-progress', Math.floor(n * 100));

                $('.radial-progress').attr('display', "block");
                console.log("About to start transfer");
                if (type == "image") {

                    type = "data";
                    var fileName = asset_num + ".jpg";
                    if (quraat_name == 'shamarly') {
                        var assetURL = uri + "shamarly_images/" + fileName;
                        var Target = store + "shamarly_images/" + fileName;
                    } else {
                        var assetURL = uri + "madina_images/" + fileName;
                        var Target = store + "madina_images/" + fileName;
                    }

                } else
                if (type == "data") {
                    type = "image";
                    var fileName = asset_num + ".json";
                    if (quraat_name == 'shamarly') {
                        var assetURL = uri + data_shamarly + fileName;
                        var Target = store + data_shamarly + fileName;
                    } else {
                        var assetURL = uri + data_madina + fileName;
                        var Target = store + data_madina + fileName;
                    }
                    asset_num = asset_num + 1;
                } else return;


                window.resolveLocalFileSystemURL(Target, function () {
                    console.log("file exist:" + Target);
                    downloadAsset(type, asset_num);
                }, function () {

                    fileTransfer.download(assetURL, Target,
                        function (entry) {
                            console.log("Success!");
                            $('.radial-progress').attr('display', "none");


                            downloadAsset(type, asset_num);
                        },
                        function (err) {
                            $('.radial-progress').attr('display', "none");
                            console.log("Error");
                            console.dir(err);
                            if (type == 'data') asset_num = asset_num - 1;
                            downloadAsset(type, asset_num);
                        });
                });


            }

            //I'm only called when the file exists or has been downloaded.
            function appStart(entry) {
                // $status.innerHTML = "App ready!";
                //alert(entry)
            }

        }


        /*********** */

     
    })

 
    .directive('onLongPress', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $elm, $attrs) {
                $elm.bind('touchstart', function(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.longPress = true;
                    $scope.longPressFired = false;
                    
    
                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function() {
                        if ($scope.longPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.longPressFired = true; 
                            $scope.$apply(function() {
                                $scope.$eval($attrs.onLongPress)
                            });
                        }
                    }, 600);
                });
    
                $elm.bind('touchend', function(evt) {
                    // Prevent the onLongPress event from firing
                    if($scope.longPressFired )  evt.stopPropagation();
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        
                        $scope.$apply(function() {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }
                });
            }
        };
    });