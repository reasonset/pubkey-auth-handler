import { default as crypto } from 'crypto'
import { challengeDB, sessionDB, keyDictionary } from './kvs.js'

class SignatureError extends Error {
  constructor(message) {
    super(message)
    this.name = "SignatureError"
  }
}

class InvalidKeyError extends Error {
  constructor(message) {
    super(message)
    this.name = "InvalidKeyError"
  }
}

const createSession = function(user) {
  const token = crypto.randomUUID()
  sessionDB.set(token, user)
  return token
}

export function getSession(token) {
  return sessionDB.get(token)
}

export function verifySign({signature, publicKey, token}) {
  const pubkey_bin = Buffer.from(publicKey, 'base64')
  const sig_bin = Buffer.from(signature, 'base64')

  const key = crypto.createPublicKey({
    key: pubkey_bin,
    format: 'der',
    type: 'spki'
  })

  const secret = challengeDB.get(token)
  if (!secret) { return false }

  return crypto.verify(
    undefined,
    Buffer.from(secret),
    key,
    sig_bin
  )
}

export function pubKeyAuth({signature, publicKey, token}) {
  if(verifySign({signature, publicKey, token})) {
    const user = keyDictionary.get(publicKey)
    if (user) {
      const token = createSession(user)
      return {user, token}
    } else {
      throw new InvalidKeyError("This public key doesn't associate to user")
    }
  } else {
    throw new SignatureError("Failed to verify signature")
  }
}

export function createChallenge() {
  const secret = crypto.randomBytes(16).toString("Base64url")
  const challenge_token = crypto.randomUUID()
  challengeDB.set(challenge_token, secret)
  return {secret, challenge_token}
}
