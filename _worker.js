const BREVO_API = 'https://api.brevo.com/v3';
const SENDER = { name: 'MMS Gardening Services', email: 'thegreatgearreview@gmail.com' };
const MMS_EMAIL = 'e-mps@outlook.com';
const LISTS = { domestic: 3, commercial: 4, nursery: 5 };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'no-store' } });
}

async function brevo(path, apiKey, body) {
  return fetch(`${BREVO_API}${path}`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body)
  });
}

async function handleEnquiry(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.BREVO_API_KEY) return json({ error: 'Brevo is not configured yet.' }, 503);

  let data;
  try { data = await request.json(); } catch { return json({ error: 'Invalid form data.' }, 400); }
  const email = String(data.email || '').trim().toLowerCase();
  const type = String(data.enquiryType || 'domestic').toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (!LISTS[type]) return json({ error: 'Invalid enquiry type.' }, 400);

  const firstName = String(data.firstName || '').trim().slice(0, 80);
  const lastName = String(data.lastName || '').trim().slice(0, 80);
  const phone = String(data.phone || '').trim().slice(0, 40);
  const postcode = String(data.postcode || '').trim().slice(0, 20);
  const message = String(data.message || '').trim().slice(0, 4000);
  const marketing = data.marketing === true;
  const enquiryLabel = type === 'commercial' ? 'Commercial' : type === 'nursery' ? 'Nursery trade' : 'Domestic';

  const contactBody = {
    email,
    updateEnabled: true,
    listIds: [LISTS[type]],
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
      SMS: phone,
      POSTCODE: postcode,
      ENQUIRY_TYPE: enquiryLabel,
      OPT_IN: marketing
    }
  };

  const contactResponse = await brevo('/contacts', env.BREVO_API_KEY, contactBody);
  if (!contactResponse.ok) return json({ error: 'We could not save your enquiry to MMS.' }, 502);

  const safe = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const customerHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:620px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>Thanks for contacting MMS Gardening Services</h2><p>Thanks ${safe(firstName || 'there')}. We have received your ${safe(enquiryLabel.toLowerCase())} enquiry and will get back to you as soon as we can.</p><p><strong>Enquiry type:</strong> ${safe(enquiryLabel)}</p><p>If you need us urgently, call <a href="tel:+447989892662">07989 892662</a>.</p><p>Kind regards,<br>MMS Gardening Services</p></div></body></html>`;
  const internalHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:680px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>New website enquiry</h2><p><strong>Type:</strong> ${safe(enquiryLabel)}</p><p><strong>Name:</strong> ${safe(firstName)} ${safe(lastName)}</p><p><strong>Email:</strong> ${safe(email)}</p><p><strong>Phone:</strong> ${safe(phone)}</p><p><strong>Postcode:</strong> ${safe(postcode)}</p><p><strong>Marketing consent:</strong> ${marketing ? 'Yes' : 'No'}</p><hr><p><strong>Message:</strong></p><p>${safe(message).replace(/\n/g,'<br>')}</p></div></body></html>`;

  const [customerMail, internalMail] = await Promise.all([
    brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email, name: `${firstName} ${lastName}`.trim() || email }], subject: 'MMS Gardening Services – Enquiry received', htmlContent: customerHtml }),
    brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email: MMS_EMAIL, name: 'MMS Gardening Services' }], replyTo: email, subject: `New ${enquiryLabel} website enquiry`, htmlContent: internalHtml })
  ]);

  if (!customerMail.ok || !internalMail.ok) return json({ ok: true, saved: true, emailNotice: 'Enquiry saved, but one of the acknowledgement emails could not be sent.' });
  return json({ ok: true, saved: true });
}

