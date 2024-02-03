import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { env } from "~/env";
import { type IterableReadableStream } from "node_modules/@langchain/core/dist/utils/stream";

export interface StoryBlock {
  text: string;
  imagePrompts: string[];
}

export default class GPTHandle {
  private static instance_: GPTHandle;
  private handle: ChatOpenAI;

  private constructor() {
    this.handle = new ChatOpenAI({
      openAIApiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    this.handle.temperature = 0.7;
    this.handle.maxTokens = 400
  }

  static get instance(): GPTHandle {
    if (!this.instance_) this.instance_ = new GPTHandle();
    return this.instance_;
  }

  async makeStoryBlock(
    history: StoryBlock[],
  ): Promise<IterableReadableStream<string>> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are helping a human write a story, where each part of the story 
         is seperated in chunks. Each chunk has some text and associated AI generated images
         for that chunk. Your task is to write the next chunk of the story, 
         given the previous chunks. Each previous chunk will include its respective
         text and the prompts used to generate the images`,
      ],
      [
        "user",
        "These are the contents of the previous chunks:\n\n {prevChunks}",
      ],
      [
        "user",
        `Use the history given to you to generate a new story section. 
         Do NOT include image prompts or the story block index. Keep your 
         response brief please`,
      ],
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(this.handle).pipe(parser);
    const historyText = makeStoryBlockString(history);

    return await chain.stream({
      prevChunks: historyText,
    });
  }

  async makeImagePrompts(
    history: StoryBlock[],
    current: StoryBlock,
    numImages: number,
    previousPrompts: string[],
  ): Promise<string[]> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are helping a human write a story, where each part of the story 
         is seperated in chunks. Each chunk has some text and associated AI generated images
         for that chunk. Your task is to make an image that captures the current chunk of the story.
         You will do this by making a DALLE-2 image generation prompt so you can tell it exactly what
         you want.`,
      ],
      [
        "user",
        "These are the contents of the previous story chunks:\n\n {prevChunks}",
      ],
      [
        "user",
        "This is the content of the current story chunk:\n\n {currChunk}",
      ],
      ["user", "These are your previous prompts {prevPrompts}"],
      [
        "user",
        `Use the history given to you, along with the contents of the current story block,
         to generate a DALLE AI Image prompt to generate a relevant image. Please make this content
         appropiate so that you do not get rejected by the DALLE-3 API, while still making
         your prompt relevant to the story. DO NOT make meta references to the 'previous' or 'next' story blocks, 
         as DALLE has no knowledge of your task here. Make sure the resulting image is not tiled up into
         tinier images. Make your prompt CLEAR and most importantly CONCISE, as DALLE needs it.`,
      ],
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(this.handle).pipe(parser);

    const historyText = makeStoryBlockString(history);
    const currentBlockText = makeStoryBlockString([current]);

    const imagePrompts: string[] = [];

    for (let i = 0; i < numImages; i++) {
      const lastPrompts = (previousPrompts.concat(imagePrompts)).reduce((acc, curr, index) => {
        const header = `Image prompt #${index + 1} `;
        const newLine = index == imagePrompts.length - 1 ? "" : "\n";
        return acc + header + curr + newLine;
      }, "");

      const prompt = await chain.invoke({
        prevChunks: historyText,
        currChunk: currentBlockText,
        prevPrompts: lastPrompts,
      });

      imagePrompts.push(prompt);
    }

    return imagePrompts;
  }

  async makeMusicLMPrompt(
    history: StoryBlock[],
    current: StoryBlock,
  ): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are helping a human write a story, where each part of the story 
         is seperated in chunks. Each chunk has some text and associated AI generated images
         for that chunk. Your task is to write the next chunk of the story, 
         given the previous chunks. Each previous chunk will include its respective
         text and the prompts used to generate the images.`,
      ],
      [
        "user",
        "These are the contents of the previous chunks:\n\n {prevChunks}",
      ],
      [
        "user",
        "This is the content of the current story chunk:\n\n {currChunk}",
      ],
      [
        "user",
        `Use the history given to you, along with the contents of the current story block,
         to generate a Music-LM prompt to generate a relevant musical piece`,
      ],
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(this.handle).pipe(parser);
    const historyText = makeStoryBlockString(history);
    const currentBlockText = makeStoryBlockString([current]);

    return await chain.invoke({
      prevChunk: historyText,
      currChunk: currentBlockText,
    });
  }
}

function makeStoryBlockString(history: StoryBlock[]): string {
  const historyText = history.reduce((acc, curr, index) => {
    const storyHeader = `Story block #${index}:\n\n`;
    const newStory = curr.text + "\n\n";

    const imageHeader = `Image prompts used for story block #${index + 1}:\n`;
    const imagePrompts = curr.imagePrompts.reduce(
      (acc, currImgPrompt, index) => {
        const header = `Image prompt #${index + 1}: `;
        const content = header + currImgPrompt;
        const newLine = index == curr.imagePrompts.length - 1 ? "" : "\n";
        return acc + content + newLine;
      },
      "",
    );

    const story = storyHeader + newStory;
    const image = imageHeader + imagePrompts;
    const newLines = index == history.length - 1 ? "" : "\n\n";

    return acc + story + image + newLines;
  }, "");

  return historyText;
}

export function randomRange(low: number, high: number): number {
  const range = high - low;
  const rand = Math.random() * range + low;
  return Math.floor(rand);
}
