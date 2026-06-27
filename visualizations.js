function updateOptionA(audioIdx, heartIdx) {
  const diff = Math.abs(audioIdx - heartIdx);
  const fillPct = diff === 0 ? 100 : Math.max(15, 100 - diff * 15);

  const barAudio = document.getElementById("barAudio");
  const barHeart = document.getElementById("barHeart");

  barAudio.style.height = fillPct + "%";
  barAudio.style.background = chakraColor(audioIdx);
  barAudio.style.boxShadow = fillPct === 100
    ? `0 0 20px ${chakraColor(audioIdx, 0.8)}`
    : "none";

  barHeart.style.height = fillPct + "%";
  barHeart.style.background = chakraColor(heartIdx);
  barHeart.style.boxShadow = fillPct === 100
    ? `0 0 20px ${chakraColor(heartIdx, 0.8)}`
    : "none";
}

function updateOptionB(audioIdx, heartIdx) {
  const closeness = chakraCloseness(audioIdx, heartIdx);
  const alpha = 0.4 + closeness * 0.6;
  const glowSize = Math.round(closeness * closeness * 40);

  const brightAudio = document.getElementById("brightAudio");
  const brightHeart = document.getElementById("brightHeart");

  brightAudio.style.background = chakraColor(audioIdx, alpha);
  brightHeart.style.background = chakraColor(heartIdx, alpha);

  if (closeness > 0.5) {
    brightAudio.style.boxShadow = `0 0 ${glowSize}px ${chakraColor(audioIdx, closeness * 0.7)}, inset 0 0 ${glowSize / 2}px ${chakraColor(audioIdx, closeness * 0.3)}`;
    brightHeart.style.boxShadow = `0 0 ${glowSize}px ${chakraColor(heartIdx, closeness * 0.7)}, inset 0 0 ${glowSize / 2}px ${chakraColor(heartIdx, closeness * 0.3)}`;
  } else {
    brightAudio.style.boxShadow = "none";
    brightHeart.style.boxShadow = "none";
  }
}

function updateOptionC(audioIdx, heartIdx) {
  const tableAudio = document.getElementById("tableAudio");
  const arcHeart = document.getElementById("arcHeart");

  tableAudio.style.background = chakraColor(audioIdx, 0.9);
  tableAudio.style.boxShadow = `0 0 20px ${chakraColor(audioIdx, 0.4)}`;

  arcHeart.style.borderColor = chakraColor(heartIdx, 0.9);
  arcHeart.style.boxShadow = `0 0 15px ${chakraColor(heartIdx, 0.4)}, inset 0 0 15px ${chakraColor(heartIdx, 0.2)}`;
}
