import React from 'react';

export function EditLabel({
    labelName,
    name,
    value
}: {
    labelName: string | React.ReactNode;
    name: string;
    value: string | undefined;
}) {
    if (typeof labelName !== 'string' && !React.isValidElement(labelName)) {
        throw new Error("labelName must be a string or a valid React element");
    }
    if (typeof value !== 'string' && typeof value !== 'undefined') {
        throw new Error("value must be a string or undefined");
    }
    return (
        <label className="flex flex-col text-xs font-medium text-neutral-700">
            {labelName}
                <input
                    name={name}
                    required={true}
                    type="text"
                    defaultValue={value}
                    className="mt-1 border rounded px-2 py-1"
                    autoFocus
                />
            </label>
    );
}