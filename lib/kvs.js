import {default as NodeCache} from 'node-cache'
/* import {default as storage} from 'node-persist' */
import {resolve as resolvePath} from 'path'
import { readFileSync } from 'fs'

export const challengeDB = {
  db: new NodeCache({ stdTTL: (5*60), checkperiod: (30*60)}),
  set: function(key, value) {
    this.db.set(key, value)
  },
  get: function(key) {
    return this.db.get(key)
  }
}

export const sessionDB = {
  db: new NodeCache({ stdTTL: (4*60*60), checkperiod: (2*60*60)}),
  set: function(key, value) {
    this.db.set(key, value)
  },
  get: function(key) {
    const value = this.db.get(key)
    if (value) { this.db.set(key, value) } // Reset TTL
    return value
  }
}

const key_dict_path = resolvePath(import.meta.dirname, "..", "var", "keys.json")
const key_dict_db = new Map(JSON.parse(readFileSync(key_dict_path)))
export const keyDictionary = {
  get(key) {
    return key_dict_db.get(key)
  }
}
