/**
 *  Set custom waveTable
 *  Drag mouse to set wavetable
 *  Press any key to hear sound
 */

var wave, wt = [];

function setup() {
  createCanvas(400, 400);
  wave = new p5.Oscillator(180, 'custom');
  for(var i=0; i<512;i++){
  	wt.push(random(-1, 1));
    // wt.push(sin(i*.01));
  }
  wave.setWaveTable(wt);
}

function draw(){
  background(0);
  text('drag mouse, press key to play freq based on keyCode\n'+wave.getFreq(), 20, 20);
  noFill();
  stroke(255);
  
  beginShape();
  for(var i=0; i<wt.length;i++){
    var x = map(i, 0, wt.length, 0, width);
    var y = map(wt[i],-1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}

function mousePressed(){
  wt = [];
}

function mouseDragged(){
  wt.push(map(mouseY, 0, height, -1, 1))
}

function mouseReleased(){
  wave.setWaveTable(wt);
}

function keyPressed() {
  wave.freq(keyCode);
  wave.start();
}

function keyReleased() {
  wave.stop();
}
