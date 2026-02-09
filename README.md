# pubkey-auth-handler

Server-side verification handler for pubkeyauth.js, compatible with auth_request.

## Description

This software is the server‑side reference implementation corresponding to [pubkeyauth.js](https://github.com/reasonset/pubkeyauth.js).

`pubkey-auth-handler-lib.js` can be used as a practical library.

`server.js` runs as a web server application using Express.js and is mainly intended to serve as a reference for implementing your own code. However, for simple use cases, it can also be used as-is by configuring the constants defined at the top of the file.

`server.js` provides two endpoints: `GET /session` and `POST /auth`.

`/session` functions as an endpoint for Nginx's `auth_request`. It also returns a user ID when a session cookie is valid, allowing other servers to verify authentication status.

`/auth` serves as the public‑key authentication endpoint for pubkeyauth.js.

## Operation test

A minimal test page is provided under the `test/` directory.

To run the operation test, start the server by running `yarn start` at the repository root, then serve the `test` directory by any method (for example, `npx http-server`) and access it.

Before testing, you must prepare `var/keys.json`.  
This file is an array of arrays, each containing a pair of a public key and a user ID.

```json
[
  ["MCowBQYDK2VwAyEAdFKG0fZr/GVCMraqjDL//GxWepS29rXMZ3v/cfBBH2o=", "hallll"],
  ["MCowBQYDK2VwAyEAAa4O63xjb/yMF5HlmlgeAxDowhC0UM1GtnjsmHIefe8=", "helooo"]
]
```

The first textarea displays the public key, which is what should be written in `keys.json`.

The second textarea displays the server's response.

The `Get Session` button sends a request to `/session`.

The `Authenticate with public key` button performs authentication against `/auth`.  
To use this button, you must first press `Get Session` and receive a `401 Unauthorized` response.

If authentication succeeds via `Authenticate with public key`, pressing `Get Session` afterward should return `200 OK`.