// Matter.js module aliases
const {
  Engine, World, Bodies, Body, Constraint,
} = Matter;

// Constants
const COLORS = {
  ball1: '#ff6b6b',
  ball2: '#4ecdc4',
  ball3: '#9b59b6',
  pin: '#00ff00',
  string: 'rgba(255, 255, 255, 0.3)',
  velocity: 'rgba(255, 255, 255, 0.5)',
  barycenter: 'rgba(255, 215, 0, 0.8)',
  momentumNet: '#FF69B4',
  cut: '#ff0000',
  trail: '#0a0a0a',
  selfOrbit: '#90EE90',
};

const SIZES = {
  ball: 15,
  pinDefault: 8,
  pinMassive: 12,
  pinZeroMass: 4,
  barycenterRadius: 20,
  barycenterDot: 4,
};

const SCENARIO_INFO = {
  1: {
    title: 'Two Balls System',
    text: "Two balls exchange momentum through the string. Each ball 'donates' v cos θ and receives the same from its partner. The pin experiences zero net force.",
  },
  2: {
    title: 'Light Pin - Small Binary System',
    text: 'When Ball 2 is cut free, the remaining string keeps Ball 1 connected to the light pin. They form a small binary system orbiting their barycenter (very close to the ball due to mass difference).',
  },
  3: {
    title: 'Massive Pin - Binary System',
    text: 'With a massive pin, Ball 1 finds a new exchange partner. They form a binary system orbiting their common barycenter - like twin stars!',
  },
  4: {
    title: 'Fixed Pin - Standard Orbit',
    text: 'An infinitely massive (fixed) pin provides perfect counter-momentum without moving. Ball 1 orbits the stationary pin - classic circular motion.',
  },
  5: {
    title: 'Zero Mass Pin - Self Orbit!',
    text: "With zero mass, the pin cannot exchange momentum. Ball 1 moves in a straight line while the massless pin trails behind at a fixed distance. The ball is 'orbiting itself' with the barycenter at the ball!",
  },
  6: {
    title: 'Three Balls System',
    text: 'Three balls connected to a central pin. When one ball (Ball 3) is cut free, the remaining two balls continue to exchange forces and orbit their barycenter with the pin!',
  },
  7: {
    title: 'Equal Mass Pin - Triple System',
    text: 'When Ball 2 is cut free, Ball 1 and the equal-mass pin form a balanced binary system. The pin has the same mass as the ball, so both orbit their barycenter equally - a perfectly symmetric dance!',
  },
};

// Global state
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

let isPaused = false;
let currentScenario = 1;
let animationSpeed = 1;
let time = 0;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 150;

// Panning state
let isPanning = false;
let panOffset = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };

// Zoom state
let zoomLevel = 1.0;
const minZoom = 0.1;
const maxZoom = 5.0;

// Create Matter.js engine
const engine = Engine.create({
  gravity: { x: 0, y: 0 }, // No gravity for orbital mechanics
});

// Helper functions for drawing
function drawCircle(x, y, r, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, strokeStyle, lineWidth = 2) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawText(text, x, y, fillStyle, font = '12px Arial') {
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
}

// Calculate barycenter from two bodies
function calculateBarycenter(body1, body2) {
  const totalMass = body1.mass + body2.mass;
  return {
    x: (body1.position.x * body1.mass + body2.position.x * body2.mass) / totalMass,
    y: (body1.position.y * body1.mass + body2.position.y * body2.mass) / totalMass,
  };
}

class System {
  constructor() {
    this.reset();
  }

  reset() {
    // Clear the world
    World.clear(engine.world);
    Engine.clear(engine);

    // Reset state
    this.stringCut = false;
    this.cutTime = 0;
    this.rotationAngle = 0;
    this.barycenter = { x: centerX, y: centerY };

    // Reset trails
    this.trails = {
      ball1: [],
      ball2: [],
      ball3: [],
      pin: [],
      barycenter: [],
    };

    // Create physics bodies
    this.createBodies();
    this.createConstraints();
  }

