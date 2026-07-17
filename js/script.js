(() => {
  'use strict';
  const modal = document.querySelector('#scenarioModal');
  const toast = document.querySelector('#toast');
  const text = document.querySelector('#scenarioText');
  let selectedYear = '1936';
  const descriptions = {
    '1936':'Dünya büyük bir savaşın eşiğinde. Bir ülke seç ve tarihin akışını değiştir.',
    '1914':'İttifaklar geriliyor, imparatorluklar çarpışmaya hazırlanıyor. Eski düzeni koru ya da yık.',
    '2026':'Modern dünyanın ekonomik, diplomatik ve askerî dengeleri yeniden kuruluyor.'
  };
  function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  function showToast(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200); }
  document.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const scenario = e.target.closest('.scenario');
    if(scenario){
      document.querySelectorAll('.scenario').forEach(b=>b.classList.remove('active'));
      scenario.classList.add('active'); selectedYear=scenario.dataset.year; text.textContent=descriptions[selectedYear]; return;
    }
    if(action==='new-game') openModal();
    if(action==='close') closeModal();
    if(action==='continue') showToast('Henüz kayıtlı oyun bulunmuyor.');
    if(action==='settings') showToast('Ayarlar ekranı Paket 2’de eklenecek.');
    if(action==='credits') showToast('IMPERA Remastered — Bilal’in dünya strateji projesi.');
    if(action==='start') showToast(`${selectedYear} dünya haritası Paket 2’de açılacak.`);
  });
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
})();