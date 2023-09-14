require("@middleware.io/opentelemetry-sdk-workers/performance");
const { WorkersSDK,OTLPJsonLogExporter } = require("@middleware.io/opentelemetry-sdk-workers");
const { OTLPProtoTraceExporter } = require("@middleware.io/opentelemetry-sdk-workers/exporters/OTLPProtoTraceExporter");
const { Resource } = require("@opentelemetry/resources");
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';


interface Config {
    DEBUG: DiagLogLevel;
    projectName: string;
    serviceName: string;
    consoleLogEnabled: boolean;
    accountKey: string;
    target: string;
}

let config: Config;

const configDefault: Config = {
    DEBUG: DiagLogLevel.NONE,
    projectName: 'Default-Worker-Project',
    serviceName: 'Default-Worker-Service',
    consoleLogEnabled: false,
    accountKey: '',
    target: '',
};

export const init = (newConfig: Partial<Config> = {}) => {
    if (!newConfig.accountKey || !newConfig.target) {
        return 'accountKey and target are required';
    } else {
        configDefault.DEBUG = newConfig.DEBUG || DiagLogLevel.NONE;
        configDefault.projectName = newConfig.projectName || 'Default-Worker-Project';
        configDefault.serviceName = newConfig.serviceName || 'Default-Worker-Service';
        configDefault.consoleLogEnabled = newConfig.consoleLogEnabled || false;
        configDefault.accountKey = newConfig.accountKey;
        configDefault.target = newConfig.target;
        if (configDefault.target) {
            configDefault.target = new URL(configDefault.target).origin;
        }
        diag.setLogger(
            new DiagConsoleLogger(),
            configDefault.DEBUG ? DiagLogLevel.DEBUG : DiagLogLevel.NONE
        );

        config = configDefault;
    }
};

export const track  = (request:any,ctx:any) => {
    const resource = new Resource({
        ['mw_agent']: true,
        ['project.name']:config.projectName,
        ['service.name']:config.serviceName,
        ['mw.account_key']:config.accountKey,
    })
    const sdk = new WorkersSDK(request, ctx, {
        service: config.serviceName,
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








