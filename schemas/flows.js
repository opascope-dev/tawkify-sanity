
export default {
  name: "flows",
  type: "document",
  title: "Flows",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "path",
      type: "string",
      title: "Path",
      hidden: ({ document }) => document?.default_flow,
    },
    {
      name:"blocks",
      type:"array",
      title:"Blocks",
      of:[{type:"reference",to:[{type:"questions_blocks"}]}]
    },
    {
      title: 'Default Flow',
      name: 'default_flow',
      type: 'boolean',
      initialValue:false
    }
  ],
};
