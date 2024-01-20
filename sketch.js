let delaySlide, ampSlide, durationSlide, tempSlide;

let easeType = [
  "in",
  "out",
  "inOut",

  "inSine",
  "outSine",
  "inOutSine",

  "inCirc",
  "outCirc",
  "inOutCirc",

  "inBack",
  "outBack",
  "inOutBack",

  "inElastic",
  "outElastic",
  "inOutElastic",

  "inBounce",
  "outBounce",
  "inOutBounce",

  "linear",
];
let radioSelector = [];
function setup() {
  createCanvas(600, 600);
  delaySlide = createSlider(-1.0, 1.0, 0.9, 0.1);
  delaySlide.position(160, height - 60);

  durationSlide = createSlider(0.1, 5, 2.0, 0.1);
  durationSlide.position(160, height - 30);
  ampSlide = createSlider(-10.0, 10.0, 1.0, 0.1);
  ampSlide.position(width * 0.4 + 170, height - 60);

  for (let i = 0; i < easeType.length; i++) {
    radioSelector[i] = createRadio();
    radioSelector[i].position(
      20 + floor(i / 3) * 90,
      floor(i % 3) * 50 + height + 40
    );
    radioSelector[i].option(easeType[i]);
    radioSelector[i].selected(easeType[i]);
    radioSelector[i].style("width", "20px");
  }
}
let counter = 0;
let startAni = 0;
let stopAni = 600;
let bars = 9;

let animationDuration = 2;
let typeStr = "inOutBounce";
let exVal = 2;

