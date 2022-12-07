/**
 * @fileoverview Al sayfası giriş noktası
 */

import Cüzdan from '/birim/cüzdan/birim';
import dom from '/lib/util/dom';
import TCKT from '/lib/ethereum/TCKT';
import kimlikdao from '/sdk/client/kimlikdao';
import ConfettiGenerator from './confetti';

/** @const {Element} */
const cüzdanBağlaDüğmesi = dom.adla("ods0b");
cüzdanBağlaDüğmesi.onclick = Cüzdan.bağla;

const validator = new kimlikdao.Validator('http://localhost:8787/validate')

const hataMesajlari = dom.TR
  ? [
    "",
    "Kampanyaya daha önce katılmışsınız 👍",
    "Bilgileriniz Hatalı."
  ] :
  [
    "",
    "You have participated in the campaign before 👍",
    "Your information is incorrect."
  ];

Cüzdan.bağlanınca(() => {
  dom.adla("ods0c").classList.add("done");
  dom.butonDurdur(cüzdanBağlaDüğmesi);
  cüzdanBağlaDüğmesi.classList.remove("act");
  cüzdanBağlaDüğmesi.innerText = dom.TR ? "Cüzdan bağlandı ✓" : "Wallet connected ✓";
  kimlikdao.hasTckt().then((present) => {
    if (true) {
      dom.adlaGöster('ods1ac')
      dom.adla('ods1ab').onclick = bilgileriKontrolEt;
    } else dom.adlaGöster('ods1bc');
  })
});

const bilgileriKontrolEt = () => {
  kimlikdao.validateTckt(['contactInfo', 'humanID'], validator, false)
    .then(res => res.json())
    .then(res => {
      dom.adla("ods1ac").classList.add("done");
      dom.butonDurdur(dom.adla("ods1ab"));
      dom.adla("ods1ab").classList.remove("act");
      dom.adla('ods1ab').innerText = dom.TR ? "Bilgilerinizi aldık ✓" : "We got your info ✓";
      if (res.success) {
        dom.adlaGöster('ods2ac');
        dom.adlaGöster('odconfetti');
        setTimeout(() => dom.adlaGizle('odconfetti'), 3000);
        dom.adla('odtx').innerHTML =
          `<a href="https://${Cüzdan.AğBilgileri[Cüzdan.ağ()][0]}/tx/${res.txHash}" target="_blank" rel="noopener noreferrer">${res.txHash}</a>`
      } else {
        dom.adlaGöster('ods2bc');
        dom.adla('ods2bt').innerText = hataMesajlari[res.error];
      }
    })
}

let confettiSettings = { target: 'odconfetti' };
let confetti = new ConfettiGenerator(confettiSettings);
confetti.render();