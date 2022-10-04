import React, { useState, useEffect, useCallback } from "react";
import { Stack, TextArea } from "@sanity/ui";
import PatchEvent, { set } from "@sanity/form-builder/PatchEvent";
import { v4 as uuidv4 } from "uuid";

const OptionsTextArea = React.forwardRef((props, ref) => {
  const keys = ["option", "id"];
  const [isInvalidInput, setInvalidInput] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const { onChange } = props;
  useEffect(() => {
    props.parent?.answers &&
      setDefaultValue(parseSotreOptions(props.parent?.answers));
  }, []);

  const handleInputOnChange = useCallback(
    (e) => {
      const data = e.target.value;
      const rows = data?.split(";\n");
      let isInvalid = false;

      const optionsArr = [];
      rows.forEach((row) => {
        if (row.includes(`${keys[0]}=`) && row.includes(`${keys[1]}=`)) {
          setInvalidInput(false);

          const spreateOptionsAndId = row?.split("\n");
          const answer = spreateOptionsAndId[0]?.split("=")[1];
          const answer_id = spreateOptionsAndId[1]?.split("=")[1];

          if (!answer || !answer_id) {
            setInvalidInput(true);
            isInvalid = true;
          } else {
            setInvalidInput(false);
            isInvalid = false;
            optionsArr.push({ answer, answer_id, key: uuidv4() });
          }
        } else {
          isInvalid = true;
          setInvalidInput(true);
        }
      });
      !isInvalid && onChange(PatchEvent.from(set([...optionsArr])));
    },
    [onChange]
  );

  return (
    <Stack ref={ref}>
      <label className="label" style={{ marginBottom: "8px" }}>
        {props.type.title}
      </label>
      <TextArea
        style={{
          resize: "auto",
          minHeight: "200px",
          borderColor: "#f36458",
          borderWidth: isInvalidInput && "1px",
          borderStyle: "solid",
        }}
        defaultValue={defaultValue}
        fontSize={[2]}
        onChange={(event) => {
          handleInputOnChange(event);
        }}
        padding={[3, 3, 4]}
        placeholder="Options... i.e. option=value (next line) id=value,"
      />
    </Stack>
  );
});

export default OptionsTextArea;

// method
function parseSotreOptions(options) {
  let parsedOptions = options.map((option) => {
    option.key = undefined;
    return option;
  });
  let stringOptions = JSON.stringify(parsedOptions);

  stringOptions = stringOptions.replace(/{/g, "");
  stringOptions = stringOptions.replace(/\[/g, "");
  stringOptions = stringOptions.replace(/\]/g, "");
  stringOptions = stringOptions.replace(/"answer"/g, "option");
  stringOptions = stringOptions.replace(/"answer_id"/g, "id");
  stringOptions = stringOptions.replace(/"/g, "");
  stringOptions = stringOptions.replace(/},/g, "break");
  stringOptions = stringOptions.replace(/};/g, "break");
  stringOptions = stringOptions.replace(/,/g, "\n");
  stringOptions = stringOptions.replace(/;/g, "\n");
  stringOptions = stringOptions.replace(/break/g, ",\n");
  stringOptions = stringOptions.replace(/}/g, "");
  stringOptions = stringOptions.replace(/:/g, "=");
  stringOptions = stringOptions.replace(/,/g, ";");

  return stringOptions;
}
