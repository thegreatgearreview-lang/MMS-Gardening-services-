(function(){
  const CODE10='GARDEN10';
  const CODE25='MMSMARK25';
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
      box.innerHTML='<strong>🌱 MMS Garden Club</strong><p style="margin:7px 0 10px;color:#62736b;font-size:14px">Garden Club members can enter their discount code below.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="garden-discount-code" type="text" placeholder="" autocomplete="off" style="flex:1;min-width:180px;padding:10px;border:1px solid #cfd9d1;border-radius:9px;font:inherit;text-transform:uppercase"><button id="garden-discount-apply" type="button" class="btn">Apply discount</button></div><div id="garden-discount-status" style="margin-top:9px;font-weight:700;min-height:20px"></div>';
      const totalBox=el.querySelector('.basket-total'); if(totalBox) totalBox.before(box); else el.appendChild(box);
      document.getElementById('garden-discount-apply').addEventListener('click',apply);
      const input=document.getElementById('garden-discount-code'); input.addEventListener('keydown',e=>{if(e.key==='Enter')apply()});
    }
    document.getElementById('garden-discount-code').value='';
    const saved=localStorage.getItem(KEY);
    if(saved==='true')localStorage.setItem(KEY,'10');
    const rate=localStorage.getItem(KEY);
    if(rate==='10'||rate==='25')showApplied(Number(rate));
  }
  function apply(){const input=document.getElementById('garden-discount-code'),status=document.getElementById('garden-discount-status');const code=String(input.value||'').trim().toUpperCase();let rate=0;if(code===CODE10)rate=10;if(code===CODE25)rate=25;if(!rate){status.textContent='That code is not recognised.';return}localStorage.setItem(KEY,String(rate));input.value='';showApplied(rate)}
  function showApplied(rate){const el=document.getElementById('basket');if(!el)return;const old=el.querySelector('#garden-discount-total');if(old)old.remove();const t=total(),discount=t*(rate/100),newTotal=t-discount;const label=rate===25?'Special customer discount (25%)':'Garden Club discount (10%)';const totalBox=el.querySelector('.basket-total');if(totalBox){totalBox.innerHTML='<strong>Subtotal: '+money(t)+'</strong><div id="garden-discount-total" style="margin-top:6px;color:#2f6b46"><strong>'+label+': −'+money(discount)+'</strong><br><strong style="font-size:18px">Total: '+money(newTotal)+'</strong></div>'}const status=document.getElementById('garden-discount-status');if(status)status.textContent=(rate===25?'Special customer discount applied ✓':'Garden Club discount applied ✓')}
  function init(){const el=document.getElementById('basket');if(!el)return;render()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
