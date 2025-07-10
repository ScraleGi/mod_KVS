import React from 'react';

export function EditLabel({
    labelName,
    name,
    value,
    type = "text",
    required = true,
    autoFocus = false,
    options = []
}: {
    labelName: string | React.ReactNode;
    name: string;
    value: string | undefined;
    type?: string;
    required?: boolean;
    autoFocus?: boolean;
    options?: { value: string; label: string }[];
}) {
    if (typeof labelName !== 'string' && !React.isValidElement(labelName)) {
        throw new Error("labelName must be a string or a valid React element");
    }
    if (typeof value !== 'string' && typeof value !== 'undefined') {
        throw new Error("value must be a string or undefined");
    }

    if (type === "select" && options.length > 0) {
        return (
            <label className="flex flex-col text-xs font-medium text-neutral-700">
                {labelName}
                <select
                    name={name}
                    required={required}
                    defaultValue={value}
                    className="mt-1 border rounded px-2 py-1"
                    autoFocus={autoFocus}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    return (
        <label className="flex flex-col text-xs font-medium text-neutral-700">
            {labelName}
                <input
                    name={name}
                    required={required}
                    type={type}
                    defaultValue={value}
                    className="mt-1 border rounded px-2 py-1"
                    autoFocus={autoFocus}
                />
            </label>
    );
}