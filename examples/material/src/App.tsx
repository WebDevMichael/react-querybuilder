import type { Field, RuleGroupType } from '@frontlinetech/react-querybuilder';
import { formatQuery, QueryBuilder } from '@frontlinetech/react-querybuilder';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { materialControlElements } from '@react-querybuilder/material';
import { useState } from 'react';

const muiTheme = createTheme();

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
    <ThemeProvider theme={muiTheme}>
      <div>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={q => setQuery(q)}
          controlElements={materialControlElements}
        />
        <h4>Query</h4>
        <pre>
          <code>{formatQuery(query, 'json')}</code>
        </pre>
      </div>
    </ThemeProvider>
  );
};