  createBodies() {
    const ballMass = 1;
    const pinMass = 0.001; // Very light initially

    // Create pin first
    this.pin = Bodies.circle(centerX, centerY, SIZES.pinDefault, {
      mass: pinMass,
      frictionAir: 0,
      friction: 0,
      restitution: 1,
      render: { fillStyle: COLORS.pin },
    });

    // For 3 ball system, position balls at 120 degrees apart
    if (currentScenario === 6) {
      const angle1 = 0;
      const angle2 = (2 * Math.PI) / 3; // 120 degrees
      const angle3 = (4 * Math.PI) / 3; // 240 degrees

      this.ball1 = Bodies.circle(
        centerX + radius * Math.cos(angle1),
        centerY + radius * Math.sin(angle1),
        SIZES.ball,
        {
          mass: ballMass,
          frictionAir: 0,
          friction: 0,
          restitution: 1,
          render: { fillStyle: COLORS.ball1 },
        },
      );

      this.ball2 = Bodies.circle(
        centerX + radius * Math.cos(angle2),
        centerY + radius * Math.sin(angle2),
        SIZES.ball,
        {
          mass: ballMass,
          frictionAir: 0,
          friction: 0,
          restitution: 1,
          render: { fillStyle: COLORS.ball2 },
        },
      );

      this.ball3 = Bodies.circle(
        centerX + radius * Math.cos(angle3),
        centerY + radius * Math.sin(angle3),
        SIZES.ball,
        {
          mass: ballMass,
          frictionAir: 0,
          friction: 0,
          restitution: 1,
          render: { fillStyle: COLORS.ball3 },
        },
      );

      // Set initial velocities for circular motion (tangent to radius)
      const speed = 1.5 * animationSpeed;
      Body.setVelocity(this.ball1, { x: -speed * Math.sin(angle1), y: speed * Math.cos(angle1) });
      Body.setVelocity(this.ball2, { x: -speed * Math.sin(angle2), y: speed * Math.cos(angle2) });
      Body.setVelocity(this.ball3, { x: -speed * Math.sin(angle3), y: speed * Math.cos(angle3) });

      World.add(engine.world, [this.ball1, this.ball2, this.ball3, this.pin]);
    } else {
      // Create balls at starting positions (2 ball system)
      this.ball1 = Bodies.circle(centerX + radius, centerY, SIZES.ball, {
        mass: ballMass,
        frictionAir: 0,
        friction: 0,
        restitution: 1,
        render: { fillStyle: COLORS.ball1 },
      });

      this.ball2 = Bodies.circle(centerX - radius, centerY, SIZES.ball, {
        mass: ballMass,
        frictionAir: 0,
        friction: 0,
        restitution: 1,
        render: { fillStyle: COLORS.ball2 },
      });

      // Set initial velocities for circular motion
      const speed = 1.5 * animationSpeed;
      Body.setVelocity(this.ball1, { x: 0, y: speed });
      Body.setVelocity(this.ball2, { x: 0, y: -speed });

      // Add bodies to world
      World.add(engine.world, [this.ball1, this.ball2, this.pin]);
    }
  }

  createConstraints() {
    // String from ball1 to pin
    this.constraint1 = Constraint.create({
      bodyA: this.ball1,
      bodyB: this.pin,
      length: radius,
      stiffness: 1,
      damping: 0,
      render: { strokeStyle: COLORS.string },
    });

    // String from ball2 to pin
    this.constraint2 = Constraint.create({
      bodyA: this.ball2,
      bodyB: this.pin,
      length: radius,
      stiffness: 1,
      damping: 0,
      render: { strokeStyle: COLORS.string },
    });

    if (currentScenario === 6) {
      // String from ball3 to pin
      this.constraint3 = Constraint.create({
        bodyA: this.ball3,
        bodyB: this.pin,
        length: radius,
        stiffness: 1,
        damping: 0,
        render: { strokeStyle: COLORS.string },
      });

      World.add(engine.world, [this.constraint1, this.constraint2, this.constraint3]);
    } else {
      World.add(engine.world, [this.constraint1, this.constraint2]);
    }
  }

  update(scenario, dt) {
    if (isPaused) return;

    // Update physics engine
    Engine.update(engine, 16.67 * animationSpeed);

    // Handle scenario-specific updates first to calculate barycenter
    const updateMethods = {
      1: () => this.updateTwoBalls(dt),
      2: () => this.updateLightPin(dt),
      3: () => this.updateMassivePin(dt),
      4: () => this.updateFixedPin(dt),
      5: () => this.updateZeroMassPin(dt),
      6: () => this.updateThreeBalls(dt),
      7: () => this.updateEqualMassPin(dt),
    };

    updateMethods[scenario]?.();

    // Add trail points after barycenter is calculated
    this.addTrailPoint('ball1', this.ball1.position.x, this.ball1.position.y);
    if (this.ball2 && (currentScenario === 1 || (currentScenario > 1 && !this.stringCut))) {
      this.addTrailPoint('ball2', this.ball2.position.x, this.ball2.position.y);
    }
    if (this.ball3 && (currentScenario === 6 && !this.stringCut)) {
      this.addTrailPoint('ball3', this.ball3.position.x, this.ball3.position.y);
    }
    this.addTrailPoint('pin', this.pin.position.x, this.pin.position.y);

    // Add barycenter trail when it's being drawn
    const shouldDrawBarycenter = currentScenario === 1
      || (currentScenario >= 2 && currentScenario <= 4 && this.stringCut)
      || currentScenario === 6
      || (currentScenario === 7 && this.stringCut);
    if (shouldDrawBarycenter) {
      this.addTrailPoint('barycenter', this.barycenter.x, this.barycenter.y);
    }

    // Remove old trail points (older than 5 seconds)
    this.cleanupTrails();
  }

