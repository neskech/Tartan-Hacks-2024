import { MouseEventHandler, useState } from "react";
import DisplayCard from "./DisplayCard";
import assert from "assert";
import GPTHandle, { StoryBlock } from "~/util/GPT";
import DalleHandle from "~/util/DALLE";
import { Button, Form } from "react-bootstrap";
import { motion, AnimatePresence} from 'framer-motion';

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
  imageUrls: string[];
}

const DEFAULT_CARD_DATA: CardData = {
  title: "",
  text: "",
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
    if(isStreaming) return false
    setIsStreaming(true)
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
    setIsStreaming(false)

  }
  function makeBlankStoryBlock(e:Event, forceGPT = false): void {
    e.preventDefault()
    setCardData([...cardData, {text:"", title:"",imageUrls:[], imagePrompts:[]}])
    if(forceGPT){
      handleGPTStreaming(cardData.length -1)
    }
  }
  return (
    <div className="h-[92vh] w-screen flex-row m-0">
      <div className="w-screen px-32 ">
        <div className="border-1 my-2 h-[80vh] flex flex-col gap-3 overflow-y-auto rounded-md bg-slate-50 p-1">
        <AnimatePresence>
          {cardData.map((data, i) => (
            <motion.div key={i} onClick={(_) => setCurrentCard(i)} 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0}}  
              transition={{duration: 0.5}}
            >
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
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
        <Form className="border-1 relative top-[0vh] rounded-md m-2">
          <Form.Group
            className="m-1"
            controlId="exampleForm.ControlTextarea1"
          >
            <Button onClick={(e)=>makeBlankStoryBlock(e)} className="m-2" variant="primary" type="submit">
              Create new typing block
            </Button>
            <Button onClick={(e)=>makeBlankStoryBlock(e, true)} className="m-2" variant="success" type="submit">
              Create new gpt block
            </Button>
          </Form.Group>
        </Form>
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
