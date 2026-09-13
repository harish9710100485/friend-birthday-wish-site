const COOKIE_NAME = 'story-auth'
const SESSION_MS = 1000 * 60 * 60 * 24 * 30

function toBase64Url(bytes: ArrayBuffer){
  let binary = ''
  const arr = new Uint8Array(bytes)
  for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(payload: string, secret: string){
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return toBase64Url(sig)
}

export async function createSessionCookie(secret: string){
  const expiry = String(Date.now() + SESSION_MS)
  const sig = await hmac(expiry, secret)
  return { name: COOKIE_NAME, value: `${expiry}.${sig}`, maxAge: SESSION_MS / 1000 }
}

export async function verifySessionCookie(value: string | undefined, secret: string){
  if (!value) return false
  const [expiry, sig] = value.split('.')
  if (!expiry || !sig) return false
  if (Number(expiry) < Date.now()) return false
  const expectedSig = await hmac(expiry, secret)
  return sig === expectedSig
}

export { COOKIE_NAME }
