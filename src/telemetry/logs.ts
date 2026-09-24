import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { AnyValueMap, logs, SeverityNumber } from '@opentelemetry/api-logs';
import { resource } from './telemetry';
import { context, Context } from '@opentelemetry/api';

const logExporter = new OTLPLogExporter({ url: '/telemetry/logs' });

const loggerProvider = new LoggerProvider({
  resource,
  processors: [
    new BatchLogRecordProcessor({
        exporter: logExporter,
        maxQueueSize: 100,
        maxExportBatchSize: 10,
        scheduledDelayMillis: 500,
        exportTimeoutMillis: 30000,
      }),
  ],
});

logs.setGlobalLoggerProvider(loggerProvider);

const otelLogger = logs.getLogger('react-app', '1.0.0');

type LogFn = (
  message: string,
  attributes?: AnyValueMap,
  currentContext?: Context
) => void;

export const log: {
  error: LogFn;
  warn: LogFn;
  info: LogFn;
} = {
  error: (message: string, attributes?: AnyValueMap, currentContext = context.active()) => {
    console.error(message, attributes);
    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: message,
      attributes,
      context: currentContext,
    });
  },
  warn: (message: string, attributes?: AnyValueMap, currentContext = context.active()) => {
    console.warn(message, attributes);
    otelLogger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: 'WARN',
      body: message,
      attributes,
      context: currentContext,
    });
  },
  info: (message: string, attributes?: AnyValueMap, currentContext = context.active()) => {
    console.info(message, attributes);
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
      attributes,
      context: currentContext,
    });
  },
};