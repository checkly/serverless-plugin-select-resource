# Serverless Select Resource Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) 
[![npm version](https://badge.fury.io/js/serverless-plugin-select.svg)](https://badge.fury.io/js/serverless-plugin-select)
[![npm downloads](https://img.shields.io/npm/dm/serverless-plugin-select.svg)](https://www.npmjs.com/package/serverless-plugin-select)
[![license](https://img.shields.io/npm/l/serverless-plugin-select.svg)](https://raw.githubusercontent.com/FidelLimited/serverless-plugin-select/master/LICENSE)

Select which resources are to be deployed based on region and stage.

**Note:** Requires Serverless *v1.12.x* or higher.

## Setup

 Install via npm in the root of your Serverless service:

```
npm install serverless-plugin-select-resource --save-dev
```

* Add the plugin to the `plugins` array in your Serverless `serverless.yml`, you should place it at the top of the list:

```yml
plugins:
  - serverless-plugin-select-resource
  - ...
```

* Add `regions` or `stages` in your resources to select for deployment

* Run deploy command `sls deploy --stage [STAGE NAME] --region [REGION NAME]` 

* Resources will be deployed based on your selection

* All done!

#### Function

* **How it works?** When deployment region or stage don't match resources regions or stages, that function will be deleted from deployment.

* **regions** - Resource accepted deployment regions.

```yml
functions:
  hello:
    regions:
      - eu-west-1
      - ...
```

* **stages** - Resource accepted deployment stages.

```yml
functions:
  hello:
    stages:
      - dev
      - ...
```

## Contribute

Help us making this plugin better and future proof.

* Clone the code
* Install the dependencies with `npm install`
* Create a feature branch `git checkout -b new_feature`
* Lint with standard `npm run lint`

## License

This software is released under the MIT license. See [the license file](LICENSE) for more details.
