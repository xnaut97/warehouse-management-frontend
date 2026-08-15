import Input from "../common/Input.jsx";

function EditableCell({
                          value,
                          type = "text",
                          placeholder,
                          className,
                          disabled = false,
                          onChange
                      }) {

    return (

        <Input
            type={type}
            value={value ?? ""}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
            min={type === "number" ? 0 : undefined}
            onChange={(event) => onChange(event.target.value)}
            onFocus={(event) => event.target.select()}
        />

    );

}

export default EditableCell;
