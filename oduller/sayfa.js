/**
 * @fileoverview Al sayfası giriş noktası
 */

import { create } from "./confetti";
import Cüzdan from "/birim/cüzdan/birim";
import dom from "/lib/util/dom";
import kimlikdao from "/sdk/client/kimlikdao";

/** @const {Element} */
const CüzdanBağlaDüğmesi = dom.adla("ods0b");
CüzdanBağlaDüğmesi.onclick = Cüzdan.bağla;

const Validator = new kimlikdao.Validator("http://localhost:8787/validate");

const HataMesajlari = dom.TR
  ? ["", "Kampanyaya daha önce katılmışsınız 👍", "Bilgileriniz Hatalı."]
  : [
      "",
      "You have participated in the campaign before 👍",
      "Your information is incorrect.",
    ];

Cüzdan.bağlanınca(() => {
  dom.adla("ods0c").classList.add("done");
  dom.butonDurdur(CüzdanBağlaDüğmesi);
  CüzdanBağlaDüğmesi.classList.remove("act");
  CüzdanBağlaDüğmesi.innerText = dom.TR
    ? "Cüzdan bağlandı ✓"
    : "Wallet connected ✓";
  kimlikdao.hasTckt().then((present) => {
    if (true) {
      dom.adlaGöster("ods1ac");
      dom.adla("ods1ab").onclick = bilgileriKontrolEt;
    } else {
      dom.adlaGöster("ods1bc");
    }
  });
});

const bilgileriKontrolEt = () => {
  kimlikdao
    .validateTckt(["contactInfo", "humanID"], Validator, false)
    .then((res) => res.json())
    .then((res) => {
      dom.butonDurdur(dom.adla("ods1ab"));
      dom.adla("ods1ab").classList.remove("act");
      dom.adla("ods1ab").innerText = dom.TR
        ? "Bilgilerinizi aldık ✓"
        : "We got your info ✓";
      if (res.success) {
        const confetti = create(dom.adla("odconfetti"));
        let count = 200;
        let defaults = {
          origin: { y: 0.7 },
        };
        const fire = (particleRatio, opts) => {
          confetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
            })
          );
        };
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
        dom.adlaGöster("ods2ac");
        dom.adlaGöster("odconfetti");
        const overlay = dom.adla("overlay");
        const modal = dom.adla("modal");
        const openModal = () => {
          modal.classList.add("active");
          overlay.classList.add("active");
        };
        openModal();
        dom.adla("odtx").innerHTML = `<a href="https://${
          Cüzdan.AğBilgileri[res.chainId][0]
        }/tx/${
          res.txHash
        }" class="odtxl" target="_blank" rel="noopener noreferrer">
            ${res.txHash}
          </a>`;
      } else {
        dom.adlaGöster("ods2bc");
        dom.adla("ods2bt").innerText = HataMesajlari[res.error];
      }
      setTimeout(() => {
        dom.adlaGizle("odconfetti");
      }, 3500);
    });
};
