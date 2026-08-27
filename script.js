// MMS Gardening Services
// Main-page card loader: each service card can be maintained independently.
// Nursery is included here so main-cards/nursery.html controls ONLY the main-page card.

async function loadIndependentMainCards(){
  if(!(location.pathname.endsWith('index.html') || location.pathname.endsWith('/'))) return;

  const map={
    maintenance:'main-cards/maintenance.html',
    planting:'main-cards/planting.html',
    tidy:'main-cards/tidy.html',
    hedges:'main-cards/hedges.html',
    lawn:'main-cards/lawn.html',
    winter:'main-cards/winter.html',
    aquatics:'main-cards/aquatics.html',
    office:'main-cards/office.html',
    industrial:'main-cards/industrial.html',
    carpark:'main-cards/carpark.html',
    seasonal:'main-cards/seasonal.html',
    nursery:'main-cards/nursery.html'
  };

  for(const [id,file] of Object.entries(map)){
    const section=document.getElementById(id) || document.querySelector(`[data-card-id="${id}"]`);
    if(!section) continue;
    try{
      const res=await fetch(file,{cache:'no-store'});
      if(!res.ok) continue;
      const html=await res.text();
      const holder=document.createElement('div');
      holder.innerHTML=html;
      const card=holder.querySelector('article,.service-card-link,[data-card]') || holder.firstElementChild;
      if(!card) continue;
      section.innerHTML='';
      section.appendChild(card);
    }catch(e){
      console.warn('Could not load independent card:',id,e);
    }
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadIndependentMainCards);
else loadIndependentMainCards();
