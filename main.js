const audioSlider = document.getElementById("audioSlider");
const heartSlider = document.getElementById("heartSlider");
const audioValueEl = document.getElementById("audioValue");
const heartValueEl = document.getElementById("heartValue");
const audioChakraEl = document.getElementById("audioChakra");
const heartChakraEl = document.getElementById("heartChakra");

function update() {
  const hz = parseInt(audioSlider.value);
  const bpm = parseInt(heartSlider.value);

  audioValueEl.textContent = hz + " Hz";
  heartValueEl.textContent = bpm + " BPM";

  const audioIdx = getChakraIndex(hz, "audio");
  const heartIdx = getChakraIndex(bpm, "heart");

  audioChakraEl.textContent = COLOR_NAMES[audioIdx] + " — " + CHAKRAS[audioIdx].name;
  audioChakraEl.style.color = chakraColor(audioIdx);
  heartChakraEl.textContent = COLOR_NAMES[heartIdx] + " — " + CHAKRAS[heartIdx].name;
  heartChakraEl.style.color = chakraColor(heartIdx);

  updateOptionA(audioIdx, heartIdx);
  updateOptionB(audioIdx, heartIdx);
  updateOptionC(audioIdx, heartIdx);
  updateToneFrequency(hz);
}

function buildLegend() {
  const legend = document.getElementById("chakraLegend");
  CHAKRAS.forEach((chakra, i) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    const dot = document.createElement("div");
    dot.className = "legend-dot";
    dot.style.background = chakraColor(i);
    const label = document.createTextNode(chakra.name);
    item.appendChild(dot);
    item.appendChild(label);
    legend.appendChild(item);
  });
}

document.getElementById("audioToggle").addEventListener("click", toggleAudioTone);
document.getElementById("heartToggle").addEventListener("click", toggleHeartbeat);
audioSlider.addEventListener("input", update);
heartSlider.addEventListener("input", update);

buildLegend();
update();
