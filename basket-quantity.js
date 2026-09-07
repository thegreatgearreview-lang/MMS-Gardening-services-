(function(){
  const KEY='mmsBasket';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function write(b){localStorage.setItem(KEY,JSON.stringify(b))}
  function key(x){return [x.name||'',x.price||'',x.category||''].join('|')}
  function mappedDeliveryClass(x){
    const cfg=window.MMS_NURSERY_DELIVERY;
    const product=cfg&&cfg.products?cfg.products[x.name]:null;
    return x.deliveryClass||product?.deliveryClass||((x.category||'Nursery')==='Nursery'?'UNMAPPED':'');
  }
  function normalise(b){
    const out=[];const map=new Map();
    b.forEach(x=>{
      if(!x||!x.name)return;
      const k=key(x);let item=map.get(k);
      if(!item){
        item={name:x.name,price:x.price||'',category:x.category||'Nursery',quantity:0,deliveryClass:mappedDeliveryClass(x)};
        map.set(k,item);out.push(item)
      }
      item.quantity+=Math.max(1,parseInt(x.quantity,10)||1);
      if(item.deliveryClass==='UNMAPPED')item.deliveryClass=mappedDeliveryClass(x);
    });
    return out
  }
  function total(b){return normalise(b).reduce((n,x)=>n+x.quantity,0)}
  function priceNumber(value){const m=String(value||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):0}
  function money(n){return '£'+n.toFixed(2)}
  function basketTotal(b){return normalise(b).reduce((n,x)=>n+(priceNumber(x.price)*x.quantity),0)}
  function deliveryReady(b){
    const cfg=window.MMS_NURSERY_DELIVERY;
    if(!cfg||!cfg.live||!cfg.carrierRates||!Object.keys(cfg.carrierRates).length)return false;
    const items=normalise(b);
    return items.length>0&&items.every(x=>x.deliveryClass&&x.deliveryClass!=='UNMAPPED');
  }
  function deliveryTotal(b){
    // Intentionally returns null until live carrier rates, packing costs and
    // physical parcel measurements have been confirmed in the delivery config.
    if(!deliveryReady(b))return null;
    return null;
  }
  function ensureHomeMenuCount(){if(!(location.pathname==='/'||location.pathname.endsWith('/index.html')))return;const menu=document.getElementById('mobileMenu');if(!menu)return;let count=menu.querySelector('#basket-count');if(!count){count=document.createElement('span');count.id='basket-count';count.setAttribute('aria-label','Basket items');count.style.cssText='display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 6px;box-sizing:border-box;margin-left:6px;background:#d00000;color:#fff;font:900 13px/1 Arial,system-ui,sans-serif;border-radius:999px;vertical-align:4px;box-shadow:0 1px 3px rgba(0,0,0,.25)';menu.appendChild(count)}}
  function updateCounts(){ensureHomeMenuCount();const n=total(read());document.querySelectorAll('#basket-count').forEach(e=>{e.textContent=n;e.style.display=n>0?'inline-flex':'none'})}
  function esc(s){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
  function addPressStyle(){if(document.getElementById('basket-feedback-style'))return;const s=document.createElement('style');s.id='basket-feedback-style';s.textContent='.basket-pressed{transform:scale(.97)!important;filter:brightness(.9)!important;transition:transform .06s ease,filter .06s ease!important}.basket-added{transition:transform .08s ease,filter .08s ease!important}';document.head.appendChild(s)}
  function pressFeedback(button){if(!button)return;button.classList.add('basket-pressed');setTimeout(()=>button.classList.remove('basket-pressed'),120);if(typeof navigator.vibrate==='function')navigator.vibrate(35)}
  function feedback(button){if(!button)return;button.classList.remove('basket-added');void button.offsetWidth;button.classList.add('basket-added');const old=button.textContent;button.textContent='✓ Added';setTimeout(()=>{button.textContent=old;button.classList.remove('basket-added')},650);if(typeof navigator.vibrate==='function')navigator.vibrate(45)}
  function ensureQtyFields(){document.querySelectorAll('.plant-buy,.buy').forEach(box=>{const button=box.querySelector('button');if(!button||!/basket/i.test(button.textContent)||box.querySelector('.qty'))return;const input=document.createElement('input');input.className='qty';input.type='number';input.min='1';input.step='1';input.value='1';input.inputMode='numeric';const card=box.closest('.plant-card,.product-card');const name=card?.querySelector('h2,h3')?.textContent?.trim()||'plant';input.setAttribute('aria-label','Quantity '+name);box.insertBefore(input,button)})}
  function add(name,price,category,button){const card=button?.closest('.plant-card,.product-card,.size,.ground-card,.log-card,.buy-row,.log-buy-wrap,.buy');const input=card?.querySelector('.qty');const quantity=Math.max(1,parseInt(input?.value||'1',10)||1);const b=normalise(read());const k=key({name,price,category});const item=b.find(x=>key(x)===k);if(item)item.quantity+=quantity;else b.push({name,price,category:category||'Nursery',quantity,deliveryClass:mappedDeliveryClass({name,price,category})});write(b);updateCounts();feedback(button)}
  window.addToBasket=add;window.add=add;window.addPlant=add;window.addAnnabelle=add;window.updateBasketCount=updateCounts;window.getNurseryDeliveryStatus=function(){const b=normalise(read());const cfg=window.MMS_NURSERY_DELIVERY;return{live:!!cfg?.live,ready:deliveryReady(b),items:b.map(x=>({name:x.name,deliveryClass:x.deliveryClass})),deliveryTotal:deliveryTotal(b)}};
  function renderBasket(){const el=document.getElementById('basket');if(!el)return;let b=normalise(read());if(!b.length){el.innerHTML='<div class="basket-empty"><p>Your basket is empty.</p></div>';updateCounts();return}write(b);el.innerHTML=b.map((x,i)=>{const lineTotal=priceNumber(x.price)*x.quantity;return `<div class="basket-row"><div class="basket-item-info"><strong>${esc(x.name)}</strong><br><span>${esc(x.category||'Nursery')} · ${esc(x.price)} each · ${money(lineTotal)}</span></div><div class="basket-item-controls"><label>Qty <input class="basket-qty" type="number" min="0" step="1" value="${x.quantity}" inputmode="numeric" aria-label="Quantity ${esc(x.name)}" oninput="updateBasketQuantity(${i},this.value)"></label><button class="remove" onclick="removeItem(${i})">Remove</button></div></div>`}).join('')+`<div class="basket-total"><strong>Total: ${money(basketTotal(b))}</strong></div><div class="basket-actions"><button class="btn" onclick="sendOrder()">Send basket order</button></div>`;updateCounts()}
  window.updateBasketQuantity=function(i,value){const b=normalise(read());const q=Math.max(0,parseInt(value,10)||0);if(!b[i])return;if(q===0)b.splice(i,1);else b[i].quantity=q;write(b);renderBasket()};window.removeItem=function(i){const b=normalise(read());b.splice(i,1);write(b);renderBasket()};window.sendOrder=function(){alert('MMS Nursery shop not currently open.\n\nWe are getting our nursery stock ready. Online ordering will be available soon.\n\nPlease check back shortly!')};
  function init(){addPressStyle();ensureQtyFields();renderBasket();updateCounts();document.addEventListener('pointerdown',e=>{const button=e.target.closest('button.add,button.add-basket,.plant-buy button,.size button,.ground-card button,.log-card button');if(button)pressFeedback(button)},{passive:true})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.addEventListener('storage',()=>{ensureQtyFields();renderBasket();updateCounts()});
})();
