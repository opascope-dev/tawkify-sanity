import { string } from "prop-types";

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

            {
              name: "question_reference",
              type: "reference",
              title: "Next Question",
              to: [{ type: "questions" }],
              hidden: ({ document }) =>
                document?.final_question ||
                document?.question_type === "multi"
            },
          ],
        },
      ],
      hidden: ({ document }) => document?.question_type === "input",
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
    {
      title: "Default Next Question",
      name: "default_next_question",
      type: "reference",
      to: [{ type: "questions" }],
      hidden: ({ document }) => document?.final_question || document?.question_type === "single" || document?.question_type === "slider",
    },
    {
      title: "Final Question",
      name: "final_question",
      type: "boolean",
    },
  ],
};
