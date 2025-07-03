import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import LanguageDetect from 'languagedetect';

import { AppConfig } from '@/config';

const MAX_INPUT_LENGTH = 4000;

export interface GeneratedTags {
  category: string;
  tags: string[];
  confidence: 'high' | 'medium' | 'low';
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly langDetect = new LanguageDetect();

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const apiKey = this.configService.get('gemini.key', { infer: true })!;
    const modelId = this.configService.get('gemini.model', { infer: true })!;

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelId });
  }

  private detectLanguage(text: string): string {
    const detected = this.langDetect.detect(text, 1);
    return detected.length > 0 ? detected[0][0] : 'english';
  }

  async summarize(text: string): Promise<string> {
    try {
      const cleanedText = text?.trim();
      if (!cleanedText) {
        throw new Error('Input text cannot be empty');
      }

      const inputText = cleanedText.slice(0, MAX_INPUT_LENGTH);
      const language = this.detectLanguage(text);

      const prompt = `
        Summarize the following text in about 20 to 30 words in ${language}, keeping it abstract and conceptual.
        Focus on strategic vision and fundamental principles rather than specific details or examples.

        Text: """${inputText}"""

        Return only the summary.
      `;

      const result = await this.model.generateContent(prompt);

      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API');
      }

      const summary = result.response.text()?.trim().replace(/\n/g, ' ') || '';
      return summary;
    } catch {
      throw new InternalServerErrorException('Failed to summarize text');
    }
  }

  async generateTags(
    content: string,
    categories: string[],
    maxTags: number = 4,
  ): Promise<GeneratedTags> {
    try {
      const cleanedContent = this.stripHtml(content).trim();
      if (!cleanedContent) {
        throw new Error('Input content cannot be empty');
      }

      if (!categories || categories.length === 0) {
        throw new Error('Categories list cannot be empty');
      }

      const inputContent = cleanedContent.slice(0, MAX_INPUT_LENGTH);
      const categoriesStr = categories.join(', ');

      const prompt = `
        You're an AI tag generator. Follow these STRICT rules:

        1. Select ONE primary category from this EXACT list (DO NOT INVENT NEW TAGS):
        [${categoriesStr}]

        2. Generate up to ${maxTags} tags that:
          - MUST be selected ONLY from the above list (NO EXTERNAL TAGS)
          - MUST be relevant subtopics, alternate names, or closely associated concepts that are ALREADY PRESENT in the list
          - Are 1-3 words only

        3. STRICTLY PROHIBITED:
          - Tags not found in the list above
          - Invented or uncommon terms
          - Tags from outside the provided list

        Content: """${inputContent}"""

        Format your response as JSON:
        {
          "category": "selected_category_from_list",
          "tags": ["tag1_from_list", "tag2_from_list"],
          "confidence": "high" | "medium" | "low"
        }

        Return ONLY the JSON response.
      `;

      const result = await this.model.generateContent(prompt);

      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API');
      }

      const responseText = result.response.text()?.trim();
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      // Parse JSON response
      let parsedResponse;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        parsedResponse = JSON.parse(jsonString);
      } catch {
        // Fallback if JSON parsing fails
        const tags = this.extractTagsFromText(responseText);
        parsedResponse = {
          category: categories[0],
          tags: tags.slice(0, maxTags),
          confidence: 'medium',
        };
      }

      // Validate and clean tags
      const validTags =
        parsedResponse.tags
          ?.filter(
            (tag) => tag && typeof tag === 'string' && tag.trim().length > 0,
          )
          ?.map((tag) => tag.trim().toLowerCase())
          ?.slice(0, maxTags) || [];

      if (validTags.length === 0) {
        throw new Error('No valid tags generated');
      }

      // Ensure category is valid
      const category = categories.includes(parsedResponse.category)
        ? parsedResponse.category
        : categories[0];

      return {
        category,
        tags: validTags,
        confidence: parsedResponse.confidence || 'medium',
      };
    } catch (error) {
      this.logger.error('Error generating tags', error.message);
      throw new InternalServerErrorException('Failed to generate tags');
    }
  }

  private extractTagsFromText(text: string): string[] {
    // Fallback method to extract tags if JSON parsing fails
    const lines = text.split('\n');
    const tags: string[] = [];

    for (const line of lines) {
      // Look for comma-separated values or quoted strings
      if (line.includes(',')) {
        const possibleTags = line
          .split(',')
          .map((tag) => tag.replace(/['"[\]]/g, '').trim());
        tags.push(...possibleTags);
      }
    }

    return tags.filter((tag) => tag.length > 0 && tag.length < 50);
  }

  private stripHtml(html: string): string {
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent || '';
  }
}
