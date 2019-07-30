'use strict';

define(function (require) {
  var p5sound = require('master');

  // var Add = require('Tone/signal/Add');
  // var Mult = require('Tone/signal/Multiply');
  // var Scale = require('Tone/signal/Scale');

  // https://github.com/micknoise/Maxim/blob/master/JavaScriptTemplate/maxim.js
  p5.waveSynth = function() {
    var that = this;
    this.phase = 0;
    this.sample_rate = 44100;
    this.context = p5sound.audiocontext;
    // this.node = this.context.createScriptProcessor(512, 2, 2);
    // this.node.onaudioprocess = function(audioContext) { 
    //   that.process(audioContext)
    //   };

    // https://medium.com/web-audio/you-dont-need-that-scriptprocessor-61a836e28b42
    // this.node = this.context.createBufferSource();
    // this.buffer = this.context.createBuffer(1, 4096, this.context.sampleRate);
    // this.wave = this.buffer.getChannelData(0);

    // for (var i = 0; i < 4096; i++) {
    //  this.wave[i] = 0;
    //  if(i%15==0){
    //   this.wave[i] = .5;
    //  }
    // }
    // this.node.buffer = this.buffer;
    // this.node.loop = true;
    // this.node.connect(this.context.destination);
    // this.node.start(0);
    this.waveFormSize = 512;
    this.real = new Array(this.waveFormSize);
    this.imag = new Array(this.waveFormSize);
    for(var i=0; i<this.real.length;i++){
      this.real[i] = Math.random();
      this.imag[i] = Math.random();
    }
    this.wave = this.context.createPeriodicWave(this.real, this.imag);
    this.osc = this.context.createOscillator();
    this.osc.setPeriodicWave(this.wave);
    this.osc.frequency.value = 80.0;
    // this.osc.loop = true;
    

    this.amplitude = 1.0;
    this.gainNode = this.context.createGain();
    this.delayGain = this.context.createGain();
    this.filter = this.context.createBiquadFilter();
    this.delay = this.context.createDelay(2);
    this.delayAmt = 0.75;
    this.delayGain.gain.value = 0.75;
    this.filter.type = "lowpass";
    this.envTime = 1.0;
    this.isPlaying = false;
    // this.wave = new Array(this.waveFormSize);

    // for (var i = 0; i < this.waveFormSize + 1 ; i++) {

    //   this.wave[i]=Math.sin(i/(this.waveFormSize-2) * (Math.PI * 2));
    // }
  }

  p5.waveSynth.prototype.waveTableSize = function(size) {
    this.waveFormSize=size;
  }

  p5.waveSynth.prototype.loadWaveTable = function(waveTable) {
    for (var i = 0; i < this.waveFormSize ; i++) {
      this.wave[i] = waveTable[i];
    }
    //  alert("all done");
  }


  //This function is the waveform generator's buffer method
  //Hack here to create new waveforms
  p5.waveSynth.prototype.process = function(audioContext) {
    var data = audioContext.outputBuffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
      var remainder;
      this.phase += (this.waveFormSize-2) / (this.sample_rate / this.frequency);
      if (this.phase >= (this.waveFormSize-3) ) this.phase -= (this.waveFormSize-2) ;
      remainder = this.phase - Math.floor(this.phase);
      data[i]=(1-remainder) * this.wave[1+Math.floor(this.phase)] + remainder * this.wave[2+Math.floor(this.phase)];
    } 
    //  console.log('data = ' + this.frequency);
  }

  //This function allows you to 'play' the waveform
  p5.waveSynth.prototype.play = function() {

    
    this.node.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    // this.gainNode.connect(this.delay);
    // this.delay.connect(this.delayGain);
    // this.delayGain.connect(this.delay);
    // this.delay.connect(this.context.destination);
    this.osc.connect(this.context.destination);
    this.osc.start();
    this.isPlaying=true;
  }

  //This function allows you to set the frequency of the waveform
  p5.waveSynth.prototype.setFrequency = function(frequency) {
    this.frequency = frequency;
  }

  //This function allows you to set the amplitude of the waveform
  p5.waveSynth.prototype.setAmplitude = function(amplitude) {

    this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(this.gainNode.gain.value, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(amplitude, this.context.currentTime + 10);
  }

  p5.waveSynth.prototype.ramp = function(amplitude, envTime) {

    this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(this.gainNode.gain.value, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(amplitude, this.context.currentTime + envTime/1000.);
  }

  //This allows us to stop the waveform generator
  p5.waveSynth.prototype.stop = function() {
    this.osc.disconnect();
    this.osc.stop(this.context.currentTime + 1);
    this.isPlaying=false;
  }

  p5.waveSynth.prototype.setDelayTime = function(t) {
    this.delay.delayTime.value = t;
  }

  p5.waveSynth.prototype.setDelayAmount = function(t) {
    this.delayGain.gain.value = t;

    //  this.delayGain.gain.cancelScheduledValues(context.currentTime);
    //  this.delayGain.gain.linearRampToValueAtTime(this.delayGain.gain.value, context.currentTime);
    //  this.delayGain.gain.linearRampToValueAtTime(this.delayGain.gain.value, context.currentTime,100);
  }

  p5.waveSynth.prototype.setFilter = function(freq, res) {
    this.filter.frequency.value = freq;
    this.filter.Q.value = res;
  }

  p5.waveSynth.prototype.filterRamp = function(freq, envTime) {
    this.filter.frequency.cancelScheduledValues(this.context.currentTime);
    this.filter.frequency.linearRampToValueAtTime(this.filter.frequency.value, this.context.currentTime);   // THIS IS THE CHANGE FROM PREVIOUS CODE EXAMPLE
    this.filter.frequency.linearRampToValueAtTime(freq, this.context.currentTime + envTime/1000.);
    //  this.filter.frequency.value = freq;
    //  this.filter.Q.value = res;
  }

});
