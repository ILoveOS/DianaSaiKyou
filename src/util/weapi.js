import crypto from 'crypto'
/**aes偏移量 */
const iv = Buffer.from('0102030405060708')
/**aes key */
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
/**base62编码表 */
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
/**rsa公钥 */
const publicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'

/**
 * aes-128-cbc加密
 * @param {Buffer} buffer 待加密数据
 * @param {Buffer} key 密钥
 * @param {Buffer} iv 偏移 
 * @returns {Buffer}
 */
const aesEncrypt = (buffer,key, iv) => {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

/**
 * rsa公钥加密
 * @param {Buffer} buffer 
 * @param {string} key 密钥 
 * @returns {Buffer}
 */
const rsaEncrypt = (buffer, key) => {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
  return crypto.publicEncrypt(
    { key: key, padding: crypto.constants.RSA_NO_PADDING },
    buffer,
  )
}

/**
 * 网易云参数weapi加密
 * @param {object} object 
 * @returns {string} 加密后的weapi参数
 */
export const weapiParam = (object) => {
  const text = JSON.stringify(object)
  const secretKey = crypto
    .randomBytes(16)
    .map((n) => base62.charAt(n % 62).charCodeAt())
  return `params=${encodeURIComponent(aesEncrypt(
    Buffer.from(
      aesEncrypt(Buffer.from(text), presetKey, iv).toString('base64'),
    ),
    secretKey,
    iv,
  ).toString('base64'))}&encSecKey=${encodeURIComponent(rsaEncrypt(secretKey.reverse(), publicKey).toString('hex'))}`
}