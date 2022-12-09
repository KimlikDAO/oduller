/**
 * @fileoverview Al sayfası giriş noktası
 */

import ConfettiGenerator from './confetti';
import Cüzdan from '/birim/cüzdan/birim';
import dom from '/lib/util/dom';
import kimlikdao from '/sdk/client/kimlikdao';

/** @const {Element} */
const CüzdanBağlaDüğmesi = dom.adla("ods0b");
CüzdanBağlaDüğmesi.onclick = Cüzdan.bağla;

const Validator = new kimlikdao.Validator('http://localhost:8787/validate')

const HataMesajlari = dom.TR ? [
  "",
  "Kampanyaya daha önce katılmışsınız 👍",
  "Bilgileriniz Hatalı."
] : [
  "",
  "You have participated in the campaign before 👍",
  "Your information is incorrect."
];

Cüzdan.bağlanınca(() => {
  dom.adla("ods0c").classList.add("done");
  dom.butonDurdur(CüzdanBağlaDüğmesi);
  CüzdanBağlaDüğmesi.classList.remove("act");
  CüzdanBağlaDüğmesi.innerText = dom.TR ? "Cüzdan bağlandı ✓" : "Wallet connected ✓";
  kimlikdao.hasTckt().then((present) => {
    if (true) {
      dom.adlaGöster('ods1ac')
      dom.adla('ods1ab').onclick = bilgileriKontrolEt;
    } else dom.adlaGöster('ods1bc');
  })
});

const bilgileriKontrolEt = () => {
  kimlikdao.validateTckt(['contactInfo', 'humanID'], Validator, false)
    .then(res => res.json())
    .then(res => {
      dom.butonDurdur(dom.adla("ods1ab"));
      dom.adla("ods1ab").classList.remove("act");
      dom.adla('ods1ab').innerText = dom.TR ? "Bilgilerinizi aldık ✓" : "We got your info ✓";
      if (res.success) {
        const confettiSettings = { target: 'odconfetti' };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        dom.adlaGöster('ods2ac');
        dom.adlaGöster('odconfetti');
        dom.adla('odtx').innerHTML =
          `<a href="https://${Cüzdan.AğBilgileri[res.chainId][0]}/tx/${res.txHash}" class="odtxl" target="_blank" rel="noopener noreferrer">
            ${res.txHash}
          </a>`
      } else {
        dom.adlaGöster('ods2bc');
        dom.adla('ods2bt').innerText = HataMesajlari[res.error];
      }
    })
}
