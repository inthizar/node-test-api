## node-test-api

##### Requirements (Built & Tested)

* Nodejs v12.20
* Npm 6.14
* Mysql 5.7

#### Deployment

Follow these steps to run in localhost:

##### Db setup

* create the database
* create the schema using `migration/init.sql`

##### API setup

* set the configurations from `config/custom-environment-variables.json` to a `.env`
* run `npm i`
* run `npm start`

##### Testing
* set test configuration in `.env.test`
* run `npm test`
