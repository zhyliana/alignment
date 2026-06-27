let audioCtx = null;
let toneOsc = null;
let toneGain = null;
let toneActive = false;
let heartbeatActive = false;
let heartbeatInterval = null;

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
}

function toggleHeartbeat() {
  const toggle = document.getElementById("heartToggle");
  if (heartbeatActive) {
    heartbeatActive = false;
    if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
    toggle.textContent = "Click for heartbeat";
    toggle.classList.remove("active");
  } else {
    heartbeatActive = true;
    toggle.textContent = "Heartbeat playing";
    toggle.classList.add("active");
    startHeartbeat();
  }
}

function playHeartbeatPulse() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 60;
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.5, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.value = 40;
  gain2.gain.setValueAtTime(0, now + 0.1);
  gain2.gain.linearRampToValueAtTime(0.35, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.3);
}

function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  const bpm = parseInt(document.getElementById("heartSlider").value);
  const intervalMs = (60 / bpm) * 1000;
  playHeartbeatPulse();
  heartbeatInterval = setInterval(() => {
    if (heartbeatActive) playHeartbeatPulse();
  }, intervalMs);
}

function updateHeartbeatRate() {
  if (heartbeatActive) startHeartbeat();
}
