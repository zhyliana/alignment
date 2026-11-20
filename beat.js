// Shared beat clock. Every beat reads the Heart slider, so tempo changes land
// on the next beat, and drives the sound and the visuals from the same tick.
let beatTimer = null;

function runBeat() {
  const bpm = parseInt(document.getElementById("heartSlider").value);
  const beatSeconds = 60 / bpm;
  pulseHeartbeatAudio(beatSeconds);
  flashVisuals(beatSeconds);
  beatTimer = setTimeout(runBeat, beatSeconds * 1000);
}

function restartBeat() {
  if (beatTimer) clearTimeout(beatTimer);
  runBeat();
}
