(function(){
  const KEY='mmsBasket';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function write(b){localStorage.setItem(KEY,JSON.stringify(b))}
  function key(x){return [x.name||'',x.price||'',x.category||''].join('|')}
  function normalise(b){
    const out=[]; const map=new Map();
    b.forEach(x=>{
      if(!x||!x.name)return;
      const k=key(x); let item=map.get(k);
      if(!item){item={name:x.name,price:x.price||'',category:x.category||'Nursery',quantity:0};map.set(k,item);out.push(item)}
      item.quantity+=Math.max(1,parseInt(x.quantity,10)||1);
    });
    return out;
  }
  function total(b){return normalise(b).reduce((n,x)=>n+x.quantity,0)}
  function updateCounts(){
    const n=total(read());
    document.querySelectorAll('#basket-count').forEach(e=>e.textContent=n);
  }
  function esc(s){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
  function ensureQtyFields(){
    document.querySelectorAll('.plant-buy,.buy').forEach(box=>{
      const button=box.querySelector('button');
      if(!button||!/basket/i.test(button.textContent))return;
      if(box.querySelector('.qty'))return;
      const input=document.createElement('input');
      input.className='qty'; input.type='number'; input.min='1'; input.step='1'; input.value='1'; input.inputMode='numeric';
      const card=box.closest('.plant-card,.product-card');
      const name=card?.querySelector('h2,h3')?.textContent?.trim()||'plant';
      input.setAttribute('aria-label','Quantity '+name);
      box.insertBefore(input,button);
    });
  }
  function add(name,price,category,button){
    const card=button?.closest('.plant-card,.product-card');
    const input=card?.querySelector('.qty');
    const quantity=Math.max(1,parseInt(input?.value||'1',10)||1);
    const b=normalise(read());
    const k=key({name,price,category});
    const item=b.find(x=>key(x)===k);
    if(item)item.quantity+=quantity; else b.push({name,price,category:category||'Nursery',quantity});
    write(b); updateCounts();
    if(button){const old=button.textContent;button.textContent='✓ Added';setTimeout(()=>button.textContent=old,1200)}
  }
  window.addToBasket=add;
  window.add=add;
  function renderBasket(){
    const el=document.getElementById('basket'); if(!el)return;
    let b=normalise(read());
    if(!b.length){el.innerHTML='<div class="basket-empty"><p>Your basket is empty.</p><a class="btn" href="nursery.html">Browse the Nursery</a></div>';updateCounts();return}
    write(b);
    el.innerHTML=b.map((x,i)=>`<div class="basket-row"><div class="basket-item-info"><strong>${esc(x.name)}</strong><br><span>${esc(x.category||'Nursery')} · ${esc(x.price)}</span></div><div class="basket-item-controls"><label>Qty <input class="basket-qty" type="number" min="1" step="1" value="${x.quantity}" inputmode="numeric" aria-label="Quantity ${esc(x.name)}" onchange="updateBasketQuantity(${i},this.value)"></label><button class="remove" onclick="removeItem(${i})">Remove</button></div></div>`).join('')+'<div class="basket-actions"><button class="btn" onclick="sendOrder()">Send basket order</button><a class="btn light" href="nursery.html">Continue shopping</a></div>';
    updateCounts();
  }
  window.updateBasketQuantity=function(i,value){
    const b=normalise(read()); const q=Math.max(1,parseInt(value,10)||1);
    if(!b[i])return; b[i].quantity=q; write(b); renderBasket();
  };
  window.removeItem=function(i){const b=normalise(read());b.splice(i,1);write(b);renderBasket()};
  window.sendOrder=function(){
    const b=normalise(read());
    const lines=b.map(x=>`- ${x.name} x${x.quantity} (${x.price} each)`);
    const text=encodeURIComponent(`Hi MMS Gardening Services, I'd like to order from the nursery:\n${lines.join('\n')}\nPlease let me know collection/delivery and payment options.`);
    window.open(`https://wa.me/447989892662?text=${text}`,'_blank');
  };
  function init(){ensureQtyFields();renderBasket();updateCounts()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('storage',()=>{ensureQtyFields();renderBasket();updateCounts()});
})();