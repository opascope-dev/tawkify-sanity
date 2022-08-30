import React, { useState } from "react";
import { Stack, Select } from "@sanity/ui";
import PatchEvent, { set, unset } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";
// style
import "../styles/selectedBlock.css?raw";
import { useEffect } from "react";

const OptionsOfQuestion = React.forwardRef((props, ref) => {
  const [options, setOptions] = useState([]);
  const { type, onChange } = props;

  // fetching options of questions
  useEffect(() => {
    client
      .fetch(
        `*[_type == "questions" && _id == "${props.parent.selected_questions?._ref}"][0]`
      )
      .then((response) => {
        if (response) {
          response?.answers ? setOptions(response.answers) : setOptions([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.parent.selected_questions]);

  // handlers
  function handleOnChange(e) {
    let select = e.target;
    onChange(PatchEvent.from(set({
        question_id:props.parent.selected_questions._ref,
        answer_id:select.options[select.selectedIndex].value
    })));
  }
  return (
    <Stack>
      <label className="label" style={{ marginBottom: "8px" }}>
        {type.title}
      </label>
      <Select onChange={handleOnChange}>
        <option></option>
        {options.map((option) => {
          if (option) {
            return (
              <option
                key={option._key}
                value={option._key}
                selected={option._key == props.parent.question_options?.answer_id}
              >
                {option.answer}
              </option>
            );
          }
        })}
      </Select>
    </Stack>
  );
});

export default OptionsOfQuestion;

