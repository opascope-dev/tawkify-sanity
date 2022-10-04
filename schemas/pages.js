export default {
    name: "pages",
    type: "document",
    title: "Pages",
    fields: [
      {
        name: "title",
        type: "string",
        title: "Title",
      },
      {
        name: "path",
        type: "string",
        title: "Path",
      },
      {
        name: "headline",
        type: "text",
        title: "Headline",
      },
      {
        name: "sub_copy",
        title: "Sub Copy",
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
      },
      {
        name: "schedule_cta_iframe_url",
        type: "string",
        title: "Schedule CTA Iframe URL",
      },
      {
        title:"Press",
        name: "press",
        type: "array",
        of:[
          {
            type: "object",
            fields: [
              {
                title: "Icon",
                name: "icon",
                type: "image",
                options: {
                    hotspot: true,
                },
              },
              {
                name: "headline",
                type: "string",
                title: "Headline",
              },
              {
                name: "description",
                type: "text",
                title: "Description",
              },
            ],
          },
        ],
      },
      {
        title:"Featured",
        name: "featured",
        type: "array",
        of:[
          {
            type: "object",
            fields: [
              {
                title: "Icon",
                name: "icon",
                type: "image",
                options: {
                    hotspot: true,
                },
              },
              {
                name: "headline",
                type: "string",
                title: "Headline",
              },
            ],
          },
        ],
      },
      {
        title: 'Default',
        name: 'default',
        type: 'boolean',
        initialValue:false
      }
    ],
  };
  