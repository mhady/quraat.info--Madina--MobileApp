angular.module('starter.controllers')

    .controller('audio_Ctrl', ['$scope', '$http', function ($scope) {

        console.log('audio_Ctrl');
        var audio = document.getElementById('audio'); // id for audio element
        var ayah_option_audio_player = document.getElementById('audio'); // id for audio elemen
        var duration = audio.duration; // Duration of audio clip, calculated here for embedding purposes
        var pButton = document.getElementById('pButton'); // play button
        var pButton_intro = document.getElementById('aya__intro_icon'); // play button
        var playhead = document.getElementById('playhead'); // playhead
        var timeline = document.getElementById('timeline'); // timeline
        var timeline_position = document.getElementById('timeline-position');
        var timeline_current_position = document.getElementById('timeline-current-position');
        // timeline width adjusted for playhead
        var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        var audio_bitrate = 56; /*ios only*/

        $scope.$on('init_audio_controller', function () {
            audio = document.getElementById('audio');
            duration = audio.duration; // Duration of audio clip, calculated here for embedding purposes
            timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
            playhead.style.marginLeft = "0px";
            audio_bitrate = 56; /*ios only*/
            // audio.currentTime=0;
            timeline_position.innerHTML = '-' + (Math.ceil(0) + "").toHHMMSS();
            timeline_current_position.innerHTML = (Math.ceil(0) + "").toHHMMSS();

        })

        // play button event listenter
        pButton.addEventListener("click", play);
        pButton_intro.addEventListener("click", play);

        // timeupdate event listener
        audio.addEventListener("timeupdate", timeUpdate, false);

        // makes timeline clickable
        timeline.addEventListener("click", function (event) {
            moveplayhead(event);
            audio.currentTime = duration * clickPercent(event);
        }, false);

        // returns click as decimal (.77) of the total timelineWidth
        function clickPercent(event) {
            if (event.clientX == undefined)
                return (event.changedTouches[0].clientX - getPosition(timeline)) / timelineWidth;
            else
                return (event.clientX - getPosition(timeline)) / timelineWidth;
        }

        // makes playhead draggable
        playhead.addEventListener('mousedown', mouseDown, false);
        playhead.addEventListener('touchstart', mouseDown, false);

        window.addEventListener('mouseup', mouseUp, false);
        window.addEventListener('touchend', mouseUp, false);

        // Boolean value so that audio position is updated only when the playhead is released
        var onplayhead = false;

        // mouseDown EventListener
        function mouseDown() {
            onplayhead = true;
            window.addEventListener('mousemove', moveplayhead, true);
            window.addEventListener('touchmove', moveplayhead, true);

            audio.removeEventListener('timeupdate', timeUpdate, false);
        }

        // mouseUp EventListener
        // getting input from all mouse clicks
        function mouseUp(event) {
            if (onplayhead == true) {
                moveplayhead(event);
                window.removeEventListener('mousemove', moveplayhead, true);
                window.removeEventListener('touchmove', moveplayhead, true);
                // change current time
                console.log(clickPercent(event));
                audio.currentTime = parseFloat(duration * clickPercent(event));
                audio.addEventListener('timeupdate', timeUpdate, false);
            }
            onplayhead = false;
        }
        // mousemove EventListener
        // Moves playhead as user drags
        function moveplayhead(event) {
            //if(	)
            var newMargLeft
            if (event.clientX == undefined)
                newMargLeft = event.changedTouches[0].clientX - getPosition(timeline);
            else
                newMargLeft = event.clientX - getPosition(timeline);

            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                playhead.style.marginLeft = newMargLeft + "px";
            }
            if (newMargLeft < 0) {
                playhead.style.marginLeft = "0px";
            }
            if (newMargLeft > timelineWidth) {
                playhead.style.marginLeft = timelineWidth + "px";
            }
        }
        String.prototype.toHHMMSS = function () {
            if (isNaN(this)) return '00:00';
            var sec_num = parseInt(this, 10); // don't forget the second param

            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            //if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            //  return hours+':'+minutes+':'+seconds;
            return minutes + ':' + seconds;
        }
        // timeUpdate
        // Synchronizes playhead position with current point in audio

        function timeUpdate() {
            if (!audio.readyState) {
                console.log('loading ....');
            }


            if (isNaN(audio.duration)) return;
            //duration = audio.duration; 
            if (duration != 0) {
                /*ios only*/
                //if(duration<audio.currentTime){if(audio_bitrate==56){duration= audio.duration*1.75 ;audio_bitrate=33;}}
                //if(duration<audio.currentTime){if(audio_bitrate==33){duration= audio.duration*2.54 ;audio_bitrate=22;}}
                // duration= audio.duration*1.75;
                var playPercent = timelineWidth * (audio.currentTime / duration);
                var trackmills = Math.abs(duration - audio.currentTime);
                //var trackmills = audio.currentTime; /*ios only*/

                timeline_position.innerHTML = '-' + (Math.ceil(trackmills) + "").toHHMMSS();
                timeline_current_position.innerHTML = (Math.ceil(audio.currentTime) + "").toHHMMSS();
            } else {
                duration = 300;
                var playPercent = timelineWidth * (audio.currentTime / duration);
                var trackmills = audio.currentTime;
                timeline_position.innerHTML = (Math.ceil(trackmills) + "").toHHMMSS();
                timeline_current_position.innerHTML = (Math.ceil(audio.currentTime) + "").toHHMMSS();
            }

            if (playPercent > timelineWidth)
                playPercent = timelineWidth;
            playhead.style.marginLeft = playPercent + "px";
            if (audio.currentTime == duration) {
                pButton.className = "";
                //   pButton.className = "play";
            }
        }

        function stopPlay() {
            audio.pause();
        }
        //Play and Pause
        function play() {
            duration = audio.duration;
            console.log('plaaaay');
            // start audio
            if (audio.paused) {
                //   audio.play();
                // remove play, add pause
                pButton.className = "";
                //   pButton.className = "pause";
            } else { // pause audio
                // audio.pause();
                // remove pause, add play
                pButton.className = "";
                //  pButton.className = "play";
            }
            //	 audio = document.getElementById("audio");

        }

        audio.addEventListener("loadedmetadata", function (_event) {
            duration = audio.duration;
            console.log('duration=', duration);

        });

        audio.addEventListener('durationchange', function (e) {
            duration = e.target.duration;
            console.log(e.target.duration); //FIRST 0, THEN REAL DURATION
        });

        // Gets audio file duration
        audio.addEventListener("canplaythrough", function () {
            duration = audio.duration;
        }, false);

        // getPosition
        // Returns elements left position relative to top-left of viewport
        function getPosition(el) {
            return el.getBoundingClientRect().left;
        }


    }])