/*
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Ajustar el tamaño del canvas a la ventana
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color; // Guardamos el color original
    this.text = text;
    this.speed = speed;
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "16px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  // Verifica colisión con otro círculo
  checkCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  // Cambia a azul en colisión y vuelve a su color original cuando ya no colisiona
  setCollisionState(isColliding) {
    this.color = isColliding ? "#0000FF" : this.originalColor;
  }
}

// Crear un array de círculos
let circles = [];

// Generar 20 círculos con velocidades entre 1 y 5
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1; // 1 a 5 unidades
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Detectar colisiones entre todos los pares de círculos
function detectCollisions() {
  for (let i = 0; i < circles.length; i++) {
    let circleA = circles[i];
    let isCollidingA = false;

    for (let j = 0; j < circles.length; j++) {
      if (i !== j) {
        let circleB = circles[j];
        if (circleA.checkCollision(circleB)) {
          isCollidingA = true;
          circleB.setCollisionState(true);
        }
      }
    }

    // Actualiza el estado de colisión del círculo actual
    circleA.setCollisionState(isCollidingA);
  }
}

// Animación
function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  detectCollisions();
  circles.forEach(circle => circle.update(ctx));
  requestAnimationFrame(animate);
}

// Iniciar con 20 círculos
generateCircles(20);
animate();
*/

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Ajustar el tamaño del canvas a la ventana
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;

    // Dirección aleatoria inicial
    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "14px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.draw(context);
  }

  checkCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  handleCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Vector unitario normal
    const nx = dx / distance;
    const ny = dy / distance;

    // Proyección de velocidades sobre la normal
    const p1 = this.dx * nx + this.dy * ny;
    const p2 = other.dx * nx + other.dy * ny;

    // Intercambio simple de velocidades (colisión elástica)
    const p1Final = p2;
    const p2Final = p1;

    this.dx += (p1Final - p1) * nx;
    this.dy += (p1Final - p1) * ny;
    other.dx += (p2Final - p2) * nx;
    other.dy += (p2Final - p2) * ny;

    // ✅ Corrección de solapamiento (para evitar que se queden pegados)
    const overlap = this.radius + other.radius - distance;
    if (overlap > 0) {
      const correction = overlap / 2;
      this.posX += nx * correction;
      this.posY += ny * correction;
      other.posX -= nx * correction;
      other.posY -= ny * correction;
    }

    // Flash azul temporal
    this.flashBlue();
    other.flashBlue();
  }

  flashBlue() {
    this.color = "#0000FF";
    setTimeout(() => {
      this.color = this.originalColor;
    }, 100);
  }
}

// Generar 20 círculos
let circles = [];
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

function detectCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const circleA = circles[i];
      const circleB = circles[j];
      if (circleA.checkCollision(circleB)) {
        circleA.handleCollision(circleB);
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  detectCollisions();
  circles.forEach(circle => circle.update(ctx));
  requestAnimationFrame(animate);
}

generateCircles(20);
animate();
