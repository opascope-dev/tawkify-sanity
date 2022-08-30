import React, { useState, useEffect } from "react";
import { FormField } from "@sanity/base/components";
import { TextInput, Card, Stack, Select, Label, Text } from "@sanity/ui";
import client from "part:@sanity/base/client";
import { useRef } from "react";
import PatchEvent, { set, unset } from "@sanity/form-builder/PatchEvent";

import "../styles/selectedBlock.css?raw";

const SelectedBlockQuestions = React.forwardRef((props, ref) => {
  const [SelectedQuestion, setSelectedQuestion] = useState("");
  const [SelectedOption, setSelectedOption] = useState({});
  const [questions, setQuestions] = useState([]);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [nextBlocksReferences, setnextBlocksReferences] = useState([]);
  const DOM_Blocks = useRef(null);

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
    // fetching all blocks
    if (blocks && blocks.length == 0) {
      client
        .fetch(`*[_type == "blocks"]`)
        .then((response) => setBlocks(response))
        .catch((err) => console.log(err));
    }
  }, [props.parent.questions_list]);

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
  useEffect(() => {
    if (nextBlocksReferences && nextBlocksReferences.length > 0) {
      let blockSelectors = DOM_Blocks.current.querySelectorAll(
        ".optionBlock select"
      );
      blockSelectors &&
        Array.from(blockSelectors).forEach((selectEle) => {
          selectEle.addEventListener("change", handleBlockchange);
        });
      console.log(nextBlocksReferences);
      props.onChange(PatchEvent.from(set(nextBlocksReferences)));
    }
  }, [nextBlocksReferences]);
  useEffect(() => {
    if(blocks && blocks.length > 0){
      addingElementsInDOM();
    }
  }, [blocks]);
  // HANDLERS
  const handleQuestionOnChange = (e) => {
    let selectEle = e.target;
    let SelectedQuestionValue =
      selectEle.options[selectEle.selectedIndex].value;
    SelectedQuestionValue
      ? setSelectedQuestion(JSON.parse(SelectedQuestionValue))
      : setSelectedQuestion("");
  };
  const handleOptionOnChange = (e) => {
    let mainBlocksParentDiv = DOM_Blocks?.current;
    let selectEle = e.target;
    let SelectedQuestionValue =
      selectEle.options[selectEle.selectedIndex].value;
    SelectedQuestionValue = SelectedQuestionValue
      ? JSON.parse(SelectedQuestionValue)
      : SelectedQuestionValue;

    SelectedQuestionValue && setSelectedOption(SelectedQuestionValue);

    let duplicateChecker = Array.from(mainBlocksParentDiv.children).find(
      (element) => {
        let id = element.getAttribute("id");
        return id === SelectedQuestionValue._key;
      }
    );
    if (mainBlocksParentDiv && SelectedQuestionValue && !duplicateChecker) {
      let span = document.createElement("span");
      let selectorDiv = document.createElement("div");
      let select = document.createElement("select");
      let parentDiv = document.createElement("div");

      parentDiv.className = "optionBlock";
      parentDiv.id = SelectedQuestionValue._key;
      select.id = SelectedQuestionValue._key;
      selectorDiv.className = "selctorDiv";
      span.innerText = SelectedQuestionValue?.answer;
      span.className = "option";

      select.addEventListener("change", (e) =>
        handleBlockchange(e, SelectedQuestionValue._key)
      );
      if (blocks && blocks.length > 0) {
        let option = document.createElement("option");
        option.value = "";
        option.innerText = "";
        select.appendChild(option);
        blocks.forEach((block) => {
          let option = document.createElement("option");

          option.value = block?._id;
          option.innerText = block.name;
          select.appendChild(option);
        });
      }
      selectorDiv.appendChild(select);
      parentDiv.append(span, selectorDiv);
      DOM_Blocks.current.appendChild(parentDiv);
      let nextBlockReference = {
        answerName: SelectedQuestionValue?.answer,
        answer_id: SelectedQuestionValue?._key,
        question: SelectedQuestion?._id,
        block_id: "",
      };
      setnextBlocksReferences((prevData) => [...prevData, nextBlockReference]);
    }
  };
  function handleBlockchange(e) {
    let id = e.target.getAttribute("id");
    let block = nextBlocksReferences.find((blockObj) => {
      console.log(blockObj);
      return blockObj?.answer_id == id;
    });
    if (block) {
      let nextBlockReference = e.target.options[e.target.selectedIndex].value;
      block.block_id = nextBlockReference;
      let updatedBlocks = nextBlocksReferences.filter(
        (blockObj) => blockObj?.answer_id !== id
      );
      updatedBlocks.push(block);
      setnextBlocksReferences([...updatedBlocks]);
    }
  }
  function addingElementsInDOM() {
    if (DOM_Blocks && DOM_Blocks.current) {
      let blocksContainer = props.parent.next_block;
      if (blocksContainer && blocksContainer.length > 0) {
        blocksContainer.forEach((block) => {
          console.log("block is :", block);
          let span = document.createElement("span");
          let selectorDiv = document.createElement("div");
          let select = document.createElement("select");
          let parentDiv = document.createElement("div");

          parentDiv.className = "optionBlock";
          parentDiv.id = block?.answer_id;
          select.id = block?.answer_id;
          selectorDiv.className = "selctorDiv";
          span.innerText = block?.answerName;
          span.className = "option";

          select.addEventListener("change", (e) =>
            handleBlockchange(e, block?.answer_id)
          );
          if (blocks && blocks.length > 0) {
            let option = document.createElement("option");
            option.value = "";
            option.innerText = "";
            select.appendChild(option);
            blocks.forEach((blockObj) => {
              let option = document.createElement("option");

              option.value = blockObj?._id;
              option.innerText = blockObj.name;
              select.appendChild(option);
            });
          }
          selectorDiv.appendChild(select);
          parentDiv.append(span, selectorDiv);
          DOM_Blocks.current.appendChild(parentDiv);
 
        });
      }
    }
  }
  return (
    <Stack>
      <Card>
        <Label
          style={{
            marginBottom: "12px",
            fontWeight: "bold",
            textTransform: "capitalize",
            letterSpacing: "normal",
          }}
        >
          Selected Questions
        </Label>
        <Select
          onChange={(e) => handleQuestionOnChange(e)}
          padding={[3, 3, 4]}
          space={[3, 3, 4]}
        >
          <option value=""></option>
          {parsedQuestions &&
            parsedQuestions.length > 0 &&
            parsedQuestions.map((question) => {
              return (
                <option
                  value={JSON.stringify(question)}
                  selected={checker(props.parent.next_block, question?._id)}
                >
                  {question?.question}
                </option>
              );
            })}
        </Select>
      </Card>
      <Card>
        <Label
          style={{
            marginTop: "2rem",
            marginBottom: "12px",
            fontWeight: "bold",
            textTransform: "capitalize",
            letterSpacing: "normal",
          }}
        >
          Selected Question's Options
        </Label>
        <Select
          padding={[3, 3, 4]}
          space={[3, 3, 4]}
          onChange={(e) => handleOptionOnChange(e)}
        >
          <option value=""></option>
          {SelectedQuestion &&
            SelectedQuestion.answers &&
            SelectedQuestion.answers.map((answer) => {
              return (
                <option value={JSON.stringify(answer)}>{answer.answer}</option>
              );
            })}
        </Select>
      </Card>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "2rem",
        }}
        ref={DOM_Blocks}
      >
        {/* <span
          style={{
            padding: "0 34px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#c9c3c3",
            height: "100%",
          }}
        >
          {SelectedOption?.answer}
        </span>
        <div style={{ flex: 1 }}>
          <Select>
            <option value=""></option>
            {blocks &&
              blocks.length > 0 &&
              blocks.map((block) => {
                return <option value={block._id}>{block.name}</option>;
              })}
          </Select>
        </div> */}
      </Card>
    </Stack>
  );
});

export default SelectedBlockQuestions;

function checker(array, id) {
  let finded =
    array && array.length > 0 && array.find((obj) => obj.question === id);
  console.log("Finded: ", finded);
  if (finded) {
    return true;
  }
  return false;
}
