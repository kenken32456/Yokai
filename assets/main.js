
const themeBtn=document.getElementById('themeToggle');
const root=document.documentElement;
function setTheme(t){root.setAttribute('data-theme',t);themeBtn.textContent=t==='dark'?'Dark':'Light';}
setTheme(localStorage.getItem('theme')||'dark');
themeBtn.addEventListener('click',()=>{const n=root.getAttribute('data-theme')==='dark'?'light':'dark';setTheme(n);localStorage.setItem('theme',n)});
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('mobileNav').classList.toggle('hidden'));

(async function(){
  const [s,p,e]=await Promise.all([
    fetch('./assets/content/settings.json',{cache:'no-store'}),
    fetch('./assets/content/portfolio.json',{cache:'no-store'}),
    fetch('./assets/content/events.json',{cache:'no-store'}).catch(()=>({ok:false,json:async()=>({items:[]})}))
  ]);
  const settings = await s.json();
  const portfolio = await p.json();
  const events = e.ok ? await e.json() : {items:[]};

  document.getElementById('brandName').textContent=settings.name||'Yokai Ink';
  document.getElementById('footerName').textContent=settings.name||'Yokai Ink';
  document.getElementById('phoneTxt').textContent=settings.phone||'';
  document.getElementById('emailTxt').textContent=settings.email||'';
  document.getElementById('addressTxt').textContent=settings.address||'';
  const ig=document.getElementById('igBox'); if(settings.instagram) ig.href=settings.instagram;

  const grid=document.getElementById('grid'); grid.innerHTML='';
  (portfolio.items||[]).forEach(item=>{
    const c=document.createElement('div');
    c.className='group relative rounded-2xl overflow-hidden bg-zinc-800 reveal';
    c.innerHTML=`<img src='${item.src}' alt='${item.title||""}' class='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'/>
    <div class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
    <div class='absolute bottom-2 left-2 right-2 flex items-center justify-between'><div><p class='text-sm font-medium'>${item.title||""}</p><p class='text-xs text-zinc-300'>${(item.tags||[]).join(' • ')}</p></div><div class='text-xs opacity-80'>+</div></div>`;
    grid.appendChild(c);
  });

  const list=document.getElementById('eventsList'); list.innerHTML='';
  (events.items||[]).forEach(ev=>{
    const d=document.createElement('div');
    d.className='glass p-5 rounded-2xl reveal';
    d.innerHTML=`<div class='flex items-center justify-between'><h3 class='font-semibold'>${ev.title||"Event"}</h3><span class='text-xs opacity-70'>${ev.date||""}</span></div><p class='text-sm mt-2 text-zinc-300'>${ev.description||""}</p>`;
    list.appendChild(d);
  });

  document.getElementById('year').textContent=new Date().getFullYear();

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.2});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

const lenis=new Lenis({smoothWheel:true}); function raf(t){lenis.raf(t);requestAnimationFrame(raf)} requestAnimationFrame(raf);
gsap.registerPlugin(ScrollTrigger); gsap.to('.parallax img',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'.parallax',scrub:true}});
