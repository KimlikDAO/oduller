// export { Participant } from '/durableObjects/participant';

const validator = (x) => true;

/**
 * @param {string} address
 * @return {Promise<string>} txHash
 */
const makeTransaction = (address) => Promise.resolve("0xasdf");

export class Participant {
  constructor(state, env) {
    this.state = state;
  }
  /**
   * @param {!Request} req
   * @param {!ProdEnvironment} env
   * @return {Promise<!Response>}
   */
  fetch(req, env) {
    req
      .json()
      .then((validationRequest) => {
        this.state.storage.get("emails").then((emails) => {
          emails ||= [];
          const email = /** @type {!did.ContactInfo} */ (
            validationRequest.decryptedInfos["contactInfo"]
          ).email;
          if (!emails.includes(email)) emails.push(email);
          this.state.storage.put("emails", emails);
        });

        this.state.storage.get("phones")
          .then((phones) => {
            phones ||= [];
            /** @type {!did.ContactInfo} */
            const phone = validationRequest.decryptedInfos["contactInfo"].phone;
            if (!phones.includes(phone)) phones.push(phone);
            this.state.storage.put("phones", phone);
          });
      }).catch(err => console.log(err));

    return this.state.storage.get("txHash").then((/** string */ txHash) => {
      /** @const {Promise<boolean>} */
      const sentNowPromise = txHash
        ? Promise.resolve(false)
        : makeTransaction(req.ownerAddress)
          .then((txHashNow) => {
            txHash = txHashNow;
            return this.state.storage.put("txHash", txHash);
          })
          .then(() => true);
      return sentNowPromise.then((sentNow) =>
        Response.json({
          sentNow,
          txHash,
          chainId: "0xa86a"
        })
      );
    });
  }
}

export default {
  /**
   * @param {!Request} req
   * @param {!cloudflare.Environment} env
   * @return { Promise<!Response>}
   */
  fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname == "/validate") {
      return (
        req
          .json()
          // .then((response) => response.json())
          .then(
            /** kimlikdao.validationRequest */(validationRequest) => {
              if (true) {
                const humanId =
                  validationRequest.decryptedInfos["humanID"].generic;
                const participants = env.PARTICIPANT.get(
                  env.PARTICIPANT.idFromName(humanId)
                );
                return participants.fetch(req);
              }
            }
          )
      );
    }
  },
};
