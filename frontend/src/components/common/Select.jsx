import React from 'react'

const Select = ({label, options=[], valueKey = '_id', labelKey, extraLabelKey, ...props}) => {
    return (
        <>
            <div>
                <label className="text-sm font-medium mb-1">{label}</label>
                <select className="w-full border rounded px-3 py-2" {...props}>
                    <option value="">Select</option>
                    {options.map(item => (
                        <option key={item[valueKey]} value={item[valueKey]}>
                            {item[labelKey]}
                            {extraLabelKey && ` (${item[extraLabelKey]})`}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default Select