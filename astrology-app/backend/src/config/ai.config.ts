import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  // Default to Claude Haiku 4.5 when Anthropic is selected
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-4.5',
  // Default AI provider set to Anthropic (Claude Haiku) unless overridden
  defaultProvider: process.env.AI_PROVIDER || 'anthropic', // 'openai' or 'anthropic'
}));
