import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { parse } from 'toml';
import { createServer } from 'vite';

const birimOku = (dosyaAdı) => {
  let stiller = [];
  let sayfa = "";
  try {
    sayfa = readFileSync(dosyaAdı, 'utf-8');
    stiller.push("/" + dosyaAdı.slice(0, -5) + ".css");
  } catch (e) {
    sayfa = readFileSync(dosyaAdı.slice(0, -11) + '.html', 'utf-8');
    stiller.push("/" + dosyaAdı.slice(0, -11) + '.css');
  }

  sayfa = sayfa.replace(/<birim:([^\s]+)[^\/]+\/>/g, (_, birimAdı) => {
    let [birim, altStiller] = birimOku(`dapp/birim/${birimAdı.trim()}/birim.html`);
    stiller.push(...altStiller);
    return birim;
  });
  sayfa = sayfa.replace(/<altbirim:([^\s]+)[^\/]+\/>/g, (_, birimAdı) => {
    let [birim, altStiller] = birimOku(`${path.dirname(dosyaAdı)}/${birimAdı.trim()}/birim.html`);
    stiller.push(...altStiller);
    return birim;
  });
  return [sayfa, stiller];
};

/** @param {string} dosyaAdı */
const sayfaOku = (dosyaAdı) => {
  let [sayfa, stiller] = birimOku(dosyaAdı);
  stiller = stiller
    .map((stil) => `  <link href="${stil}" rel="stylesheet" type="text/css" />\n`)
    .join('');
  return sayfa.replace("</head>", stiller + "</head>");
};

/** @const {Object<string, string>} */
const SAYFALAR = {
  "/": "oduller/sayfa.html",
};

createServer({
  server: { middlewareMode: true },
  appType: 'custom'
}).then((vite) => {
  const app = express();
  app.use(vite.middlewares);
  app.use('/', (req, res, next) => {

    if (req.path == '/validate') {
      res.status(200)
        .set({ 'Content-type': 'application/json' })
        .end('{"success": true, "txHash": "0x6ec58cb638fe1a3456cb419d94f89895f2913a364198ef06726ab0e629c4e3e3", "chainId": "0xa86a"}');
    } else if (!(req.path in SAYFALAR)) {
      res.status(200).end(); // Dev sunucuda hata vermemeye çalış
    } else {
      let sayfa = sayfaOku(SAYFALAR[req.path]);
      vite.transformIndexHtml(req.path, sayfa).then((sayfa) => {
        res.status(200)
          .set({ 'Content-type': 'text/html;charset=utf-8' })
          .end(sayfa);
      }).catch((e) => {
        vite.ssrFixStacktrace(e);
        next(e);
      });
    }
  });
  const cfConfig = parse(readFileSync('wrangler.toml'));
  const port = 8789;
  console.log(`Ana sayfaya şu adreste çalışıyor: http://localhost:${port}`);
  app.listen(port);
});
