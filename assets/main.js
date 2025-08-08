
// Theme toggle
const themeBtn=document.getElementById('themeToggle');const root=document.documentElement;
function setTheme(t){root.setAttribute('data-theme',t);themeBtn.textContent=t==='dark'?'Dark':'Light';}
setTheme(localStorage.getItem('theme')||'dark');
themeBtn.addEventListener('click',()=>{const n=root.getAttribute('data-theme')==='dark'?'light':'dark';setTheme(n);localStorage.setItem('theme',n)});

// Lenis smooth scroll
const lenis = new Lenis({smoothWheel:true}); function raf(time){lenis.raf(time);requestAnimationFrame(raf)} requestAnimationFrame(raf);

// GSAP panel wipes
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.panel').forEach((panel,i)=>{
  ScrollTrigger.create({trigger:panel,start:'top bottom',onEnter:()=>panel.classList.add('in')});
});
gsap.utils.toArray('.panel').forEach((panel, i)=>{
  gsap.from(panel,{opacity:0,y:60,duration:0.8,ease:'power2.out',scrollTrigger:{trigger:panel,start:'top 75%'}});
});
// Parallax
gsap.to('.parallax img',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'.parallax',scrub:true}});

// Content loader
(async function(){
  const [s,p,e]=await Promise.all([
    fetch('./assets/content/settings.json',{cache:'no-store'}),
    fetch('./assets/content/portfolio.json',{cache:'no-store'}),
    fetch('./assets/content/events.json',{cache:'no-store'}).catch(()=>({ok:false,json:async()=>({items:[]})}))
  ]);
  const settings=await s.json(); const portfolio=await p.json(); const events=e.ok?await e.json():{items:[]};

  // Brand/contact
  document.getElementById('studioName').textContent=settings.name||'Yokai Ink';
  document.getElementById('footerName').textContent=settings.name||'Yokai Ink';
  document.getElementById('phoneTxt').textContent=settings.phone||'';
  document.getElementById('emailTxt').textContent=settings.email||'';
  document.getElementById('addressTxt').textContent=settings.address||'';
  const ig=document.getElementById('igBox'); if(settings.instagram) ig.href=settings.instagram;

  // Marquee + grid
  const track=document.getElementById('marqueeTrack');
  const grid=document.getElementById('grid');
  (portfolio.items||[]).forEach(item=>{
    const card=`<div class='relative h-44 w-72 rounded-xl overflow-hidden bg-zinc-800'><img src='${item.src}' alt='${item.title||""}' class='h-full w-full object-cover'/><div class='absolute inset-x-0 bottom-0 p-2 text-xs bg-gradient-to-t from-black/60 to-transparent'>${item.title||""}</div></div>`;
    track.insertAdjacentHTML('beforeend',card);
    const cell=document.createElement('div');
    cell.className='group relative rounded-2xl overflow-hidden bg-zinc-800 reveal';
    cell.innerHTML=`<img src='${item.src}' alt='${item.title||""}' class='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'/>
    <div class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
    <div class='absolute bottom-2 left-2 right-2 flex items-center justify-between'><div><p class='text-sm font-medium'>${item.title||""}</p><p class='text-xs text-zinc-300'>${(item.tags||[]).join(' • ')}</p></div><div class='text-xs opacity-80'>+</div></div>`;
    grid.appendChild(cell);
  });
  // simple marquee loop
  let x=0; function loop(){x-=0.5; track.style.transform=`translateX(${x}px)`; if(Math.abs(x) > track.scrollWidth/2) x=0; requestAnimationFrame(loop)} requestAnimationFrame(loop);

  // Events
  const list=document.getElementById('eventsList'); list.innerHTML='';
  (events.items||[]).forEach(ev=>{
    const d=document.createElement('div');
    d.className='glass p-5 rounded-2xl reveal';
    d.innerHTML=`<div class='flex items-center justify-between'><h3 class='font-semibold'>${ev.title||"Event"}</h3><span class='text-xs opacity-70'>${ev.date||""}</span></div><p class='text-sm mt-2 text-zinc-300'>${ev.description||""}</p>`;
    list.appendChild(d);
  });

  // Reveals
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.2});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Year
  document.getElementById('year').textContent=new Date().getFullYear();
})();
