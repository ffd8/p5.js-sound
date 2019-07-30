/**
 *  Play a random note
 *  every time you press a key
 */

var waveSynth;

function setup() {
  waveSynth = new p5.waveSynth(440);
  waveSynth.waveTableSize(512);
  var wt = [];
  for(var i=0; i<512;i++){
  	wt.push(random(-1, 1));
  }
  waveSynth.loadWaveTable(wt);

  createCanvas(400, 400);
  text('press to play a random note at a random velocity', 20, 20);
}

function mousePressed() {
  // pick a random midi note
  //var midiVal = midiToFreq(round( random(50,72) ));
  //monoSynth.triggerAttack(midiVal, random() );
  waveSynth.play();
}

function mouseReleased() {
  //monoSynth.triggerRelease();
  waveSynth.stop();
}
