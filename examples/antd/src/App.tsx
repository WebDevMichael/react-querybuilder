import type { Field, RuleGroupType } from '@frontlinetech/react-querybuilder';
import { formatQuery, QueryBuilder } from '@frontlinetech/react-querybuilder';
import { antdControlElements } from '@react-querybuilder/antd';
import { useState } from 'react';

const fields: Field[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const initialQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
};

export const App = () => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <div>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={q => setQuery(q)}
        controlElements={antdControlElements}
      />
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, 'json')}</code>
      </pre>
    </div>
  );
};
