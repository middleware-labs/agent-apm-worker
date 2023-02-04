# agent apm worker

```javascript

import * as tracker from "@middleware.io/agent-apm-worker";

tracker.init({
	projectName:"{APM-PROJECT-NAME}",
	serviceName:"{APM-SERVICE-NAME}",
	accountKey:"{ACCOUNT_KEY}",
	target:"https://{ACCOUNT-UID}.middleware.io"

})

const sdk = tracker.track(request, ctx);
return sdk.sendResponse(response);