const TRACKER = `<script src="https://cdn.brevo.com/js/sdk-loader.js" async></script><script>window.Brevo=window.Brevo||[];Brevo.push(["init",{client_key:"ing6mi27rcoomcj2anywf05d"}]);</script>`;
const MODAL = `<style>#mms-qm{display:none;position:fixed;inset:0;z-index:9999;background:rgba(10,35,22,.72);padding:20px;box-sizing:border-box;overflow:auto}#mms-qm.open{display:flex;align-items:center;justify-content:center}#mms-qm .box{width:min(620px,100%);background:#fffdf8;border-radius:22px;padding:26px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.3);color:#183027;position:relative}#mms-qm h2{font:600 32px/1.1 Georgia,serif;margin:0 0 8px}#mms-qm .close{position:absolute;right:14px;top:10px;border:0;background:none;font-size:30px;cursor:pointer;color:#245b3a}#mms-qm form{display:grid;gap:12px}#mms-qm label{font-weight:700;font-size:14px}#mms-qm input,#mms-qm select,#mms-qm textarea{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd9d1;border-radius:10px;background:#fff;font:inherit}#mms-qm textarea{min-height:120px;resize:vertical}#mms-qm .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}#mms-qm .submit{border:0;border-radius:999px;background:#245b3a;color:#fff;padding:13px 18px;font-weight:800;font-size:16px;cursor:pointer}#mms-qm .status{min-height:22px;font-weight:700}@media(max-width:600px){#mms-qm{padding:10px}#mms-qm .box{padding:22px 18px}.row{grid-template-columns:1fr!important}}</style><div id="mms-qm" aria-hidden="true"><div class="box"><button class="close" type="button" aria-label="Close">×</button><h2>Request a quote</h2><p>Send your enquiry directly to MMS Gardening Services.</p><form><div class="row"><div><label>First name<input name="firstName" autocomplete="given-name" required></label></div><div><label>Last name<input name="lastName" autocomplete="family-name"></label></div></div><div><label>Email<input name="email" type="email" autocomplete="email" required></label></div><div class="row"><div><label>Phone<input name="phone" type="tel" autocomplete="tel"></label></div><div><label>Postcode<input name="postcode" autocomplete="postal-code"></label></div></div><div><label>Enquiry type<select name="enquiryType"><option value="domestic">Domestic</option><option value="commercial">Commercial</option><option value="nursery">Nursery trade</option></select></label></div><div><label>What do you need?<textarea name="message" placeholder="Tell us a little about the work you need..." required></textarea></label></div><label style="font-weight:500"><input name="marketing" type="checkbox" style="width:auto;margin-right:8px"> Keep me informed about MMS news and offers.</label><div class="status" aria-live="polite"></div><button class="submit" type="submit">Send enquiry</button><p style="font-size:12px;margin:0">Prefer to email directly? <a href="mailto:E-mps@outlook.com?subject=MMS%20Gardening%20Services%20%E2%80%93%20Quote">Email MMS</a></p></form></div></div>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/enquiry') return handleEnquiry(request, env);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    const html = await response.text();
    const script = `<script>(function(){const modal=document.getElementById('mms-qm');if(!modal)return;const form=modal.querySelector('form'),status=modal.querySelector('.status'),close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')},open=(type)=>{if(type)form.enquiryType.value=type;modal.classList.add('open');modal.setAttribute('aria-hidden','false');form.querySelector('input[name=firstName]').focus()};modal.querySelector('.close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href')||'';const type=/commercial/i.test(href)?'commercial':/nursery/i.test(href)?'nursery':'domestic';e.preventDefault();open(type)}));document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open('domestic')}));form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Sending…';const payload=Object.fromEntries(new FormData(form).entries());payload.marketing=form.marketing.checked;try{const r=await fetch('/api/enquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not send');status.textContent='Thanks — your enquiry has been sent.';form.reset();setTimeout(close,1800)}catch(err){status.textContent=err.message+' You can use the email link below instead.'}})})();</script>`;
    return new Response(html.replace('</head>', `${TRACKER}</head>`).replace('</body>', `${MODAL}${script}</body>`), { status: response.status, headers: response.headers });
  }
};
