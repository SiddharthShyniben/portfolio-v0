function swirl(selector) {
  const particleCount = 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = 0.1;
  const rangeSpeed = 2;
  const baseRadius = 1;
  const rangeRadius = 4;
  const baseHue = 220;
  const rangeHue = 100;
  const noiseSteps = 8;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = "#0e1111";

  let container;
  let canvas;
  let ctx;
  let center;
  let gradient;
  let tick;
  let simplex;
  let particleProps;
  let positions;
  let velocities;
  let lifeSpans;
  let speeds;
  let sizes;
  let hues;

  function setup() {
    createCanvas();
    resize();
    initParticles();
    draw();
  }

  function initParticles() {
    tick = 0;
    simplex = new SimplexNoise();
    particleProps = new Float32Array(particlePropsLength);

    let i;

    for (i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  }

  function initParticle(i) {
    let x, y, vx, vy, life, ttl, speed, radius, hue;

    x = rand(canvas.a.width);
    y = center[1] + randRange(rangeY);
    vx = 0;
    vy = 0;
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    speed = baseSpeed + rand(rangeSpeed);
    radius = baseRadius + rand(rangeRadius);
    hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  }

  function drawParticles() {
    let i;

    for (i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i);
    }
  }

  function updateParticle(i) {
    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

    x = particleProps[i];
    y = particleProps[i2];
    n = simplex.noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    vx = lerp(particleProps[i3], cos(n), 0.5);
    vy = lerp(particleProps[i4], sin(n), 0.5);
    life = particleProps[i5];
    ttl = particleProps[i6];
    speed = particleProps[i7];
    x2 = x + vx * speed;
    y2 = y + vy * speed;
    radius = particleProps[i8];
    hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    (checkBounds(x, y) || life > ttl) && initParticle(i);
  }

  function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
    ctx.a.save();
    ctx.a.lineCap = "round";
    ctx.a.lineWidth = radius;
    ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.a.beginPath();
    ctx.a.moveTo(x, y);
    ctx.a.lineTo(x2, y2);
    ctx.a.stroke();
    ctx.a.closePath();
    ctx.a.restore();
  }

  function checkBounds(x, y) {
    return x > canvas.a.width || x < 0 || y > canvas.a.height || y < 0;
  }

  function createCanvas() {
    container = document.querySelector(selector);
    canvas = {
      a: document.createElement("canvas"),
      b: document.createElement("canvas"),
    };
    canvas.b.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
    container.appendChild(canvas.b);
    ctx = {
      a: canvas.a.getContext("2d"),
      b: canvas.b.getContext("2d"),
    };
    center = [];
  }

  function resize() {
    const { innerWidth, innerHeight } = window;

    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;

    ctx.a.drawImage(canvas.b, 0, 0);

    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;

    ctx.b.drawImage(canvas.a, 0, 0);

    center[0] = 0.5 * canvas.a.width;
    center[1] = 0.5 * canvas.a.height;
  }

  function renderGlow() {
    ctx.b.save();
    ctx.b.filter = "blur(8px) brightness(200%)";
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();

    ctx.b.save();
    ctx.b.filter = "blur(4px) brightness(200%)";
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function renderToScreen() {
    ctx.b.save();
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function draw() {
    tick++;

    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);

    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

    drawParticles();
    renderGlow();
    renderToScreen();

    window.requestAnimationFrame(draw);
  }

  window.addEventListener("load", setup);
  window.addEventListener("resize", resize);
}

