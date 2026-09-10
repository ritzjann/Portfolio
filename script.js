
const canvas = document.getElementById('ember-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let embers = [];

  function resizeCanvas() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Ember {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.fade = Math.random() * 0.005 + 0.002;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.opacity -= this.fade;

      if (this.opacity <= 0 || this.y < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237, 192, 105, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#edc069';
      ctx.fill();
    }
  }

  function initEmbers() {
    embers = [];
    const count = Math.min(Math.floor(width / 25), 40);
    for (let i = 0; i < count; i++) {
      const ember = new Ember();
      ember.y = Math.random() * height; 
      embers.push(ember);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => {
      ember.update();
      ember.draw();
    });
    requestAnimationFrame(animate);
  }

  initEmbers();
  animate();
}


function handleSummonSubmit(event) {
  event.preventDefault();
  const btnText = document.getElementById('btn-text');
  const formFeedback = document.getElementById('form-feedback');
  
  if (btnText && formFeedback) {
    btnText.textContent = "Dispatching...";
    setTimeout(() => {
      formFeedback.classList.remove('hidden');
      btnText.textContent = "Contract Sealed";
      document.getElementById('summons-form').reset();
    }, 1000);
  }
}