# Agent APM for Cloudflare Workers

```typescript
import { init,track } from '@middleware.io/agent-apm-worker';

export default {
	async fetch(
		request: Request,
		ctx: ExecutionContext
	): Promise<Response> {

		init({
			projectName:"{APM-PROJECT-NAME}",
			serviceName:"{APM-SERVICE-NAME}",
			accountKey:"{ACCOUNT_KEY}",
			target:"https://{ACCOUNT-UID}.middleware.io"
		})
		
		const sdk = track(request, ctx);
		const url = new URL(request.url);
		const response = await sdk.fetch(`https://httpbin.org${url.pathname}`);
		return sdk.sendResponse(response);
	},
};
```
