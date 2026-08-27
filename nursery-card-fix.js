// MMS Gardening Services — main-page Nursery card only
(function () {
  function applyNurseryCardFix() {
    const section = document.getElementById('nursery');
    if (!section || !location.pathname.match(/(^|\/)index\.html$|\/$/)) return;

    const card = section.querySelector('.nursery-home-card');
    if (!card) return;

    card.href = 'nursery.html';
    card.setAttribute('aria-label', 'Enter the MMS Nursery');
    card.innerHTML = `
      <article class="nursery-card-final">
        <div class="nursery-card-final-image" role="img" aria-label="MMS Nursery plants"></div>
        <div class="nursery-card-final-content">
          <div>
            <div class="nursery-card-final-kicker">THE MMS NURSERY</div>
            <h3>Visit the MMS Nursery</h3>
            <p>Browse our plants, shrubs and garden stock, see what is available and discover new stock as it is added.</p>
          </div>
          <span class="nursery-card-final-button">Enter the Nursery <span aria-hidden="true">→</span></span>
        </div>
      </article>`;

    if (!document.getElementById('nursery-card-final-css')) {
      const style = document.createElement('style');
      style.id = 'nursery-card-final-css';
      style.textContent = `
        #nursery .nursery-home-card{display:block!important;max-width:820px!important;margin:28px auto 0!important;text-decoration:none!important;text-align:left!important}
        #nursery .nursery-card-final{padding:0!important;overflow:hidden!important;border-radius:28px!important;background:#123f2b!important;border:1px solid #dce3dc!important;box-shadow:0 14px 34px rgba(24,48,39,.18)!important}
        #nursery .nursery-card-final-image{height:330px;background-image:linear-gradient(90deg,rgba(0,35,20,.08),rgba(0,35,20,.08)),url('https://www.ripleynurseries.co.uk/files/images/photo-albums/album_2_cbc9312e0e_n.jpg');background-size:cover;background-position:center}
        #nursery .nursery-card-final-content{padding:28px 32px 30px!important;background:#123f2b!important;color:#fff!important}
        #nursery .nursery-card-final-kicker{font-size:12px;font-weight:800;letter-spacing:.15em;color:#d8eadc!important;margin-bottom:7px}
        #nursery .nursery-card-final-content h3{margin:0 0 10px!important;color:#fff!important;font:700 32px/1.1 Georgia,serif!important;text-shadow:0 1px 3px rgba(0,0,0,.45)!important}
        #nursery .nursery-card-final-content p{margin:0!important;color:#fff!important;font-size:17px!important;line-height:1.55!important;max-width:680px}
        #nursery .nursery-card-final-button{display:inline-block!important;margin-top:22px!important;padding:13px 22px!important;border-radius:999px!important;background:#fff!important;color:#123f2b!important;font-size:16px!important;font-weight:800!important;box-shadow:0 3px 10px rgba(0,0,0,.16)!important}
        @media(max-width:800px){#nursery .nursery-card-final-image{height:240px}#nursery .nursery-card-final-content{padding:22px!important}#nursery .nursery-card-final-content h3{font-size:25px!important}#nursery .nursery-card-final-content p{font-size:16px!important}}
      `;
      document.head.appendChild(style);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyNurseryCardFix);
  else applyNurseryCardFix();
})();
