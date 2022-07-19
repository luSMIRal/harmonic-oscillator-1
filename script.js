const spring = document.getElementById("spring");
const springLeft = document.getElementsByClassName("spring-element--left");
const springRight = document.getElementsByClassName("spring-element--right");
const ball = document.getElementById("ball");
const playBtn = document.getElementById("btn-play");
const time = document.getElementById("time");
const params = {
  m: document.getElementById("param-m"),
  k: document.getElementById("param-k"),
  x0: document.getElementById("param-x0"),
};
const answers = {
  wavering: document.getElementById("param-wavering"),
  w: document.getElementById("param-w"),
  x: document.getElementById("param-x"),
  t: document.getElementById("param-t"),
};

const fps = 100;
let timeoutId;
let isPlayed = false;
const initParams = {
  x0: 10,
  m: 0.5,
  k: 5,
};
let x0, k, m, x, t, waveNumber, w, T;


init();
playBtn.addEventListener("click", onPlayButtonClick);
params.m.addEventListener("input", onChangeMHandler);
params.x0.addEventListener("input", onChangeX0Handler);
params.k.addEventListener("input", onChangeKHandler);

function init() {
  x0 = initParams.x0;
  k = initParams.k;
  m = initParams.m;
  x = x0;
  t = 0; // time, s
  T = 0; // period, s
  waveNumber = 0;
  w = updateW();

  params.m.value = m;
  params.k.value = k;
  params.x0.value = x0;

  setAnswers();

  changeBallDiameter();
  changeSpringParams();
}

function onPlayButtonClick(event) {
  isPlayed = !isPlayed;

  toggleBtnSvgs(event.target.closest("button").children);
  toggleInputsDisabled(isPlayed);

  if (isPlayed) {
    animate();
  } else {
    clearTimeout(timeoutId);
    init();
  }
}

function onChangeMHandler() {
  if (isPlayed) return;
  const min = 0.5;
  const max = 1;
  const step = 0.1;
  params.m.value = validteInputs(params.m.value, min, max, step);
  m = Number(params.m.value);
  w = updateW();
  changeBallDiameter();
}

function onChangeX0Handler() {
  if (isPlayed) return;
  const min = 0;
  const max = 20;
  const step = 1;
  params.x0.value = validteInputs(params.x0.value, min, max, step);
  x0 = Number(params.x0.value);
  x = x0;
  answers.x.value = x;
  changeSpringParams();
}

function onChangeKHandler() {
  if (isPlayed) return;
  const min = 5;
  const max = 9;
  const step = 1;
  params.k.value = validteInputs(params.k.value, min, max, step);
  k = Number(params.k.value);
  w = updateW();
}

function validteInputs(value, min, max, step) {
  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  } else if (parseInt(step) === step && value % step !== 0) {
    value = parseInt(value);
  }
  return value;
}

function toggleBtnSvgs(svgs) {
  const play = svgs[0];
  const stop = svgs[1];
  play.classList.toggle("hidden");
  stop.classList.toggle("hidden");
}

function changeBallDiameter() {
  const diameter = Math.cbrt(m);
  const coef = 4;
  ball.style.width = coef * diameter + "em";
  ball.style.height = coef * diameter + "em";
  ball.style.left = (-coef * diameter) / 2 + "em";
  ball.style.bottom = (-coef * diameter) / 2 + "em";
}

function changeSpringParams() {
  const coef = 2;
  const newHeight = 50 + coef * x;
  spring.style.height = newHeight + "%";

  const angle = 90 - 45 * newHeight / 50; // 90 - max angle, angle=angle(springHeight)

  for (let spr of springLeft) {
    spr.style.transform = `rotate(${angle}deg)`;
  }

  for (let spr of springRight) {
    spr.style.transform = `rotate(${-1 * angle}deg)`;
  }
}

function toggleInputsDisabled(shouldDisable) {
  params.m.disabled = shouldDisable;
  params.k.disabled = shouldDisable;
  params.x0.disabled = shouldDisable;
}

function setAnswers() {
  answers.w.value = w.toFixed(2);
  answers.x.value = x;
  answers.wavering.value = waveNumber;
  answers.t.value = t;
}

function updateW() {
  let newW = Math.sqrt(k / m);
  T = Math.PI * 2 / newW;
  answers.w.value = newW.toFixed(2);
  return newW;
}

function calculateWavesNumber() {}

function animate() {
  timeoutId = setTimeout(function () {
    animate();

    // update values
    t += 1 / fps;
    t = Number(t.toFixed(2));
    x = x0 * Math.cos(w * t);
    waveNumber = t / T;
    answers.wavering.value = Math.floor(waveNumber);
    
    
    // update ui
    changeSpringParams();
    if (parseInt(t) === t) {
      answers.t.value = t;
      answers.x.value = x.toFixed(2);
    }
  }, 1000 / fps);
}
