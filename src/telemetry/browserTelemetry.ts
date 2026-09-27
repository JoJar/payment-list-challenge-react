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
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { trace, context } from '@opentelemetry/api';

const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === 'true';

context.setGlobalContextManager(new ZoneContextManager());

export const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'payment-list-challenge-react',
  [ATTR_SERVICE_VERSION]: import.meta.env.VITE_APP_VERSION || '1.0.0',
  [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: import.meta.env.MODE || 'development',
});

let provider: WebTracerProvider | null = null;

if (TELEMETRY_ENABLED) {
  const exporter = new OTLPTraceExporter({
    url: '/telemetry/traces',
  });

  provider = new WebTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(exporter, {
        maxQueueSize: 100,
        maxExportBatchSize: 10,
        scheduledDelayMillis: 500,
        exportTimeoutMillis: 30000,
      }),
    ],
  });

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
    ],
  });
}

export const tracer = trace.getTracer('payment-list-challenge-react', '1.0.0');

export function shutdownTelemetry(): Promise<void> {
  if (!provider) {
    return Promise.resolve();
  }

  return provider.shutdown();
}