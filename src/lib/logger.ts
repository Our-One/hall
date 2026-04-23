type LogData = Record<string, unknown>;

interface Logger {
  info(message: string, data?: LogData): void;
  warn(message: string, data?: LogData): void;
  error(message: string, error?: unknown, data?: LogData): void;
}

function formatError(err: unknown): { message: string; stack?: string } | undefined {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  }
  if (err !== undefined && err !== null) {
    return { message: String(err) };
  }
  return undefined;
}

function createProductionLogger(module: string): Logger {
  const log = (level: string, message: string, data?: LogData) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      ...data,
    };
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      JSON.stringify(entry),
    );
  };

  return {
    info(message, data) {
      log('info', message, data);
    },
    warn(message, data) {
      log('warn', message, data);
    },
    error(message, err?, data?) {
      const errorInfo = formatError(err);
      log('error', message, { ...data, ...(errorInfo && { error: errorInfo }) });
    },
  };
}

function createDevLogger(module: string): Logger {
  const prefix = `[${module}]`;

  return {
    info(message, data) {
      console.log(prefix, message, ...(data ? [data] : []));
    },
    warn(message, data) {
      console.warn(prefix, message, ...(data ? [data] : []));
    },
    error(message, err?, data?) {
      const args: unknown[] = [prefix, message];
      if (err) args.push(err);
      if (data) args.push(data);
      console.error(...args);
    },
  };
}

export function createLogger(module: string): Logger {
  if (process.env.NODE_ENV === 'production') {
    return createProductionLogger(module);
  }
  return createDevLogger(module);
}
