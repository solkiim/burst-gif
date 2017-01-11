// put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
	// canvas settings
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	// media settings
	var video = document.getElementById('video');
	var mediaConfig = { video: true };
	var errBack = function(e) {
		console.log('An error has occurred!', e)
	};
	
	// jsgif encoder settings
	var encoder = new GIFEncoder();
	encoder.setRepeat(0);	// loop forever
	encoder.setDelay(500);	// go to next frame every 500 milliseconds
	encoder.start();

	// put video listeners into place
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		});
	}
	// legacy code
	else if(navigator.getUserMedia) { 			// standard
		navigator.getUserMedia(mediaConfig, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) {	// webKit-prefixed
		navigator.webkitGetUserMedia(mediaConfig, function(stream){
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	} else if(navigator.mozGetUserMedia) {		// mozilla-prefixed
		navigator.mozGetUserMedia(mediaConfig, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}

	// snap burst trigger
	document.getElementById('snap').addEventListener('click', function() {
		encoder.start();
		
		(function myLoop (i) {
			setTimeout(function() {
				context.drawImage(video, 0, 0, 1024, 768);
				encoder.addFrame(context);	// add to encoder
				if (--i) {
					myLoop(i);      		// decrement i and call myLoop again if i > 0
				} else {
					encoder.finish();		// finish gif
					var binary_gif = encoder.stream().getData() //notice this is different from the as3gif package!
					var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
					window.location = data_url;
				}
			}, 500)
		})(10);
	});
}, false);