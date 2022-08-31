import filteredQuestions from "../components/filteredQuestions";
import OptionsOfQuestion from "../components/optionsOfQuestion";
import NextBlockEditBox from "../components/NextBlockEditBox";
//----------------------------------------------------------------
export default {
  name: "blocks",
  type: "document",
  title: "Blocks",
  fields: [
    {
      title: "Name",
      type: "string",
      name: "name",
    },
    {
      title: "Questions",
      name: "questions_list",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "questions" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Selected Questions",
      name: "selected_questions",
      type: "reference",
      to: [{ type: "questions" }],
      inputComponent: filteredQuestions,
    },
    {
      title: "Selected Question's Options",
      name: "question_options",
      type: "object",
      fields:[
        {name:"question_id",title:"question id",type:"string"},
        {name:"answer_id",title:"answer id",type:"string"},
      ],
      inputComponent: OptionsOfQuestion,
    },
    {
      title: "Next Block's' References",
      name: "next_block_references",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question_options",
              type: "string",
              title: "Option",
            },
            {
              name: "next_block",
              type: "reference",
              title: "Next Block",
              to: [{ type: "blocks" }],
            },
          ],
        },
      ],
      inputComponent:NextBlockEditBox
    },
    {
      name:"default_next_block_reference",
      type:"reference",
      title:"Default Next Block's Reference",
      to:[{type:"blocks"}]
    }

  ],
};
