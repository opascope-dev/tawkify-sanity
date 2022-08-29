import ReferenceSelect from "../components/ReferenceSelect";

export default {
  name: "flows",
  type: "document",
  title: "Flows",
  fields: [
    {
      name: "path",
      type: "string",
      title: "Path",
    },
    {
      title: "First Question",
      name: "first_question",
      type: "reference",
      to:[{type:"questions"}],
      
    },
  ],
};
