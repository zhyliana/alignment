const CHAKRAS = [
  { name: "Root",         color: [255, 0, 0],   hzMin: 20,  hzMax: 35,  bpmMin: 40,  bpmMax: 51 },
  { name: "Sacral",       color: [255, 119, 0], hzMin: 35,  hzMax: 50,  bpmMin: 52,  bpmMax: 63 },
  { name: "Solar Plexus", color: [255, 221, 0], hzMin: 50,  hzMax: 70,  bpmMin: 64,  bpmMax: 74 },
  { name: "Heart",        color: [0, 204, 68],  hzMin: 70,  hzMax: 100, bpmMin: 75,  bpmMax: 86 },
  { name: "Throat",       color: [0, 136, 255], hzMin: 100, hzMax: 140, bpmMin: 87,  bpmMax: 97 },
  { name: "Third Eye",    color: [68, 0, 204],  hzMin: 140, hzMax: 190, bpmMin: 98,  bpmMax: 109 },
  { name: "Crown",        color: [136, 0, 255], hzMin: 190, hzMax: 250, bpmMin: 110, bpmMax: 120 },
];

const COLOR_NAMES = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];

function getChakraIndex(value, type) {
  const minKey = type === "audio" ? "hzMin" : "bpmMin";
  const maxKey = type === "audio" ? "hzMax" : "bpmMax";
  for (let i = 0; i < CHAKRAS.length; i++) {
    if (value >= CHAKRAS[i][minKey] && value <= CHAKRAS[i][maxKey]) return i;
  }
  return CHAKRAS.length - 1;
}

function chakraColor(idx, alpha = 1) {
  const [r, g, b] = CHAKRAS[idx].color;
  return `rgba(${r},${g},${b},${alpha})`;
}

function chakraCloseness(audioIdx, heartIdx) {
  return 1 - Math.abs(audioIdx - heartIdx) / 6;
}
