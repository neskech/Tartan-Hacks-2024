import { MouseEventHandler, useState } from "react";
import DisplayCard from "./DisplayCard";
import assert from "assert";
import GPTHandle, { StoryBlock, randomRange } from "~/util/GPT";
import DalleHandle from "~/util/DALLE";
import { Button, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//! COMPONENT
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

interface CardData {
  title: string;
  text: string;
  imagePrompts: string[];
  imageUrls: string[] | number;
}

const DEFAULT_CARD_DATA: CardData = {
  title: "",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere, massa sed luctus volutpat, sem dui vehicula tellus, vel mollis diam enim a enim. In hac habitasse platea dictumst. Nulla nibh risus, mollis sit amet feugiat vitae, molestie commodo sapien. Mauris eget suscipit nulla, vel cursus diam. Aliquam et leo et nisl blandit fermentum quis ullamcorper quam. Morbi condimentum sit amet odio in commodo. In hac habitasse platea dictumst. Etiam cursus euismod urna, sit amet imperdiet eros vulputate a.",
  imagePrompts: [],
  imageUrls: [],
};

function CardStack() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [cardData, setCardData] = useState<CardData[]>([
    DEFAULT_CARD_DATA,
    DEFAULT_CARD_DATA,
    DEFAULT_CARD_DATA,
    DEFAULT_CARD_DATA,
  ]);

  function handleCardTextUpdate(newText: string, cardIndex: number) {
    assert(0 <= cardIndex && cardIndex < cardData.length);
    setCardData((data) =>
      data.map((d, i) => {
        if (i != cardIndex) return JSON.parse(JSON.stringify(d)) as CardData;
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
    if (isStreaming) return false;
    setIsStreaming(true);
    const currentBlock = makeStoryBlock(cardData.at(-1)!);

    /* allow images to play loading animation */
    const numImages = randomRange(1, 4);
    setCardData((data) =>
      data.map((d, i) => {
        if (i != cardIndex) return JSON.parse(JSON.stringify(d)) as CardData;

        return {
          title: d.title,
          text: d.text,
          imagePrompts: d.imagePrompts,
          imageUrls: numImages,
        };
      }),
    );

    const stream = await GPTHandle.instance.makeStoryBlock(history);
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
      handleCardTextUpdate(fullText, cardIndex);
    }

    const lastPrompts = cardData.flatMap((d) => d.imagePrompts);
    const imagePrompts = await GPTHandle.instance.makeImagePrompts(
      history,
      currentBlock,
      numImages,
      lastPrompts,
    );
    console.log("prompts", imagePrompts);

    const imageUrls: string[] = [];
    for (const prompt of imagePrompts) {
      console.log("prompt", prompt);
      const url = await DalleHandle.instance.generateImage(prompt);
      imageUrls.push(url);

      setCardData((data) =>
        data.map((d, i) => {
          if (i != cardIndex) return JSON.parse(JSON.stringify(d)) as CardData;

          return {
            title: d.title,
            text: fullText,
            imagePrompts: imagePrompts,
            imageUrls: imageUrls,
          };
        }),
      );
      setIsStreaming(false);
    }
  }

  async function makeBlankStoryBlock(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    forceGPT = false,
  ) {
    e.preventDefault();
    setCardData([
      ...cardData,
      { text: "", title: "", imageUrls: [], imagePrompts: [] },
    ]);
    if (forceGPT) {
      await handleGPTStreaming(cardData.length - 1);
    }
  }
  return (
    <div className="h-[92vh] w-screen flex-row px-32">
      <div className="border-1 my-2 flex h-[80vh] flex-col gap-3 overflow-y-auto rounded-md bg-slate-50 p-1">
        {cardData.map((data, i) => (
          <div key={i} onClick={(_) => setCurrentCard(i)}>
            <DisplayCard
              key={i}
              text={data.text}
              title={data.title}
              isStreaming={isStreaming}
              imageUrls={data.imageUrls}
              isSelected={i == currentCard}
              onDelete={() => onCardDelete(i)}
              onTextChange={(t) => handleCardTextUpdate(t, i)}
              onGPTGenerate={() => handleGPTStreaming(i)}
            />
          </div>
        ))}
      </div>
      <Form className="border-1 relative top-[0vh] rounded-md bg-slate-100">
        <Form.Group className="m-1" controlId="exampleForm.ControlTextarea1">
          <Button
            onClick={(e) => makeBlankStoryBlock(e)}
            className="m-2"
            variant="primary"
            type="submit"
          >
            Create new typing block
          </Button>
          <Button
            onClick={(e) => makeBlankStoryBlock(e, true)}
            className="m-2"
            variant="success"
            type="submit"
          >
            Create new gpt block
          </Button>
        </Form.Group>
      </Form>
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
