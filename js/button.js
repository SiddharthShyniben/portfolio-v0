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

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener("resize", () => (winsize = calcWinsize()));

// Track the mouse position
let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)));

class Cursor {
  constructor(el) {
    this.DOM = { el };
    this.DOM.el.style.opacity = 0;

    this.bounds = this.DOM.el.getBoundingClientRect();

    this.renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.2 },
      ty: { previous: 0, current: 0, amt: 0.2 },
      scale: { previous: 1, current: 1, amt: 0.2 },
      opacity: { previous: 1, current: 1, amt: 0.2 },
    };

    this.onMouseMoveEv = () => {
      this.renderedStyles.tx.previous = this.renderedStyles.tx.current =
        mouse.x - this.bounds.width / 2;
      this.renderedStyles.ty.previous = this.renderedStyles.ty.previous =
        mouse.y - this.bounds.height / 2;
      gsap.to(this.DOM.el, {
        duration: 0.9,
        ease: "Power3.easeOut",
        opacity: 1,
      });
      requestAnimationFrame(() => this.render());
      window.removeEventListener("mousemove", this.onMouseMoveEv);
    };
    window.addEventListener("mousemove", this.onMouseMoveEv);
  }

  enter() {
    this.renderedStyles["scale"].current = 4;
    this.renderedStyles["opacity"].current = 0.2;
  }

  leave() {
    this.renderedStyles["scale"].current = 1;
    this.renderedStyles["opacity"].current = 1;
  }

  render() {
    this.renderedStyles["tx"].current = mouse.x - this.bounds.width / 2;
    this.renderedStyles["ty"].current = mouse.y - this.bounds.height / 2;

    for (const key in this.renderedStyles) {
      this.renderedStyles[key].previous = lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].amt,
      );
    }

    this.DOM.el.style.transform = `translateX(${this.renderedStyles["tx"].previous}px) translateY(${this.renderedStyles["ty"].previous}px) scale(${this.renderedStyles["scale"].previous})`;
    this.DOM.el.style.opacity = this.renderedStyles["opacity"].previous;

    requestAnimationFrame(() => this.render());
  }
}

class ButtonCtrl extends EventTarget {
  constructor(el) {
    super();

    this.DOM = { el: el };
    this.DOM.text = this.DOM.el.querySelector(".button__text");
    this.DOM.textinner = this.DOM.el.querySelector(".button__text-inner");

    this.renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.1 },
      ty: { previous: 0, current: 0, amt: 0.1 },
    };

    this.state = { hover: false };

    this.events = {
      enter: new Event("enter"),
      leave: new Event("leave"),
    };

    this.calculateSizePosition();
    this.initEvents();
    requestAnimationFrame(() => this.render());
  }

  calculateSizePosition() {
    this.rect = this.DOM.el.getBoundingClientRect();
    this.distanceToTrigger = this.rect.width * 0.7;
  }

  initEvents() {
    this.onResize = () => this.calculateSizePosition();
    window.addEventListener("resize", this.onResize);
  }

  render() {
    const distanceMouseButton = distance(
      mouse.x + window.scrollX,
      mouse.y + window.scrollY,
      this.rect.left + this.rect.width / 2,
      this.rect.top + this.rect.height / 2,
    );
    let x = 0;
    let y = 0;

    if (distanceMouseButton < this.distanceToTrigger) {
      if (!this.state.hover) {
        this.enter();
      }
      x =
        (mouse.x + window.scrollX - (this.rect.left + this.rect.width / 2)) *
        0.3;

      y =
        (mouse.y + window.scrollY - (this.rect.top + this.rect.height / 2)) *
        0.3;
    } else if (this.state.hover) {
      this.leave();
    }

    this.renderedStyles["tx"].current = x;
    this.renderedStyles["ty"].current = y;

    for (const key in this.renderedStyles) {
      this.renderedStyles[key].previous = lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].amt,
      );
    }

    this.DOM.el.style.transform = `translate3d(${this.renderedStyles["tx"].previous}px, ${this.renderedStyles["ty"].previous}px, 0)`;
    this.DOM.text.style.transform = `translate3d(${-this.renderedStyles["tx"].previous * 0.6}px, ${-this.renderedStyles["ty"].previous * 0.6}px, 0)`;

    requestAnimationFrame(() => this.render());
  }

  enter() {
    this.dispatchEvent(this.events.enter);

    this.state.hover = true;
    this.DOM.el.classList.add("button--hover");

    document.body.classList.add("active");

    gsap.killTweensOf(this.DOM.textinner);

    gsap
      .timeline()
      .to(this.DOM.textinner, 0.15, {
        ease: "Power2.easeIn",
        opacity: 0,
        y: "-20%",
      })
      .to(this.DOM.textinner, 0.2, {
        ease: "Expo.easeOut",
        opacity: 1,
        startAt: { y: "100%" },
        y: "0%",
      });
  }

  leave() {
    this.dispatchEvent(this.events.leave);

    this.state.hover = false;
    this.DOM.el.classList.remove("button--hover");

    document.body.classList.remove("active");

    gsap.killTweensOf(this.DOM.textinner);

    gsap
      .timeline()
      .to(this.DOM.textinner, 0.15, {
        ease: "Power2.easeIn",
        opacity: 0,
        y: "20%",
      })
      .to(this.DOM.textinner, 0.2, {
        ease: "Expo.easeOut",
        opacity: 1,
        startAt: { y: "-100%" },
        y: "0%",
      });
  }
}

const cursor = new Cursor(document.querySelector(".cursor"));
const button = new ButtonCtrl(document.querySelector(".button"));

button.addEventListener("enter", () => cursor.enter());
button.addEventListener("leave", () => cursor.leave());
