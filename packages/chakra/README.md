## @react-querybuilder/chakra

Official [react-querybuilder](https://npmjs.com/package/react-querybuilder) components for [Chakra UI](https://chakra-ui.com/).

To see them in action, check out the [`react-querybuilder` demo](https://react-querybuilder.js.org/react-querybuilder/#style=chakra) or [load the example in CodeSandbox](https://codesandbox.io/s/github/react-querybuilder/react-querybuilder/tree/main/examples/chakra).

## Installation

```bash
npm i --save react-querybuilder @react-querybuilder/chakra @chakra-ui/icons @chakra-ui/react @chakra-ui/system @emotion/react @emotion/styled framer-motion
# OR
yarn add react-querybuilder @react-querybuilder/chakra @chakra-ui/icons @chakra-ui/react @chakra-ui/system @emotion/react @emotion/styled framer-motion
```

## Usage

```tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { chakraControlElements } from '@react-querybuilder/chakra';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const App = () => {
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });
  const chakraTheme = extendTheme();

  return (
    <ChakraProvider theme={chakraTheme}>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={q => setQuery(q)}
        controlElements={chakraControlElements}
      />
    </ChakraProvider>
  );
};
```

Some additional styling may be necessary, e.g.:

```css
.queryBuilder .chakra-select__wrapper {
  width: fit-content;
  display: inline-block;
}

.queryBuilder .chakra-input {
  width: auto;
  display: inline-block;
}

.queryBuilder .chakra-radio-group {
  display: inline-block;
}
```
