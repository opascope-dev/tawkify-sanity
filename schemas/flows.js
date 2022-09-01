
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
      name:"blocks",
      type:"array",
      title:"Blocks",
      of:[{type:"reference",to:[{type:"questions_blocks"}]}]
    },
  ],
};
