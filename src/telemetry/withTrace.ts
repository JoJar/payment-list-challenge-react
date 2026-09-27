import 'zone.js';
import logger from './logger';
import { tracer } from './browserTelemetry';
import { context, trace, SpanStatusCode } from '@opentelemetry/api';

const TELEMETRY_ENABLED =
  import.meta.env.VITE_ENABLE_TELEMETRY === 'true';

  /**
 * Executes an async operation inside a named OpenTelemetry span and
 * attaches the current trace context to any logger output.
 *
 * This helper is used to wrap requests so that logs and spans 
 * are correlated to the same operation. 
 * 
 * It starts a span, sets it as the active context, runs the
 * supplied function, marks the span as OK on success, and records an
 * error + structured log if the function throws.
 *
 * @template T
 * @param name The logical operation name to use for the span.
 * @param attributes Structured metadata to attach to the span/log.
 * @param fn The async work to execute within the trace context.
 * @returns The result of the async operation.
 */
export async function withTrace<T>(
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