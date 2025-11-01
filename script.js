// Basic spooky effects: ghost spawns and follows cursor, countdown timer, SFX toggle

const ghostLayer = document.getElementById('ghost-layer');
const ambience = document.getElementById('ambience');
const sfxBtn = document.getElementById('start-sfx');

// Toggle ambience
sfxBtn.onclick = () => {
  if (ambience.paused) { ambience.play(); sfxBtn.innerText='Silence' }
  else { ambience.pause(); sfxBtn.innerText='Toggle Atmosphere' }
}

// Create ghost element
function spawnGhost(x=200,y=200){
  const g = document.createElement('div');
  g.className = 'ghost';
  g.style.position='absolute';
  g.style.left=(x)+'px';
  g.style.top=(y)+'px';
  g.style.width='72px';
  g.style.height='96px';
  g.style.pointerEvents='none';
  g.style.opacity=0.85;
  g.style.transform='translate(-50%,-50%)';
  g.innerHTML = `
    <svg viewBox="0 0 64 64" width="72" height="96" aria-hidden="true">
      <path d="M32 6c-9 0-16 7-16 16v12c0 5 4 9 9 9h14c5 0 9-4 9-9V22c0-9-7-16-16-16z" fill="white" opacity="0.9"/>
    </svg>`;
  ghostLayer.appendChild(g);
  // float animation
  g.animate([{transform:'translate(-50%,-50%) translateY(-6px)'},{transform:'translate(-50%,-50%) translateY(6px)'}],{duration:3000+Math.random()*3000,iterations:Infinity,easing:'ease-in-out'});
  // gently fade and remove after a while
  setTimeout(()=>g.remove(), 22000);
}

// spawn a few ghosts on load
for(let i=0;i<3;i++) spawnGhost(200 + i*120, 200 + (i%2)*40);

// cursor-follow ghost (one persistent)
let follower = document.createElement('div');
follower.className='ghost';
follower.style.position='absolute';
follower.style.width='92px';
follower.style.height='120px';
follower.style.pointerEvents='none';
follower.style.opacity=0.95;
follower.style.transform='translate(-50%,-50%)';
follower.innerHTML = `<svg viewBox="0 0 64 64"><path d="M32 6c-9 0-16 7-16 16v12c0 5 4 9 9 9h14c5 0 9-4 9-9V22c0-9-7-16-16-16z" fill="white" opacity="0.92"/></svg>`;
ghostLayer.appendChild(follower);
let mouse = {x:window.innerWidth/2,y:window.innerHeight/2};
window.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
function tick(){
  const rect = follower.getBoundingClientRect();
  const fx = rect.left + rect.width/2;
  const fy = rect.top + rect.height/2;
  const dx=(mouse.x - fx)*0.08, dy=(mouse.y - fy)*0.08;
  follower.style.left = (fx + dx)+'px';
  follower.style.top = (fy + dy)+'px';
  requestAnimationFrame(tick);
}
tick();

// Halloween countdown
const countdownEl = document.getElementById('countdown');
function updateCountdown(){
  const now = new Date();
  const year = now.getMonth()===9 && now.getDate()>31 ? now.getFullYear()+1 : now.getFullYear();
  const target = new Date(year, 9, 31, 0, 0, 0); // Oct 31
  const diff = target - now;
  if (diff <= 0) countdownEl.textContent = "🎃 Happy Halloween! 🎃";
  else {
    const days = Math.floor(diff/86400000);
    const hours = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    countdownEl.textContent = `Halloween in ${days}d ${hours}h ${mins}m`;
  }
}
setInterval(updateCountdown, 10000);
updateCountdown();


// === ⚡ PHASE 2: HauntHouse Awakens ===

// 🎇 Lightning system
const sky = document.querySelector('.sky');
const thunderSounds = [
  'assets/audio/thunder1.mp3',
  'assets/audio/thunder2.mp3'
];
let lightningActive = false;

function triggerLightning() {
  if (lightningActive) return;
  lightningActive = true;
  const flash = document.createElement('div');
  flash.style.position = 'absolute';
  flash.style.inset = 0;
  flash.style.background = 'white';
  flash.style.opacity = 0;
  flash.style.transition = 'opacity 0.1s';
  sky.appendChild(flash);

  // flash sequence
  setTimeout(() => flash.style.opacity = 0.8, 50);
  setTimeout(() => flash.style.opacity = 0, 250);
  setTimeout(() => flash.remove(), 400);

  // thunder sound
  const audio = new Audio(thunderSounds[Math.floor(Math.random() * thunderSounds.length)]);
  audio.volume = 0.6;
  setTimeout(() => audio.play(), 500 + Math.random() * 1200);

  setTimeout(() => lightningActive = false, 8000 + Math.random() * 8000);
}

// random lightning
setInterval(() => {
  if (Math.random() < 0.1) triggerLightning();
}, 5000);

// 🌫️ Fog drift animation
const fog = document.getElementById('fog-layer');
let fogX = 0;
function animateFog() {
  fogX += 0.05;
  fog.style.backgroundPosition = `${fogX}px ${fogX * 0.5}px`;
  requestAnimationFrame(animateFog);
}
animateFog();

// 🪞 Window flicker effect
const windows = document.querySelectorAll('.window');
function flickerWindows() {
  windows.forEach(w => {
    if (Math.random() < 0.3) {
      w.style.background = `rgba(255, 200, 80, ${Math.random() * 0.8})`;
    } else {
      w.style.background = '#1a191a';
    }
  });
}
setInterval(flickerWindows, 600);

// 🕹️ Ghost Mode (Easter Egg)
let combo = [];
const secret = ['g','h','o','s','t'];
window.addEventListener('keydown', e => {
  combo.push(e.key.toLowerCase());
  if (combo.slice(-secret.length).join('') === secret.join('')) {
    activateGhostMode();
    combo = [];
  }
});

function activateGhostMode() {
  document.body.classList.add('ghost-mode');
  const msg = document.createElement('div');
  msg.textContent = '👻 GHOST MODE ACTIVATED 👻';
  msg.style.position = 'fixed';
  msg.style.top = '50%';
  msg.style.left = '50%';
  msg.style.transform = 'translate(-50%,-50%)';
  msg.style.padding = '1rem 2rem';
  msg.style.background = 'rgba(0,0,0,0.7)';
  msg.style.color = '#fff';
  msg.style.fontSize = '1.4rem';
  msg.style.borderRadius = '10px';
  msg.style.zIndex = '9999';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
  // add visual ghost overlay
  const overlay = document.createElement('div');
  overlay.style.position='fixed';
  overlay.style.inset='0';
  overlay.style.background='radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 60%)';
  overlay.style.pointerEvents='none';
  overlay.style.mixBlendMode='screen';
  overlay.style.animation='ghostFade 6s infinite';
  document.body.appendChild(overlay);
}

// 🍬 Candy portal
const portal = document.createElement('button');
portal.id = 'portal';
portal.textContent = '🍭 ENTER THE CANDY REALM 🍭';
portal.style.position = 'fixed';
portal.style.bottom = '2rem';
portal.style.right = '2rem';
portal.style.background = 'linear-gradient(90deg, orange, purple)';
portal.style.color = 'white';
portal.style.border = 'none';
portal.style.padding = '0.8rem 1.2rem';
portal.style.borderRadius = '10px';
portal.style.cursor = 'pointer';
portal.style.boxShadow = '0 0 12px rgba(0,0,0,0.4)';
portal.style.zIndex = '99';
document.body.appendChild(portal);

portal.onclick = () => {
  window.location.href = 'games/find-the-candy.html';
};
