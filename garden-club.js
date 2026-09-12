(function(){
  function init(){
    if(document.getElementById('mms-garden-club'))return;
    const wrap=document.createElement('section');
    wrap.id='mms-garden-club';
    wrap.style.cssText='width:min(1120px,92%);margin:0 auto 60px;background:#edf3ec;border:2px solid #2f6b46;border-radius:22px;padding:34px;box-sizing:border-box;color:#183027';
    wrap.innerHTML='<small>🌱 MMS GARDEN CLUB</small><h2 style="font:600 38px/1.05 Georgia,serif;margin:10px 0 12px">Join the MMS Garden Club</h2><p style="color:#62736b;max-width:760px">Join our free Garden Club and get <strong>10% off your first MMS Nursery order</strong>, plus new plant stock, seasonal gardening news and exclusive offers.</p><form id="garden-club-form" style="display:grid;gap:12px;max-width:620px"><input name="firstName" placeholder="First name (optional)" autocomplete="given-name" style="padding:12px;border:1px solid #cfd9d1;border-radius:10px;font:inherit"><input name="email" type="email" placeholder="Email address" autocomplete="email" required style="padding:12px;border:1px solid #cfd9d1;border-radius:10px;font:inherit"><label style="font-size:13px;line-height:1.4"><input name="consent" type="checkbox" required style="margin-right:8px"> Yes, I'd like to receive MMS Garden Club news, nursery updates and offers by email.</label><button type="submit" style="border:0;border-radius:999px;background:#245b3a;color:#fff;padding:13px 18px;font-weight:800;font-size:16px;cursor:pointer">Join the Garden Club &amp; get 10% off</button><div class="garden-club-status" aria-live="polite" style="font-weight:700;min-height:22px"></div></form>';
    const nursery=document.querySelector('main');
    if(nursery) nursery.appendChild(wrap); else document.body.appendChild(wrap);
    const form=wrap.querySelector('form'),status=wrap.querySelector('.garden-club-status');
    form.addEventListener('submit',async function(e){e.preventDefault();status.textContent='Joining…';const data=Object.fromEntries(new FormData(form).entries());data.consent=form.consent.checked;try{const r=await fetch('/api/garden-club',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not join');localStorage.setItem('mmsGardenClub','true');localStorage.setItem('mmsGardenClubCode','GARDEN10');status.innerHTML='You’re in! 🌱 Your 10% discount code is <strong>GARDEN10</strong>. Check your email too.';form.reset()}catch(err){status.textContent=err.message}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
