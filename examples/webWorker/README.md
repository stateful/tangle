Tangle iFrames Example
======================

This little demo shows how to keep state and send events around multiple web workers. To run the demo, first build the project:

```sh
yarn build
```

Then start a static server in this directory:

```sh
cd ./examples/webWorker
ln -s ../../dist/esm/ ./dist
npm i -g http-server
http-server
```

This will deploy the app locally on: [`http://localhost:8080`](http://localhost:8080).
