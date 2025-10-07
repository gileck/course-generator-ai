/**
 * Base Model Adapter
 * Handles common functionality like caching, cost estimation, and API call management
 * Delegates model-specific logic to the individual adapters
 */

import { AIModelDefinition, getModelById, getAllModels, isModelExists } from './models';
import { adapters } from './adapters';
import { AIModel, AIModelAdapterResponse, AIModelBaseAdapter, AIModelCostEstimate, Usage, AIModelResponse } from './types';
import { countTokens } from './utils/tokenizer';
import { getPricePer1K } from './price';
import { addAIUsageRecord } from '../ai-usage-monitoring';


export class AIModelAdapter implements AIModelBaseAdapter {
  modelId: string;
  modelDefinition: AIModelDefinition;
  modelAdapter: AIModel;

  constructor(modelId: string) {
    // Resolve model safely; fallback to first available if invalid
    const resolvedId = isModelExists(modelId) ? modelId : (getAllModels()[0]?.id || modelId);
    if (!isModelExists(resolvedId)) {
      throw new Error(`No AI models available to use`);
    }
    this.modelId = resolvedId;
    this.modelDefinition = getModelById(resolvedId);
    this.modelAdapter = adapters[this.modelDefinition.provider]();
  }

  private getFallbackModelId(): string | null {
    const all = getAllModels();
    const preferred = all.find(m => m.provider === 'openai');
    if (preferred) return preferred.id;
    const differentProvider = all.find(m => m.id !== this.modelId);
    return differentProvider ? differentProvider.id : null;
  }

  private calculateCost(usage: Usage): AIModelCostEstimate {
    const inputCost = (usage.promptTokens / 1000) * getPricePer1K(this.modelId, usage.promptTokens).inputCost;
    const outputCost = (usage.completionTokens / 1000) * getPricePer1K(this.modelId, usage.completionTokens).outputCost;
    const totalCost = inputCost + outputCost;
    return { totalCost };
  }

  /**
   * Estimate cost based on input text and expected output
   * Uses common logic but delegates model-specific details to the specific adapter
   */
  estimateCost(
    prompt: string,
    expectedOutputTokens?: number
  ): AIModelCostEstimate {

    // Count input tokens using the appropriate tokenizer
    const promptTokens = countTokens(prompt, this.modelDefinition.provider, this.modelId);

    // Calculate input cost based on actual token count
    const inputCost = (promptTokens / 1000) * getPricePer1K(this.modelId, promptTokens).inputCost;

    // Calculate output cost based on expected output tokens (if provided)
    const outputTokens = expectedOutputTokens || Math.ceil(promptTokens / 2); // Estimate output tokens if not provided
    const outputCost = (outputTokens / 1000) * getPricePer1K(this.modelId, outputTokens).outputCost;

    const totalCost = inputCost + outputCost;
    return { totalCost };
  }

  /**
   * Process a prompt and return plain text
   * Handles caching and cost tracking, delegating the actual API call to the specific adapter
   */
  async processPromptToText(
    prompt: string,
    endpoint: string = 'unknown'
  ): Promise<AIModelAdapterResponse<string>> {

    let response: AIModelResponse<string>;
    try {
      response = await this.modelAdapter.processPromptToText(prompt, this.modelId);
    } catch (err) {
      // Fallback once to a different provider (prefer OpenAI)
      const fallbackId = this.getFallbackModelId();
      if (fallbackId && fallbackId !== this.modelId) {
        const fallback = new AIModelAdapter(fallbackId);
        return fallback.processPromptToText(prompt, endpoint);
      }
      throw err;
    }
    const cost = this.calculateCost(response.usage);

    // Track AI usage
    try {
      await addAIUsageRecord(
        this.modelId,
        this.modelDefinition,
        response.usage,
        cost.totalCost,
        endpoint
      );
    } catch (error) {
      console.error('Error tracking AI usage:', error);
      // Continue even if tracking fails
    }

    return {
      result: response.result,
      usage: response.usage,
      cost: cost
    };
  }

  /**
   * Process a prompt and return parsed JSON of type T
   * Handles caching and cost tracking, delegating the actual API call to the specific adapter
   */
  async processPromptToJSON<T>(
    prompt: string,
    endpoint: string = 'unknown'
  ): Promise<AIModelAdapterResponse<T>> {

    let response: AIModelResponse<T>;
    try {
      response = await this.modelAdapter.processPromptToJSON<T>(prompt, this.modelId);
    } catch (err) {
      // Fallback once to a different provider (prefer OpenAI)
      const fallbackId = this.getFallbackModelId();
      if (fallbackId && fallbackId !== this.modelId) {
        const fallback = new AIModelAdapter(fallbackId);
        return fallback.processPromptToJSON<T>(prompt, endpoint);
      }
      throw err;
    }
    const cost = this.calculateCost(response.usage);

    // Track AI usage
    try {
      await addAIUsageRecord(
        this.modelId,
        this.modelDefinition,
        response.usage,
        cost.totalCost,
        endpoint
      );
    } catch (error) {
      console.error('Error tracking AI usage:', error);
      // Continue even if tracking fails
    }

    return {
      result: response.result,
      usage: response.usage,
      cost: cost
    };
  }
}
