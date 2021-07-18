/**
 * Order book grouping
 */
import { Select } from './BookStyles';

export default function BookGrouping(): JSX.Element | null {

  const groupingOptions = [0.5, 1, 2.5];

  return groupingOptions.length ? (
    <Select>
      {groupingOptions.map((group) => (
        <option key={group} value={group}>
          {`Group ${group.toFixed(2)}`}
        </option>
      ))}
    </Select>
  ) : null;
}
