angular.module('starter')

    .service('setting_srv',  function ($location, $ionicPopup, $rootScope,common_serv) {
 

        self_setting=this;

        this.settings=[];
        this.general_settings = [];
        this.init=function(){
            this.settings = {};
            this.general_settings = {};
            if (window.localStorage.getItem('setting'))
            this.settings = JSON.parse(window.localStorage.getItem('setting'));
        else {
            this.settings.alamat7 = true;
            this.settings.efrad_gam3 = "gam3";
            this.settings.shawahed3 = true;
            this.settings.shawahed7 = true;
            this.settings._3adalayat = true;
            this.settings.intro_kobra_v=true;
            this.settings.intro_soghra_v=true;
            this.settings.msgBox = false;
            this.settings.alamat3mwafaqa = true;
            this.settings.tshabohat = true;
            this.settings.alamat3 = true;
            this.settings.alamat7 = true;
            this.settings.tawgehqraat = true;
            this.settings.infradat = true;
            this.settings.keepAwake = false;

            
            this.settings.selectedreader = "Taha";//alkobra[2].folder; // Default : Taha
            this.settings.selectedreader_matn = "Taha";//alkobra[2].folder; // Default : Taha

            
            window.localStorage.setItem('setting', JSON.stringify(this.settings));
        }
        }

        this.open_setting = function (target_scope) {
            $rootScope.$broadcast('autoscrollpause', true);
            console.log('open_setting called...........');
            console.log(this.settings);
            // if (quraat_name == 'shamarly') {
            //     var local_sound_path = window.localStorage.getItem('general_settings');
            // } else {
            //     var local_sound_path = window.localStorage.getItem('general_settings_m');
            // }
            // if (local_sound_path) {
            //     self_setting.general_settings.sound_path = local_sound_path;
            // } else {
            //     self_setting.general_settings.sound_path = '';
            //     local_sound_path = '';
            //     if (quraat_name == 'shamarly')
            //         window.localStorage.setItem('general_settings', self_setting.general_settings.sound_path);
            //     else window.localStorage.setItem('general_settings_m', self_setting.general_settings.sound_path);
            // }
            self_setting.settings_t = $.extend(true, {}, self_setting.settings);
            var select_options = '';
            var select_options_matn='';
            var checked = '';
            
            $.each(alkobra, function (indx, val) {
                if (val.active_sound == 1) {
                    if (self_setting.settings_t.selectedreader == val.folder) {
                        checked = 'selected="selected"';
                    } else if (self_setting.settings_t.selectedreader == undefined || self_setting.settings_t.selectedreader == 'undefined') {
                        {
                            checked = 'selected="selected"';
                            // this.settings_t.selectedreader = alkobra[0].folder;
                            self_setting.settings_t.selectedreader = alkobra[2].folder; // Default : Taha
                        }
                    } else {
                        checked = '';
                        // console.log('%cLook to my line : ' + val.folder, 'color:orange');
                    }
                    if(val.local) local=" [محليا] "; else local="";
                    select_options += '<option ' + checked + ' value="' + val.folder + '"> ' + val.shikh + '/' + val.khatma + '/' + val.text +local+ '</option>';
                }
            });

            var matn_readers=[{name:"طه الفهد" , value:"Taha"} , {name:" أيمن سويد" ,value:"Ayman"}]
            $.each(matn_readers, function (indx, val) {
                //default reader
                if(val.value=="Taha") checked='selected="selected"';  else  checked="";
                // user already selected reader 
                if (self_setting.settings_t.selectedreader_matn == val.value)  checked = 'selected="selected"';
                 select_options_matn +='<option ' + checked + ' value="' + val.value + '"> ' + val.name  + '</option>';
            })




            // --------------------   { to_fix + Addon }   -------------------- //
            console.log('%cselectedreader : ' + self_setting.settings_t.selectedreader, 'color: orange');

            function to_fix_handle_current_reader() {
                function to_fix_localStorage(to_fix_file) {
                    if(window.localStorage.getItem(to_fix_file))
                    {
                    to_fix_local = (window.localStorage.getItem(to_fix_file)).toString()
                    to_fix_local = to_fix_local.substring(to_fix_local.indexOf("=") + 1);
                    to_fix_local = JSON.parse(to_fix_local);
                    }
                    else  to_fix_local=[];
                    to_fix = to_fix_local;
                    self_setting.to_fix = to_fix;
                    window.localStorage.setItem("to_fix_locally", JSON.stringify(to_fix));
                    console.log('%cto_fix_locally : updated', 'color:green');
                }

                $.each(alkobra, function (indx, val) {
                    if (val.active_sound == 1) {
                        if (self_setting.settings_t.selectedreader == val.folder) {
                            checked = 'selected="selected"';
                        } else if (self_setting.settings_t.selectedreader == undefined || self_setting.settings_t.selectedreader == 'undefined') {
                            {
                                checked = 'selected="selected"';
                                // this.settings_t.selectedreader = alkobra[0].folder;
                                self_setting.settings_t.selectedreader = alkobra[2].folder; // Default : Taha
                            }
                        } else {
                            checked = '';
                            // console.log('%cLook to my line : ' + val.folder, 'color:orange');
                        }
                      //  select_options += '<option ' + checked + ' value="' + val.folder + '"> ' + val.shikh + '/' + val.khatma + '/' + val.text + '</option>';
                    }

                    if (checked != '') {
                        console.log('%cSelected : Shiekh : ' + val.shikh + 'Soghra=0/Kobra=1 : ' + val.Type, 'color: purple');
                        to_fix_localStorage(val.folder + '_to_fix.json');
                        window.localStorage.setItem("selected_reader_s_or_k", val.Type);
                        window.localStorage.setItem("selected_reader_name", val.folder);
                        return false;
                    }

                });
            //    kobra_or_soghra_Addon();
                common_serv.kobra_or_soghra_Addon()
                console.log('%cselectedreader : ' + self_setting.settings_t.selectedreader, 'color: orange');
                console.log('%c1 = kobra, 0 = soghra : __ ' + window.localStorage.getItem('selected_reader_s_or_k'), 'color:orange');
                // console.log(to_fix);
               // location.reload(true);
            }
            // --------------------     { to_fix ?? }      -------------------- //
            // --------------------        { end }         -------------------- //
            // -------------------- Creative Mohamed Sayed -------------------- //

/**
 * {
                        // -------------------- Download Efrad -------------------- //
                        text: '<b>تنزيل الافراد</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            self_setting.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                            self_setting.efrad_download();
                            return this.settings;
                        }
                        // -------------------- Creative Mohamed Sayed -------------------- //
                    }
 */


                    var template=' <ion-list class="setting"> <ion-item><h3 style="text-align:right;color: brown;">ضبط اظهار الشواهد والعلامات</h3></ion-item> ' +
                    '<ion-item>    <ion-checkbox ng-model="settings_t.msgBox" ng-true-value="true" ng-false-value="false" >  الشواهد باللمس  </ion-checkbox>    </ion-item> ' +
                    '<ion-item class="efrad">    <ion-radio onchange="efrad_f(1)" onIonChange="efrad_f(1)" ng-model="settings_t.efrad_gam3"  value="efrad_k"   >الافراد-قالون  </ion-radio>    </ion-item> ' +
                    '<ion-item class="efrad">    <ion-radio onchange="efrad_f(1)" onIonChange="efrad_f(1)" ng-model="settings_t.efrad_gam3"  value="efrad_b"   >الافراد-ابن كثير  </ion-radio>    </ion-item> ' +
                    '<ion-item class="efrad">    <ion-radio onchange="efrad_f(1)" onIonChange="efrad_f(1)" ng-model="settings_t.efrad_gam3"  value="efrad_s"   >الافراد-شعبة  </ion-radio>    </ion-item> ' +
                    '<ion-item class="efrad">    <ion-radio onchange="efrad_f(1)" onIonChange="efrad_f(1)" ng-model="settings_t.efrad_gam3"  value="efrad_j"   >الافراد-أبو جعفر  </ion-radio>    </ion-item> ' +
                    '<ion-item class="efrad">    <ion-radio onchange="efrad_f(1)" onIonChange="efrad_f(1)" ng-model="settings_t.efrad_gam3"  value="efrad_a"   >الافراد-الاصبهاني  </ion-radio>    </ion-item> ' +     
                    '<ion-item  >    <ion-radio  onchange="gam3()" ng-model="settings_t.efrad_gam3"  value="gam3"> الجمع  </ion-radio>    </ion-item> ' +
                    '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.shawahed7" ng-true-value="true" ng-false-value="false" >  شواهد السبع  <div class="Yellow_mark"></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item class="gam3">    <ion-checkbox  ng-model="settings_t.alamat7" ng-true-value="true" ng-false-value="false">    علامات السبع <div class="under_line black "></div><div class="under_line green shiftright10"></div><div class="under_line red shiftright20"></div><div class="under_line blue shiftright30"></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.shawahed3" ng-true-value="true" ng-false-value="false"> شواهد الثلاث  <div class="brown_circle"></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.alamat3" ng-true-value="true" ng-false-value="false">  علامات الثلاث <div class="circle red"></div> <div class="circle green shiftright10"></div> <div class="circle blue shiftright20"></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item class="gam3">    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.alamat3mwafaqa">علامات الثلاث الموافقة<div class="circle red emp_circle"></div> <div class="circle green emp_circle shiftright10"></div> <div class="circle black emp_circle shiftright20"></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.tshabohat">ارشادات والمتشابهات   <div class="greed_star" ></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.tawgehqraat">توجية القراءات   <div class="key" ></div></ion-checkbox>    </ion-item> ' +
                  
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t._3adalayat">اظهار عد الاّي <div class="_3adalayat" ></div></ion-checkbox>    </ion-item> ' +
                   
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.intro_kobra_v">  تقدمات الكبرى<div class="into_k_m intro_v" ></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.intro_soghra_v">  تقدمات الصغرى<div class="into_s_m intro_v" ></div></ion-checkbox>    </ion-item> ' +

                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.infradat">اظهار الانفرادات <div class="infradat" ></div></ion-checkbox>    </ion-item> ' +
                    '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.keepAwake">عدم إطفاء الشاشه<div class="keepAwake" ></div></ion-checkbox>    </ion-item> ' +
                   
                    '</ion-list>' +
                   // '<ion-list class="general_settings setting"> ' + ' <h3 style="text-align:right;color: brown;">ضبط إعدادات الصوت</h3>' +
                  //  '<ion-item style="height:auto;">  <input value="' + local_sound_path + '" style="text-align:right" id="local_sound_option" type="text" placeholder="اكتب المسار الخاص بقراءة ملفات الصوت من على الجهاز الخاص بك"></ion-item>' +
                    '<label style="width: 100%;float: right;text-align:right;color: brown;    margin-top: 10px;margin-bottom: 11px;">اختر القارئ </label>' +
                    '<select name="reader_switcher" class="reader_switcher" style="float:right;background:#fff;width: 100%;">' + select_options +
                    '</select>' +
                    // 
                    '<label style="width: 100%;float: right;text-align:right;color: brown;    margin-top: 10px;margin-bottom: 11px;">اختر قاريء المتن </label>' +
                    '<select name="reader_switcher_matn" class="reader_switcher_matn" style="float:right;background:#fff;width: 100%;">' + select_options_matn +
                    '</select>' +
                    // '<button class="button button-block button-positive" onClick="console.log(' + '"test"' + ');">تحديث</button>' +
                    // '<button class="button button-block button-positive" onClick="' + self_setting.check_update() + '">تحديث</button>' +
                    // '<button class="button button-block button-positive" onClick="check_update_test()" sytyle="padding-top: 10px;">تحديث</button>' +
                    '</ion-list>';
                    if(!self_setting.efrad)
                    {
                        template=' <ion-list class="setting"> <ion-item><h3 style="text-align:right;color: brown;">ضبط اظهار الشواهد والعلامات</h3></ion-item> ' +
                        '<ion-item>    <ion-checkbox ng-model="settings_t.msgBox" ng-true-value="true" ng-false-value="false" >  الشواهد باللمس  </ion-checkbox>    </ion-item> ' ;
                        if(quraat_name == 'shamarly'){
                            template+= '<ion-item  > <button ion-button ng-click="efrad_download()" class="button-positive ng-binding popup-buttons button" style="width: 100%;" value="efrad_download" >تحميل الافراد </button> </ion-item> ' ;
                        }
                        template+= '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.shawahed7" ng-true-value="true" ng-false-value="false" >  شواهد السبع  <div class="Yellow_mark"></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item class="gam3">    <ion-checkbox  ng-model="settings_t.alamat7" ng-true-value="true" ng-false-value="false">    علامات السبع <div class="under_line black "></div><div class="under_line green shiftright10"></div><div class="under_line red shiftright20"></div><div class="under_line blue shiftright30"></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.shawahed3" ng-true-value="true" ng-false-value="false"> شواهد الثلاث  <div class="brown_circle"></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item class="gam3">    <ion-checkbox ng-model="settings_t.alamat3" ng-true-value="true" ng-false-value="false">  علامات الثلاث <div class="circle red"></div> <div class="circle green shiftright10"></div> <div class="circle blue shiftright20"></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item class="gam3">    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.alamat3mwafaqa">علامات الثلاث الموافقة<div class="circle red emp_circle"></div> <div class="circle green emp_circle shiftright10"></div> <div class="circle black emp_circle shiftright20"></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.tshabohat">المتشابهات   <div class="blue_star" ></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.tawgehqraat">توجية القراءات   <div class="key" ></div></ion-checkbox>    </ion-item> ' +
                      
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t._3adalayat">اظهار عد الاّي <div class="_3adalayat" ></div></ion-checkbox>    </ion-item> ' +
                       
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.intro_kobra_v">  تقدمات الكبرى<div class="into_k_m intro_v" ></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.intro_soghra_v">  تقدمات الصغرى<div class="into_s_m intro_v" ></div></ion-checkbox>    </ion-item> ' +
    
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.infradat">اظهار الانفرادات <div class="infradat" ></div></ion-checkbox>    </ion-item> ' +
                        '<ion-item>    <ion-checkbox  ng-true-value="true" ng-false-value="false" ng-model="settings_t.keepAwake">  عدم إطفاء الشاشه <div class="keepAwake" ></div></ion-checkbox>    </ion-item> ' +
                      
                        
                        '</ion-list>' +
                      //  '<ion-list class="general_settings setting"> ' + ' <h3 style="text-align:right;color: brown;">ضبط إعدادات الصوت</h3>' +
                      //  '<ion-item style="height:auto;">  <input value="' + local_sound_path + '" style="text-align:right" id="local_sound_option" type="text" placeholder="اكتب المسار الخاص بقراءة ملفات الصوت من على الجهاز الخاص بك"></ion-item>' +
                        '<label style="width: 100%;float: right;text-align:right;color: brown;    margin-top: 10px;margin-bottom: 11px;">اختر القارئ </label>' +
                        '<select name="reader_switcher" class="reader_switcher" style="float:right;background:#fff;width: 100%;">' + select_options +
                        '</select>' +
                         // 
                        '<label style="width: 100%;float: right;text-align:right;color: brown;    margin-top: 10px;margin-bottom: 11px;">اختر قاريء المتن </label>' +
                        '<select name="reader_switcher_matn" class="reader_switcher_matn" style="float:right;background:#fff;width: 100%;">' + select_options_matn +
                        '</select>' +
                        // '<button class="button button-block button-positive" onClick="console.log(' + '"test"' + ');">تحديث</button>' +
                        // '<button class="button button-block button-positive" onClick="' + self_setting.check_update() + '">تحديث</button>' +
                        // '<button class="button button-block button-positive" onClick="check_update_test()" sytyle="padding-top: 10px;">تحديث</button>' +
                        '</ion-list>';  
                    }
            setTimeout(function () { 
                self_setting.myPopup = $ionicPopup.show({
                    template:template ,

                    /* title: 'الضبط',*/
                    title: 'الإعدادات',
                    scope: target_scope,
                    cssClass: 'setting-popup',
                    buttons: [{
                        text: 'تراجع',
                        onTap: function () {
                            self_setting.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                        }
                    }, {
                        text: '<b>حفظ</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            self_setting.myPopup_opended = false;
                            $rootScope.$broadcast('autoscrollplay', true);
                          //  self_setting.general_settings.sound_path ='' //document.getElementById("local_sound_option").value;
                            var selectedreader = $('select.reader_switcher').children("option:selected").val();
                            var selectedreader_matn = $('select.reader_switcher_matn').children("option:selected").val();

                            
                            self_setting.settings_t.selectedreader = selectedreader;
                            target_scope.settings_t.selectedreader = selectedreader;

                            self_setting.settings_t.selectedreader_matn = selectedreader_matn;
                            target_scope.settings_t.selectedreader_matn = selectedreader_matn;
                            
                            // if (quraat_name == 'shamarly') {
                            //     window.localStorage.setItem('general_settings', self_setting.general_settings.sound_path);
                            // } else {
                            //     window.localStorage.setItem('general_settings_m', self_setting.general_settings.sound_path);
                            // }
                            
                            // -------------------- Creative Mohamed Sayed -------------------- //
                            // -------------------- Creative Mohamed Sayed -------------------- //
                            // console.log(settings_t.msgBox);
                            console.log(self_setting.settings_t.msgBox);
                            if (self_setting.settings_t.msgBox == false) {
                                $("#msgdiv").show();
                            } else {
                                $("#msgdiv").hide();
                            }
                            self_setting.settings =target_scope.settings_t;
                           // target_scope.settings_t=self_setting.settings ;
                            setTimeout(to_fix_handle_current_reader(), 1000);
                            return self_setting.settings;

                        }
                    }, 
                    // {
                    //     // -------------------- Creative Mohamed Sayed -------------------- //
                    //     text: '<b>تحديث</b>',
                    //     type: 'button-positive',
                    //     onTap: function (e) {
                    //         self_setting.myPopup_opended = false;
                    //         $rootScope.$broadcast('autoscrollplay', true);
                    //         common_serv.check_update();
                    //         return this.settings;
                    //     }
                    //     // -------------------- Creative Mohamed Sayed -------------------- //
                    // },
                    
                ]
                });
                //find if popup showing or not
                self_setting.find_pop=function(){
                    if($('.popup').length>0)
                    {
                        if(this.settings.efrad_gam3=="gam3")  self_setting.gam3();
                        else self_setting.efrad_f(1);
                        
                    }
                    else
                    setTimeout(function(){  self_setting.find_pop();  }, 100);
                } 
                self_setting.efrad_f=function(val){

                }
                if (quraat_name == 'shamarly') {
                setTimeout(function(){  self_setting.find_pop();  }, 100)
                }
           
               
                // Custom popup
                self_setting.myPopup.then(function (res) {
                    if (res) {
                        console.log(res);

                        window.localStorage.setItem('setting', JSON.stringify(self_setting.settings));
                        args = {
                            newsettings: self_setting.settings
                        };
                        $rootScope.$broadcast('init_quraat', args);
                    }
                });
            }, 100);



        }
 
    } )