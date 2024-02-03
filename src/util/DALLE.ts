
import OpenAI from "openai";

export default class DalleHandle {
  private static instance_: DalleHandle;
  private handle: OpenAI;

  private constructor() {
    this.handle = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
  }

  static get instance(): DalleHandle {
    if (!this.instance_) this.instance_ = new DalleHandle();
    return this.instance_;
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await this.handle.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const url = response.data[0]?.url;

    if (!url) {
      alert("HOLY FUCK THE IMAGE GENERATION ISNT WORKING");
    }

    return url!;
  }
}
