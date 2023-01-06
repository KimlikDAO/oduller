/** @externs */

/**
 * @interface
 * @extends {cloudflare.Environment}
 */
function ProdEnvironment() {}

/**
 * Öduller ödemelerinin yapılacağı cüzdan gizli anahtarı.
 *
 * @const {string}
 */
ProdEnvironment.prototype.ODULLER_PRIVATE_KEY;