function pipeline(selector) {
  const pipeCount = 30;
  const pipePropCount = 8;
  const pipePropsLength = pipeCount * pipePropCount;
  const turnCount = 8;
  const turnAmount = (360 / turnCount) * TO_RAD;
  const turnChanceRange = 58;
  const baseSpeed = 0.5;
  const rangeSpeed = 1;
  const baseTTL = 100;
  const rangeTTL = 300;
  const baseWidth = 2;
  const rangeWidth = 4;
  const baseHue = 180;
  const rangeHue = 60;
  const backgroundColor = "hsla(150,80%,1%,1)";

  let container;
  let canvas;
  let ctx;
  let center;
  let tick;
  let pipeProps;

  function setup() {
    createCanvas();
    resize();
    initPipes();
    draw();
  }

  function initPipes() {
    pipeProps = new Float32Array(pipePropsLength);

    let i;

    for (i = 0; i < pipePropsLength; i += pipePropCount) {
      initPipe(i);
    }
  }

  function initPipe(i) {
    let x, y, direction, speed, life, ttl, width, hue;

    x = rand(canvas.a.width);
    y = center[1];
    direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
    speed = baseSpeed + rand(rangeSpeed);
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    width = baseWidth + rand(rangeWidth);
    hue = baseHue + rand(rangeHue);

    pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
  }

  function updatePipes() {
    tick++;

    let i;

    for (i = 0; i < pipePropsLength; i += pipePropCount) {
      updatePipe(i);
    }
  }

  function updatePipe(i) {
    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i;
    let x, y, direction, speed, life, ttl, width, hue, turnChance, turnBias;

    x = pipeProps[i];
    y = pipeProps[i2];
    direction = pipeProps[i3];
    speed = pipeProps[i4];
    life = pipeProps[i5];
    ttl = pipeProps[i6];
    width = pipeProps[i7];
    hue = pipeProps[i8];

    drawPipe(x, y, life, ttl, width, hue);

    life++;
    x += cos(direction) * speed;
    y += sin(direction) * speed;
    turnChance =
      !(tick % round(rand(turnChanceRange))) &&
      (!(round(x) % 6) || !(round(y) % 6));
    turnBias = round(rand(1)) ? -1 : 1;
    direction += turnChance ? turnAmount * turnBias : 0;

    pipeProps[i] = x;
    pipeProps[i2] = y;
    pipeProps[i3] = direction;
    pipeProps[i5] = life;

    checkBounds(x, y);
    life > ttl && initPipe(i);
  }

  function drawPipe(x, y, life, ttl, width, hue) {
    ctx.a.save();
    ctx.a.strokeStyle = `hsla(${hue},75%,50%,${fadeInOut(life, ttl) * 0.125})`;
    ctx.a.beginPath();
    ctx.a.arc(x, y, width, 0, TAU);
    ctx.a.stroke();
    ctx.a.closePath();
    ctx.a.restore();
  }

  function checkBounds(x, y) {
    if (x > canvas.a.width) x = 0;
    if (x < 0) x = canvas.a.width;
    if (y > canvas.a.height) y = 0;
    if (y < 0) y = canvas.a.height;
  }

  function createCanvas() {
    container = document.querySelector(selector);
    canvas = {
      a: document.createElement("canvas"),
      b: document.createElement("canvas"),
    };
    canvas.b.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
    container.appendChild(canvas.b);
    ctx = {
      a: canvas.a.getContext("2d"),
      b: canvas.b.getContext("2d"),
    };
    center = [];
    tick = 0;
  }

  function resize() {
    const { innerWidth, innerHeight } = window;

    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;

    ctx.a.drawImage(canvas.b, 0, 0);

    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;

    ctx.b.drawImage(canvas.a, 0, 0);

    center[0] = 0.5 * canvas.a.width;
    center[1] = 0.5 * canvas.a.height;
  }

  function render() {
    ctx.b.save();
    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
    ctx.b.restore();

    ctx.b.save();
    ctx.b.filter = "blur(12px)";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();

    ctx.b.save();
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function draw() {
    updatePipes();

    render();

    window.requestAnimationFrame(draw);
  }

  window.addEventListener("load", setup);
  window.addEventListener("resize", resize);
}

function coalesce(selector) {
  const particleCount = 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = 100;
  const rangeTTL = 500;
  const baseSpeed = 0.1;
  const rangeSpeed = 1;
  const baseSize = 2;
  const rangeSize = 10;
  const baseHue = 10;
  const rangeHue = 100;
  const noiseSteps = 2;
  const xOff = 0.0025;
  const yOff = 0.005;
  const zOff = 0.0005;
  const backgroundColor = "hsla(60,50%,3%,1)";

  let container;
  let canvas;
  let ctx;
  let center;
  let gradient;
  let tick;
  let particleProps;
  let positions;
  let velocities;
  let lifeSpans;
  let speeds;
  let sizes;
  let hues;

  function setup() {
    createCanvas();
    resize();
    initParticles();
    draw();
  }

  function initParticles() {
    tick = 0;
    particleProps = new Float32Array(particlePropsLength);

    let i;

    for (i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  }

  function initParticle(i) {
    let theta, x, y, vx, vy, life, ttl, speed, size, hue;

    x = rand(canvas.a.width);
    y = rand(canvas.a.height);
    theta = angle(x, y, center[0], center[1]);
    vx = cos(theta) * 6;
    vy = sin(theta) * 6;
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    speed = baseSpeed + rand(rangeSpeed);
    size = baseSize + rand(rangeSize);
    hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
  }

  function drawParticles() {
    let i;

    for (i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i);
    }
  }

  function updateParticle(i) {
    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let x, y, theta, vx, vy, life, ttl, speed, x2, y2, size, hue;

    x = particleProps[i];
    y = particleProps[i2];
    theta = angle(x, y, center[0], center[1]) + 0.75 * HALF_PI;
    vx = lerp(particleProps[i3], 2 * cos(theta), 0.05);
    vy = lerp(particleProps[i4], 2 * sin(theta), 0.05);
    life = particleProps[i5];
    ttl = particleProps[i6];
    speed = particleProps[i7];
    x2 = x + vx * speed;
    y2 = y + vy * speed;
    size = particleProps[i8];
    hue = particleProps[i9];

    drawParticle(x, y, theta, life, ttl, size, hue);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    life > ttl && initParticle(i);
  }

  function drawParticle(x, y, theta, life, ttl, size, hue) {
    let xRel = x - 0.5 * size,
      yRel = y - 0.5 * size;

    ctx.a.save();
    ctx.a.lineCap = "round";
    ctx.a.lineWidth = 1;
    ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.a.beginPath();
    ctx.a.translate(xRel, yRel);
    ctx.a.rotate(theta);
    ctx.a.translate(-xRel, -yRel);
    ctx.a.strokeRect(xRel, yRel, size, size);
    ctx.a.closePath();
    ctx.a.restore();
  }

  function createCanvas() {
    container = document.querySelector(selector);
    canvas = {
      a: document.createElement("canvas"),
      b: document.createElement("canvas"),
    };
    canvas.b.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
    container.appendChild(canvas.b);
    ctx = {
      a: canvas.a.getContext("2d"),
      b: canvas.b.getContext("2d"),
    };
    center = [];
  }

  function resize() {
    const { innerWidth, innerHeight } = window;

    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;

    ctx.a.drawImage(canvas.b, 0, 0);

    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;

    ctx.b.drawImage(canvas.a, 0, 0);

    center[0] = 0.5 * canvas.a.width;
    center[1] = 0.5 * canvas.a.height;
  }

  function renderGlow() {
    ctx.b.save();
    ctx.b.filter = "blur(8px) brightness(200%)";
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();

    ctx.b.save();
    ctx.b.filter = "blur(4px) brightness(200%)";
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function render() {
    ctx.b.save();
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function draw() {
    tick++;

    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);

    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

    drawParticles();
    renderGlow();
    render();

    window.requestAnimationFrame(draw);
  }

  window.addEventListener("load", setup);
  window.addEventListener("resize", resize);
}

if (!window.matchMedia("(prefers-reduced-motion: reduced)").matches) {
  swirl(".card--1");
  pipeline(".card--2");
  coalesce(".card--3");
}
