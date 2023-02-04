import * as tracker from "@middleware.io/agent-apm-worker";
tracker.init({
	projectName:"{APM-PROJECT-NAME}",
	serviceName:"{APM-SERVICE-NAME}",
	accountKey:"{ACCOUNT_KEY}",
	target:"https://{ACCOUNT-UID}.middleware.io"

})
export default {
		async fetch(
				request: Request,
				env: Env,
				ctx: ExecutionContext
		): Promise<Response> {
				const sdk = tracker.track(request, ctx);
				try {
						const response = new Response(`Hello World from ${request.method}!`);
						return sdk.sendResponse(response);
				} catch (ex) {
						sdk.captureException(ex);
				}
		}
};
