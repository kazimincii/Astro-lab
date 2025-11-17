import { ConfigService } from '@nestjs/config';
import { ensureAiConfig } from './ai.guard';

describe('ensureAiConfig', () => {
  it('does not throw when provider is openai', () => {
    const cfg: Partial<Record<string, any>> = {
      AI_PROVIDER: 'openai',
    };
    const service = ({ get: (key: string) => cfg[key] } as unknown) as ConfigService;
    expect(() => ensureAiConfig(service)).not.toThrow();
  });

  it('throws when provider is anthropic and key is missing', () => {
    const cfg: Partial<Record<string, any>> = {
      AI_PROVIDER: 'anthropic',
    };
    const service = ({ get: (key: string) => cfg[key] } as unknown) as ConfigService;
    expect(() => ensureAiConfig(service)).toThrow(/ANTHROPIC_API_KEY/);
  });

  it('does not throw when provider is anthropic and key is present', () => {
    const cfg: Partial<Record<string, any>> = {
      AI_PROVIDER: 'anthropic',
      ANTHROPIC_API_KEY: 'sk-ant-abc123',
    };
    const service = ({ get: (key: string) => cfg[key] } as unknown) as ConfigService;
    expect(() => ensureAiConfig(service)).not.toThrow();
  });
});
