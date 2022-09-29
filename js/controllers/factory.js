// ---- Starter Controller ---- //
angular.module('starter.controllers')
    .factory('data_var_transfer_service', function () {
        var default_data_files_uri = "http://json.quraat.info";
        var data_files_uri = default_data_files_uri;
        var old_v = window.localStorage.getItem('data_files_uri');
        if (old_v != 'undefined' && old_v != null)
            data_files_uri = old_v;

        return {
            get_data_files_uri: function () {
                return data_files_uri;
            },
            set_data_files_uri: function (_data_files_uri) {
                window.localStorage.setItem('data_files_uri', _data_files_uri);
                data_files_uri = _data_files_uri;
            },
            set_default: function () {
                window.localStorage.removeItem('data_files_uri');
                data_files_uri = default_data_files_uri
            }
        }
    })
angular.module('starter.controllers')
    // ---- Audio Transfer URL ---- //
    .factory('audio_var_transfer_service', function () {
        var default_audio_files_uri = default_sound_server_shamarly;
        var audio_files_uri = default_audio_files_uri;
        var old_v = window.localStorage.getItem('audio_files_uri');
        if (old_v != 'undefined' && old_v != null)
            audio_files_uri = old_v;
        return {
            get_audio_files_uri: function () {
                return audio_files_uri;
            },
            set_audio_files_uri: function (_audio_files_uri) {
                window.localStorage.setItem('audio_files_uri', _audio_files_uri);
                audio_files_uri = _audio_files_uri;
            },
            set_default: function () {
                window.localStorage.removeItem('audio_files_uri');
                audio_files_uri = default_audio_files_uri;
            }
        }
    })