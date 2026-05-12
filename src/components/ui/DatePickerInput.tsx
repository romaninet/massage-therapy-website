'use client'

interface DatePickerInputProps {
  value: string
  onChange: (date: string) => void
  min?: string
  max?: string
  className?: string
  'data-testid'?: string
}

export function DatePickerInput({
  value,
  onChange,
  min,
  max,
  className,
  'data-testid': testId,
}: DatePickerInputProps) {
  return (
    <input
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={(e) => { if (e.target.value) onChange(e.target.value) }}
      className={className}
      data-testid={testId}
    />
  )
}
