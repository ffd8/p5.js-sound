/**
 *  Set custom waveTable
 *  Draw XY shape (for oscilloscope)
 */

var wx, wy, wtx = [], wty = [], c = [], isPlaying = false, fft, fftBands = 1024, waveform = [];
var audio, audioContext, analyserl, analyserr, sourceNode, dataArrayl, dataArrayr, bufferLength, splitter;


function setup() {
  createCanvas(800, 400);
  setupWaves();
  audioContext = p5.soundOut.audiocontext;
  splitter = audioContext.createChannelSplitter(2);

  analyserl = audioContext.createAnalyser();
  analyserl.smoothingTimeConstant = 0.7;

  analyserr = audioContext.createAnalyser();
  analyserr.smoothingTimeConstant = 0.7;

  // sourceNode = audioContext.createMediaElementSource(p5.soundOut);
  // sourceNode.connect(splitter);
  // sourceNode.connect(audioContext.destination);

  // audioContext.destination.connect(splitter);
  // audioContext.destination.connect(audioContext.destination);
  print(audioContext) 
  splitter.connect(analyserl,0,0);
  splitter.connect(analyserr,1,0);
  analyserl.fftSize = fftBands;
  analyserr.fftSize = fftBands;
  bufferLength = analyserl.fftSize;
  dataArrayl = new Float32Array(bufferLength);
  dataArrayr = new Float32Array(bufferLength);

  // print(p5.soundOut);
  // fft = new p5.FFT(.99, fftBands);
}

function draw(){
  background(0);
  noStroke();
  fill(255);
  text('draw with mouse, press key to change freq based on keyCode\n'+wx.getFreq(), 20, 20);
  text('XY Oscilloscope preview', width/2+20, 20);
  noFill();

  stroke(255);
  strokeWeight(5);
  line(width/2, 0, width/2, height);
  strokeWeight(2);
  // draw L/X channel
  stroke(0, 0, 255);
  beginShape();
  for(var i=0; i < wtx.length; i++){
    var x = map(i, 0, wtx.length, 0, width/2);
    var wxa = height * .25 + (height * .25 * wtx[i]);
    vertex(x, wxa);
  }
  endShape();

  // draw R/Y channel
  stroke(255, 0, 0);
  beginShape();
  for(var i=0; i < wty.length; i++){
    var x = map(i, 0, wty.length, 0, width/2);
    var wya = height * .75 + (height * .25 * wty[i]);
    vertex(x, wya);
  }
  endShape();

  // draw path
  stroke(255);
  beginShape();
  for(var i=0; i < c.length; i++){
    vertex(c[i].x, c[i].y);
  }
  endShape();

  // waveform = fft.waveform();
  analyserl.getFloatTimeDomainData(dataArrayl);
  analyserr.getFloatTimeDomainData(dataArrayr);

  stroke(255);
  beginShape();
  // for (var i = 0; i < dataArrayl.length; i++) {
  //     vertex(-(dataArrayl[i]+1)*width/2+width/2+width/2, -(dataArrayr[i]+1)*width/2+width);
  //   }
  // print(analyserl.context.destination);
  for (var i = 0; i< dataArrayl.length; i++){
    //let x = map(i, 0, waveform.length, width/2, width);
    //vertex(x, map(waveform[i], -1, 1, height, 0) );
    // print(dataArrayl[0]);
    vertex(width/2+(dataArrayl[i]+1)*width, (dataArrayr[i]+1)*width);
  }
  endShape();
}

function mousePressed(){
  wtx = [];
  wty = [];
  c = [];
}

function mouseDragged(){
  var mouseXHalf = constrain(mouseX, 0, width/2);
  wtx.push(map(mouseXHalf, 0, width/2, 0, 1));  
  wty.push(map(mouseY, 0, height, 1, 0));  
  c.push(createVector(mouseXHalf, mouseY));
}

function mouseReleased(){
  setupWaves(wx.getFreq());    
}

function setupWaves(fr){
  var fr = 120 || fr;
  wx = new p5.Oscillator(fr, 'custom');
  wy = new p5.Oscillator(fr, 'custom');
  wx.pan(-1.0);
  wy.pan(1.0);
  wx.setWaveTable(wtx);
  wy.setWaveTable(wty);
}

function keyPressed() {
  if(keyCode == 32){
    wtx = [];
    wty = [];
    c = [];
  }else{
    wx.freq(keyCode+0.0);
    wy.freq(keyCode+0.0);
  }
}

function drawScope(){

}