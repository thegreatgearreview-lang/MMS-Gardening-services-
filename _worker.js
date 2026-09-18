const BREVO_API = 'https://api.brevo.com/v3';
const SENDER = { name: 'MMS Gardening Services', email: 'thegreatgearreview@gmail.com' };
const MMS_EMAIL = 'e-mps@outlook.com';
const LISTS = { domestic: 3, commercial: 4, nursery: 5 };

function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'no-store' } }); }
async function brevo(path, apiKey, body) { return fetch(`${BREVO_API}${path}`, { method: 'POST', headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) }); }

async function handleGardenClub(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.BREVO_API_KEY) return json({ error: 'Brevo is not configured yet.' }, 503);
  let data; try { data = await request.json(); } catch { return json({ error: 'Invalid form data.' }, 400); }
  const email = String(data.email || '').trim().toLowerCase();
  const firstName = String(data.firstName || '').trim().slice(0, 80);
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (data.consent !== true) return json({ error: 'Please tick the Garden Club email permission box.' }, 400);
  const contactBody = { email, updateEnabled: true, listIds: [LISTS.nursery], attributes: { FIRSTNAME: firstName, OPT_IN: true } };
  const contactResponse = await brevo('/contacts', env.BREVO_API_KEY, contactBody);
  if (!contactResponse.ok) return json({ error: 'We could not add you to the MMS Garden Club yet.' }, 502);
  const safe = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const welcomeHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:620px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>Welcome to the MMS Garden Club 🌱</h2><p>Thanks ${safe(firstName || 'there')} for joining.</p><p>Your Garden Club welcome discount is:</p><p style="font-size:28px;font-weight:800;color:#245b3a">GARDEN10</p><p>Use <strong>GARDEN10</strong> at the MMS Nursery basket to receive <strong>10% off your plant order</strong>.</p><p>We'll also keep you up to date with new nursery stock, seasonal gardening news and Garden Club offers.</p><p>Kind regards,<br>MMS Gardening Services</p></div></body></html>`;
  const welcomeMail = await brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email, name: firstName || email }], subject: 'Welcome to the MMS Garden Club – Your 10% discount', htmlContent: welcomeHtml });
  return json({ ok: true, subscribed: true, emailSent: welcomeMail.ok, code: 'GARDEN10' });
}

async function handleEnquiry(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.BREVO_API_KEY) return json({ error: 'Brevo is not configured yet.' }, 503);
  let data; try { data = await request.json(); } catch { return json({ error: 'Invalid form data.' }, 400); }
  const email = String(data.email || '').trim().toLowerCase(); const type = String(data.enquiryType || 'domestic').toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (!LISTS[type]) return json({ error: 'Invalid enquiry type.' }, 400);
  const firstName = String(data.firstName || '').trim().slice(0, 80); const lastName = String(data.lastName || '').trim().slice(0, 80); const phone = String(data.phone || '').trim().slice(0, 40); const postcode = String(data.postcode || '').trim().slice(0, 20); const message = String(data.message || '').trim().slice(0, 4000); const marketing = data.marketing === true; const enquiryLabel = type === 'commercial' ? 'Commercial' : type === 'nursery' ? 'Nursery trade' : 'Domestic';
  const contactBody = { email, updateEnabled: true, listIds: [LISTS[type]], attributes: { FIRSTNAME: firstName, LASTNAME: lastName, SMS: phone, POSTCODE: postcode, ENQUIRY_TYPE: enquiryLabel, OPT_IN: marketing } };
  const contactResponse = await brevo('/contacts', env.BREVO_API_KEY, contactBody); if (!contactResponse.ok) return json({ error: 'We could not save your enquiry to MMS.' }, 502);
  const safe = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const customerHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:620px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>Thanks for contacting MMS Gardening Services</h2><p>Thanks ${safe(firstName || 'there')}. We have received your ${safe(enquiryLabel.toLowerCase())} enquiry and will get back to you as soon as we can.</p><p><strong>Enquiry type:</strong> ${safe(enquiryLabel)}</p><p>If you need us urgently, call <a href="tel:+447989892662">07989 892662</a>.</p><p>Kind regards,<br>MMS Gardening Services</p></div></body></html>`;
  const internalHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:680px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>New website enquiry</h2><p><strong>Type:</strong> ${safe(enquiryLabel)}</p><p><strong>Name:</strong> ${safe(firstName)} ${safe(lastName)}</p><p><strong>Email:</strong> ${safe(email)}</p><p><strong>Phone:</strong> ${safe(phone)}</p><p><strong>Postcode:</strong> ${safe(postcode)}</p><p><strong>Marketing consent:</strong> ${marketing ? 'Yes' : 'No'}</p><hr><p><strong>Message:</strong></p><p>${safe(message).replace(/\n/g,'<br>')}</p></div></body></html>`;
  const [customerMail, internalMail] = await Promise.all([brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email, name: `${firstName} ${lastName}`.trim() || email }], subject: 'MMS Gardening Services – Enquiry received', htmlContent: customerHtml }), brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email: MMS_EMAIL, name: 'MMS Gardening Services' }], replyTo: email, subject: `New ${enquiryLabel} website enquiry`, htmlContent: internalHtml })]);
  if (!customerMail.ok || !internalMail.ok) return json({ ok: true, saved: true, emailNotice: 'Enquiry saved, but one of the acknowledgement emails could not be sent.' }); return json({ ok: true, saved: true });
}


