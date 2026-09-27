Requirements (for server & observability):
- Docker

To run with the server:

```
npm run start
```

Or if you want to run the server with observability enabled:

```
docker compose up
```

Application is at: http://localhost:3000
Aspire logs can be found at: http://localhost:18888/

Example of error logs coming through otel and displayed in aspire:
![Logging example with Trace ID](./docs/examples/aspire-dashboard-example-error-log.png)

To run without express server and observability:
```
npm run dev
```