/**
 *  Set custom waveTable
 *  Drag mouse to set wavetable
 *  Press any key to hear sound
 */

var wx, wy, wtx = [], wty = [], wmode = 0, isPlaying = false;

function setup() {
  createCanvas(400, 400);
  wx = new p5.Oscillator(120, 'custom');
  wy = new p5.Oscillator(120, 'custom');
  for(var i=0; i<512;i++){
     wtx.push(sin(i*.05));
     wty.push(cos(i*.05));
  }
  wx.setWaveTable(wtx);
  wx.pan(-1);
  wy.setWaveTable(wty);
  wy.pan(1);
}

function draw(){
  background(0);
  text('drag mouse, press key to play freq based on keyCode\n'+wx.getFreq(), 20, 20);
  noFill();
  
  stroke(0, 0, 255);
  beginShape();
  for(var i=0; i < wtx.length; i++){
    var x = map(i, 0, wtx.length, 0, width);
    var wxa = height * .25 + (height * .25 * wtx[i]);
    vertex(x, wxa);
  }
  endShape();

  stroke(255, 0, 0);
  beginShape();
  for(var i=0; i < wty.length; i++){
    var x = map(i, 0, wty.length, 0, width);
    var wya = height * .75 + (height * .25 * wty[i]);
    vertex(x, wya);
  }
  endShape();
}

function mousePressed(){
  if(mouseY < height*.5){
    wx.stop();
    wtx = [];
    wmode = 0;
  }else{
    wy.stop();
    wty = [];
    wmode = 1;
  }
}

function mouseDragged(){
  if(wmode == 0){
    wtx.push(constrain(map(mouseY, 0, height*.5, -1, 1), -1, 1));  
  }else{
    wty.push(constrain(map(mouseY, height*.5, height, -1, 1), -1, 1));
  }
  
}

function mouseReleased(){
  if(wmode == 0){
    wx.setWaveTable(wtx);
    wx.start();
  }else{
    wy.setWaveTable(wty);
    wy.start();
  }
}

function keyPressed() {
  if(keyCode == 32){
    // if(!isPlaying){
    //   wx.start();
    //   wy.start();
    //   isPlaying = true;
    // }else{
    //   wx.stop();
    //   wy.stop();
    //   isPlaying = false
    // }
  }else{
    wx.freq(keyCode);
    wy.freq(keyCode);
  }
}

// function keyReleased() {
//   if(keyCode == 32){
//     wx.stop();
//     wy.stop();
//   }
// }
