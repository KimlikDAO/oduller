// export { Participant } from '/durableObjects/participant';

const validator = (x) => true;

export class Participant {
  constructor(state, env) {
    this.state = state;
  }

  /**
   * @param {cloudflare.Request}
   * @param {cloudflare.Environment}
   * @param {cloudflare.Context}
   */ 
  async fetch(req, env, ctx) {
    req.json()
      .then((res) => console.log(res));
    /** @type {string} */
    let txHash = await this.state.storage.get("txHash");
    if (!txHash) {
      txHash = "0xa5"
      await this.state.storage.put("txHash", txHash);
      return new Response("Transfer yapıldı: " + txHash);
    } else {
      return new Response(`${txHash} adlı transfer zaten var`)
    }    
  }
}


export default {
  /**
   * @param {cloudflare.Request} 
   * @param {cloudflare.Environment} 
   * @param {cloudflare.Context}  
   */
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname == '/validate') {
      return req.json()
        // .then((response) => response.json())
        .then(/** kimlikdao.validationRequest */(validationRequest) => {
          if (true) {
            const humanId = validationRequest.decryptedInfos["humanID"].generic;
            // Unique id in cloudflare for the class
            const id = env.PARTICIPANT.idFromName(humanId);
            const object = env.PARTICIPANT.get(id);
            return object.fetch(req);
          }
        })
    }
  }
}
