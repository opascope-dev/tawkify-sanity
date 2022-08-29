import React from "react";
import S from "@sanity/desk-tool/structure-builder";
import { useEffect } from "react";

const ReferenceSelect = React.forwardRef(() => {
  useEffect(() => {
    console.log(S.list().title("Content").items([
        S.listItem("questions").child()
    ]));
  }, []);
  return <div>ReferenceSelect</div>;
});

export default ReferenceSelect;
