/**
 * @fileoverview Al sayfası giriş noktası
 */

import { create } from "./confetti";
import Cüzdan from "/birim/cüzdan/birim";
import dom from "/lib/util/dom";

/** @const {Element} */
const Konfeti = dom.adla("odconfetti");
/** @const {Element} */
const CüzdanBağlaDüğmesi = dom.adla("ods0b");
CüzdanBağlaDüğmesi.onclick = Cüzdan.bağla;
/** @const {Element} */
const DiscordLink = `<a href="https://discord.com/channels/951587582712639548/973319243544276992" target="_blank" rel="noopener noreferrer" class="discord-link">Discord</a>`;

const kimlikdao = {};
kimlikdao.hasDID = (contractaddress) => Promise.resolve(true);
kimlikdao.getValidated = (contractAddress, sectionNames) => Promise.resolve(Response.json({
  "sentNow": false,
  "txHash": "0xasdfkjas",
  "chainId": "0xa86a"
}));

const popup = () => {
  const overlay = dom.adla("overlay");
  const modal = dom.adla("modal");
  openModal(modal, overlay);
};
const openModal = (modal, overlay) => {
  modal.classList.add("active");
  overlay.classList.add("active");
};

const HataMesajlari = dom.TR
  ? ["", `Oops! Fark ettik ki ödülünü daha önceden almışsın. Bundan dolayı kampanyamızdan tekrar yararlanamazsın. O zaman seni ${DiscordLink} kanalımıza bekliyoruz. Orada görüşmek üzere 👋`, "Bilgileriniz Hatalı."]
  : [
    "",
    "Oops! We realized that you took your prize before. So, you cannot participate our campaign again. Then, we hope to see you soon in our Discord 👋.",
    "Your information is incorrect.",
  ];

Cüzdan.bağlanınca(() => {
  dom.adla("ods0c").classList.add("done");
  dom.butonDurdur(CüzdanBağlaDüğmesi);
  CüzdanBağlaDüğmesi.classList.remove("act");
  CüzdanBağlaDüğmesi.innerText = dom.TR
    ? "Cüzdan bağlandı ✓"
    : "Wallet connected ✓";
  if (true) {
    dom.adlaGöster("ods1ac");
    dom.adla("ods1ab").onclick = bilgileriKontrolEt;
  } else {
    dom.adlaGöster("ods1bc");
  }
});

const bilgileriKontrolEt = () => {
  kimlikdao
    .getValidated(0xaa, "humanID")
    .then((res) => res.json())
    .then((res) => {
      dom.butonDurdur(dom.adla("ods1ab"));
      dom.adla("ods1ab").classList.remove("act");
      dom.adla("ods1ab").innerText = dom.TR
        ? "Bilgilerinizi aldık ✓"
        : "We got your info ✓";
      if (res.sentNow) {
        const confetti = create(dom.adla("odconfetti"));
        let count = 300;
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
        dom.göster(Konfeti);
        popup();
        dom.adla("odtx").innerHTML = `<a href="https://${Cüzdan.AğBilgileri[res.chainId][0]
          }/tx/${res.txHash
          }" class="odtxl" target="_blank" rel="noopener noreferrer">
            ${res.txHash}
          </a>`;
        setTimeout(() => {
          Konfeti.remove();
        }, 3000);
      } else {
        dom.adlaGöster("ods2bc");
        dom.adla("ods2bt").innerHTML = HataMesajlari[1];
        popup();
        dom.adla("odtxf").innerHTML = `<a href="https://${Cüzdan.AğBilgileri[res.chainId][0]
          }/tx/${res.txHash
          }" class="odtxl" target="_blank" rel="noopener noreferrer">
            ${res.txHash}
          </a>`;
      }
    });
};
