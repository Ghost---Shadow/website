// Constants
const COLORS = {
    ball1: '#ff6b6b',
    ball2: '#4ecdc4',
    pin: '#ffd700',
    string: 'rgba(255, 255, 255, 0.3)',
    momentumExchange: '#90EE90',
    barycenter: 'rgba(255, 215, 0, 0.8)',
    velocity: 'rgba(255, 255, 255, 0.8)',
    cut: '#ff0000',
    trail: '#0a0a0a'
};

const SIZES = {
    ball: 15,
    pinDefault: 8,
    pinMassive: 12,
    pinZeroMass: 4,
    barycenterRadius: 20,
    barycenterDot: 4
};

const SCENARIO_INFO = {
    1: {
        title: "Two Balls System",
        text: "Two balls exchange momentum through the string. Each ball 'donates' v cos θ and receives the same from its partner. The pin experiences zero net force."
    },
    2: {
        title: "Light Pin - Small Binary System",
        text: "When Ball 2 is cut free, the remaining string keeps Ball 1 connected to the light pin. They form a small binary system orbiting their barycenter (very close to the ball due to mass difference)."
    },
    3: {
        title: "Massive Pin - Binary System",
        text: "With a massive pin, Ball 1 finds a new exchange partner. They form a binary system orbiting their common barycenter - like twin stars!"
    },
    4: {
        title: "Fixed Pin - Standard Orbit",
        text: "An infinitely massive (fixed) pin provides perfect counter-momentum without moving. Ball 1 orbits the stationary pin - classic circular motion."
    },
    5: {
        title: "Zero Mass Pin - Self Orbit!",
        text: "With zero mass, the pin cannot exchange momentum. Ball 1 moves in a straight line while the massless pin trails behind at a fixed distance. The ball is 'orbiting itself' with the barycenter at the ball!"
    }
};

// Global state
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

let animationId;
let isPaused = false;
let currentScenario = 1;
let animationSpeed = 1;
let time = 0;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 150;

