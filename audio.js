let audioCtx = null;
let toneOsc = null;
let toneGain = null;
let toneActive = false;
let heartbeatActive = false;
let heartOsc = null;
let heartGain = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function toggleAudioTone() {
  const toggle = document.getElementById("audioToggle");
  if (toneActive) {
    toneActive = false;
    if (toneOsc) { toneOsc.stop(); toneOsc = null; }
    if (toneGain) { toneGain.disconnect(); toneGain = null; }
    toggle.textContent = "Click for tone";
    toggle.classList.remove("active");
  } else {
    toneActive = true;
    const ctx = getAudioCtx();
    toneGain = ctx.createGain();
    toneGain.gain.value = 0.3;
    toneGain.connect(ctx.destination);
    toneOsc = ctx.createOscillator();
    toneOsc.type = "sine";
    toneOsc.frequency.value = parseInt(document.getElementById("audioSlider").value);
    toneOsc.connect(toneGain);
    toneOsc.start();
    toggle.textContent = "Tone playing";
    toggle.classList.add("active");
  }
}

function updateToneFrequency(hz) {
  if (toneActive && toneOsc) {
    toneOsc.frequency.setTargetAtTime(hz, getAudioCtx().currentTime, 0.02);
  }
  if (heartOsc) {
    heartOsc.frequency.setTargetAtTime(hz, getAudioCtx().currentTime, 0.02);
  }
}

// Heartbeat: the bass tone runs continuously and its volume swells once per
// beat, a soft rise followed by a long fade, so there is no hard on/off edge.
const HEART_PEAK = 0.35;
const HEART_FLOOR = 0.03;
// Fraction of a beat spent rising to the peak, shared with the visual flash.
const BEAT_RISE = 0.2;

function toggleHeartbeat() {
  const toggle = document.getElementById("heartToggle");
  if (heartbeatActive) {
    heartbeatActive = false;
    stopHeartbeat();
    toggle.textContent = "Click for heartbeat";
    toggle.classList.remove("active");
  } else {
    heartbeatActive = true;
    toggle.textContent = "Heartbeat playing";
    toggle.classList.add("active");
    startHeartbeat();
  }
}

function startHeartbeat() {
  const ctx = getAudioCtx();
  heartGain = ctx.createGain();
  heartGain.gain.value = 0;
  heartGain.connect(ctx.destination);
  heartOsc = ctx.createOscillator();
  heartOsc.type = "sine";
  heartOsc.frequency.value = parseInt(document.getElementById("audioSlider").value);
  heartOsc.connect(heartGain);
  heartOsc.start();
  restartBeat();
}

// Swell for one beat. Called by the beat clock in beat.js on every beat.
function pulseHeartbeatAudio(beatSeconds) {
  if (!heartbeatActive || !heartGain) return;
  const now = getAudioCtx().currentTime;
  const rise = beatSeconds * BEAT_RISE;

  heartGain.gain.setTargetAtTime(HEART_PEAK, now, rise / 3);
  heartGain.gain.setTargetAtTime(HEART_FLOOR, now + rise, beatSeconds * 0.2);
}

function stopHeartbeat() {
  if (!heartOsc) return;
  const ctx = getAudioCtx();
  const osc = heartOsc;
  const gain = heartGain;
  heartOsc = null;
  heartGain = null;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  osc.stop(ctx.currentTime + 0.4);
  osc.onended = () => gain.disconnect();
}
