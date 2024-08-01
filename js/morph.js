const morphElements = [
  document.getElementById("morph1"),
  document.getElementById("morph2"),
];

const texts = [
  "stunning software",
  "efficient architecture",
  "innovative prototypes",
  "clever solutions",
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = -1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

morphElements[0].textContent = texts[textIndex % texts.length];
morphElements[1].textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

// A lot of the magic happens here, this is what applies the blur filter to the text.
function setMorph(fraction) {
  // fraction = Math.cos(fraction * Math.PI) / -2 + 0.5;

  morphElements[1].style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  morphElements[1].style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  morphElements[0].style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  morphElements[0].style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  morphElements[0].textContent = texts[textIndex % texts.length];
  morphElements[1].textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  morphElements[1].style.filter = "";
  morphElements[1].style.opacity = "100%";

  morphElements[0].style.filter = "";
  morphElements[0].style.opacity = "0%";
}

// Animation loop, which is called every frame.
function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }

    doMorph();
  } else {
    doCooldown();
  }
}

// Start the animation.
animate();
