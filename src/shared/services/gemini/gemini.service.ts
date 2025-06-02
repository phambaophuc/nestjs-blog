import { AppConfig } from '@config';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import LanguageDetect from 'languagedetect';

const MAX_INPUT_LENGTH = 4000;

@Injectable()
export class GeminiService {
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
}
