import filteredBlocks from "../components/filteredBlocks";
import filteredQuestions from "../components/filteredQuestions";
import OptionsBlocks from "../components/OptonsBlocks";
//----------------------------------------------------------------
export default {
  name: "questions_blocks",
  type: "document",
  title: "Blocks",
  fields: [
    {
      title: "Name",
      type: "string",
      name: "name",
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => [Rule.unique(), Rule.required()],
    },
    {
      title: "Selected Questions",
      name: "selected_question",
      type: "string",
      inputComponent: filteredQuestions,
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
              name: "option_id",
              type: "string",
              title: "Option",
            },
            {
              name: "next_block_reference",
              type: "string",
              title: "nextBlockReference",
            },
            {
              name: "next_flow_reference",
              type: "string",
              title: "nextFlowReference",
            },
          ],
        },
      ],
      inputComponent: OptionsBlocks,
    },
    {
      name: "default_next_flow_reference",
      type: "reference",
      title: "Default Next Flow's Reference",
      to: [{ type: "flows" }],
    },
    {
      name:"defualt_next_block_reference",
      type:"string",
      title:"Default Next Block's Reference",
      inputComponent:filteredBlocks
    }
  ],
};
