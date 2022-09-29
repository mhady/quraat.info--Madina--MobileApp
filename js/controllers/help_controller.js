// ---- Starter Controller ---- //
angular.module('starter.controllers')
    .controller(quraat_name + 'helpCtrl', function ($scope, $rootScope, $state, $ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(false)


        $scope.$on('$ionicView.enter', function () {
            $rootScope.$broadcast('autoscrollpause', true);
            $scope.opened = true;
            $(".helpimg").css('display', "none"); // hide all 
            $("#the-help_img_0").css('display', "block");
            
            console.log('help Opened!');

            // $rootScope.$broadcast('autoscrollplay', true);
            // $scope.autoscroll();
        })

        $scope.close_help = function ( ) {
            no_imgs=$('.helpimg').length;
            for(i=0;i<no_imgs ;i++){
                if($("#the-help_img_"+i).is(":visible"))
                {
                    if(i==(no_imgs-1)){
                        //close
                        var mvp = document.getElementById('viewport_to_scal');
                        mvp.setAttribute('content', "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width");
        
        
                        $state.go('quraat');
                        console.log('help closed!');
                        break;
                    }
                    else
                    {
                        $(".helpimg").css('display', "none"); // hide all 
                        $("#the-help_img_"+(i+1)).css('display', "block");
                        break;

                    }
                }
            }
           
        }

    })