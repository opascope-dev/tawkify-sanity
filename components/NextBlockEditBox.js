import React, { useState } from "react";
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
  const DOM_Container = useRef(null);
  const { type, onChange } = props;

  //fetching added boxes
  useEffect(()=>{
    if(props.parent.next_block_references?.length >0){
        setBoxes([...props.parent.next_block_references]);
    }
  },[])
  // fetching all blocks
  useEffect(() => {
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
    console.log("id: ", props.parent.question_options);
    client
      .fetch(`*[_id == "${props.parent.question_options?.question_id}"][0]`)
      .then((response) => {
        console.log("Main response: ",response.answers.find((dataObj) => dataObj._key === props.parent.question_options?.answer_id))
        if (response) {
          let option = response.answers.find((dataObj) => dataObj._key === props.parent.question_options?.answer_id)
          console.log("response option is: ",option)
          if (option) {
            console.log("Enetered")
            console.log(boxes.find((optionObj) => optionObj._key === option._key))
            if (!boxes.find((optionObj) => optionObj._key === option._key)) {
              setBoxes((prevBoxes) => [...prevBoxes, option]);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.parent.question_options, props.parent.selected_questions]);
  // updated values on removed or updated box
  useEffect(() => {
    if (isBoxRemoved || isBoxUpdated) {
        console.log("in updation: ",boxes);
      onChange(PatchEvent.from(set(boxes)));
      setIsBoxRemoved(false);
      setIsBoxUpdated(false);
    }
  }, [isBoxRemoved, isBoxUpdated,boxes]);
  // handlers
  function handleClickOnRemoveBox(id) {
    let updatedBoxes = boxes.filter((box) => box._key !== id);
    setBoxes([...updatedBoxes]);
    setIsBoxRemoved(true);
  }
  function handleSelectorOnChange(e, id) {
    let select = e.target;
    let selectedBlock = select.options[select.selectedIndex].value;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        if (box._key === id) {
          console.log("entered");
          box.next_block_ref = selectedBlock;
        }
        return box;
      })
    );
    setIsBoxUpdated(true);
  }
  return (
    <Stack ref={DOM_Container}>
      <label className="label" style={{ marginBottom: "8px" }}>
        {type.title}
      </label>
      {boxes.map((box) => {
        return (
          <Card className="card" key={box._key} id={box._key}>
            <span className="option_label">{box.answer}</span>
            <Select onChange={(e) => handleSelectorOnChange(e, box._key)}>
              <option></option>
              {blocks.map((block) => {
                if (block) {
                  return <option value={block._id}>{block.name}</option>;
                }
              })}
            </Select>
            <button
              onClick={() => handleClickOnRemoveBox(box._key)}
              className="option_label"
            >
              Remove
            </button>
          </Card>
        );
      })}
    </Stack>
  );
});

export default NextBlockEditBox;
