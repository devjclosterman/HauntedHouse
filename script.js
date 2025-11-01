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
