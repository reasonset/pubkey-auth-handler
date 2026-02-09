import { PubKeyAuth } from "https://cdn.jsdelivr.net/npm/pubkeyauth/pubkeyauth.js"

const pk = new PubKeyAuth("http://localhost:3000/auth")
const rf = document.getElementById("ResponseField")
let challenge

async function alternative_auth(token, challenge) {
  const signobj = await pk.sign(token)
  if (!pk.endpoint) {
    throw "API endpoint is not defined."
  }
  const response = await fetch(pk.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({token: challenge, ...signobj}),
    credentials: "include"
  })

  return response
}

document.getElementById("PublicKeyField").value = (await pk.sign("")).publicKey

document.getElementById("GetSession").addEventListener("click", async e => {
  const res = await fetch("http://localhost:3000/session", {credentials: "include"})
  const data = await res.text()
  rf.value = [res.status, data].join("\n")
  if (!res.ok) {
    challenge = JSON.parse(data)
  }
})

document.getElementById("PostSign").addEventListener("click", async e => {
  const res = await alternative_auth(challenge.secret, challenge.challenge_token)
  rf.value = [res.status, (await res.text())].join("\n")
})