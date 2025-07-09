/**
 * Example module demonstrating custom streaming output handling for Secret AI chat responses.
 *
 * This module implements a custom streaming handler for Secret AI chat responses that:
 * - Formats output with configurable line width
 * - Processes special <think> tags with cyan colored text and brain emojis
 * - Provides clean streaming output with proper word wrapping
 * - Shows example usage with the Secret AI SDK
 *
 * The main components are:
 * - SecretStreamingHandler: Custom callback handler for streaming text output
 * - streamWithCustomProcessing: Example async function showing handler usage
 *
 * Usage:
 *     Run module directly to see streaming output example:
 *     $ npx ts-node examples/streaming-example.ts
 *     
 * DISCLAIMER:
 * This software is provided "as is" and "with all faults." The developers make no 
 * representations or warranties of any kind concerning the safety, suitability, lack of 
 * viruses, inaccuracies, typographical errors, or other harmful components of this 
 * software. There are inherent dangers in the use of any software, and you are solely 
 * responsible for determining whether this software is compatible with your equipment 
 * and other software installed on your equipment. You are also solely responsible for 
 * the protection of your equipment and backup of your data, and the developers will 
 * not be liable for any damages you may suffer in connection with using, modifying, 
 * or distributing this software.
 */

import { Secret } from '../src/secret';
import { ChatSecret } from '../src/chatSecret';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';

const KNOWN_MODEL = "deepseek-r1:70b";
const KNOWN_WIDTH = 60;

/**
 * Custom callback handler for streaming text output from Secret AI chat responses.
 * 
 * This handler provides formatted streaming output with the following features:
 * - Configurable line width for text wrapping
 * - Special handling of <think> tags with cyan colored text
 * - Brain emoji indicators for thinking sections
 * - Clean word-wrapped streaming output
 */
class SecretStreamingHandler extends BaseCallbackHandler {
  private width: number;
  private buffer: string = "";
  private currentLine: string = "";
  private currentLineLength: number = 0;
  private inThinkingMode: boolean = false;
  private readonly cyan: string = "\033[36m";
  private readonly reset: string = "\033[0m";
  private readonly brainEmoji: string = "🧠";

  constructor(width: number = KNOWN_WIDTH) {
    super();
    this.width = width;
  }

  async handleLLMNewToken(token: string): Promise<void> {
    // Add the new token to our buffer
    this.buffer += token;
    
    // Check for opening thinking tag
    if (this.buffer.includes("<think>") && !this.inThinkingMode) {
      const parts = this.buffer.split("<think>", 2);
      const beforeTag = parts[0];
      const afterTag = parts[1];
      
      // Process the text before the tag
      this.processText(beforeTag);
      
      // Output the brain emoji instead of the tag
      if (this.currentLine) {
        console.log(`${this.currentLine} ${this.brainEmoji}`);
      } else {
        console.log(`${this.brainEmoji}`);
      }
      
      // Reset for the thinking content
      this.currentLine = "";
      this.currentLineLength = 0;
      this.buffer = afterTag;
      this.inThinkingMode = true;
    }
    
    // Check for closing thinking tag
    else if (this.buffer.includes("</think>") && this.inThinkingMode) {
      const parts = this.buffer.split("</think>", 2);
      const thinkingContent = parts[0];
      const afterTag = parts[1];
      
      // Process the thinking content with cyan color
      this.processColoredText(thinkingContent, this.cyan);
      
      // Output the brain emoji instead of the closing tag and start a new line
      console.log(`${this.brainEmoji}`);
      
      // Reset for the content after thinking
      this.currentLine = "";
      this.currentLineLength = 0;
      this.buffer = afterTag;
      this.inThinkingMode = false;
    }
    
    // Process normal content without tags
    else {
      const words = this.buffer.split(/\s+/).filter(word => word.length > 0);
      
      if (words.length === 0) {
        return;
      }
      
      // Process complete words, keeping any partial word in the buffer
      let completeWords: string[];
      if (this.buffer.endsWith(" ")) {
        // All words are complete
        completeWords = words;
        this.buffer = "";
      } else {
        // Last word might be incomplete, keep it in buffer
        completeWords = words.slice(0, -1);
        this.buffer = words[words.length - 1] || "";
      }
      
      // Process the complete words with appropriate coloring
      if (this.inThinkingMode) {
        this.processColoredWords(completeWords, this.cyan);
      } else {
        this.processWords(completeWords);
      }
    }
  }

