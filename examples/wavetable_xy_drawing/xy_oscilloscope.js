// https://codepen.io/Codepixl/pen/bqWvGO

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var audio, audioContext, analyserl, analyserr, sourceNode, dataArrayl, dataArrayr, bufferLength, splitter, size;

const fps = 120;

audio = new Audio();
audio.crossOrigin = "anonymous";
audio.src = 'http://codepixl.net/codepen/oscilloscope.mp3';
audio.addEventListener("canplay", function(e) {
	setup();
}, false);

function setup() {
	audioContext = new AudioContext();
	splitter = audioContext.createChannelSplitter();

	analyserl = audioContext.createAnalyser();
	analyserl.smoothingTimeConstant = 0.7;

	analyserr = audioContext.createAnalyser();
	analyserr.smoothingTimeConstant = 0.7;

	sourceNode = audioContext.createMediaElementSource(audio);
	sourceNode.connect(splitter);
	sourceNode.connect(audioContext.destination);

	splitter.connect(analyserl,0,0);
    splitter.connect(analyserr,1,0);

	audio.play();
	analyserl.fftSize = 4096;
	analyserr.fftSize = 4096;
	bufferLength = analyserl.fftSize;
	dataArrayl = new Float32Array(bufferLength);
	dataArrayr = new Float32Array(bufferLength);
	draw();
}

function draw() {
	setTimeout(function(){
		requestAnimationFrame(draw);
		analyserl.getFloatTimeDomainData(dataArrayl);
		analyserr.getFloatTimeDomainData(dataArrayr);
		ctx.fillStyle = 'rgba(0,0,0,0.7)'
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(-(dataArrayl[0]+1)*size/2+size/2+canvas.width/2, -(dataArrayr[0]+1)*size/2+size);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(50,230,50,0.3)";
		for (var i = 0; i < dataArrayl.length; i++) {
			ctx.lineTo(-(dataArrayl[i]+1)*size/2+size/2+canvas.width/2, -(dataArrayr[i]+1)*size/2+size);
		}
		ctx.stroke();
	},1000/fps);
}

window.onresize = function(){
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if(canvas.width > canvas.height) size = canvas.height;
	else size = canvas.width;
}
window.onresize();