  addTrailPoint(object, x, y) {
    this.trails[object].push({
      x,
      y,
      time,
    });
  }

  cleanupTrails() {
    const maxAge = 5; // 5 seconds
    ['ball1', 'ball2', 'ball3', 'pin', 'barycenter'].forEach((obj) => {
      this.trails[obj] = this.trails[obj].filter((point) => time - point.time < maxAge);
    });
  }

  updateTwoBalls() {
    // Calculate barycenter
    this.barycenter = calculateBarycenter(this.ball1, this.ball2);
  }

  updateLightPin(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball2 and its constraint
      World.remove(engine.world, this.constraint2);
      World.remove(engine.world, this.ball2);

      // Set pin to light mass
      Body.setMass(this.pin, 0.2);
    }

    if (this.stringCut) {
      this.barycenter = calculateBarycenter(this.ball1, this.pin);
    }
  }

  updateMassivePin(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball2 and its constraint
      World.remove(engine.world, this.constraint2);
      World.remove(engine.world, this.ball2);

      // Set pin to massive
      Body.setMass(this.pin, 5);
    }

    if (this.stringCut) {
      this.barycenter = calculateBarycenter(this.ball1, this.pin);
    }
  }

  updateFixedPin(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball2 and its constraint
      World.remove(engine.world, this.constraint2);
      World.remove(engine.world, this.ball2);

      // Make pin static (infinite mass)
      Body.setStatic(this.pin, true);
    }

    if (this.stringCut) {
      this.barycenter = { x: this.pin.position.x, y: this.pin.position.y };
    }
  }

  updateZeroMassPin(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball2 and its constraint
      World.remove(engine.world, this.constraint2);
      World.remove(engine.world, this.ball2);

      // Set pin to nearly zero mass
      Body.setMass(this.pin, 0.0001);
    }

    if (this.stringCut) {
      // Barycenter is essentially at the ball
      this.barycenter = { x: this.ball1.position.x, y: this.ball1.position.y };
    }
  }

  updateThreeBalls(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball3 and its constraint
      World.remove(engine.world, this.constraint3);
      World.remove(engine.world, this.ball3);
    }

    // Calculate barycenter of remaining bodies
    if (this.stringCut) {
      // After cut: ball1, ball2, and pin
      const totalMass = this.ball1.mass + this.ball2.mass + this.pin.mass;
      this.barycenter = {
        x: (this.ball1.position.x * this.ball1.mass
          + this.ball2.position.x * this.ball2.mass
          + this.pin.position.x * this.pin.mass) / totalMass,
        y: (this.ball1.position.y * this.ball1.mass
          + this.ball2.position.y * this.ball2.mass
          + this.pin.position.y * this.pin.mass) / totalMass,
      };
    } else {
      // Before cut: all three balls and pin
      const totalMass = this.ball1.mass + this.ball2.mass + this.ball3.mass + this.pin.mass;
      this.barycenter = {
        x: (this.ball1.position.x * this.ball1.mass
          + this.ball2.position.x * this.ball2.mass
          + this.ball3.position.x * this.ball3.mass
          + this.pin.position.x * this.pin.mass) / totalMass,
        y: (this.ball1.position.y * this.ball1.mass
          + this.ball2.position.y * this.ball2.mass
          + this.ball3.position.y * this.ball3.mass
          + this.pin.position.y * this.pin.mass) / totalMass,
      };
    }
  }

  updateEqualMassPin(dt) {
    this.rotationAngle += dt * animationSpeed;

    if (!this.stringCut && time > 4) {
      this.stringCut = true;
      this.cutTime = time;

      // Remove ball2 and its constraint
      World.remove(engine.world, this.constraint2);
      World.remove(engine.world, this.ball2);

      // Set pin to equal mass as ball
      Body.setMass(this.pin, 1);
    }

    if (this.stringCut) {
      this.barycenter = calculateBarycenter(this.ball1, this.pin);
    }
  }

  draw() {
    // Clear canvas
    ctx.fillStyle = COLORS.trail;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply pan offset and zoom
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    this.drawTrails();
    this.drawBarycenter();
    this.drawStrings();
    this.drawObjects();
    this.drawVelocityVectors();

    ctx.restore();

    // Draw UI elements without pan offset or zoom
    this.drawCutIndicator();
  }

  drawTrails() {
    const maxAge = 5; // 5 seconds

    // Draw trail for ball 1
    this.trails.ball1.forEach((point) => {
      const age = time - point.time;
      const alpha = Math.max(0, 1 - age / maxAge);
      ctx.fillStyle = COLORS.ball1;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw trail for ball 2
    this.trails.ball2.forEach((point) => {
      const age = time - point.time;
      const alpha = Math.max(0, 1 - age / maxAge);
      ctx.fillStyle = COLORS.ball2;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw trail for ball 3
    this.trails.ball3.forEach((point) => {
      const age = time - point.time;
      const alpha = Math.max(0, 1 - age / maxAge);
      ctx.fillStyle = COLORS.ball3;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw trail for pin
    this.trails.pin.forEach((point) => {
      const age = time - point.time;
      const alpha = Math.max(0, 1 - age / maxAge);
      ctx.fillStyle = COLORS.pin;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw trail for barycenter
    this.trails.barycenter.forEach((point) => {
      const age = time - point.time;
      const alpha = Math.max(0, 1 - age / maxAge);
      ctx.fillStyle = COLORS.barycenter;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }

  drawBarycenter() {
    const shouldDrawStandard = currentScenario === 1
            || (currentScenario >= 2 && currentScenario <= 4 && this.stringCut)
            || currentScenario === 6
            || (currentScenario === 7 && this.stringCut);

    if (shouldDrawStandard) {
      drawCircle(this.barycenter.x, this.barycenter.y, SIZES.barycenterDot, COLORS.barycenter);

      let label = 'Barycenter';
      if (currentScenario === 2 && this.stringCut) {
        label = 'Barycenter (near ball)';
      } else if (currentScenario === 7 && this.stringCut) {
        label = 'Barycenter (midpoint)';
      }
      drawText(label, this.barycenter.x + 10, this.barycenter.y - 10, COLORS.barycenter);
    }

    if (currentScenario === 5 && this.stringCut) {
      drawText(
        'Barycenter = Ball',
        this.ball1.position.x + 20,
        this.ball1.position.y - 20,
        COLORS.barycenter,
      );
    }
  }

  drawStrings() {
    // For 3 ball system
    if (currentScenario === 6) {
      // Ball 1 to Pin
      drawLine(
        this.ball1.position.x,
        this.ball1.position.y,
        this.pin.position.x,
        this.pin.position.y,
        COLORS.string,
      );

      // Ball 2 to Pin
      if (this.ball2) {
        drawLine(
          this.ball2.position.x,
          this.ball2.position.y,
          this.pin.position.x,
          this.pin.position.y,
          COLORS.string,
        );
      }

      // Ball 3 to Pin (only before cut)
      if (this.ball3 && !this.stringCut) {
        drawLine(
          this.ball3.position.x,
          this.ball3.position.y,
          this.pin.position.x,
          this.pin.position.y,
          COLORS.string,
        );
      }
    } else {
      // For 2 ball system
      // String between Ball 1 and Ball 2 (cut after stringCut)
      if (currentScenario === 1 || (currentScenario > 1 && !this.stringCut)) {
        if (this.ball2) {
          drawLine(
            this.ball1.position.x,
            this.ball1.position.y,
            this.ball2.position.x,
            this.ball2.position.y,
            COLORS.string,
          );
        }
      }

      // String between Ball 1 and Pin (remains after cut in all scenarios)
      drawLine(
        this.ball1.position.x,
        this.ball1.position.y,
        this.pin.position.x,
        this.pin.position.y,
        COLORS.string,
      );

      // String between Ball 2 and Pin (cut after stringCut)
      if (currentScenario === 1 || (currentScenario > 1 && !this.stringCut)) {
        if (this.ball2) {
          drawLine(
            this.ball2.position.x,
            this.ball2.position.y,
            this.pin.position.x,
            this.pin.position.y,
            COLORS.string,
          );
        }
      }
    }
  }

  drawObjects() {
    // Draw pin
    const pinSize = {
      3: SIZES.pinMassive,
      5: SIZES.pinZeroMass,
    }[currentScenario] || SIZES.pinDefault;

    drawCircle(this.pin.position.x, this.pin.position.y, pinSize, COLORS.pin);

    // Draw balls
    drawCircle(this.ball1.position.x, this.ball1.position.y, SIZES.ball, COLORS.ball1);

    if (this.ball2 && (currentScenario === 1
       || (currentScenario > 1 && !this.stringCut) || currentScenario === 6)) {
      drawCircle(this.ball2.position.x, this.ball2.position.y, SIZES.ball, COLORS.ball2);
    }

    if (this.ball3 && currentScenario === 6 && !this.stringCut) {
      drawCircle(this.ball3.position.x, this.ball3.position.y, SIZES.ball, COLORS.ball3);
    }
  }

  drawVelocityVectors() {
    const scale = 30;

    // Draw velocity vector for ball 1
    drawLine(
      this.ball1.position.x,
      this.ball1.position.y,
      this.ball1.position.x + this.ball1.velocity.x * scale,
      this.ball1.position.y + this.ball1.velocity.y * scale,
      COLORS.velocity,
    );

    // Draw velocity vector for ball 2 (if it exists)
    if (this.ball2 && (currentScenario === 1
      || (currentScenario > 1 && !this.stringCut) || currentScenario === 6)) {
      drawLine(
        this.ball2.position.x,
        this.ball2.position.y,
        this.ball2.position.x + this.ball2.velocity.x * scale,
        this.ball2.position.y + this.ball2.velocity.y * scale,
        COLORS.velocity,
      );
    }

    // Draw velocity vector for ball 3 (if it exists)
    if (this.ball3 && currentScenario === 6 && !this.stringCut) {
      drawLine(
        this.ball3.position.x,
        this.ball3.position.y,
        this.ball3.position.x + this.ball3.velocity.x * scale,
        this.ball3.position.y + this.ball3.velocity.y * scale,
        COLORS.velocity,
      );
    }
  }

  drawCutIndicator() {
    if (this.stringCut && currentScenario > 1) {
      const message = currentScenario === 6 ? '✂ BALL 3 CUT FREE' : '✂ STRING CUT';
      drawText(message, 20, 40, COLORS.cut, 'bold 20px Arial');
    }

    if (currentScenario === 5 && this.stringCut) {
      drawText(
        'BALL ORBITING ITSELF!',
        centerX - 120,
        50,
        COLORS.selfOrbit,
        'bold 24px Arial',
      );
      drawText(
        '(Straight line = orbit with R=0)',
        centerX - 110,
        80,
        COLORS.selfOrbit,
        '18px Arial',
      );
    }
  }
}

const system = new System();

function animate() {
  const dt = 0.016 * animationSpeed;
  time += dt;

  system.update(currentScenario, dt);
  system.draw();

  requestAnimationFrame(animate);
}

function setScenario(scenario) {
  currentScenario = scenario;
  system.reset();
  time = 0;
  panOffset = { x: 0, y: 0 };
  zoomLevel = 1.0;

  document.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
  document.getElementById(`scenario${scenario}`).classList.add('active');

  const infoData = SCENARIO_INFO[scenario];
  info.innerHTML = `<h3>${infoData.title}</h3><p>${infoData.text}</p>`;
}

function togglePause() {
  isPaused = !isPaused;
}

function reset() {
  system.reset();
  time = 0;
  panOffset = { x: 0, y: 0 };
  zoomLevel = 1.0;
}

function updateSpeed(value) {
  animationSpeed = parseFloat(value);
  document.getElementById('speedValue').textContent = `${animationSpeed.toFixed(1)}x`;
}

// Initialize event listeners
function initEventListeners() {
  // Scenario buttons
  for (let i = 1; i <= 7; i += 1) {
    document.getElementById(`scenario${i}`)
      .addEventListener('click', () => setScenario(i));
  }

  // Control buttons
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('resetBtn').addEventListener('click', reset);
  document.getElementById('speedSlider').addEventListener(
    'input',
    (e) => updateSpeed(e.target.value),
  );

  // Mouse panning
  canvas.addEventListener('mousedown', (e) => {
    isPanning = true;
    lastMousePos = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      panOffset.x += dx;
      panOffset.y += dy;
      lastMousePos = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('mouseup', () => {
    isPanning = false;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('mouseleave', () => {
    isPanning = false;
    canvas.style.cursor = 'grab';
  });

  // Mouse wheel zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate world position before zoom
    const worldX = (mouseX - panOffset.x) / zoomLevel;
    const worldY = (mouseY - panOffset.y) / zoomLevel;

    // Update zoom level
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel * zoomFactor));

    // Calculate new pan offset to zoom towards mouse
    panOffset.x = mouseX - worldX * newZoom;
    panOffset.y = mouseY - worldY * newZoom;

    zoomLevel = newZoom;
  }, { passive: false });

  // Set initial cursor
  canvas.style.cursor = 'grab';
}

// Start the animation
initEventListeners();
setScenario(1);
animate();
