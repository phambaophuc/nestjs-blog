import { ENV } from '@constants/env.constants';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import LanguageDetect from 'languagedetect';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly langDetect = new LanguageDetect();

  constructor() {
    this.genAI = new GoogleGenerativeAI(ENV.GEMINI.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: ENV.GEMINI.MODEL });
  }

  private detectLanguage(text: string): string {
    const detected = this.langDetect.detect(text, 1);
    return detected.length > 0 ? detected[0][0] : 'english';
  }

  async summarize(text: string): Promise<string> {
    try {
      if (!text) {
        throw new Error('Input text cannot be empty');
      }

      const language = this.detectLanguage(text);
      const prompt = `
        Summarize the following text in about 20 to 30 words in ${language}, keeping it abstract and conceptual.
        Focus on strategic vision and fundamental principles rather than specific details or examples.

        Text: """${text}"""

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
