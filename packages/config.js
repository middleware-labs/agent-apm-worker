const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');

const configDefault = {
    'DEBUG' : DiagLogLevel.NONE,
    'projectName':"Default-Worker-Project",
    'serviceName':"Default-Worker-Service",
    'consoleLogEnabled':false,
    'accountKey':"",
    'target':''
}

module.exports.init = (config = {}) => {
    Object.keys(configDefault).forEach(function(key) {
        configDefault[key] = config[key] ? config[key] : configDefault[key];
    })
    if (configDefault.target){
        configDefault.target=new URL(configDefault.target).origin
    }
    diag.setLogger(new DiagConsoleLogger(), configDefault['DEBUG'] ? DiagLogLevel.DEBUG : DiagLogLevel.NONE);
    return configDefault
}
