To run with the server:

```
npm run start
```

If you want to enable observability (in detached mode):

```
docker compose up
```

![Aspire Login URL](./docs/examples/authenticate-aspire.png)

Example of error logs coming through otel and displayed in aspire:
![Logging example with Trace ID](./docs/examples/aspire-dashboard-example-error-log.png)

To run without a server
```
npm run dev
```