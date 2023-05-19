let config;
import "@middleware.io/opentelemetry-sdk-workers/performance";
import { WorkersSDK,OTLPJsonLogExporter  } from "@middleware.io/opentelemetry-sdk-workers";
import { OTLPProtoTraceExporter } from "@middleware.io/opentelemetry-sdk-workers/exporters/OTLPProtoTraceExporter";
import { Resource } from '@opentelemetry/resources';

module.exports.init = (newConfig = {}) => {
    if (!newConfig['accountKey']){
        return 'accountKey is required';
    } else if (!newConfig['target']){
        return 'target is required';
    } else{
        config = require('./config').init(newConfig)
    }
};

module.exports.track = (request,ctx) => {
    const resource = new Resource({
        ['mw_agent']: true,
        ['project.name']:config['projectName'],
        ['service.name']:config['serviceName'],
        ['mw.account_key']:config['accountKey'],
        ['mw_serverless']: true,
        ['mw_source']: "cloudflare-worker",
    })
    const sdk = new WorkersSDK(request, ctx, {
        service: config['serviceName'],
        traceExporter: new OTLPProtoTraceExporter({
            url: config.target+'/v1/traces'
        }),
        logExporter: new OTLPJsonLogExporter({
            url: config.target+'/v1/logs',
            headers:{origin: 'localhost' }
        }),
        resource,
        consoleLogEnabled:config['consoleLogEnabled']
    });
    return sdk;
};

