(function(){
  const CODE='GARDEN10';
  const KEY='mmsGardenDiscount';
  const BASKET='mmsBasket';
  function read(){try{return JSON.parse(localStorage.getItem(BASKET)||'[]')}catch(e){return[]}}
  function price(v){const m=String(v||'').replace(/,/g,'').match(/\d+(?:\.\d+)?/);return m?Number(m[0]):0}
  function total(){return read().reduce((n,x)=>n+(price(x.price)*(Math.max(1,parseInt(x.quantity,10)||1))),0)}
  function money(n){return '£'+n.toFixed(2)}
  function render(){
    const el=document.getElementById('basket'); if(!el||!read().length)return;
    let box=document.getElementById('garden-discount-box');
    if(!box){
      box=document.createElement('div'); box.id='garden-discount-box'; box.style.cssText='margin-top:18px;padding:18px;background:#edf3ec;border:1px solid #2f6b46;border-radius:14px';
      box.innerHTML='<strong>🌱 MMS Garden Club</strong><p style="margin:7px 0 10px;color:#62736b;font-size:14px">Garden Club members can enter their 10% discount code below.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="garden-discount-code" type="text" placeholder="GARDEN10" autocomplete="off" style="flex:1;min-width:180px;padding:10px;border:1px solid #cfd9d1;border-radius:9px;font:inherit;text-transform:uppercase"><button id="garden-discount-apply" type="button" class="btn">Apply 10% off</button></div><div id="garden-discount-status" style="margin-top:9px;font-weight:700;min-height:20px"></div>';
      const totalBox=el.querySelector('.basket-total'); if(totalBox) totalBox.before(box); else el.appendChild(box);
      document.getElementById('garden-discount-apply').addEventListener('click',apply);
      const input=document.getElementById('garden-discount-code'); input.addEventListener('keydown',e=>{if(e.key==='Enter')apply()});
    }
    const saved=localStorage.getItem(KEY)==='true';
    if(saved){document.getElementById('garden-discount-code').value=CODE;showApplied()}
  }
  function apply(){const input=document.getElementById('garden-discount-code'),status=document.getElementById('garden-discount-status');if(String(input.value||'').trim().toUpperCase()!==CODE){status.textContent='That code is not recognised.';return}localStorage.setItem(KEY,'true');showApplied()}
  function showApplied(){const el=document.getElementById('basket');if(!el)return;const old=el.querySelector('#garden-discount-total');if(old)old.remove();const t=total(),discount=t*.10,newTotal=t-discount;const totalBox=el.querySelector('.basket-total');if(totalBox){totalBox.innerHTML='<strong>Subtotal: '+money(t)+'</strong><div id="garden-discount-total" style="margin-top:6px;color:#2f6b46"><strong>Garden Club discount (10%): −'+money(discount)+'</strong><br><strong style="font-size:18px">Total: '+money(newTotal)+'</strong></div>'}const status=document.getElementById('garden-discount-status');if(status)status.textContent='Garden Club discount applied ✓'}
  function init(){const el=document.getElementById('basket');if(!el)return;new MutationObserver(()=>{render();if(localStorage.getItem(KEY)==='true')showApplied()}).observe(el,{childList:true,subtree:true});render()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
