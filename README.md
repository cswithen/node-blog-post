# node-playground

make sure that MongoDB is up on their website

to run the project use:

```
yarn dev
```

to test the project:

```
yarn test
```

## pm2

https://pm2.keymetrics.io/

Open-source project for managing clusters

### Notes
Deconstructing a session variable

Grab the session variable from the response headers from the auth.

start up node within your directory

```
node
```

require in and set the instance of Buffer, as well as save your session variable

```
const session = 'laksjdfl...'

const Buffer = require('safe-buffer').Buffer;
```

Use Buffer to decode the base64 string that is the session key

```
Buffer.from(session, 'base64).toString('utf8')
```

We can then use the keygrip module to look at how each response is `signed` using our cookie key.

```
const Keygrip = require("keygrip")

const keygrip = new Keygrip(['insertKeyHere'])
```

And then we can use the keygrip module to sign our session and then compare the signed version to the cookie signature we recieved as a response!

```
keygrip.sign('session=' + session)
```

But the more appropriate use of this would be to use the key provided and the keygrip module to verify that it has not been tampered with.

```
keygrip.verify('sesion=' + session, 'insertValuefromKeygrip.sign') //should result in true
```