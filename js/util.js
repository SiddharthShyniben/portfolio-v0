const lerp = (a, b, n) => (1 - n) * a + n * b;
const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

const calcWinsize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const getMousePos = (e) => ({
  x: e.clientX,
  y: e.clientY,
});

const { PI, cos, sin, abs, sqrt, pow, round, random, atan2 } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const floor = (n) => n | 0;
const rand = (n) => n * random();
const randIn = (min, max) => rand(max - min) + min;
const randRange = (n) => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
  let hm = 0.5 * m;
  return abs(((t + hm) % m) - hm) / hm;
};
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
