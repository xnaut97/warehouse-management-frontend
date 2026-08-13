import { useState } from "react";

import Input from "../common/Input.jsx";

function EditableCell({
                          value,
                          type = "text",
                          placeholder,
                          className,
                          disabled = false,
                          onCommit
                      }) {

    const [draft, setDraft] = useState(
        value ?? ""
    );

    const [syncedValue, setSyncedValue] = useState(value);

    if (value !== syncedValue) {

        setSyncedValue(value);

        setDraft(value ?? "");

    }

    const commit = async () => {

        const current = value ?? "";

        if (String(draft) === String(current)) {
            return;
        }

        if (type === "number") {

            if (draft === "" || Number.isNaN(Number(draft)) || Number(draft) < 0) {

                setDraft(current);

                return;

            }

        }

        const saved = await onCommit(draft);

        if (saved === false) {

            setDraft(current);

        }

    };

    return (

        <Input
            type={type}
            value={draft}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={(event) => event.target.select()}
            onBlur={commit}
            onKeyDown={(event) => {

                if (event.key === "Enter") {
                    event.currentTarget.blur();
                }

            }}
        />

    );

}

export default EditableCell;
