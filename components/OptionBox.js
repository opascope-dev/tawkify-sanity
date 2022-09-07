import React, { useState, useEffect } from "react";
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

  // getting stored references
  useEffect(() => {
    if (flows && flows.length > 0) {
      let currentReferenceOBJ = nextBlocksReferences?.find(
        (referenceOBJ) => referenceOBJ.option_id === option._key
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
  const handleFlowSelectOnChange = (e) => {
    const selectEle = e.target;
    const flowId = selectEle.options[selectEle.selectedIndex].value;
    setSelectedFlow(flowId);
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
    const data =
      nextBlocksReferences.length > 0 ? nextBlocksReferences : options;
    const references = data.map((optionOBJ) => {
      const updatedOption = {
        option_id: optionOBJ._key ?? optionOBJ.option_id,
        next_block_reference: optionOBJ.next_block_reference ?? "",
        next_flow_reference: optionOBJ.next_flow_reference ?? "",
      };
      if (optionOBJ._key === id || optionOBJ.option_id === id) {
        updatedOption.next_block_reference = blockId;
        updatedOption.next_flow_reference = selectedFlow;
      }
      return updatedOption;
    });
    setNextBlocksReferences([...references]);
    onChange(PatchEvent.from(set([...references])));
  };
  return (
    <Card className="card" key={option?._key}>
      <span className="option_label">{option?.answer}</span>
      <Select onChange={(e) => handleFlowSelectOnChange(e)}>
        <option></option>
        <option value="" disabled selected>
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
              option?._key
            )}
          >
            {flow?.name}
          </option>
        ))}
      </Select>
      <Select onChange={(e) => handleBlockSelectOnChange(e, option?._key)}>
        <option></option>
        <option value="" disabled selected>
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
              option?._key
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
