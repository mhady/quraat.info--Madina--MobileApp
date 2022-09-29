// Start
function audioPlayer() {
    var currentaya = 0;
    $("#audioPlayer")[0].src = $("#playlist li a")[0];
    $("#audioPlayer")[0].play();
    //////
    audio_play_try_count=0;
    $("#audioPlayer")[0].onerror = function (event) {
        cont_audio_player = $("#audioPlayer")[0];
                if(event.target.error.code==event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED)
                {// change to default reader and try again 
                    src_parts=event.target.src.split("/");
                    file_name=src_parts[src_parts.length-1];
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
                        
                        cont_audio_player.src=new_src;
                        cont_audio_player.play();
                        return;
                   }
                }
                console.log('error:', event);
                cont_audio_player.pause();
              
       }
    ///////

    $("#playlist li:first-child").append("<span class='fa fa-arrow-right'></span>");

    $("#playlist li a").click(function (e) {
        $("#playlist li .fa").remove();
        e.preventDefault();
        $("#audioPlayer")[0].src = this;
        $("#audioPlayer")[0].play();
        $("#playlist li").removeClass("current-aya");
        currentaya = $(this).parent().index();
        $(this).parent().addClass("current-aya");
        $(this).parent().append("<span class='fa fa-arrow-right'></span>");
    });
    // Test .. not working
    // var audio_player_id = $("#audioPlayer")[0];
    // audio_player_id.onended =function (){
    // }
    $("#audioPlayer")[0].addEventListener("ended", function () {
        currentaya++;
        if (currentaya == $("#playlist li a").length)
            currentaya = 0;
        $("#playlist li").removeClass("current-aya");
        $("#playlist li .fa").remove();
        $("#playlist li:eq(" + currentaya + ")").addClass("current-aya");
        $("#playlist li:eq(" + currentaya + ")").append("<span class='fa fa-arrow-right'></span>");
        $("#audioPlayer")[0].src = $("#playlist li a")[currentaya].href;
        $("#audioPlayer")[0].play();
    });
}

 

// 

function get_local_reader_folder(reader){
    reader=reader.split("/").join("");// remove any /
    $.each(alkobra, function (indx, val) {
        if (reader == val.folder) {
            alkobra_telawa_reader=val;
            telawa_reader_local=val.local;
            telawa_reader_local_folder=val.local_folder;
        }
    });
} 

// 





