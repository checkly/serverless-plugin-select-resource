'use strict'

/**
 * @module serverless-plugin-select-resource
 *
 * @see {@link https://serverless.com/framework/docs/providers/aws/guide/plugins/}
 * */

/**
 * @classdesc Select which resources are to be deployed
 * @class SelectResource
 * */
class SelectResource {
  /**
   * @description Serverless Select Resource
   * @constructor
   *
   * @param {!Object} serverless - Serverless object
   * @param {!Object} options - Serverless options
   * */
  constructor (serverless, options) {
    /** Serverless variables */
    this.serverless = serverless
    this.options = options
    this.pluginName = "select-resource"

    /** Serverless hooks */
    this.hooks = {
      'after:package:initialize': this.deployHook.bind(this),
      'before:deploy:resource:initialize': this.deployHook.bind(this)
    }
  }

  /**
   * @description Deploy hook
   *
   * @fulfil {} — Resources optimized
   * @reject {Error} Optimization error
   *
   * @return {(boolean|Promise)}
   * */
  deployHook () {
    /** Skip resource selection */
    if (this.options.noDeploy) {
      return false
    }

    /** Log select resources start */
    this.serverless.cli.log(
      this.pluginName +': selecting resources for deployment'
    )

    /** Select all resources */
    return this.selectAllResources()
  }

  /**
   * @description Select all resources
   *
   * @fulfil {} — All selected resources
   * @reject {Error} Selection error
   *
   * @return {Promise}
   * */
  selectAllResources () {
    /** Get resources */
    const allResources = Object.keys(
      this.serverless.service.resources.Resources
    )

    /** Select resources for deployment */
    const promises = allResources.map((resourceName) =>
      this.selectResource(resourceName)
    )
    return Promise.all(promises)
  }

  /**
   * @description Select resource
   *
   * @param {string} resourceName - Resource name
   *
   * @fulfil {} — Selected resource
   * @reject {Error} Selection error
   *
   * @return {Promise}
   * */
  selectResource (resourceName) {
    /** Select promise */
    return new Promise((resolve, reject) => {
      /** Resource object variables */
      const resourceObject = this.serverless.service.resources.Resources[resourceName]

      /** Select function properties */
      const regions =
        Array.isArray(resourceObject.regions) && resourceObject.regions.length
          ? resourceObject.regions
          : false
      const stages =
        Array.isArray(resourceObject.stages) && resourceObject.stages.length
          ? resourceObject.stages
          : false
      if( stages ) {
          this.serverless.cli.log(this.pluginName+": found stages: " + stages + " in " + resourceName);
      }
      /** Deployment region not selected for resource deployment */
      if (
        regions && typeof this.options.region !== 'undefined' && regions.indexOf(this.options.region) === -1
      ) {
        this.serverless.cli.log("disable resource:", resourceName);
        delete this.serverless.service.resources.Resources[resourceName]
      }
    /* 
     // enable for debugging
    if( typeof stages.indexOf == "function") { 
        this.serverless.cli.log( resourceName +  "::::"+ stages.indexOf(this.options.stage)  );
        console.log(resourceName, stages, typeof this.options.stage !== 'undefined', typeof stages.indexOf == 'function' , stages.indexOf(this.options.stage) === -1)
        console.log(
        stages &&
        typeof this.options.stage !== 'undefined' &&
        typeof stages.indexOf == 'function' &&
        stages.indexOf(this.options.stage) === -1
        )
    }
    */
      /** Deployment stage not selected for resource deployment */
      if (
        stages &&
        typeof this.options.stage !== 'undefined' &&
        typeof stages.indexOf == 'function' &&
        stages.indexOf(this.options.stage) === -1
      ) {
        this.serverless.cli.log(this.pluginName+" STAGE:"+this.options.stage+ " disable resource:" + resourceName);
        const statements = this.serverless.service.provider.iamRoleStatements
        for (let st in statements) {
            for (const e in statements[st].Resource) {
                const resource = statements[st].Resource[e];
                const resourceStr = JSON.stringify(resource);
                if( resourceStr.indexOf(`"${resourceName}"`) !== -1 ) {
                    this.serverless.cli.log(this.pluginName+" STAGE:"+this.options.stage+ " disable statement:" +  resourceStr);
                    delete this.serverless.service.provider.iamRoleStatements[st].Resource[e];
                }
            }
        }
        delete this.serverless.service.resources.Resources[resourceName]
      }

      /** Remove the regions and stages keys to keep generated CloudFormation files correct **/
      if (this.serverless.service.resources.Resources[resourceName]) {
        Object.assign(this.serverless.service.resources.Resources[resourceName], {
          regions: undefined,
          stages: undefined
        })
      }

      /** Resolve with function object */
      resolve(resourceObject)
    })
  }
}

/** Export stages class */
module.exports = SelectResource
