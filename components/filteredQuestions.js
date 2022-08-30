import React, { useEffect, useRef, useState } from "react";
import { Stack, Select } from "@sanity/ui";
import PatchEvent, { set, unset } from "@sanity/form-builder/PatchEvent";
import client from "part:@sanity/base/client";

import "../styles/selectedBlock.css?raw";

const filteredQuestions = React.forwardRef((props, ref) => {
  const [questions, setQuestions] = useState([]);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const DOM_Selector = useRef(null);
  const {
    type, // Schema information
    onChange, // Method to handle patch events
  } = props;
  // fetching questions
  useEffect(() => {
    let addedQuestionsRefs = props.parent.questions_list;
    addedQuestionsRefs &&
      addedQuestionsRefs.forEach((question) => {
        client
          .fetch(`*[_type == 'questions' && _id == '${question._ref}'][0]`)
          .then((response) =>
            setQuestions((prevQuestions) => [...prevQuestions, response])
          )
          .catch((err) => console.log(err));
      });
  }, [props.parent.questions_list]);
  // remove duplicate quetsions
  useEffect(() => {
    if (questions.length > 0) {
      let ParsedQuest;
      ParsedQuest = questions.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t?._id === value?._id && t?.question === value?.question
          )
      );
      setParsedQuestions([...ParsedQuest]);
    }
  }, [questions]);

  // HANDLERS
  function handleOnChange(e) {
    let select = e.target;
    onChange(
      PatchEvent.from(
        set({
          _ref: select.options[select.selectedIndex].value,
        })
      )
    );
  }
  return (
    <Stack>
      <label className="label" style={{ marginBottom: "8px" }}>
        {type.title}
      </label>
      <Select ref={DOM_Selector} onChange={handleOnChange}>
        <option></option>
        {parsedQuestions.map((question) => {
          if (question) {
            return (
              <option
                key={question._id}
                value={question._id}
                selected={props.parent.selected_questions?._ref === question._id}
              >
                {question.question}
              </option>
            );
          }
        })}
      </Select>
    </Stack>
  );
});

export default filteredQuestions;