function triger_from_aya_change() {
    var from_aya_val = $(" #from_aya option:selected").val();
    if (from_aya_val == undefined) from_aya_val = 1;
    var from_sura_list_val = $(" #from_sura_list option:selected").val();
    var to_sura_list_val = $(" #to_sura_list option:selected").val();
    var ayat_numbers = $(" #from_sura_list option:selected").attr('ayat_numbers');
    var toaya = $(" #from_sura_list option:selected").attr('toaya');
    //alert(from_aya_val  +"- to_sura_list_val"+from_sura_list_val+"- to_sura_list_val"+to_sura_list_val+"- ayat_numbers"+ayat_numbers+"- toaya"+toaya);
    if (parseInt(toaya) < parseInt(ayat_numbers))
        ayat_numbers = toaya;
    if (parseInt(to_sura_list_val) == parseInt(from_sura_list_val)) {
        var i_begin = parseInt(from_aya_val);
        var ayat_list = '';
        for (var i = i_begin; i <= ayat_numbers; i++) {
            ayat_list += '<option value="' + i + '">' + i + '</option>';
        }
        $("#to_aya").empty().append(ayat_list);
    }
}
// From - To 
$(document).on('change', '#rwah_list', function () {
    if (typeof sura_data == 'undefined') {
        var sura_data = JSON.parse(window.localStorage.getItem('sura_data'));
    }

    $("#from_sura_list").html('');
    $("#to_sura_list").html('');
    $("#from_aya").html('');
    $("#to_aya").html('');
    var from_sura_options = '<option value="0">اختر السورة</option>';
    var optionSelected = $(" option:selected", this);
    var valueSelected = this.value;
    $.each(alkobra, function (indx, val) {
        if (val.active_sound == 1) {
            var tosura = optionSelected.attr('tosura');
            $.each(sura_data, function (i, v) {
                if (parseInt(v.sura_order) <= parseInt(tosura) && $("#from_sura_list option[value='" + v.sura_order + "']").length == 0) {
                    if (parseInt(v.sura_order) == parseInt(tosura))
                        var toaya = optionSelected.attr('toaya');
                    else
                        var toaya = v.ayat;
                    from_sura_options += '<option value="' + v.sura_order + '" toaya="' + toaya + '" ayat_numbers="' + v.ayat + '"> ' + v.sura_name + '</option>';
                    $("#from_sura_list").html(from_sura_options);
                    $("#to_sura_list").html(from_sura_options);
                }

            });

        }
    });

});
$(document).on('change', '#from_sura_list, #to_sura_list', function () {
    var this_id = $(this).attr('id');
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    var tosura = valueSelected;
    var ToAyaFromRawy = $(" #rwah_list option:selected").attr('toaya');
    var ToSuraFromRawy = $(" #rwah_list option:selected").attr('tosura');
    var from_aya_val = $(" #from_aya option:selected").val();
    var from_sura_list_val = $(" #from_sura_list option:selected").val();
    var to_sura_list_val = $(" #to_sura_list option:selected").val();
    var toaya = optionSelected.attr('toaya');
    var ayat_numbers = optionSelected.attr('ayat_numbers');
    if (this_id == 'from_sura_list') {
        $('#to_sura_list option').filter(function () {
            return parseInt(this.value) < parseInt(valueSelected);
        }).remove();

    }
    if (this_id == 'from_sura_list' && parseInt(valueSelected) < parseInt(to_sura_list_val)) {
        $("#to_sura_list").html($("#from_sura_list").html());

        $('#to_sura_list option').filter(function () {
            return parseInt(this.value) < parseInt(valueSelected);
        }).remove();
    }

    $.each(alkobra, function (indx, val) {
        if (val.active_sound == 1) {
            ayat_list = '';
            if (parseInt(toaya) < parseInt(ayat_numbers))
                ayat_numbers = toaya;
            if (from_sura_list_val == tosura && this_id == 'to_sura_list')
                var i_begin = parseInt(from_aya_val);
            else var i_begin = 1;
            for (var i = i_begin; i <= ayat_numbers; i++) {
                ayat_list += '<option value="' + i + '">' + i + '</option>';
            }
            if (this_id == 'from_sura_list')
                $("#from_aya").empty().append(ayat_list);
            else $("#to_aya").empty().append(ayat_list);


        }
    });
    triger_from_aya_change();
});

