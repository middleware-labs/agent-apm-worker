# Agent APM for Cloudflare Workers

```typescript
import * as tracker from "@middleware.io/agent-apm-worker";

export default {
	async fetch(
		request: Request,
		ctx: ExecutionContext
	): Promise<Response> {

		tracker.init({
			projectName:"{APM-PROJECT-NAME}",
			serviceName:"{APM-SERVICE-NAME}",
			accountKey:"{ACCOUNT_KEY}",
			target:"https://{ACCOUNT-UID}.middleware.io"
		})
		
		const sdk = tracker.track(request, ctx);
		const url = new URL(request.url);
		const response = await sdk.fetch(`https://httpbin.org${url.pathname}`);
		return sdk.sendResponse(response);
	},
};
```
