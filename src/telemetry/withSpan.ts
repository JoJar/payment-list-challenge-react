import 'zone.js';
import logger from './logger';
import { tracer } from './telemetry';
import { context, trace, SpanStatusCode } from '@opentelemetry/api';

const TELEMETRY_ENABLED =
  import.meta.env.VITE_ENABLE_TELEMETRY === 'true';

export async function withSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean>,
  fn: () => Promise<T>
): Promise<T> {
  if (!TELEMETRY_ENABLED) {
    return fn();
  }
  
  const parentCtx = context.active();
  const span = tracer.startSpan(name, { attributes }, parentCtx);
  const spanCtx = trace.setSpan(parentCtx, span);

  return context.with(spanCtx, async () => {
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);

      logger.error(`${name} failed: ${error.message}`, {
        error: error.message,
        stack: error.stack ?? '',
        ...attributes,
      }, spanCtx);

      throw err;
    } finally {
      span.end();
    }
  });
}