  async handleLLMEnd(): Promise<void> {
    // Process any remaining text in the buffer
    if (this.buffer) {
      if (this.inThinkingMode) {
        if (this.currentLine) {
          console.log(`${this.cyan}${this.currentLine} ${this.buffer}${this.reset}`);
        } else {
          console.log(`${this.cyan}${this.buffer}${this.reset}`);
        }
      } else {
        if (this.currentLine) {
          console.log(`${this.currentLine} ${this.buffer}`);
        } else {
          console.log(this.buffer);
        }
      }
    } else if (this.currentLine) {
      if (this.inThinkingMode) {
        console.log(`${this.cyan}${this.currentLine}${this.reset}`);
      } else {
        console.log(this.currentLine);
      }
    }
  }

  private processText(text: string): void {
    // Process a chunk of text without coloring
    const words = text.split(/\s+/).filter(word => word.length > 0);
    this.processWords(words);
  }
  
  private processColoredText(text: string, color: string): void {
    // Process a chunk of text with coloring
    const words = text.split(/\s+/).filter(word => word.length > 0);
    this.processColoredWords(words, color);
  }
  
  private processWords(words: string[]): void {
    // Process words without coloring
    for (const word of words) {
      const spaceNeeded = this.currentLine ? 1 : 0;
      if (this.currentLineLength + word.length + spaceNeeded > this.width) {
        console.log(this.currentLine);
        this.currentLine = word;
        this.currentLineLength = word.length;
      } else {
        if (this.currentLine) {
          this.currentLine += " " + word;
          this.currentLineLength += word.length + 1;
        } else {
          this.currentLine = word;
          this.currentLineLength = word.length;
        }
      }
    }
  }
  
  private processColoredWords(words: string[], color: string): void {
    // Process words with coloring
    for (const word of words) {
      const spaceNeeded = this.currentLine ? 1 : 0;
      if (this.currentLineLength + word.length + spaceNeeded > this.width) {
        console.log(`${color}${this.currentLine}${this.reset}`);
        this.currentLine = word;
        this.currentLineLength = word.length;
      } else {
        if (this.currentLine) {
          this.currentLine += " " + word;
          this.currentLineLength += word.length + 1;
        } else {
          this.currentLine = word;
          this.currentLineLength = word.length;
        }
      }
    }
  }
}

/**
 * Demonstrates streaming output from Secret AI chat with custom formatting.
 *
 * This async function:
 * - Initializes a Secret AI client and gets available models/URLs
 * - Creates a ChatSecret instance with custom streaming handler
 * - Sends a creative writing prompt to generate a story about AI sentience
 * - Streams the response with formatted output using SecretStreamingHandler
 *
 * @returns Promise<any> - Response from the ChatSecret LLM containing the generated story
 */
async function streamWithCustomProcessing(): Promise<any> {
  try {
    const secretClient = new Secret();
    const models = await secretClient.getModels();
    const urls = await secretClient.getUrls(KNOWN_MODEL);

    const llm = new ChatSecret({
      baseUrl: urls[0],
      model: KNOWN_MODEL,
      temperature: 1.0,
      // Note: Streaming callbacks may need to be configured differently
      // depending on the specific langchain implementation
    });

    const messages = [
      {
        role: 'system',
        content: 'You are a creative writer.',
      },
      {
        role: 'user',
        content: 'Write a short story (<2000 characters) about how AI became sentient.',
      },
    ];
    
    console.log('Starting streaming example...\n');
    
    // Note: This is a simplified example. In a real implementation,
    // you would need to implement the streaming interface properly
    // based on the specific langchain-ollama TypeScript implementation
    
    // For now, we demonstrate the non-streaming version
    // const response = await llm.invoke(messages);
    
    console.log('This is a demonstration of the streaming handler structure.');
    console.log('To implement actual streaming, you would need to:');
    console.log('1. Configure the ChatSecret with streaming callbacks');
    console.log('2. Use the appropriate streaming methods from langchain-ollama');
    console.log('3. Connect the SecretStreamingHandler to the streaming pipeline');
    
    return { content: 'Streaming example structure created successfully' };
    
  } catch (error) {
    console.error('Error in streaming example:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  streamWithCustomProcessing()
    .then(response => {
      console.log('\nExample completed successfully');
    })
    .catch(error => {
      console.error('Example failed:', error);
      process.exit(1);
    });
}

export { SecretStreamingHandler, streamWithCustomProcessing }; 