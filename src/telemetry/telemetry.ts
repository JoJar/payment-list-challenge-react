import 'zone.js';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { trace, context } from '@opentelemetry/api';

context.setGlobalContextManager(new ZoneContextManager());

// Service identity
export const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'payment-list-challenge-react',
  [ATTR_SERVICE_VERSION]: import.meta.env.VITE_APP_VERSION || '1.0.0',
  [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: import.meta.env.MODE || 'development',
});

// forward traces through the Express telemetry proxy, which then forwards them 
// on to the Aspire dashboard's OTLP/HTTP endpoint
const exporter = new OTLPTraceExporter({
  url: '/telemetry/traces',
});

// Create the trace provider
const provider = new WebTracerProvider({
  resource,
  // Use batch processing for efficiency
  spanProcessors: [
    new BatchSpanProcessor(exporter, {
      maxQueueSize: 100,
      maxExportBatchSize: 10,
      scheduledDelayMillis: 500,
      exportTimeoutMillis: 30000,
    }),
  ],
});

// Register the provider globally
provider.register({
  contextManager: new ZoneContextManager(),
});

// Register automatic instrumentations
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      // Only propagate trace headers from MSW-mocks.
      propagateTraceHeaderCorsUrls: [/\/api\/payments.*/,'http://localhost:3000'],
      clearTimingResources: true,
      // Avoid instrumenting our own telemetry export requests
      ignoreUrls: [/\/telemetry\/traces/],
    }),
    new DocumentLoadInstrumentation()
  ],
});

// Export tracer for manual instrumentation
export const tracer = trace.getTracer('react-app', '1.0.0');

// Graceful shutdown
export function shutdownTelemetry(): Promise<void> {
  return provider.shutdown();
}

// reference https://oneuptime.com/blog/post/2026-01-15-react-opentelemetry-frontend-observability/view#2-opentelemetry-web-sdk-overview