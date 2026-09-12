(function(){
  const KEY='mmsGardenDiscount';
  const BASKET='mmsBasket';

  // Permanent member discount plus flexible special offers.
  // Add future plant offers here without changing the basket system.
  const OFFERS={
    GARDEN10:{rate:10,label:'Garden Club discount (10%)',allItems:true},
    MMSMARK25:{rate:25,label:'Special customer discount (25%)',allItems:true}
    // Example future offer:
    // FIG20:{rate:20,label:'Garden Club Fig offer (20%)',products:['Brown Turkey Fig'],expires:'2026-09-30'}
  };

  function read(){try{return JSON.parse(localStorage.getItem(BASKET)||'[]')}catch(e){return[]}}
  function price(v){const m=String(v||'').replace(/,/g,'').match(/\d+(?:\.\d+)?/);return m?Number(m[0]):0}
  function money(n){return '£'+n.toFixed(2)}
  function activeOffer(code){
    const offer=OFFERS[code];
    if(!offer)return null;
    if(offer.expires){
      const today=new Date(); today.setHours(23,59,59,999);
      if(today>new Date(offer.expires+'T23:59:59'))return null;
    }
    return offer;
  }
  function itemEligible(item,offer){
    if(offer.allItems)return true;
    const name=String(item&&item.name||'').trim().toLowerCase();
    return Array.isArray(offer.products)&&offer.products.some(p=>name===String(p).trim().toLowerCase());
  }
  function calculate(code){
    const offer=activeOffer(code); if(!offer)return{total:0,discount:0,eligible:false};
    const items=read();
    let total=0,discount=0,eligible=false;
    items.forEach(item=>{
      const line=price(item.price)*(Math.max(1,parseInt(item.quantity,10)||1));
      total+=line;
      if(itemEligible(item,offer)){discount+=line*(offer.rate/100);eligible=true}
    });
    return{total,discount,eligible};
  }
  function render(){
    const el=document.getElementById('basket'); if(!el||!read().length)return;
    let box=document.getElementById('garden-discount-box');
    if(!box){
      box=document.createElement('div'); box.id='garden-discount-box'; box.style.cssText='margin-top:18px;padding:18px;background:#edf3ec;border:1px solid #2f6b46;border-radius:14px';
      box.innerHTML='<strong>🌱 MMS Garden Club</strong><p style="margin:7px 0 10px;color:#62736b;font-size:14px">Garden Club members can enter their discount code below.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="garden-discount-code" type="text" placeholder="" autocomplete="off" style="flex:1;min-width:180px;padding:10px;border:1px solid #cfd9d1;border-radius:9px;font:inherit;text-transform:uppercase"><button id="garden-discount-apply" type="button" class="btn">Apply discount</button></div><div id="garden-discount-status" style="margin-top:9px;font-weight:700;min-height:20px"></div>';
      const totalBox=el.querySelector('.basket-total'); if(totalBox)totalBox.before(box); else el.appendChild(box);
      document.getElementById('garden-discount-apply').addEventListener('click',apply);
      const input=document.getElementById('garden-discount-code'); input.addEventListener('keydown',e=>{if(e.key==='Enter')apply()});
    }
    document.getElementById('garden-discount-code').value='';
    const saved=localStorage.getItem(KEY);
    if(saved==='10')localStorage.setItem(KEY,'GARDEN10');
    if(saved==='25')localStorage.setItem(KEY,'MMSMARK25');
    const code=localStorage.getItem(KEY);
    if(code&&activeOffer(code))showApplied(code);
  }
  function apply(){
    const input=document.getElementById('garden-discount-code'),status=document.getElementById('garden-discount-status');
    const code=String(input.value||'').trim().toUpperCase();
    const offer=activeOffer(code);
    if(!offer){status.textContent='That code is not recognised or has expired.';return}
    const result=calculate(code);
    if(!offer.allItems&&!result.eligible){status.textContent='That offer does not apply to anything currently in your basket.';return}
    localStorage.setItem(KEY,code); input.value=''; showApplied(code);
  }
  function showApplied(code){
    const el=document.getElementById('basket'); if(!el)return;
    const offer=activeOffer(code); if(!offer)return;
    const result=calculate(code);
    const old=el.querySelector('#garden-discount-total'); if(old)old.remove();
    const totalBox=el.querySelector('.basket-total');
    if(totalBox){
      totalBox.innerHTML='<strong>Subtotal: '+money(result.total)+'</strong><div id="garden-discount-total" style="margin-top:6px;color:#2f6b46"><strong>'+offer.label+': −'+money(result.discount)+'</strong><br><strong style="font-size:18px">Total: '+money(result.total-result.discount)+'</strong></div>';
    }
    const status=document.getElementById('garden-discount-status');
    if(status)status.textContent=offer.label+' applied ✓';
  }
  function init(){const el=document.getElementById('basket');if(!el)return;render()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