function draw() {
  radioSelector.forEach((element) => {
    if (element.selected()) {
      typeStr = element.value();
    }
  });
  noStroke();
  background(200);
  translate(width * 0.1, height * 0.1);
  scale(0.8);

  animationDuration = durationSlide.value();
  let totalLength = animationDuration + abs(delaySlide.value());
  let exVal = ampSlide.value();

  let step = 1 / 60;
  //   let temp = stopAni;
  let ts = height / (bars + 1);

  for (let j = 0; j < bars; j++) {
    let delayVal = map(j, 0, bars, delaySlide.value(), 0);

    let x = ease(
      counter,
      animationDuration,
      delayVal,
      typeStr,
      exVal,
      startAni,
      stopAni
    );
    push();
    translate(width / 2, height / 2);
    //     rotate(radians(x/4))
    fill(0, 0, 255);
    stroke(0);
    ellipse(
      x - width / 2,
      map(j, 0, bars, ts, height) - ts / 2 - height / 2,
      width / 2 + x * 0.1,
      ts
    );
    pop();
  }
  let f = ease(
    counter,
    animationDuration,
    delaySlide.value(),
    typeStr,
    exVal,
    startAni,
    stopAni
  );
  let g = map(counter, 0, totalLength, startAni, stopAni);
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(f, -50, 20);
  //linear
  fill(0, 255, 0);
  ellipse(g, -50, 20);
  fill(255, 0, 0);

  ellipse(stopAni, -20, 20);
  line(startAni, -50, stopAni, -20);
  textSize(30);
  text("Start: " + startAni, startAni, -50);
  //   text(`temp: ${temp}`, width / 2, height + 20);

  text("Stop: " + stopAni, stopAni, 10);
  text("delay: " + delaySlide.value(), -20, height + 20);
  text("dur:" + totalLength.toFixed(2), -20, height + 60);
  text(`curve: ${exVal}`, width * 0.5, height + 20);
  text("counter: " + counter.toFixed(2), width * 0.8, height + 60);
  text(typeStr, width * 0.5, height + 60);

  noFill();
  beginShape();
  curveVertex(0, 0);
  for (let c = 0; c < 1; c += step) {
    let xc = map(c, 0, 1, 0, width);
    let yc = ease(c, 1, 0, typeStr, exVal, 0, height);
    curveVertex(xc, yc);
  }
  curveVertex(width, height);
  curveVertex(width, height);
  endShape();

  counter = counter >= totalLength ? totalLength : (counter += step);

  if (frameCount % (totalLength * 60) === 0) {
    counter = 0;
    temp = stopAni;
    startAni = temp;
    temp =
      stopAni > width / 2 ? random(height / 2) : random(height / 2, height);
    stopAni = temp;
  }
}
//////////////////////////////
//
//  EASE
//
function ease(ct, span, delay, type, ex, start, end) {
  let progress = norm(constrain(max(ct - delay, 0), 0, span), 0, span);
  const c1 = ex;
  const c2 = c1 * 1.5;
  const c3 = c1 + 1;
  const c4 = ex + (2 * PI) / 3; //elastic
  const c5 = ex + (2 * PI) / 4.5; //elastic
  const n1 = 7.5625; //bounce
  const d1 = 2.75; //bounce

  switch (type) {
    case "in":
      return start + pow(progress, ex) * (end - start);
      break;
    case "out":
      return end - pow(1 - progress, ex) * (end - start);
      break;
    case "inOut":
      return progress < 0.5
        ? start + pow(2, ex - 1) * pow(progress, ex) * (end - start)
        : start + (1 - pow(2 - progress * 2, ex) / 2) * (end - start);
      break;
    case "inSine":
      return start + (1 - cos(progress * PI * 0.5)) * (end - start);
      break;
    case "outSine":
      return start + sin(progress * PI * 0.5) * (end - start);
      break;
    case "inOutSine":
      return start + ((1 - cos(progress * PI)) / 2) * (end - start);
      break;
    case "inCirc":
      return start + (1 - sqrt(1 - pow(progress, abs(ex * 2)))) * (end - start);
      break;
    case "outCirc":
      return start + sqrt(1 - pow(progress - 1, abs(ex * 2))) * (end - start);
      break;
    case "inOutCirc":
      return progress < 0.5
        ? start +
            ((1 - sqrt(1 - pow(2 * progress, abs(ex * 2)))) * (end - start)) / 2
        : start +
            ((sqrt(1 - pow(-2 * progress + 2, abs(ex * 2))) + 1) *
              (end - start)) /
              2;
      break;
    case "inBack":
      return (
        start + (c3 * pow(progress, 3) - c1 * pow(progress, 2)) * (end - start)
      );
      break;
    case "outBack":
      return (
        start +
        (1 + c3 * pow(progress - 1, 3) + c1 * pow(progress - 1, 2)) *
          (end - start)
      );
      break;
    case "inOutBack":
      return progress < 0.5
        ? start +
            (pow(2 * progress, 2) *
              ((c2 + 1) * 2 * progress - c2) *
              (end - start)) /
              2
        : start +
            ((pow(2 * progress - 2, 2) * ((c2 + 1) * (progress * 2 - 2) + c2) +
              2) *
              (end - start)) /
              2;
      break;
    case "inElastic":
      return progress === 0
        ? start
        : progress === 1
        ? end
        : start -
          pow(2, 10 * progress - 10) *
            sin((progress * 10 - 10.75) * c4) *
            (end - start);
      break;
    case "outElastic":
      return progress === 0
        ? start
        : progress === 1
        ? end
        : start +
          (pow(2, -10 * progress) * sin((progress * 10 - 0.75) * c4) + 1) *
            (end - start);
      break;
    case "inOutElastic":
      return progress === 0
        ? start
        : progress === 1
        ? end
        : progress < 0.5
        ? start -
          (pow(2, 20 * progress - 10) *
            sin((20 * progress - 11.125) * c5) *
            (end - start)) /
            2
        : start +
          ((pow(2, -20 * progress + 10) * sin((20 * progress - 11.125) * c5)) /
            2 +
            1) *
            (end - start);
      break;

    case "outBounce":
      return start + bounce(progress, ex) * (end - start);
      break;
    case "inBounce":
      return end - bounce(1 - progress, ex) * (end - start);
      break;
    case "inOutBounce":
      if (progress < 0.5) {
        return end - (0.5 + bounce(1 - progress * 2, ex) * 0.5) * (end - start);
      } else {
        return start + (1 + bounce(2 * progress - 1, ex)) * (end - start) * 0.5;
      }
      break;
    case "linear":
      return start + progress * (end - start);
      break;
    default:
      return start + progress * (end - start);
      break;
  }
}
function bounce(t, ex) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}
