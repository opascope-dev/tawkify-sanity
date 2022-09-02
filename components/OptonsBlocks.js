import React, { useState, useEffect } from "react";
import { Stack } from "@sanity/ui";
import PatchEvent, { set } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";
import OptionBox from "./OptionBox";

const OptonsBlocks = React.forwardRef((props, ref) => {
  const [nextBlocksReferences, setNextBlocksReferences] = useState([]);
  const [options, setOptions] = useState([]);
  const [blocks, setBlocks] = useState();
  const [flows, setFlows] = useState();
  const [selectedFlow, setSelectedFlow] = useState({});
  const { selected_question } = props.parent;
  // fetcing options
  useEffect(() => {
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
  // fetching blocks and flows
  useEffect(() => {
    const blockQuery = `*[_type == "questions_blocks"]{name,_id}`;
    const flowQuery = `*[_type == "flows"]`;
    client
      .fetch(blockQuery)
      .then((response) => {
        setBlocks([...response]);
      })
      .catch(() => {});
    // fetching flows
    client
      .fetch(flowQuery)
      .then((response) => {
        setFlows([...response]);
      })
      .catch(() => {});
    //---------------------------------
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
  if (options && options.length > 0) {
    return (
      <Stack>
        <label className="label" style={{ marginBottom: "18px" }}>
          {props.type.title}
        </label>
        {options?.map((option) => {
          return (
            <OptionBox
              option={option}
              options={options}
              nextBlocksReferences={nextBlocksReferences}
              setNextBlocksReferences={setNextBlocksReferences}
              flows={flows}
              onChange={props.onChange}
            />
          );
        })}
      </Stack>
    );
  }
  return <div></div>;
});

export default OptonsBlocks;
