let config;
import "opentelemetry-sdk-workers/performance";
import { WorkersSDK, OTLPJsonLogExporter } from "opentelemetry-sdk-workers";
import { OTLPProtoTraceExporter } from "opentelemetry-sdk-workers/exporters/OTLPProtoTraceExporter";
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
    })
    const sdk = new WorkersSDK(request, ctx, {
        traceExporter: new OTLPProtoTraceExporter({
            url: config.target
        }),
        logExporter: new OTLPJsonLogExporter({
            url: config.target,
            headers:{origin: 'localhost' }
        }),
        resource
    });
    return sdk;
};

