import React from 'react';

export function EditLabel({
    labelName,
    name,
    value,
    type = "text",
    required = true,
    autoFocus = false,
    options = [],
    rows = 2
}: {
    labelName: string | React.ReactNode;
    name: string;
    value: string | undefined;
    type?: string;
    required?: boolean;
    autoFocus?: boolean;
    options?: { value: string; label: string }[];
    rows?: number;
}) {
    if (typeof labelName !== 'string' && !React.isValidElement(labelName)) {
        throw new Error("labelName must be a string or a valid React element");
    }
    if (typeof value !== 'string' && typeof value !== 'undefined') {
        throw new Error("value must be a string or undefined");
    }

    if (type === "select" && options.length > 0) {
        return (
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                    {labelName}
                    <select
                        name={name}
                        required={required}
                        defaultValue={value}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        autoFocus={autoFocus}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        );
    } else if (type === "textarea") {
        return (
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                    {labelName}
                    <textarea
                        name={name}
                        required={required}
                        defaultValue={value}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        autoFocus={autoFocus}
                        rows={rows}
                    />
                </label>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
                {labelName}
                <input
                    name={name}
                    required={required}
                    type={type}
                    defaultValue={value}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus={autoFocus}
                />
            </label>
        </div>
    );
}