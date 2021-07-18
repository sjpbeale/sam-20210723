/**
 * Order book grouping
 */

export default function BookGrouping(): JSX.Element | null {

  const groupingOptions = [0.5, 1, 2.5];

  return groupingOptions.length ? (
    <select>
      {groupingOptions.map((group) => (
        <option key={group} value={group}>
          {`Group ${group.toFixed(2)}`}
        </option>
      ))}
    </select>
  ) : null;
}