const SUMUP_API = 'https://api.sumup.com/v0.1';

function cleanOrderItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 100).map(x => ({
    name: String(x?.name || '').trim().slice(0, 120),
    price: String(x?.price || '').trim().slice(0, 40),
    category: String(x?.category || 'Nursery').trim().slice(0, 80),
    quantity: Math.min(99, Math.max(1, parseInt(x?.quantity, 10) || 1))
  })).filter(x => x.name);
}
function orderAmount(items) {
  return items.reduce((n, x) => {
    const m = x.price.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return n + ((m ? Number(m[0]) : 0) * x.quantity);
  }, 0);
}
async function sumup(path, apiKey, options = {}) {
  return fetch(`${SUMUP_API}${path}`, { method: options.method || 'GET', headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', accept: 'application/json' }, body: options.body ? JSON.stringify(options.body) : undefined });
}
async function handleSumupConfig(request, env) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  if (!env.SUMUP_PUBLIC_KEY) return json({ error: 'SumUp wallet checkout is not configured yet.' }, 503);
  return json({ publicKey: env.SUMUP_PUBLIC_KEY });
}
async function handleCreateSumupCheckout(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.SUMUP_API_KEY || !env.SUMUP_MERCHANT_CODE) return json({ error: 'SumUp checkout is not configured yet.' }, 503);
  if (!env.MMS_ORDERS) return json({ error: 'Order storage is not configured yet.' }, 503);
  let data; try { data = await request.json(); } catch { return json({ error: 'Invalid checkout data.' }, 400); }
  const email = String(data.email || '').trim().toLowerCase();
  const firstName = String(data.firstName || '').trim().slice(0, 80);
  const lastName = String(data.lastName || '').trim().slice(0, 80);
  const items = cleanOrderItems(data.items);
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (!items.length) return json({ error: 'Your basket is empty.' }, 400);
  const amount = Number(orderAmount(items).toFixed(2));
  if (!(amount > 0)) return json({ error: 'Your basket total could not be calculated.' }, 400);
  const orderId = 'MMS-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  const record = { orderId, status: 'PENDING', createdAt: new Date().toISOString(), firstName, lastName, email, items, amount, currency: 'GBP', confirmationSent: false };
  const webhookUrl = new URL('/api/sumup/webhook', request.url).toString();
  const redirectUrl = new URL('/thankyou.html?order=' + encodeURIComponent(orderId), request.url).toString();
  const checkoutResponse = await sumup('/checkouts', env.SUMUP_API_KEY, { method: 'POST', body: { checkout_reference: orderId, amount, currency: 'GBP', merchant_code: env.SUMUP_MERCHANT_CODE, description: 'MMS Nursery order ' + orderId, return_url: webhookUrl, redirect_url: redirectUrl }});
  if (!checkoutResponse.ok) return json({ error: 'SumUp could not create the checkout.' }, 502);
  const checkout = await checkoutResponse.json();
  await env.MMS_ORDERS.put(orderId, JSON.stringify({ ...record, checkoutId: checkout.id }), { expirationTtl: 604800 });
  return json({ ok: true, orderId, checkoutId: checkout.id, amount, currency: 'GBP' });
}
async function verifyAndConfirmOrder(orderId, env) {
  if (!env.SUMUP_API_KEY || !env.MMS_ORDERS || !env.BREVO_API_KEY) return false;
  const raw = await env.MMS_ORDERS.get(orderId); if (!raw) return false;
  const order = JSON.parse(raw); if (order.confirmationSent) return true;
  const response = await sumup('/checkouts/' + encodeURIComponent(order.checkoutId), env.SUMUP_API_KEY); if (!response.ok) return false;
  const checkout = await response.json();
  if (checkout.status !== 'PAID') { order.status = checkout.status || 'PENDING'; await env.MMS_ORDERS.put(orderId, JSON.stringify(order), { expirationTtl: 604800 }); return false; }
  order.status = 'PAID'; order.paidAt = new Date().toISOString();
  const safe = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rows = order.items.map(x => { const m=String(x.price).replace(/,/g,'').match(/-?\d+(?:\.\d+)?/); const line=(Number(m?.[0]||0)*x.quantity).toFixed(2); return `<tr><td style="padding:7px 0">${safe(x.name)}</td><td style="padding:7px 0;text-align:center">${x.quantity}</td><td style="padding:7px 0;text-align:right">£${line}</td></tr>`; }).join('');
  const customerHtml = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#183027;line-height:1.6"><div style="max-width:620px;margin:auto"><img src="https://mmsgardeningservices.co.uk/images/mms-logo-master.svg" alt="MMS Gardening Services" style="max-width:180px;height:auto"><h2>Thank you for your MMS Nursery purchase</h2><p>Thanks ${safe(order.firstName || 'there')} — your payment has been confirmed and your nursery order is now being processed.</p><p><strong>Order reference:</strong> ${safe(order.orderId)}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left">Item</th><th>Qty</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table><p style="font-size:18px"><strong>Total paid: £${Number(order.amount).toFixed(2)}</strong></p><p>We'll get your order ready and contact you if we need any further information.</p><p>Kind regards,<br>MMS Gardening Services</p></div></body></html>`;
  const mail = await brevo('/smtp/email', env.BREVO_API_KEY, { sender: SENDER, to: [{ email: order.email, name: `${order.firstName} ${order.lastName}`.trim() || order.email }], subject: `MMS Nursery – Order ${order.orderId} confirmed`, htmlContent: customerHtml });
  if (!mail.ok) return false;
  order.confirmationSent = true; order.confirmationSentAt = new Date().toISOString();
  await env.MMS_ORDERS.put(orderId, JSON.stringify(order), { expirationTtl: 604800 }); return true;
}
async function handleSumupWebhook(request, env) {
  if (request.method !== 'POST') return new Response(null, { status: 204 });
  let event; try { event = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const id = String(event?.id || ''); if (!id || !env.MMS_ORDERS) return new Response(null, { status: 204 });
  const all = await env.MMS_ORDERS.list({ prefix: 'MMS-' });
  for (const key of all.keys) { const raw = await env.MMS_ORDERS.get(key.name); if (!raw) continue; const order = JSON.parse(raw); if (order.checkoutId === id) { await verifyAndConfirmOrder(order.orderId, env); break; } }
  return new Response(null, { status: 204 });
}
async function checkPendingOrders(env) {
  if (!env.MMS_ORDERS) return;
  const all = await env.MMS_ORDERS.list({ prefix: 'MMS-' });
  for (const key of all.keys.slice(0, 100)) { const raw = await env.MMS_ORDERS.get(key.name); if (!raw) continue; const order = JSON.parse(raw); if (!order.confirmationSent && Date.now() - Date.parse(order.createdAt) < 604800000) await verifyAndConfirmOrder(order.orderId, env); }
}

const TRACKER = `<script src="https://cdn.brevo.com/js/sdk-loader.js" async></script><script>window.Brevo=window.Brevo||[];Brevo.push(["init",{client_key:"ing6mi27rcoomcj2anywf05d"}]);</script>`;
const MODAL = `<style>#mms-qm{display:none;position:fixed;inset:0;z-index:9999;background:rgba(10,35,22,.72);padding:20px;box-sizing:border-box;overflow:auto}#mms-qm.open{display:flex;align-items:center;justify-content:center}#mms-qm .box{width:min(620px,100%);background:#fffdf8;border-radius:22px;padding:26px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.3);color:#183027;position:relative}#mms-qm h2{font:600 32px/1.1 Georgia,serif;margin:0 0 8px}#mms-qm .close{position:absolute;right:14px;top:10px;border:0;background:none;font-size:30px;cursor:pointer;color:#245b3a}#mms-qm form{display:grid;gap:12px}#mms-qm label{font-weight:700;font-size:14px}#mms-qm input,#mms-qm select,#mms-qm textarea{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd9d1;border-radius:10px;background:#fff;font:inherit}#mms-qm textarea{min-height:120px;resize:vertical}#mms-qm .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}#mms-qm .submit{border:0;border-radius:999px;background:#245b3a;color:#fff;padding:13px 18px;font-weight:800;font-size:16px;cursor:pointer}#mms-qm .status{min-height:22px;font-weight:700}@media(max-width:600px){#mms-qm{padding:10px}#mms-qm .box{padding:22px 18px}.row{grid-template-columns:1fr!important}}</style><div id="mms-qm" aria-hidden="true"><div class="box"><button class="close" type="button" aria-label="Close">×</button><h2>Request a quote</h2><p>Send your enquiry directly to MMS Gardening Services.</p><form><div class="row"><div><label>First name<input name="firstName" autocomplete="given-name" required></label></div><div><label>Last name<input name="lastName" autocomplete="family-name"></label></div></div><div><label>Email<input name="email" type="email" autocomplete="email" required></label></div><div class="row"><div><label>Phone<input name="phone" type="tel" autocomplete="tel"></label></div><div><label>Postcode<input name="postcode" autocomplete="postal-code"></label></div></div><div><label>Enquiry type<select name="enquiryType"><option value="domestic">Domestic</option><option value="commercial">Commercial</option><option value="nursery">Nursery trade</option></select></label></div><div><label>What do you need?<textarea name="message" placeholder="Tell us a little about the work you need..." required></textarea></label></div><label style="font-weight:500"><input name="marketing" type="checkbox" style="width:auto;margin-right:8px"> Keep me informed about MMS news and offers.</label><div class="status" aria-live="polite"></div><button class="submit" type="submit">Send enquiry</button><p style="font-size:12px;margin:0">Prefer to email directly? <a href="mailto:E-mps@outlook.com?subject=MMS%20Gardening%20Services%20%E2%80%93%20Quote">Email MMS</a></p></form></div></div>`;

export default { async scheduled(controller, env, ctx) { ctx.waitUntil(checkPendingOrders(env)); }, async fetch(request, env) {
  const url = new URL(request.url); if (url.pathname === '/api/enquiry') return handleEnquiry(request, env); if (url.pathname === '/api/garden-club') return handleGardenClub(request, env); if (url.pathname === '/api/sumup/config') return handleSumupConfig(request, env); if (url.pathname === '/api/sumup/create-checkout') return handleCreateSumupCheckout(request, env); if (url.pathname === '/api/sumup/webhook') return handleSumupWebhook(request, env);
  const response = await env.ASSETS.fetch(request); const type = response.headers.get('content-type') || ''; if (!type.includes('text/html')) return response; const html = await response.text();
  const script = `<script>(function(){const modal=document.getElementById('mms-qm');if(!modal)return;const form=modal.querySelector('form'),status=modal.querySelector('.status'),close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')},open=(type)=>{if(type)form.enquiryType.value=type;modal.classList.add('open');modal.setAttribute('aria-hidden','false');form.querySelector('input[name=firstName]').focus()};modal.querySelector('.close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href')||'';const type=/commercial/i.test(href)?'commercial':/nursery/i.test(href)?'nursery':'domestic';e.preventDefault();open(type)}));document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open('domestic')}));form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Sending…';const payload=Object.fromEntries(new FormData(form).entries());payload.marketing=form.marketing.checked;try{const r=await fetch('/api/enquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not send');status.textContent='Thanks — your enquiry has been sent.';form.reset();setTimeout(close,1800)}catch(err){status.textContent=err.message+' You can use the email link below instead.'}})})();</script>`;
  return new Response(html.replace('</head>', `${TRACKER}</head>`).replace('</body>', `${MODAL}${script}</body>`), { status: response.status, headers: response.headers });
} };
