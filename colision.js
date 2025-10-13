const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
const NUM_OBJECTS = 20;
let objects = [];

// Símbolos posibles
const SYMBOLS = ["♠", "★", "♥"];

// Colores base estilo neón
const COLORS = ["#FF4D6D", "#4DFFEA", "#FFD84D", "#9B4DFF", "#4D94FF"];

class FallingSymbol {
  constructor(x, y, size, color, symbol, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.symbol = symbol;
    this.speed = speed;
    this.alpha = 1;
  }

  draw(ctx) {
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.size * 2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Sombra y brillo tipo neón
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;

    // Fondo degradado
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x - this.size / 2, this.y, this.size, this.size * 1.5);

    // Símbolo centrado
    ctx.fillStyle = "#fff";
    ctx.font = `${this.size}px 'Segoe UI Symbol', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.symbol, this.x, this.y + this.size * 0.8);

    ctx.restore();
  }

  update() {
    this.y += this.speed;

    // Reinicia cuando sale del canvas
    if (this.y - this.size > canvas.height) {
      this.reset();
    }

    this.draw(ctx);
  }

  reset() {
    this.y = -this.size;
    this.x = Math.random() * canvas.width;
    this.speed = Math.random() * 3 + 2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  isClicked(mouseX, mouseY) {
    return (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y &&
      mouseY < this.y + this.size * 1.5
    );
  }
}

function generateSymbols(n) {
  objects = [];
  for (let i = 0; i < n; i++) {
    const size = Math.random() * 30 + 30;
    const x = Math.random() * canvas.width;
    const y = Math.random() * -canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const speed = Math.random() * 3 + 2;
    objects.push(new FallingSymbol(x, y, size, color, symbol, speed));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach(obj => obj.update());
  requestAnimationFrame(animate);
}

// Detección de clic
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = 0; i < objects.length; i++) {
    if (objects[i].isClicked(mouseX, mouseY)) {
      objects.splice(i, 1);
      score++;
      document.getElementById("score").textContent = score;

      // Crear uno nuevo
      const size = Math.random() * 30 + 30;
      const x = Math.random() * canvas.width;
      const y = Math.random() * -canvas.height;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const speed = Math.random() * 3 + 2;
      objects.push(new FallingSymbol(x, y, size, color, symbol, speed));
      break;
    }
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateSymbols(NUM_OBJECTS);
});

// Inicializar
generateSymbols(NUM_OBJECTS);
animate();