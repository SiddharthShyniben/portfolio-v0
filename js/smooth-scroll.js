const easeSpeed = 0.06;
let moveDistance = 0,
  curScroll = 0;

document.addEventListener("scroll", () => {
  moveDistance = window.scrollY;
});

const ghostEle = document.createElement("section");
ghostEle.style.height = document.querySelector("main").scrollHeight + "px";
document.querySelector("main").after(ghostEle);

function animate() {
  requestAnimationFrame(animate);

  curScroll = curScroll + easeSpeed * (moveDistance - curScroll);
  if (curScroll < 0.001) curScroll = 0;

  document.querySelector("main").style.transform =
    `translateY(${curScroll * -1}px)`;
}

animate();
