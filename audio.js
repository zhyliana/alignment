let audioCtx = null;
let toneOsc = null;
let toneGain = null;
let toneActive = false;
let heartbeatActive = false;
let heartbeatTimer = null;
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
  scheduleHeartbeatPulse();
}

// Swell for one beat, then queue the next. The BPM is read fresh every beat,
// so tempo changes land on the next beat without retriggering the swell.
function scheduleHeartbeatPulse() {
  if (!heartbeatActive || !heartGain) return;
  const bpm = parseInt(document.getElementById("heartSlider").value);
  const beatSeconds = 60 / bpm;
  const now = getAudioCtx().currentTime;
  const rise = beatSeconds * 0.2;

  heartGain.gain.setTargetAtTime(HEART_PEAK, now, rise / 3);
  heartGain.gain.setTargetAtTime(HEART_FLOOR, now + rise, beatSeconds * 0.2);

  heartbeatTimer = setTimeout(scheduleHeartbeatPulse, beatSeconds * 1000);
}

function stopHeartbeat() {
  if (heartbeatTimer) { clearTimeout(heartbeatTimer); heartbeatTimer = null; }
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
