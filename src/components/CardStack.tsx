import { useState } from "react";
import DisplayCard from "./DisplayCard";
import assert from "assert";
import GPTHandle, { StoryBlock } from "~/util/GPT";
import DalleHandle from "~/util/DALLE";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//! COMPONENT
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export interface CardStackProps {}

interface CardData {
  title: string;
  text: string;
  imagePrompts: string[];
  imageUrls: string[];
}

const DEFAULT_CARD_DATA: CardData = {
  title: "",
  text: "",
  imagePrompts: [],
  imageUrls: [],
};

function CardStack() {
  const [currentCard, setCurrentCard] = useState(0);
  const [cardData, setCardData] = useState<CardData[]>([DEFAULT_CARD_DATA]);

  function handleCardTextUpdate(newText: string, cardIndex: number) {
    assert(0 <= cardIndex && cardIndex < cardData.length);
    setCardData((data) =>
      data.map((d, i) => {
        if (i != cardIndex) return d;
        return {
          title: d.title,
          text: newText,
          imagePrompts: d.imagePrompts,
          imageUrls: d.imageUrls,
        };
      }),
    );
  }

  function onCardDelete(cardIndex: number) {
    setCardData((data) => data.filter((_, i) => i != cardIndex));
  }

  async function handleGPTStreaming(cardIndex: number) {
    const history = cardData.map(makeStoryBlock);
    const stream = await GPTHandle.instance.makeStoryBlock(history);

    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
      handleCardTextUpdate(fullText, cardIndex);
    }

    const currentBlock = makeStoryBlock(cardData.at(-1)!);
    const imagePrompts = await GPTHandle.instance.makeImagePrompts(
      history,
      currentBlock,
    );

    const imageUrls: string[] = [];
    for (const prompt of imagePrompts) {
      const url = await DalleHandle.instance.generateImage(prompt);
      imageUrls.push(url);
    }

    setCardData((data) =>
      data.map((d, i) => {
        if (i != cardIndex) return d;

        return {
          title: d.title,
          text: fullText,
          imagePrompts: imagePrompts,
          imageUrls: imageUrls,
        };
      }),
    );
  }

  return (
    <div className="h-[90vh] w-screen flex-row">
      <div className="w-screen px-32 ">
        <div className="border-1 my-4 h-[32rem] gap-3 overflow-y-auto rounded-md bg-slate-50 p-1"></div>
        {cardData.map((data, i) => (
          <div key={i} onClick={(_) => setCurrentCard(i)}>
            <DisplayCard
              key={i}
              text={data.text}
              title={data.title}
              isSelected={i == currentCard}
              onDelete={() => onCardDelete(i)}
              onTextChange={(t) => handleCardTextUpdate(t, i)}
              onGPTGenerate={() => handleGPTStreaming(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//! HELPERS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function makeStoryBlock(cardData: CardData): StoryBlock {
  return {
    text: cardData.text,
    imagePrompts: cardData.imagePrompts,
  };
}

export default CardStack;
