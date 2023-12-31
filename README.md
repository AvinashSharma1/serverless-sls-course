# Codingly.io: Base Serverless Framework Template

https://codingly.io

## What's included
* Folder structure used consistently across our projects.
* [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started
```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
npm i serverless-webpack

sls deploy
sls deploy -f createAuction


npm install @middy/core @middy/http-event-normalizer @middy/http-error-handler @middy/http-json-body-parser
 npm install http-errors

```
Logs watch
sls logs -f processAuctions -t
sls logs -f processAuctions
sls logs -f processAuctions --startTime 1m
sls invoke -f processAuctions -l


npm i -D serverless-dotenv-plugin
useDotenv: true
- serverless-dotenv-plugin

You are ready to go!