// Helper functions for drawing
function drawCircle(x, y, r, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawArc(x, y, r, strokeStyle, lineWidth = 2, dashed = false) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    if (dashed) ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    if (dashed) ctx.setLineDash([]);
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

class System {
    constructor() {
        this.reset();
    }

    reset() {
        this.angle = 0;
        this.ball1 = { x: 0, y: 0, vx: 0, vy: 0 };
        this.ball2 = { x: 0, y: 0, vx: 0, vy: 0 };
        this.pin = { x: centerX, y: centerY, mass: 1, vx: 0, vy: 0 };
        this.stringCut = false;
        this.cutTime = 0;
        this.barycenter = { x: centerX, y: centerY };
        this.initialDist = 0;
        this.initialAngle = 0;
    }

    update(scenario, dt) {
        const updateMethods = {
            1: () => this.updateTwoBalls(dt),
            2: () => this.updateLightPin(dt),
            3: () => this.updateMassivePin(dt),
            4: () => this.updateFixedPin(dt),
            5: () => this.updateZeroMassPin(dt)
        };

        updateMethods[scenario]?.();
    }

    updateTwoBalls(dt) {
        this.angle += dt * animationSpeed;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        this.ball1.x = centerX + radius * cos;
        this.ball1.y = centerY + radius * sin;
        this.ball2.x = centerX - radius * cos;
        this.ball2.y = centerY - radius * sin;

        const speed = radius * animationSpeed;
        this.ball1.vx = -speed * sin;
        this.ball1.vy = speed * cos;
        this.ball2.vx = speed * sin;
        this.ball2.vy = -speed * cos;
    }

    handleStringCut(cutAngleThreshold, pinMass) {
        if (!this.stringCut && this.angle > cutAngleThreshold) {
            this.stringCut = true;
            this.cutTime = time;
            this.pin.mass = pinMass;
            return true;
        }
        return false;
    }

    updateLightPin(dt) {
        if (!this.stringCut) {
            this.updateTwoBalls(dt);
            if (this.handleStringCut(Math.PI / 2, 0.1)) {
                // Store initial conditions at cut time
                this.initialDist = radius;
                this.initialAngle = Math.atan2(
                    this.ball1.y - this.pin.y,
                    this.ball1.x - this.pin.x
                );
                // Calculate barycenter at cut time
                const totalMass = 1 + this.pin.mass;
                this.barycenter.x = (this.ball1.x + this.pin.x * this.pin.mass) / totalMass;
                this.barycenter.y = (this.ball1.y + this.pin.y * this.pin.mass) / totalMass;
            }
        } else {
            // Light pin system orbits barycenter while maintaining string length
            const timeSinceCut = time - this.cutTime;
            const orbitAngle = this.initialAngle + timeSinceCut * animationSpeed;
            const totalMass = 1 + this.pin.mass;

            // Calculate orbit radii based on masses
            const ball1Radius = this.initialDist * this.pin.mass / totalMass;
            const pinRadius = this.initialDist * 1 / totalMass;

            // Both objects orbit the barycenter, maintaining string length
            const cos = Math.cos(orbitAngle);
            const sin = Math.sin(orbitAngle);

            this.ball1.x = this.barycenter.x + ball1Radius * cos;
            this.ball1.y = this.barycenter.y + ball1Radius * sin;
            this.pin.x = this.barycenter.x - pinRadius * cos;
            this.pin.y = this.barycenter.y - pinRadius * sin;
        }
    }

    updateMassivePin(dt) {
        if (!this.stringCut) {
            this.updateTwoBalls(dt);
            if (this.handleStringCut(Math.PI / 2, 5)) {
                this.initialDist = Math.hypot(
                    this.ball1.x - this.pin.x,
                    this.ball1.y - this.pin.y
                );
                this.initialAngle = Math.atan2(
                    this.ball1.y - this.pin.y,
                    this.ball1.x - this.pin.x
                );
            }
        } else {
            const timeSinceCut = time - this.cutTime;
            const orbitAngle = this.initialAngle + timeSinceCut * animationSpeed;
            const totalMass = 1 + this.pin.mass;
            const ball1Radius = this.initialDist * this.pin.mass / totalMass;
            const pinRadius = this.initialDist * 1 / totalMass;

            if (timeSinceCut === 0) {
                const barycenterX = (this.ball1.x * 1 + this.pin.x * this.pin.mass) / totalMass;
                const barycenterY = (this.ball1.y * 1 + this.pin.y * this.pin.mass) / totalMass;
                this.barycenter.x = barycenterX;
                this.barycenter.y = barycenterY;
            }

            const cos = Math.cos(orbitAngle);
            const sin = Math.sin(orbitAngle);
            this.ball1.x = this.barycenter.x + ball1Radius * cos;
            this.ball1.y = this.barycenter.y + ball1Radius * sin;
            this.pin.x = this.barycenter.x - pinRadius * cos;
            this.pin.y = this.barycenter.y - pinRadius * sin;
        }

        this.updateBarycenter();
    }

    updateFixedPin(dt) {
        if (!this.stringCut) {
            this.updateTwoBalls(dt);
            this.handleStringCut(Math.PI / 2, Infinity);
        } else {
            const orbitAngle = this.angle + (time - this.cutTime) * animationSpeed;
            this.ball1.x = centerX + radius * Math.cos(orbitAngle);
            this.ball1.y = centerY + radius * Math.sin(orbitAngle);
            this.barycenter.x = this.pin.x;
            this.barycenter.y = this.pin.y;
        }
    }

    updateZeroMassPin(dt) {
        if (!this.stringCut) {
            this.updateTwoBalls(dt);
            if (this.handleStringCut(Math.PI / 2, 0)) {
                // Store the initial angle between ball and pin
                this.initialAngle = Math.atan2(
                    this.pin.y - this.ball1.y,
                    this.pin.x - this.ball1.x
                );
            }
        } else {
            // Ball moves in straight line
            this.ball1.x += this.ball1.vx * dt;
            this.ball1.y += this.ball1.vy * dt;

            // Pin maintains fixed distance (string length) from ball
            // It stays on the opposite side of the ball's direction of motion
            this.pin.x = this.ball1.x + radius * Math.cos(this.initialAngle);
            this.pin.y = this.ball1.y + radius * Math.sin(this.initialAngle);

            // Barycenter is at the ball (zero mass pin)
            this.barycenter.x = this.ball1.x;
            this.barycenter.y = this.ball1.y;
        }
    }

    updateBarycenter() {
        if (this.stringCut) {
            const totalMass = 1 + this.pin.mass;
            this.barycenter.x = (this.ball1.x + this.pin.x * this.pin.mass) / totalMass;
            this.barycenter.y = (this.ball1.y + this.pin.y * this.pin.mass) / totalMass;
        }
    }

    draw() {
        // Draw trail
        ctx.fillStyle = COLORS.trail;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawBarycenter();
        this.drawStrings();
        this.drawMomentumExchange();
        this.drawObjects();
        this.drawVelocityVectors();
        this.drawCutIndicator();
    }

    drawBarycenter() {
        const shouldDrawStandard = currentScenario === 1 ||
            (currentScenario >= 2 && currentScenario <= 4 && this.stringCut);

        if (shouldDrawStandard) {
            drawCircle(this.barycenter.x, this.barycenter.y, SIZES.barycenterDot, COLORS.barycenter);

            const label = (currentScenario === 2 && this.stringCut)
                ? 'Barycenter (near ball)'
                : 'Barycenter';
            drawText(label, this.barycenter.x + 10, this.barycenter.y - 10, COLORS.barycenter);
        }

        if (currentScenario === 5 && this.stringCut) {
            drawText('Barycenter = Ball', this.ball1.x + 20,
                this.ball1.y - 20, COLORS.barycenter);
        }
    }

    drawStrings() {
        // String between Ball 1 and Ball 2 (cut after stringCut)
        if (currentScenario === 1 || (currentScenario > 1 && !this.stringCut)) {
            drawLine(this.ball1.x, this.ball1.y, this.ball2.x, this.ball2.y, COLORS.string);
        }

        // String between Ball 1 and Pin (remains after cut in all scenarios)
        drawLine(this.ball1.x, this.ball1.y, this.pin.x, this.pin.y, COLORS.string);

        // String between Ball 2 and Pin (cut after stringCut)
        if (currentScenario === 1 || (currentScenario > 1 && !this.stringCut)) {
            drawLine(this.ball2.x, this.ball2.y, this.pin.x, this.pin.y, COLORS.string);
        }
    }

    drawMomentumExchange() {
        if (currentScenario === 1 && Math.sin(time * 2) > 0) {
            const midX = (this.ball1.x + this.ball2.x) / 2;
            const midY = (this.ball1.y + this.ball2.y) / 2;
            const offset = 20;

            drawLine(this.ball1.x, this.ball1.y,
                midX + offset * Math.sin(time * 3),
                midY + offset * Math.cos(time * 3),
                COLORS.momentumExchange, 3);

            drawLine(this.ball2.x, this.ball2.y,
                midX - offset * Math.sin(time * 3),
                midY - offset * Math.cos(time * 3),
                COLORS.momentumExchange, 3);
        }
    }

    drawObjects() {
        // Draw pin
        const pinSize = currentScenario === 3 ? SIZES.pinMassive :
            (currentScenario === 5 ? SIZES.pinZeroMass : SIZES.pinDefault);
        drawCircle(this.pin.x, this.pin.y, pinSize, COLORS.pin);

        // Draw balls
        drawCircle(this.ball1.x, this.ball1.y, SIZES.ball, COLORS.ball1);

        if (currentScenario === 1 || (currentScenario > 1 && !this.stringCut)) {
            drawCircle(this.ball2.x, this.ball2.y, SIZES.ball, COLORS.ball2);
        }
    }

    drawVelocityVectors() {
        if (currentScenario === 1 && !this.stringCut) {
            this.drawDetailedVelocityDecomposition();
        } else {
            // Simple velocity vector
            const scale = 0.3;
            drawLine(this.ball1.x, this.ball1.y,
                this.ball1.x + this.ball1.vx * scale,
                this.ball1.y + this.ball1.vy * scale,
                'rgba(255, 255, 255, 0.5)');
        }
    }

    drawDetailedVelocityDecomposition() {
        const angle = this.angle;
        const vMagnitude = radius * animationSpeed;
        const scale = 0.5;
        const dt = 0.016 * animationSpeed;
        const dAngle = dt;

        // Radial and tangential directions
        const radialX = Math.cos(angle);
        const radialY = Math.sin(angle);
        const tangentialX = -Math.sin(angle);
        const tangentialY = Math.cos(angle);

        // Total velocity vector (white)
        drawLine(this.ball1.x, this.ball1.y,
            this.ball1.x + this.ball1.vx * scale,
            this.ball1.y + this.ball1.vy * scale,
            COLORS.velocity, 3);

        // Tangential component v sin(dθ) (green) - retained
        const tangentialComponent = vMagnitude * Math.sin(dAngle) * scale;
        drawLine(this.ball1.x, this.ball1.y,
            this.ball1.x + tangentialX * tangentialComponent * 10,
            this.ball1.y + tangentialY * tangentialComponent * 10,
            COLORS.momentumExchange);

        // Radial component v cos(dθ) (yellow) - exchanged
        const radialComponent = vMagnitude * Math.cos(dAngle) * scale;
        drawLine(this.ball1.x, this.ball1.y,
            this.ball1.x + radialX * radialComponent,
            this.ball1.y + radialY * radialComponent,
            COLORS.pin);

        // Labels
        drawText('v sin θ (retained)', this.ball1.x + 30, this.ball1.y - 30,
            COLORS.momentumExchange, '14px Arial');
        drawText('v cos θ (exchanged)', this.ball1.x + 30, this.ball1.y - 15,
            COLORS.pin, '14px Arial');
    }

    drawCutIndicator() {
        if (this.stringCut && currentScenario > 1) {
            drawText('✂ STRING CUT', 20, 40, COLORS.cut, 'bold 20px Arial');
        }

        if (currentScenario === 5 && this.stringCut) {
            drawText('BALL ORBITING ITSELF!', centerX - 120, 50,
                COLORS.momentumExchange, 'bold 24px Arial');
            drawText('(Straight line = orbit with R=0)', centerX - 110, 80,
                COLORS.momentumExchange, '18px Arial');
        }
    }
}

const system = new System();

function animate() {
    if (!isPaused) {
        const dt = 0.016 * animationSpeed;
        time += dt;

        system.update(currentScenario, dt);
        system.draw();
    }

    animationId = requestAnimationFrame(animate);
}

function setScenario(scenario) {
    currentScenario = scenario;
    system.reset();
    time = 0;

    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('scenario' + scenario).classList.add('active');

    const infoData = SCENARIO_INFO[scenario];
    info.innerHTML = `<h3>${infoData.title}</h3><p>${infoData.text}</p>`;
}

function togglePause() {
    isPaused = !isPaused;
}

function reset() {
    system.reset();
    time = 0;
}

function updateSpeed(value) {
    animationSpeed = parseFloat(value);
    document.getElementById('speedValue').textContent = animationSpeed.toFixed(1) + 'x';
}

// Initialize event listeners
function initEventListeners() {
    // Scenario buttons
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`scenario${i}`)
            .addEventListener('click', () => setScenario(i));
    }

    // Control buttons
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('speedSlider').addEventListener('input',
        (e) => updateSpeed(e.target.value));
}

// Start the animation
initEventListeners();
setScenario(1);
animate();
