// ---- Starter Controller ---- //
angular.module('starter.controllers')
    // ---- About Controller ---- //
    .controller('quraataboutCtrl', function ($scope, $rootScope, $state, $ionicSideMenuDelegate, data_var_transfer_service, audio_var_transfer_service) {

        $ionicSideMenuDelegate.canDragContent(false)

        $scope.$on('$ionicView.enter', function () { $rootScope.$broadcast('autoscrollpause', true); })
        $scope.backtop = function () { $('#aboutquraat').offset({ top: 0, left: 0 }) }
        $scope.slideto = function (id) {
            var pos = -$('#' + id).offset().top;
            $('#aboutquraat').offset({ top: pos, left: 0 })
        }

        $scope.opend_file_seeting_times = 0;

        $scope.opend_file_seeting = function () {
            $scope.opend_file_seeting_times++;
            if ($scope.opend_file_seeting_times % 7 == 0) {

                $('#file_setting').html('<div>  AUDIO file : <input id="audio_file_setting" value="' + audio_var_transfer_service.get_audio_files_uri() + '" ><br><button id="f_setting_save" > Save</buttton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <button id="default_setting_save">default</button> <button id="cancel_setting_save">cancel</button></div>');
                $('#file_setting').css('display', 'block');

                var cancel_setting_save = document.getElementById("cancel_setting_save");
                cancel_setting_save.addEventListener("click", function () {
                    $('#file_setting').css('display', 'none');
                });

                var f_setting_save = document.getElementById("f_setting_save");
                f_setting_save.addEventListener("click", function () {
                    D_file = $("#data_file_setting").val();
                    A_file = $("#audio_file_setting").val();

                    data_var_transfer_service.set_data_files_uri(D_file);
                    audio_var_transfer_service.set_audio_files_uri(A_file);

                    $('#file_setting').css('display', 'none');
                });


                var default_setting_save = document.getElementById("default_setting_save");
                default_setting_save.addEventListener("click", function () {
                    audio_var_transfer_service.set_default();
                    data_var_transfer_service.set_default();
                    $('#file_setting').css('display', 'none');
                });
                console.log("$scope.opend_file_seeting ..");
            }

        }
        $scope.close_about = function () {
            $scope.opened = false;
            $state.go('quraat');
        }

    })