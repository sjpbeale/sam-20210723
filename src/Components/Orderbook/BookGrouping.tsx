/**
 * Order book grouping
 */
import { Select } from './BookStyles';

interface BookGroupingProps {
  isEnabled: boolean,
}

export default function BookGrouping({ isEnabled }: BookGroupingProps): JSX.Element | null {

  const groupingOptions = [0.5, 1, 2.5];

  return groupingOptions.length ? (
    <Select disabled={!isEnabled}>
      {groupingOptions.map((group) => (
        <option key={group} value={group}>
          {`Group ${group.toFixed(2)}`}
        </option>
      ))}
    </Select>
  ) : null;
}
