/* eslint-disable prettier/prettier */
import { Injectable, Logger, Scope } from '@nestjs/common';

// Interface pour la structure des logs
interface LogContext {
  requestId?: string;
  userId?: string;
  timestamp?: string;
  environment?: string;
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService {
  private logger: Logger;
  private context: LogContext = {};

  constructor(private readonly serviceName: string) {
    this.logger = new Logger(serviceName);
    this.context.environment = process.env.NODE_ENV || 'development';
  }

  // Méthode pour ajouter du contexte global
  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  // Méthode utilitaire pour formater le message
  private formatMessage(message: string, additionalContext?: object): string {
    const timestamp = new Date().toISOString();
    const logContext = {
      ...this.context,
      timestamp,
      ...additionalContext,
    };

    return `[${this.context.service || this.serviceName}] ${message} ${JSON.stringify(logContext)}`;
  }

  // Méthodes de logging principales
  log(message: string, context?: object) {
    this.logger.log(this.formatMessage(message, context));
  }

  error(message: string, error?: Error, context?: object) {
    const errorContext = {
      ...context,
      errorName: error?.name,
      errorMessage: error?.message,
      stackTrace: error?.stack,
    };
    this.logger.error(this.formatMessage(message, errorContext));
  }

  warn(message: string, context?: object) {
    this.logger.warn(this.formatMessage(message, context));
  }

  debug(message: string, context?: object) {
    this.logger.debug(this.formatMessage(message, context));
  }

  verbose(message: string, context?: object) {
    this.logger.verbose(this.formatMessage(message, context));
  }

  // Méthode pour les logs de sécurité
  logSecurity(message: string, context?: object) {
    this.warn(`Security: ${message}`, {
      ...context,
      metric: 'security',
    });
  }
}
