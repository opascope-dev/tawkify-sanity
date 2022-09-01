import React, { useState, useEffect } from "react";
import { Stack, Card, Select } from "@sanity/ui";
import PatchEvent, { set } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";

const OptonsBlocks = React.forwardRef((props, ref) => {
  const [nextBlocksReferences, setNextBlocksReferences] = useState([]);
  const [options, setOptions] = useState([]);
  const [blocks, setBlocks] = useState();
  const { selected_question } = props.parent;
  // fetcing options
  useEffect(() => {
    console.log("rendering");
    let currentQuestionRef = selected_question;
    if (currentQuestionRef) {
      const query = `*[_type == "questions" && _id == "${currentQuestionRef}"][0]`;
      client
        .fetch(query)
        .then((response) => {
          if (response && response.answers) {
            setOptions(response.answers);
          } else {
            setOptions([]);
          }
        })
        .catch(() => {});
    } else {
      setOptions([]);
    }
  }, [selected_question]);
  // fetching blocks
  useEffect(() => {
    const query = `*[_type == "questions_blocks"]{name,_id}`;
    client
      .fetch(query)
      .then((response) => {
        setBlocks([...response]);
      })
      .catch((error) => {
        console.log(error);
      });
    // getting added blocks refereneces
    let nextReferences = props.parent.next_block_references ?? [];
    setNextBlocksReferences([...nextReferences]);
    // on question changed reset references
    const selectedQuestionSelector = document.getElementById(
      "selectedQuestionSelector"
    );
    selectedQuestionSelector.onchange = () => {
      setNextBlocksReferences([]);
      props.onChange(PatchEvent.from(set([])));
    };
  }, []);
  //
  // handler
  //
  function handleSelectOnChange(e, id) {
    let selectEle = e.target;
    let value = selectEle.options[selectEle.selectedIndex].value;
    let data = nextBlocksReferences.length > 0 ? nextBlocksReferences : options;
    let references = data.map((optionOBJ) => {
      let updatedOption = {
        option_id: optionOBJ._key ?? optionOBJ.option_id,
        next_block_reference: optionOBJ.next_block_reference ?? "",
      };
      if (optionOBJ._key === id || optionOBJ.option_id === id) {
        updatedOption.next_block_reference = value;
      }
      return updatedOption;
    });
    console.log("references", references);
    setNextBlocksReferences([...references]);
    props.onChange(PatchEvent.from(set([...references])));
  }
  if (options && options.length > 0) {
    return (
      <Stack>
        <label className="label" style={{ marginBottom: "18px" }}>
          {props.type.title}
        </label>
        {options?.map((option) => (
          <Card className="card" key={option?._key}>
            <span className="option_label">{option?.answer}</span>
            <Select onChange={(e) => handleSelectOnChange(e, option._key)}>
              <option></option>
              {blocks?.map((block) => (
                <option
                  key={block._id}
                  value={block._id}
                  selected={_has__key(
                    nextBlocksReferences,
                    block._id,
                    option._key
                  )}
                >
                  {block?.name}
                </option>
              ))}
            </Select>
          </Card>
        ))}
      </Stack>
    );
  }
});

export default OptonsBlocks;

// methods

function _has__key(array, keyOne, keyTwo) {
  let result = array.find((OBJECT) => {
    return (
      OBJECT.next_block_reference === keyOne && OBJECT.option_id === keyTwo
    );
  });
  if (result) {
    return true;
  }
  return false;
}
