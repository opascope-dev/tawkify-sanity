import React, { useState, useEffect, useCallback } from "react";
import { Card, Select } from "@sanity/ui";
import PatchEvent, { set } from "@sanity/form-builder/PatchEvent";
import getBlock from "../utils/getBlock";

const OptionBox = ({
  option,
  nextBlocksReferences,
  flows,
  options,
  setNextBlocksReferences,
  onChange,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState("");
  const [answerId, setAnswerId] = useState("");

  // getting stored references
  useEffect(() => {
    if (flows && flows.length > 0) {
      let currentReferenceOBJ = nextBlocksReferences?.find(
        (referenceOBJ) => referenceOBJ.option_id === option.answer_id
      );
      if (currentReferenceOBJ) {
        let flowId = currentReferenceOBJ.next_flow_reference;
        setSelectedFlow(flowId);
        const flow = flows?.find((flowOBJ) => flowOBJ._id === flowId);
        const blocks = flow?.blocks ?? [];
        // setting blocks when all blocks are fetched
        Promise.allSettled(
          blocks.map(
            (block) =>
              new Promise((resolve, reject) => {
                getBlock(block._ref)
                  .then((response) => resolve(response))
                  .catch((error) => reject(error));
              })
          )
        ).then((values) => setBlocks(values.map((valOBJ) => valOBJ.value)));
        return;
      }
    }
  }, [flows]);
  //
  // handlers
  //
  const handleFlowSelectOnChange = (e, id) => {
    const selectEle = e.target;
    const flowId = selectEle.options[selectEle.selectedIndex].value;
    setSelectedFlow(flowId);
    setAnswerId(id);
    updateReferences(flowId, id)
    if (flowId) {
      const flow = flows?.find((flowOBJ) => flowOBJ._id === flowId);
      const blocks = flow?.blocks ?? [];
      // setting blocks when all blocks are fetched
      Promise.allSettled(
        blocks.map(
          (block) =>
            new Promise((resolve, reject) => {
              getBlock(block._ref)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
            })
        )
      ).then((values) => setBlocks(values.map((valOBJ) => valOBJ.value)));
      return;
    }
    setBlocks([]);
  };
  const handleBlockSelectOnChange = (e, id) => {
    const selectEle = e.target;
    const blockId = selectEle.options[selectEle.selectedIndex].value;
    console.log(nextBlocksReferences, "nextBlocksReferences");
    updateReferences(blockId, id)
    setAnswerId(id);
  };
  const updateReferences = (referenceId, id) => {
    const data = nextBlocksReferences.length > 0 ? nextBlocksReferences : options;
    const references = data.map((optionOBJ) => {
      const updatedOption = {
        option_id: optionOBJ.answer_id ?? optionOBJ.option_id,
        next_block_reference: optionOBJ.next_block_reference ?? "",
        next_flow_reference: optionOBJ.next_flow_reference ?? "",
      };
      if (optionOBJ._key === id || optionOBJ.option_id === id) {
        updatedOption.next_block_reference = referenceId;
        updatedOption.next_flow_reference = selectedFlow;
      }
      return updatedOption;
    });
    console.log(references, "References");
    setNextBlocksReferences([...references]);
    onChange(PatchEvent.from(set([...references])));
  };
  useEffect(() => {
    updateReferences(selectedFlow, answerId);
  }, [selectedFlow, answerId]);
  return (
    <Card className="card" key={option?.answer_id}>
      <span className="option_label">{option?.answer}</span>
      <Select onChange={(e) => handleFlowSelectOnChange(e, option?.answer_id)}>
        <option value="" selected>
          Select Flow...
        </option>
        {flows?.map((flow) => (
          <option
            value={flow?._id}
            key={flow?._id}
            selected={_has__key(
              nextBlocksReferences,
              "next_flow_reference",
              flow._id,
              option?.answer_id
            )}
          >
            {flow?.name}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => handleBlockSelectOnChange(e, option?.answer_id)}>
        <option value="" selected>
          Select Block...
        </option>
        {blocks?.map((block) => (
          <option
            key={block._id}
            value={block._id}
            selected={_has__key(
              nextBlocksReferences,
              "next_block_reference",
              block?._id,
              option?.answer_id
            )}
          >
            {block?.name}
          </option>
        ))}
      </Select>
    </Card>
  );
};

export default OptionBox;
function _has__key(array, keyTo, keyOne, keyTwo) {
  let result = array.find((OBJECT) => {
    return OBJECT[keyTo] === keyOne && OBJECT.option_id === keyTwo;
  });
  if (result) {
    return true;
  }
  return false;
}
