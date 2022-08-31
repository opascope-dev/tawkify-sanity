import React, { useMemo, useState } from "react";
import { Stack, Select, Card } from "@sanity/ui";
import PatchEvent, { set, unset } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";
// style
import "../styles/selectedBlock.css?raw";
import { useEffect } from "react";
import { useRef } from "react";

const NextBlockEditBox = React.forwardRef((props, ref) => {
  const [blocks, setBlocks] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [isBoxRemoved, setIsBoxRemoved] = useState(false);
  const [isBoxUpdated, setIsBoxUpdated] = useState(false);
  const [isBoxesFetched, setIsBoxesFetched] = useState(false);
  const [currentSelectedQuestion, setCurrentSelectedQuestion] = useState({});
  const DOM_Container = useRef(null);
  const { type, onChange } = props;
  // remove all options if question changed
  useEffect(() => {
    if (currentSelectedQuestion && currentSelectedQuestion?.answers) {
      if (
        currentSelectedQuestion?._id !== props.parent.selected_questions?._ref
      ) {
        console.log("question changed");
        setBoxes([]);
        onChange(PatchEvent.from(set([])));
        // setIsBoxUpdated(true);
      }
    }
  }, [currentSelectedQuestion, props.parent.selected_questions]);
  useEffect(() => {
    //fetching added boxes
    setIsBoxesFetched(false);
    if (props.parent.next_block_references?.length > 0) {
      setBoxes([...props.parent.next_block_references]);
      setIsBoxesFetched(true);
    } else {
      setIsBoxesFetched(true);
    }
    // fetching all blocks
    client
      .fetch(`*[_type == "blocks"]`)
      .then((response) => {
        setBlocks(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // fetching option
  useEffect(() => {
    if (isBoxesFetched) {
      let answerId = props.parent.question_options?.answer_id;
      let isOptionBoxAlreadyExists =
        boxes.length === 0
          ? false
          : boxes.find((optionOBJ) => optionOBJ?._key === answerId)
          ? true
          : false;
      !isOptionBoxAlreadyExists &&
        answerId &&
        client
          .fetch(`*[_id == "${props.parent.question_options?.question_id}"][0]`)
          .then((response) => {
            setCurrentSelectedQuestion(response);
            console.log("option Response: ", response);
            if (response) {
              let option = response?.answers.find(
                (optionOBJ) => optionOBJ?._key === answerId
              );
              option &&
                setBoxes((prevBoxesState) => [...prevBoxesState, option]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }, [props.parent.question_options, isBoxesFetched]);
  // updated values on removing or updating the option box
  useEffect(() => {
    if (isBoxRemoved || isBoxUpdated) {
      console.log("Entered Of ");
      onChange(PatchEvent.from(set(boxes)));
      isBoxRemoved && setIsBoxRemoved(false);
      isBoxUpdated && setIsBoxUpdated(false);
    }
  }, [isBoxRemoved, isBoxUpdated]);

  // handlers
  function handleClickOnRemoveBox(id) {
    let updatedBoxes = boxes.filter((box) => box?._key !== id);
    setBoxes([...updatedBoxes]);
    setIsBoxRemoved(true);
  }
  function handleSelectorOnChange(e, id) {
    let select = e.target;
    let selectedBlock = select.options[select.selectedIndex].value;
    setBoxes(
      boxes.map((box) => {
        if (box?._key === id) {
          box.next_block_ref = selectedBlock;
        }
        return box;
      })
    );
    setIsBoxUpdated(true);
  }
  if (boxes && boxes.length > 0) {
    return (
      <Stack ref={DOM_Container}>
        <label className="label" style={{ marginBottom: "8px" }}>
          {type.title}
        </label>
        {boxes.map((box) => {
          return (
            <Card className="card" key={box?._key} id={box?._key}>
              <span className="option_label">{box?.answer}</span>
              <Select onChange={(e) => handleSelectorOnChange(e, box?._key)}>
                <option></option>
                {blocks.map((block) => {
                  if (block) {
                    return (
                      <option
                        value={block._id}
                        selected={box?.next_block_ref === block?._id}
                      >
                        {block.name}
                      </option>
                    );
                  }
                })}
              </Select>
              <button
                onClick={() => handleClickOnRemoveBox(box?._key)}
                className="option_label"
              >
                Remove
              </button>
            </Card>
          );
        })}
      </Stack>
    );
  }
});

export default NextBlockEditBox;