$(document).on('change', '#from_aya', function () {
    triger_from_aya_change();
});
// $("#rwah_audio").submit(function (event) {
// $("#rwah_audio").on('submit',function (event) {
function submit_form(event) {
    // submit_form = function (event) {
    console.log('%c$("#rwah_audio").submit called', 'color: orange');
    // event.preventDefault();
    if($('#play_audio').val()=='ايقاف الصوت')
    {
        $("#audioPlayer")[0].pause();
        $('#play_audio').val(' تشغيل الصوت ');
        return ;
    }
   
    var selected_ayat = [];
    $("#playlist").html('');
    var rawy_folder = $("#rwah_list option:selected").val();
    var telawa_reader= $("#rwah_list option:selected").val();
    get_local_reader_folder(telawa_reader);
    var fromSuraOptionSelected = parseInt($("#from_sura_list option:selected").val());
    var fromAyaOptionSelected = parseInt($("#from_aya option:selected").val());
    var toSuraOptionSelected = parseInt($("#to_sura_list option:selected").val());
    var toAyaOptionSelected = parseInt($("#to_aya option:selected").val());
    //alert(typeof rawy_folder);
    if (rawy_folder === '0') {
        alert('يجب اختيار القارئ  ');
        return false;
    }
    if (fromSuraOptionSelected === parseInt('0')) {
        alert('يجب اختيار سورة  بداية القراءة');
        return false;
    }

    if (toSuraOptionSelected === parseInt('0')) {
        alert('يجب اختيار سورة نهاية القراءة ');
        return false;
    }

    if (toSuraOptionSelected < fromSuraOptionSelected) {
        alert('يجب أن تكون سورة انتهاء القراءة( إلى)  تالية لسورة البداية  (من )');
        return false;
    }
    if (toAyaOptionSelected < fromAyaOptionSelected && fromSuraOptionSelected === toSuraOptionSelected) {
        alert('آية النهاية يجب أن تكون أكبر من آية البداية');
        return false;
    }


    //	 alert(rawy_folder+" - "+fromSuraOptionSelected+" - "+fromAyaOptionSelected+" - "+toSuraOptionSelected+" - "+toAyaOptionSelected);
    var MainControllerScope = angular.element(document.getElementById('1')).scope();
    if (quraat_name == 'shamarly') {
        console.log('no problem');
        aya_data = MainControllerScope.aya_data;
    } else {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = dataDirectory + data_madina + 'ayah_data_info.json';
        aya_data = ayah_data_info;
    }

    var txt = '';
    var count = '';
    
    // $.each(MainControllerScope.aya_data, function (index, value) {
    $.each(aya_data, function (index, value) {
        //Test 3
        value.ayah = parseInt(value.ayah);
        value.sura = parseInt(value.sura);
        var sura_num = zeroFilled = ('000' + value.sura).substr(-3);
        var ayah_num = zeroFilled = ('000' + value.ayah).substr(-3);
        if(alkobra_telawa_reader.file_name_format=="qmp3")
        {
            var file_name =alkobra_telawa_reader.url + sura_num  + ayah_num + ".mp3";
        }
        else
        {
            var file_name= default_sound_server_shamarly + rawy_folder + "/S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
        }
       
       
        if(telawa_reader_local){
            // /local_folder
          //  file_name =  telawa_reader_local_folder + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
            //windows.resolveLocalFilesystemUrl(str_src,function(entry){},function(err){})
            if(alkobra_telawa_reader.file_name_format=="qmp3")
            {
                var file_name = telawa_reader_local_folder+ sura_num  + ayah_num + ".mp3";
            }
            else
            {
                var file_name= telawa_reader_local_folder + "S" + sura_num + "/S" + sura_num + "A" + ayah_num + ".mp3";
            }
            
        } 
        if (value.sura == fromSuraOptionSelected && value.sura != toSuraOptionSelected) {
            if (value.ayah >= fromAyaOptionSelected) {
                if (value.ayah < 10) {
                    txt += '<li data-sortid="' + value.sura + '000' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else if (10 <= value.ayah && value.ayah < 100) {
                    txt += '<li data-sortid="' + value.sura + '00' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else {
                    txt += '<li data-sortid="' + value.sura + '0' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                }
            }

        } else if (value.sura == toSuraOptionSelected && value.sura != fromSuraOptionSelected) {
            if (value.ayah <= toAyaOptionSelected) {
                if (value.ayah < 10) {
                    txt += '<li data-sortid="' + value.sura + '000' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else if (10 <= value.ayah && value.ayah < 100) {
                    txt += '<li data-sortid="' + value.sura + '00' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else {
                    txt += '<li data-sortid="' + value.sura + '0' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                }
            }
        } else if (value.sura == toSuraOptionSelected && value.sura == fromSuraOptionSelected) {
            if (value.ayah <= toAyaOptionSelected && value.ayah >= fromAyaOptionSelected) {
                if (value.ayah < 10) {
                    txt += '<li data-sortid="' + value.sura + '000' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else if (10 <= value.ayah && value.ayah < 100) {
                    txt += '<li data-sortid="' + value.sura + '00' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                } else {
                    txt += '<li data-sortid="' + value.sura + '0' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                    count++;
                }
            }

        } else if (value.sura < toSuraOptionSelected && value.sura > fromSuraOptionSelected) {
            if (value.ayah < 10) {
                txt += '<li data-sortid="' + value.sura + '000' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                count++;
            } else if (10 <= value.ayah && value.ayah < 100) {
                txt += '<li data-sortid="' + value.sura + '00' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                count++;
            } else {
                txt += '<li data-sortid="' + value.sura + '0' + value.ayah + '" class="current-aya"><a href="' + file_name + '" >' + value.ayah + " - " + value.ayahtext + '</a></li>';
                count++;
            }
        }

    });
    $("#audioPlayer").show();
    $("#playlist").html(txt);
    sortMeBy('data-sortid', '#playlist', 'li', 'asc');
    $('#play_audio').val('ايقاف الصوت');
    audioPlayer();
    sortMeBy('data-sortid', '#playlist', 'li', 'asc');
    // });

    aya_data = MainControllerScope.aya_data;
}

function sortMeBy(arg, sel, elem, order) {
    var $selector = $(sel),
        $element = $selector.children(elem);
    $element.sort(function (a, b) {
        var an = parseInt(a.getAttribute(arg)),
            bn = parseInt(b.getAttribute(arg));
        if (order == "asc") {
            if (an > bn)
                return 1;
            if (an < bn)
                return -1;
        } else if (order == "desc") {
            if (an < bn)
                return 1;
            if (an > bn)
                return -1;
        }
        return 0;
    });
    $element.detach().appendTo($selector);
}
// End