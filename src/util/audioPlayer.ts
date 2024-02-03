import { None, type Option, Some } from "./option";

type AudioCallback = (this: AudioBufferSourceNode, ev: Event) => void;
interface CurrentAudio {
  audioBuffer: AudioBuffer;
  callback: AudioCallback;
}

export default class AudioPlayer {
  private static instance_: AudioPlayer;
  private audioContext: AudioContext;
  private currentAudio: Option<CurrentAudio>;
  private source: AudioBufferSourceNode;

  private constructor() {
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createBufferSource();
    this.source.connect(this.audioContext.destination);
    this.currentAudio = None();
  }

  static get instance(): AudioPlayer {
    if (!this.instance_) this.instance_ = new AudioPlayer();
    return this.instance_;
  }

  private async setAudio(audioBuffer: AudioBuffer) {
    await this.stopAudioAsync();

    const callback: AudioCallback = function () {
      this.start();
    };
    this.source.addEventListener("ended", callback);

    this.source.buffer = audioBuffer;
    this.source.start();

    this.currentAudio = Some({
      audioBuffer,
      callback,
    });
  }

  async playAudio(prompt: string) {
    const response = await fetch("/api/getAudio", {
      body: JSON.stringify({
        prompt,
      }),
    });

    const buffer = await response.arrayBuffer();
    const audioBuf = await this.audioContext.decodeAudioData(buffer);
    await this.setAudio(audioBuf);
  }

  stopAudio() {
    if (this.currentAudio.isNone()) return;

    this.source.stop();
    this.source.buffer = null;

    const callback = this.currentAudio.unwrap().callback;
    this.source.removeEventListener("ended", callback);

    this.currentAudio = None();
  }

  async stopAudioAsync() {
    if (this.currentAudio.isNone()) return;

    const callback = this.currentAudio.unwrap().callback;
    this.source.removeEventListener("ended", callback);

    await untilAudioEnd(this.source)

    this.source.stop();
    this.source.buffer = null;
    this.currentAudio = None();
  }
}

function untilAudioEnd(source: AudioBufferSourceNode): Promise<void> {
  return new Promise((res) => {
    const callback = () => {
      source.removeEventListener("ended", callback);
      res();
    };

    source.addEventListener("ended", callback);
  });
}
