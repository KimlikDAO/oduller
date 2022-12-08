export class User {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    return new Response('Hello World')
  }
}