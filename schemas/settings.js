export default {
    name: "settings",
    type: "document",
    title: "Settings",
    fields: [
      {
        name: "title",
        type: "string",
        title: "Title",
      },
      {
        name: "grading_snippet",
        type: "text",
        title: "Grading Snippet",
      },
      {
        name: "grading_url",
        type: "string",
        title: "Grading URL",
      },
      {
        title: 'Default',
        name: 'default',
        type: 'boolean',
        initialValue:false
      }
    ],
  };
  