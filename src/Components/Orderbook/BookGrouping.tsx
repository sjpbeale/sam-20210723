/**
 * Order book grouping
 */
import * as React from 'react';
import { useBookContext } from './BookContext';
import { Select } from './BookStyles';

interface BookGroupingProps {
  isEnabled: boolean,
}

export default function BookGrouping({ isEnabled }: BookGroupingProps): JSX.Element | null {

  const { group, setGroup, groupOptions } = useBookContext();

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.value) {
      setGroup?.(Number(e.target.value));
    }
  };

  return groupOptions?.length ? (
    <Select value={group} onChange={handleGroupChange} disabled={!isEnabled}>
      {groupOptions.map((option) => (
        <option key={option} value={option}>
          {`Group ${option.toFixed(2)}`}
        </option>
      ))}
    </Select>
  ) : null;
}
