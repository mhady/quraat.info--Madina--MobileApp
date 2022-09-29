// ---- Global Config ---- //
var index_page_number = 0; // ... start page 
var appNeedInstall_str = 'appNeedInstall' + app_version_code; // ... V 
if (quraat_name == 'shamarly') { // ... Shamarly
    var allpages = 522;
    var image_width = 1110;
    var image_height = 1602;
    var img_h = 100;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var h_10 = h * 10 / 100;
    var index_style = '';
} else { // ... Madina
    var allpages = 604;
    var image_ratio = 1.4;
    var image_width = 622 * image_ratio; //622
    var image_height = 917 * image_ratio; //917
    var img_h = 100;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var h_10 = h * 10 / 100;
}
var index_cols = 5;
if (w > h)
    index_cols = 7;
ratio = w / image_width;
img_h = ratio * image_height;
var openedPages = [];
var store = '';
var cross_proxy = '';
var addon_s_or_k = '';
var is_aya_selected = false;
// Some Test
if (window.localStorage.getItem('selected_reader_name')) {
    selected_reader_name = window.localStorage.getItem('selected_reader_name');
} else { selected_reader_name = 'Taha' }

// alkobra define : (but) open settings
// if (window.localStorage.getItem('switch.json')) {
//     console.log('%c' + 'window.localStorage.getItem("switch.json")', 'color:purple')
//     alkobra = JSON.parse((window.localStorage.getItem('switch.json')));
// } else {
//     var alkobra;
// }

if (!window.localStorage.getItem('selected_reader_s_or_k')) { addon_s_or_k = 'AddonK/'; }
// ---- Global Config : End ---- //

var default_sound_server_shamarly = "http://sound.quraat.info/";
var taha = "Taha/";
var osool = "Osool";//
// var osools ="http://osools.quraat.info/";
// var osoolk ="http://osools.quraat.info/";
var local_intro_s_path="Tayseer/Sound/AddonS";
var local_intro_k_path="Tayseer/Sound/AddonK";
var json_uri = "http://json.quraat.info/";
var data_shamarly = "data/";
var data_shamarly_k = "data_k/";
var data_shamarly_a = "data_a/";
var data_shamarly_b = "data_b/";
var data_shamarly_j = "data_j/";
var data_shamarly_s = "data_s/"; 
var data_madina = "data_m/";
var data_madina_tashabohat="data_m_t/";
var data_shamarly_tashabohat="data_s_t/";
var sh_more_data = "sh_more_data/";
var madina_more_data = "madina_more_data/";
var farshiat_tool_api_url = "http://farshiat.quraat.info/tool_api";
var common_files = "common_files/";
