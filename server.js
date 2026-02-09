import { default as express } from 'express'
import { default as session } from 'express-session'
import { getSession, pubKeyAuth, createChallenge } from './lib/pubkey-auth-handler-lib.js'
import cors from 'cors'

const app = express()
const port = 3000
const session_secret = "ABCDxxyy"
const cookie_name = "pubkeyauth_session"
const origin = "http://localhost:8080"

app.use(cors({
  origin: origin,
  credentials: true,
  exposedHeaders: ["WWW-Authenticate"]
}))

app.use(session({
  name: cookie_name,
  secret: session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}))

app.get("/session", (req,res) => {
  const token = req.session.token
  let user
  if (token) {
    user = getSession(token)
  }
  if (token && user) {
    res.json({user})
  } else {
    const res_obj = createChallenge()
    res.set("WWW-Authenticate", "PublicKey")
    res.status(401).json(res_obj)
  }
})

app.post("/auth", express.json(), (req,res) => {
  try {
    const result = pubKeyAuth(req.body)
    req.session.token = result.token
    req.session.save(err => {
      res.sendStatus(204)
    })
  } catch(e) {
    console.error(e)
    console.error(req.body)
    res.sendStatus(403)
  }
})

app.listen(port, () => {
  console.log("Hi, this is pubkeyauth handler.")
})