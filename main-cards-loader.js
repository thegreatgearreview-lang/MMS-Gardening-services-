// MMS main-page card loader
// Each main-page service card lives in its own editable file under /main-cards/.
// This keeps picture, title, description and link independent.
(function(){
  const domestic = [
    ['Garden Maintenance','garden-maintenance.html'],
    ['Planting & Borders','planting-borders.html'],
    ['Seasonal Tidy-Ups','seasonal-tidy-ups.html'],
    ['Hedge Work — One of Our Specialities','hedge-work.html'],
    ['Lawn Care','lawn-care.html'],
    ['Snow Clearing & Salt Spreading','snow-clearing-salt-spreading.html'],
    ['Aquatics & Water Features','aquatics-water-features.html']
  ];
  const commercial = [
    ['Office & Business Grounds','office-business-grounds.html'],
    ['Industrial Sites','industrial-sites.html'],
    ['Car Parks & Communal Areas','car-parks-communal-areas.html'],
    ['Autumn & Winter Grounds Work','autumn-winter-grounds-work.html']
  ];
  async function loadCard(sectionSelector,title,file){
    const section=document.querySelector(sectionSelector); if(!section)return;
    const grid=section.querySelector('.grid, .commercial-grid'); if(!grid)return;
    const old=[...grid.querySelectorAll('article')].find(a=>a.querySelector('h3')?.textContent.trim()===title);
    if(!old)return;
    const oldLink=old.closest('a');
    try{
      const r=await fetch('./main-cards/'+file,{cache:'no-cache'}); if(!r.ok)return;
      const html=(await r.text()).trim(); if(!html)return;
      const holder=document.createElement('div'); holder.innerHTML=html;
      const newArticle=holder.querySelector('article'); if(!newArticle)return;
      const link=newArticle.closest('a');
      if(link){
        link.className='service-card-link';
        link.href=link.getAttribute('href').replace(/^\.\.\//,'');
        link.innerHTML=newArticle.outerHTML;
        if(oldLink)oldLink.replaceWith(link); else old.replaceWith(link);
      }else{
        if(oldLink)oldLink.replaceWith(newArticle); else old.replaceWith(newArticle);
      }
    }catch(e){console.warn('MMS card file could not be loaded:',file,e)}
  }
  function addStyle(){
    if(document.getElementById('mms-independent-card-style'))return;
    const s=document.createElement('style'); s.id='mms-independent-card-style';
    s.textContent='.grid .service-card-link article,.commercial-grid .service-card-link article{height:100%}.grid .service-card-link img,.commercial-grid .service-card-link img{display:block;width:100%;height:190px;object-fit:cover}.grid .service-card-link article h3,.commercial-grid .service-card-link article h3{margin-top:18px}.grid .service-card-link article p,.commercial-grid .service-card-link article p{margin-bottom:0}';
    document.head.appendChild(s);
  }
  async function init(){
    if(!(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')))return;
    addStyle();
    for(const [t,f] of domestic)await loadCard('#services',t,f);
    for(const [t,f] of commercial)await loadCard('#commercial-services',t,f);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
