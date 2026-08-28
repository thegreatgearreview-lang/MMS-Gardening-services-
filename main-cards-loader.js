// MMS main-page card loader
// Each card is an independent file under /main-cards/.
// The loader never uses one card's HTML, image or link to build another card.
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

  async function getCard(file){
    const r=await fetch('./main-cards/'+file+'?v=independent-20260828',{cache:'no-store'});
    if(!r.ok)throw new Error('Card file unavailable: '+file);
    const holder=document.createElement('div');
    holder.innerHTML=(await r.text()).trim();
    const article=holder.querySelector('article[data-main-card]');
    if(!article)throw new Error('Invalid card file: '+file);
    const link=article.closest('a');
    if(link){
      link.className='service-card-link';
      const target=link.getAttribute('href');
      if(target)link.href=target.replace(/^\.\.\//,'');
      link.innerHTML=article.outerHTML;
      return link;
    }
    return article;
  }

  function findExisting(grid,title,key){
    return [...grid.children].find(el=>
      el.matches('[data-main-card="'+key+'"], .service-card-link:has([data-main-card="'+key+'"])') ||
      el.querySelector?.('[data-main-card="'+key+'"]') ||
      el.querySelector?.('h3')?.textContent.trim()===title
    );
  }

  async function loadCards(sectionSelector,items){
    const section=document.querySelector(sectionSelector); if(!section)return;
    const grid=section.querySelector('.grid, .commercial-grid'); if(!grid)return;
    for(const [title,file] of items){
      const key=file.replace(/\.html$/,'');
      try{
        const newCard=await getCard(file);
        const existing=findExisting(grid,title,key);
        if(existing) existing.replaceWith(newCard);
        else grid.appendChild(newCard);
      }catch(e){console.warn('MMS independent card could not be loaded:',file,e)}
    }
  }

  function addStyle(){
    if(document.getElementById('mms-independent-card-style'))return;
    const s=document.createElement('style');
    s.id='mms-independent-card-style';
    s.textContent='.grid .service-card-link article,.commercial-grid .service-card-link article{height:100%}.grid .service-card-link img,.commercial-grid .service-card-link img{display:block;width:100%;height:190px;object-fit:cover}.grid .service-card-link article h3,.commercial-grid .service-card-link article h3{margin-top:18px}.grid .service-card-link article p,.commercial-grid .service-card-link article p{margin-bottom:0}';
    document.head.appendChild(s);
  }

  async function init(){
    if(!(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')))return;
    addStyle();
    // Each file is fetched independently. A missing file cannot replace or delete another card.
    await Promise.all([
      loadCards('#services',domestic),
      loadCards('#commercial-services',commercial)
    ]);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
