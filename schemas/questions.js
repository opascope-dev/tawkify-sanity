export default {
  name: "questions",
  type: "document",
  title: "Questions",
  initialValue: {
    final_question: false,
  },
  fields: [
    {
      name: "question",
      type: "string",
      title: "Question",
      validation: (Rule) => Rule.required(),
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
      title: "Answers",
      name: "answers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "answer",
              type: "string",
              title: "Answer",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer_id",
              type: "string",
              title: "ID",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      hidden: ({ document }) => document?.question_type === "input" && document?.input_type !== "options"
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
      title: "Sub Copy",
      name: "sub_copy",
      type: "string",
    },
    {
      title: "Icon",
      name: "icon",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
};
