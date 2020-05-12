# ExampleApp

This simple Angular web application made for testing output of `angular-rest-generator` application.

After installing generator with `npm i angular-rest-generator` there was created configuration file for generator `generatorconfig.json`.

`GatewayModule` was generated into `./src/app/gateway` using `angular-rest-generator --config ./generatorconfig.json` command.

`GatewayModule` was imported into `AppModule` and service `GatewayService` is used is `AppComponent`. 

# Installation

Download and run in root directory:
```bash
npm install
npm run start-open
```

# Usage 

* Choose method from dropdown list
* Fill required inputs
* Press call method
* See results 