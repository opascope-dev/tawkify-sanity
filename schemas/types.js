export default {
    name:"questions_types",
    type:"document",
    title: "Types",
    fields:[
        {
            name:"quest_type",
            type:"string",
            title:"Question Type",
            validation: (Rule) => Rule.required(),
        }
    ]
}