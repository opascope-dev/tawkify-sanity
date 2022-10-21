import { string } from "prop-types";
import OptionsTextArea from "../components/OptionsTextArea";

export default {
  name: "questions",
  type: "document",
  title: "Questions",
  initialValue: {
    final_question: false,
    is_question_required:true,
    is_answer_array:false, 
  },
  fields: [
    {
      name: "question",
      type: "text",
      title: "Question"
    },
    {
      name: "question_id",
      type: "string",
      title: "ID",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "question_friendly_name",
      type: "string",
      title: "Friendly Name",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "question_type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Single", value: "single" },
          { title: "Multi", value: "multi" },
          { title: "Slider", value: "slider" },
          { title: "Input", value: "input" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name:"input_type",
      title:"Input Type",
      type:"string",
      options:{
        list:[
          {title:"Date",value:"date"},
          {title:"Text",value:"text"},
          {title:"Options",value:"options"},
        ]
      },
      hidden: ({ document }) => document?.question_type !== "input",
    },
    {
      title:"Answers",
      name: "answers",
      type: "array",
      of:[
        {
          type: "object",
          fields: [
            {
              name: "answer",
              type: "string",
              title: "Answer",
            },
            {
              name: "answer_id",
              type: "string",
              title: "ID",
            },
            {
              name: "key",
              type: "string",
              title: "Key",
            },
          ],
        },
      ],
      hidden: ({ document }) => document?.question_type === "input" && document?.input_type !== "options",
      inputComponent:OptionsTextArea
    },
    {
      name:"options_cols",
      type:"number",
      title:"Columns (i.e. 2)",
      hidden: ({ document }) => document?.question_type !== "multi" && document?.question_type !== "single"
    },
    {
      title: "Endpoint",
      name: "endpoint",
      type: "url",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Sub Copy Before Question",
      name: "sub_copy_before",
      type: 'string',
    },
    {
      title: "Sub Copy After Question",
      name: "sub_copy_after",
      type: 'array',
      of: [
        {
          type: 'block'
        }
      ]
    },
    {
      title: "Icon",
      name: "icon",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      title: 'Is Answer type is Array',
      name: 'is_answer_array',
      type: 'boolean',
      hidden: ({ document }) => document?.question_type === "multi"
    },
    {
      title: 'Required',
      name: 'is_question_required',
      type: 'boolean',
    },
    {
      title: 'Viewed Event',
      name: 'viewed_event',
      type: 'string',
    },
    {
      title: 'Completed Event',
      name: 'completed_event',
      type: 'string',
    }
  ],
};
