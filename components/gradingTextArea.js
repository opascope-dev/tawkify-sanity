import React from "react";
import { TextArea } from "@sanity/ui";
import Card from 'part:@sanity/components/Card'

const GradingTextArea = React.forwardRef((props, ref) => {
    const [value, setValue] = useState('')
    return (
        <Card padding={4}>
            <TextArea
                fontSize={[2, 2, 3, 4]}
                onChange={(event) =>
                setValue(event.currentTarget.value)
                }
                padding={[3, 3, 4]}
                placeholder="TextArea"
                value={value}
            />
        </Card>
    );
});

export default GradingTextArea;
