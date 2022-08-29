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
        
    }
  ],
};
