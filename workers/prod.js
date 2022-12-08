import { Validator } from '/sdk/server-js/validator'
export { Participant } from '/durableObjects/participant'

const validator = new Validator({
  '0xa86a': 'https://avalanche.kimlikdao.org',
  'kimlikdao': 'https://node.kimlikdao.org',
})

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname == '/validate') {
      return request.body()
        .then(response => response.json())
        .then(validationRequest => validator.validate(validationRequest)
          .then((report) => {
            if (report.validity == 'valid') {
              const humanIDGeneric = validationRequest.decryptedInfos['humanID']['generic'];
              const id = env.PARTICIPANT.idFromName(humanIDGeneric);
              const object = env.PARTICIPANT.get(id);a
              object.fetch(`${apiURL}/`)
                .then(res => {
                  if (res == '') {
                    // transaction
                  } else {
                    // daha once katilmis
                    return new Response('katilmis')
                  }
                })
            }
          })
        )
    }
  }
}
