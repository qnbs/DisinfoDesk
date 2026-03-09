// Virality Simulation Web Worker

type AgentType = 'NORMAL' | 'INFLUENCER' | 'BOT' | 'SKEPTIC';
type AgentState = 'SUSCEPTIBLE' | 'INCUBATING' | 'INFECTED' | 'RECOVERED';

interface Agent {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: AgentType;
    state: AgentState;
    infectionTimer: number;
    incubationTimer: number;
    resistance: number;
    affinity: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let _animFrame: number = 0;
let lastUpdate = 0;
let isPaused = false;
let isMobileMode = false;

let agents: Agent[] = [];
let particles: Particle[] = [];
let params: Record<string, number> = {
    emotionalPayload: 50,
    novelty: 50,
    visualProof: 50,
    echoChamberDensity: 50
};

// Physics
let width = 800;
let height = 400;

function initSimulation(customCount?: number) {
    if (!canvas) return;
    
    // Mobile optimization for count
    const count = customCount || (isMobileMode ? 100 : 300);
    
    agents = [];
    particles = [];

    // Bot factory
    for (let i=0; i<count; i++) {
        let type: AgentType = 'NORMAL';
        let state: AgentState = 'SUSCEPTIBLE';
        
        const rand = Math.random();
        if (rand < 0.05) type = 'INFLUENCER';
        else if (rand < 0.15) type = 'BOT';
        else if (rand < 0.3) type = 'SKEPTIC';

        if (i < 3) {
            type = 'BOT';
            state = 'INFECTED';
        }

        agents.push({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (type === 'BOT' ? 3 : 1.5),
            vy: (Math.random() - 0.5) * (type === 'BOT' ? 3 : 1.5),
            type,
            state,
            infectionTimer: state === 'INFECTED' ? 1000 : 0,
            incubationTimer: 0,
            resistance: type === 'SKEPTIC' ? 0.8 : type === 'INFLUENCER' ? 0.3 : 0.5,
            affinity: Math.random()
        });
    }
}

function spawnParticles(x: number, y: number, color: string, amount: number) {
    if (isMobileMode && particles.length > 50) return; // Throttle mobile
    for (let i=0; i<amount; i++) {
        particles.push({
            x, y,
            vx: (Math.random()-0.5)*4,
            vy: (Math.random()-0.5)*4,
            life: 1.0,
            color,
            size: Math.random() * 3 + 1
        });
    }
}

function render(time: number) {
    if (!ctx || !canvas) return;
    
    if (isPaused) {
        _animFrame = requestAnimationFrame(render);
        return;
    }

    // Stats Throttling
    if (time - lastUpdate > 500) {
        const inf = agents.filter(a => a.state === 'INFECTED').length;
        const rec = agents.filter(a => a.state === 'RECOVERED').length;
        self.postMessage({ type: 'STATS', infected: inf, recovered: rec });
        lastUpdate = time;
    }

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let x=0; x<width; x+=100) { ctx.moveTo(x,0); ctx.lineTo(x,height); }
    for(let y=0; y<height; y+=100) { ctx.moveTo(0,y); ctx.lineTo(width,y); }
    ctx.stroke();

    const infectionRadius = 40 + (params.echoChamberDensity * 0.5);

    for (let i=0; i<agents.length; i++) {
        const a = agents[i];

        if (a.type !== 'INFLUENCER') {
            if (params.echoChamberDensity > 50) {
                const targetX = a.affinity * width;
                a.vx += (targetX - a.x) * 0.0005 * (params.echoChamberDensity / 100);
            }
            a.x += a.vx;
            a.y += a.vy;

            if (a.x < 0 || a.x > width) a.vx *= -1;
            if (a.y < 0 || a.y > height) a.vy *= -1;
        } else {
            // Influencers move to center
            a.x += (width/2 - a.x) * 0.01;
            a.y += (height/2 - a.y) * 0.01;
        }

        if (a.state === 'INCUBATING') {
            a.incubationTimer--;
            if (a.incubationTimer <= 0) {
                a.state = 'INFECTED';
                a.infectionTimer = 800 + (params.novelty * 10);
                spawnParticles(a.x, a.y, '#ef4444', 5);
            }
        } else if (a.state === 'INFECTED' && a.type !== 'BOT') {
            a.infectionTimer--;
            if (a.infectionTimer <= 0) {
                a.state = 'RECOVERED';
                spawnParticles(a.x, a.y, '#10b981', 8);
            }
        }

        if (a.state === 'INFECTED') {
            for (let j=0; j<agents.length; j++) {
                if (i===j) continue;
                const b = agents[j];
                if (b.state !== 'SUSCEPTIBLE') continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < infectionRadius) {
                    const power = ((params.emotionalPayload + params.visualProof) / 200) * (a.type === 'BOT' ? 1.5 : 1.0);
                    const susceptibility = 1.0 - (b.resistance || 0);
                    
                    if (Math.random() < power * susceptibility * 0.05) {
                        b.state = 'INCUBATING';
                        b.incubationTimer = 100 - (params.novelty * 0.5);
                        
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - dist/infectionRadius})`;
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                }
            }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.type === 'INFLUENCER' ? 6 : a.type === 'BOT' ? 4 : 3, 0, Math.PI * 2);
        
        if (a.state === 'INFECTED') ctx.fillStyle = '#ef4444';
        else if (a.state === 'INCUBATING') ctx.fillStyle = '#f59e0b';
        else if (a.state === 'RECOVERED') ctx.fillStyle = '#10b981';
        else ctx.fillStyle = a.type === 'SKEPTIC' ? '#3b82f6' : '#64748b';
        
        ctx.fill();

        if (a.state === 'INFECTED' || a.state === 'INCUBATING') {
            ctx.beginPath();
            ctx.arc(a.x, a.y, (a.type === 'INFLUENCER' ? 12 : 8) + Math.sin(time*0.01)*2, 0, Math.PI*2);
            ctx.strokeStyle = a.state === 'INFECTED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';
            ctx.stroke();
        }
    }

    for (let i=particles.length-1; i>=0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    _animFrame = requestAnimationFrame(render);
}

self.onmessage = (e) => {
    const { type, payload } = e.data;
    switch(type) {
        case 'INIT':
            canvas = payload.canvas;
            width = payload.width;
            height = payload.height;
            isMobileMode = payload.isMobileMode;
            ctx = canvas!.getContext('2d');
            initSimulation();
            _animFrame = requestAnimationFrame(render);
            break;
        case 'UPDATE_PARAMS':
            params = { ...params, ...payload };
            break;
        case 'PAUSE':
            isPaused = payload;
            break;
        case 'RESTART':
            initSimulation();
            break;
        case 'RESIZE':
            width = payload.width;
            height = payload.height;
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
            }
            break;
    }
}

self.addEventListener('message', (e) => {
    if (e.data.type === 'INTERACT') {
        const { x, y, tool } = e.data.payload;
        if (tool === 'CURE') {
            for (const a of agents) {
                const dx = a.x - x, dy = a.y - y;
                if (dx*dx+dy*dy < 2500) { a.state = 'RECOVERED'; a.infectionTimer = 0; }
            }
        } else if (tool === 'INFECT' || tool === 'INJECT_BOTS') {
            for (const a of agents) {
                const dx = a.x - x, dy = a.y - y;
                if (dx*dx+dy*dy < 2500 && a.state === 'SUSCEPTIBLE') { 
                    a.state = 'INFECTED'; a.infectionTimer = 1000;
                    spawnParticles(a.x, a.y, '#ef4444', 10);
                }
            }
        }
    }
});
