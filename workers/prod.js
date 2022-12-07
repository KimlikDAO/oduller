import { Validator } from '/sdk/server-js/validator'
export { User } from '/durableObjects/user'

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
              const id = env.USER.idFromName(humanIDGeneric);
              const object = env.USER.get(id);
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
