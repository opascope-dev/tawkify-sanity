import React, { useEffect, useRef, useState } from "react";
import { Select, Card, Stack } from "@sanity/ui";
import PatchEvent, { set, unset } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";
import getBlock from "../utils/getBlock";
// style
import "../styles/selectedBlock.css?raw";

const filteredBlocks = React.forwardRef((props, ref) => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    let flowRef = props.parent.default_next_flow_reference;
    if (flowRef && flowRef._ref) {
      const query = `*[_type == "flows" && _id == "${flowRef._ref}"][0]`;
      client.fetch(query).then((response) => {
        let blocks = response?.blocks;
        if (blocks) {
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
        }
      });
    } else {
      props.onChange(PatchEvent.from(set("")));
    }
  }, [props.parent.default_next_flow_reference]);
  // handlers
  const handleSelectOnChange = (e) => {
    const selectEle = e.target;
    const blockId = selectEle.options[selectEle.selectedIndex].value;
    if (blockId) {
      props.onChange(PatchEvent.from(set(blockId)));
      return;
    }
    props.onChange(PatchEvent.from(set("")));
  };
  return (
    <Stack>
      <label className="label" style={{ marginBottom: "8px" }}>
        {props.type.title}
      </label>
      <Card>
        <Select onChange={(e) => handleSelectOnChange(e)}>
          <option></option>
          <option value="" disabled selected>
            Select Block...
          </option>
          {blocks?.map((block) => {
            return (
              <option
                value={block._id}
                key={block._id}
                selected={
                  block._id === props.parent?.defualt_next_block_reference
                }
              >
                {block?.name}
              </option>
            );
          })}
        </Select>
      </Card>
    </Stack>
  );
});

export default filteredBlocks;
