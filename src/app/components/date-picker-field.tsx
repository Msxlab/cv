import { useEffect, useMemo, useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { format, getMonth, getYear, setMonth, setYear, startOfMonth } from 'date-fns';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from './ui/utils';
import { safeParseDate, toStoredDate } from '../utils/content-helpers';

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: index,
  label: format(new Date(2026, index, 1), 'MMMM'),
}));

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 81 }, (_, index) => currentYear + 10 - index);

interface DatePickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePickerField({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select date',
  className,
}: DatePickerFieldProps) {
  const selectedDate = useMemo(() => safeParseDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date())
  );

  useEffect(() => {
    setVisibleMonth(selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date()));
  }, [value, selectedDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal text-left',
            !selectedDate && 'text-gray-500',
            className
          )}
        >
          <span>{selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder}</span>
          <CalendarIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={String(getMonth(visibleMonth))}
              onValueChange={(nextMonth) => setVisibleMonth((prev) => startOfMonth(setMonth(prev, Number(nextMonth))))}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={String(month.value)}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(getYear(visibleMonth))}
              onValueChange={(nextYear) => setVisibleMonth((prev) => startOfMonth(setYear(prev, Number(nextYear))))}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-gray-500"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => {
                const today = new Date();
                onChange(toStoredDate(today));
                setVisibleMonth(startOfMonth(today));
                setOpen(false);
              }}
            >
              Today
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          selected={selectedDate || undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(toStoredDate(date));
            setVisibleMonth(startOfMonth(date));
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
