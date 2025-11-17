import { ConfigService } from '@nestjs/config';

/**
 * Ensures AI configuration is valid at startup.
 * Throws an Error when Anthropic provider is selected but API key is missing.
 */
export function ensureAiConfig(configService: ConfigService) {
  const aiProvider =
    configService.get<string>('ai.defaultProvider') ||
    configService.get<string>('AI_PROVIDER') ||
    'openai';

  if (aiProvider === 'anthropic') {
    const anthropicKey =
      configService.get<string>('ai.anthropicApiKey') ||
      configService.get<string>('ANTHROPIC_API_KEY') ||
      process.env.ANTHROPIC_API_KEY;

    if (!anthropicKey) {
      const msg =
        'Anthropic provider selected (AI_PROVIDER=anthropic) but ANTHROPIC_API_KEY is not set. ' +
        'Set ANTHROPIC_API_KEY in your environment or switch AI_PROVIDER to another provider.';
      // Use console.error and throw so the process fails fast during startup
      // and CI/CD can catch the misconfiguration.
      // eslint-disable-next-line no-console
      console.error(msg);
      throw new Error(msg);
    }
  }
}

export default ensureAiConfig;
