/* Pneu.com Jundiaí — interações sem dependências externas. */
(() => {
  'use strict';
  // TODO antes de publicar: confirmar o WhatsApp oficial com a oficina.
  const WA_NUMBER='5511991783385';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const header=$('#site-header');
  const progress=$('#scroll-progress');
  const navBtn=$('#nav-toggle');
  const mobileNav=$('#mobile-nav');
  function closeMenu(){mobileNav?.classList.remove('open');navBtn?.setAttribute('aria-expanded','false');navBtn?.setAttribute('aria-label','Abrir menu')}
  navBtn?.addEventListener('click',()=>{
    const next=!mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open',next);
    navBtn.setAttribute('aria-expanded',String(next));navBtn.setAttribute('aria-label',next?'Fechar menu':'Abrir menu');
  });
  $$('#mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeLightbox()}});
  document.addEventListener('click',e=>{if(mobileNav?.classList.contains('open') && !mobileNav.contains(e.target) && !navBtn.contains(e.target))closeMenu()});

  // Scroll progress + parallax share one rAF. Media is decorative, so reduced motion disables it.
  const parallaxItems=$$('[data-parallax]');let pending=false;
  function updateScroll(){
    const y=window.scrollY, doc=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=(doc>0?Math.max(0,Math.min(100,y/doc*100)):0)+'%';
    header?.classList.toggle('is-scrolled',y>15);
    if(!reduced.matches && window.innerWidth>600){
      for(const el of parallaxItems){
        const rect=el.parentElement.getBoundingClientRect();
        if(rect.bottom<0||rect.top>window.innerHeight)continue;
        const offset=(rect.top+rect.height/2-window.innerHeight/2)*parseFloat(el.dataset.parallax||'0.1');
        el.style.transform=`translate3d(0,${Math.max(-95,Math.min(95,-offset))}px,0) scale(1.18)`;
      }
    }
    pending=false;
  }
  window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateScroll)}},{passive:true});
  window.addEventListener('resize',()=>requestAnimationFrame(updateScroll),{passive:true});updateScroll();

  // IntersectionObserver animates only as content becomes visible (non-blocking).
  const observed=$$('.reveal,.reveal-mask');
  if(reduced.matches || !('IntersectionObserver' in window))observed.forEach(el=>el.classList.add('in-view'));
  else{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}})
    },{threshold:0.08,rootMargin:'0px 0px -12px 0px'});
    observed.forEach((el,i)=>{if(el.getBoundingClientRect().top<window.innerHeight*.95){el.classList.add('in-view')}else observer.observe(el)});
  }

  // User-controlled editorial service selector, fully keyboard-accessible.
  const services={
    diesel:{image:'assets/van-bay.webp',label:'VANS / PICAPES / UTILITÁRIOS',title:'DIESEL LEVE',description:'Para quem depende do veículo para trabalhar. Manutenção e revisão de vans, picapes e utilitários diesel leve.',href:'diesel-leve.html',alt:'Van em cenário de oficina, imagem conceitual'},
    alignment:{image:'assets/wheel-tech.webp',label:'DIREÇÃO / GEOMETRIA / ESTABILIDADE',title:'ALINHAMENTO',description:'Avaliação de geometria e balanceamento para direção mais estável, menos vibração e cuidado com os pneus.',href:'alinhamento-balanceamento.html',alt:'Detalhe de equipamento de alinhamento, imagem conceitual'},
    light:{image:'assets/inspection.webp',label:'CARROS / SUVS / REVISÕES',title:'LINHA LEVE',description:'Revisão e manutenção de carros e SUVs. Freios, suspensão, óleo e diagnóstico com explicação clara.',href:'linha-leve.html',alt:'Mecânico em inspeção de automóvel, imagem conceitual'},
    fleet:{image:'assets/hero-cinematic.webp',label:'EMPRESAS / FROTISTAS / TRANSPORTE',title:'FROTAS',description:'Manutenção planejada para empresas com vans, picapes e veículos leves. Solicite uma conversa sobre sua operação.',href:'frotas.html',alt:'Vans e picapes em imagem conceitual'}
  };
  const tabs=$$('.service-choice');let swapTimer;
  function activateTab(tab){
    const data=services[tab.dataset.service];if(!data)return;
    tabs.forEach(t=>{const sel=t===tab;t.classList.toggle('is-active',sel);t.setAttribute('aria-selected',String(sel));t.tabIndex=sel?0:-1});
    const img=$('#service-image');if(!img)return;
    const index=tabs.indexOf(tab)+1;
    img.classList.add('swap');clearTimeout(swapTimer);
    swapTimer=setTimeout(()=>{
      img.src=data.image;img.alt=data.alt;$('#service-photo-label').textContent=data.label;
      $('#service-counter').textContent=`0${index} / 04`;
      $('#service-title').textContent=data.title;
      $('#service-description').textContent=data.description;
      $('#service-link').href=data.href;
      img.classList.remove('swap');
    },150);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activateTab(tab));
    tab.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
      e.preventDefault();let next=(index+(e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:1)+tabs.length)%tabs.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;
      tabs[next].focus();activateTab(tabs[next]);
    });
  });
  // Lightweight modal for gallery images.
  const modal=$('#lightbox');const modalImg=$('#lightbox img');let restoreFocus;
  function closeLightbox(){if(!modal||modal.hidden)return;modal.hidden=true;document.body.style.overflow='';restoreFocus?.focus()}
  $$('.gallery-photo').forEach(btn=>btn.addEventListener('click',()=>{if(!modal)return;restoreFocus=btn;modalImg.src=btn.dataset.lightbox;modalImg.alt=btn.querySelector('img')?.alt||'Fotografia ilustrativa ampliada';modal.hidden=false;document.body.style.overflow='hidden';$('#lightbox .lightbox-close').focus()}));
  $('#lightbox .lightbox-close')?.addEventListener('click',closeLightbox);
  modal?.addEventListener('click',e=>{if(e.target===modal)closeLightbox()});
  // Working quote form: visitors build their own WhatsApp request. No backend or data storage.
  $$('[data-quote-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form),val=k=>String(data.get(k)||'').trim();
    const fleet=!!val('empresa');
    const parts=['Olá, Pneu.com Jundiaí! Vim pelo novo site e gostaria de solicitar '+(fleet?'uma proposta para a frota.':'um orçamento.'),''];
    if(fleet){parts.push('Empresa: '+val('empresa'),'Responsável: '+val('nome'),'Tamanho da frota: '+val('frota'),'Veículos: '+val('tipo'));}
    else{parts.push('Nome: '+(val('nome')||'Não informado'),'Veículo: '+val('tipo'),'Modelo e ano: '+val('modelo'),'Serviço: '+val('servico'));}
    parts.push('Observações: '+(val('detalhes')||'Não informadas'),'','Podemos conversar sobre avaliação e disponibilidade?');
    const url='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(parts.join('\n'));
    // window.location ensures it works even when the browser blocks popups.
    window.open(url,'_blank','noopener,noreferrer') || (window.location.href=url);
  }));
  $$('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'})}));
})();
