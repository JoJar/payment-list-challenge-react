import 'zone.js';
import { log } from './logs'
import { tracer } from './telemetry'
import { context, trace, SpanStatusCode } from '@opentelemetry/api'

export async function withSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean>,
  fn: () => Promise<T>
): Promise<T> {
  const span = tracer.startSpan(name, { attributes })
  const ctx = trace.setSpan(context.active(), span)

  return context.with(ctx, async () => {
    try {
      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      const message = `${name} failed: ${error.message}`

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      })
      span.recordException(error)

      log.error(message, {
        error: error.message,
        stack: error.stack ?? '',
        ...attributes,
      }, ctx)

      throw err
    } finally {
      span.end()
    }
  })
}