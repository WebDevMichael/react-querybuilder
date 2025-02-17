import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef } from 'react';
import {
  simulateDrag,
  simulateDragDrop,
  simulateDragHover,
  wrapWithTestBackend,
} from 'react-dnd-test-utils';
import { defaultControlElements } from './controls';
import {
  defaultControlClassnames,
  defaultTranslations as t,
  standardClassnames as sc,
  TestID,
} from './defaults';
import { errorDeprecatedRuleProps } from './internal';
import { Rule as RuleOriginal } from './Rule';
import type {
  ActionProps,
  Classnames,
  Controls,
  Field,
  FieldSelectorProps,
  OperatorSelectorProps,
  QueryActions,
  RuleProps,
  Schema,
  ValidationResult,
  ValueEditorProps,
  ValueSelectorProps,
  ValueSources,
} from './types';

const user = userEvent.setup();

const [Rule, getDndBackendOriginal] = wrapWithTestBackend(RuleOriginal);
// This is just a type guard against `undefined`
const getDndBackend = () => getDndBackendOriginal()!;

const getHandlerId = (el: HTMLElement, dragDrop: 'drag' | 'drop') => () =>
  el.getAttribute(`data-${dragDrop}monitorid`);

const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
afterEach(() => {
  consoleError.mockReset();
  consoleWarn.mockReset();
});

const getFieldMapFromArray = (fa: Field[]) => {
  const map: Record<string, Field> = {};
  for (const f of fa) {
    map[f.name] = f;
  }
  return map;
};

const defaultFields: Field[] = [
  { name: 'field1', label: 'Field 1' },
  { name: 'field2', label: 'Field 2' },
];
const fieldMap = getFieldMapFromArray(defaultFields);
const controls: Partial<Controls> = {
  cloneRuleAction: (props: ActionProps) => (
    <button
      data-testid={TestID.cloneRule}
      className={props.className}
      onClick={e => props.handleOnClick(e)}>
      ⧉
    </button>
  ),
  fieldSelector: (props: FieldSelectorProps) => (
    <select
      data-testid={TestID.fields}
      className={props.className}
      onChange={e => props.handleOnChange(e.target.value)}>
      <option value="field">Field</option>
      <option value="any_field">Any Field</option>
    </select>
  ),
  operatorSelector: (props: OperatorSelectorProps) => (
    <select
      data-testid={TestID.operators}
      className={props.className}
      onChange={e => props.handleOnChange(e.target.value)}>
      <option value="operator">Operator</option>
      <option value="any_operator">Any Operator</option>
    </select>
  ),
  valueEditor: (props: ValueEditorProps) => (
    <input
      data-testid={TestID.valueEditor}
      className={props.className}
      type="text"
      onChange={e => props.handleOnChange(e.target.value)}
    />
  ),
  removeRuleAction: (props: ActionProps) => (
    <button
      data-testid={TestID.removeRule}
      className={props.className}
      onClick={e => props.handleOnClick(e)}>
      x
    </button>
  ),
  dragHandle: forwardRef(({ className, label }, ref) => (
    <span ref={ref} className={className}>
      {label}
    </span>
  )),
};
const classNames: Partial<Classnames> = {
  cloneRule: 'custom-cloneRule-class',
  dragHandle: 'custom-dragHandle-class',
  fields: 'custom-fields-class',
  operators: 'custom-operators-class',
  removeRule: 'custom-removeRule-class',
  rule: 'custom-rule-class',
};
const schema: Partial<Schema> = {
  fields: defaultFields,
  fieldMap,
  controls: { ...defaultControlElements, ...controls },
  classNames: { ...defaultControlClassnames, ...classNames },
  getOperators: () => [
    { name: '=', label: 'is' },
    { name: '!=', label: 'is not' },
  ],
  getValueEditorType: () => 'text',
  getValueSources: () => ['value'],
  getInputType: () => 'text',
  getValues: () => [
    { name: 'one', label: 'One' },
    { name: 'two', label: 'Two' },
  ],
  showCloneButtons: false,
  validationMap: {},
};
const actions: Partial<QueryActions> = {
  onPropChange: () => {},
  onRuleRemove: () => {},
};
const UNUSED = 'UNUSED';
const getProps = (
  mergeIntoSchema: Partial<Schema> = {},
  mergeIntoActions: Partial<QueryActions> = {}
): RuleProps => ({
  id: 'id',
  rule: {
    field: 'field', // note that this is not a valid field name based on the defaultFields
    value: 'value',
    operator: 'operator',
  },
  field: UNUSED,
  operator: UNUSED,
  value: UNUSED,
  schema: { ...schema, ...mergeIntoSchema } as Schema,
  actions: { ...actions, ...mergeIntoActions } as QueryActions,
  path: [0],
  translations: t,
});

it('should have correct classNames', () => {
  render(<Rule {...getProps()} />);
  expect(screen.getByTestId(TestID.rule)).toHaveClass(sc.rule, 'custom-rule-class');
});

describe('onElementChanged methods', () => {
  describe('onFieldChanged', () => {
    it('should call onPropChange with the rule path', async () => {
      const onPropChange = jest.fn();
      const props = { ...getProps({}, { onPropChange }) };
      render(<Rule {...props} />);
      await user.selectOptions(
        screen.getByTestId(TestID.rule).querySelector(`select.${sc.fields}`)!,
        'any_field'
      );
      expect(onPropChange).toHaveBeenCalledWith('field', 'any_field', [0]);
    });
  });

  describe('onOperatorChanged', () => {
    it('should call onPropChange with the rule path', async () => {
      const onPropChange = jest.fn();
      const props = { ...getProps({}, { onPropChange }) };
      render(<Rule {...props} />);
      await user.selectOptions(
        screen.getByTestId(TestID.rule).querySelector(`select.${sc.operators}`)!,
        'any_operator'
      );
      expect(onPropChange).toHaveBeenCalledWith('operator', 'any_operator', [0]);
    });
  });

  describe('onValueChanged', () => {
    it('should call onPropChange with the rule path', async () => {
      const onPropChange = jest.fn();
      const props = { ...getProps({}, { onPropChange }) };
      render(<Rule {...props} />);
      await user.type(
        screen.getByTestId(TestID.rule).querySelector(`input.${sc.value}`)!,
        'any_value'
      );
      expect(onPropChange).toHaveBeenCalledWith('value', 'any_value', [0]);
    });
  });
});

describe('valueEditorType as function', () => {
  it('should determine the correct value editor type', () => {
    const fields: Field[] = [{ name: 'f1', label: 'Field 1', valueEditorType: () => 'radio' }];
    const fieldMap = getFieldMapFromArray(fields);
    const {
      schema: { controls },
      rule,
    } = getProps();
    const props = getProps({
      fields,
      fieldMap,
      controls: { ...controls, valueEditor: ({ type }) => <button>{type}</button> },
    });
    render(<Rule {...props} rule={{ ...rule, field: 'f1' }} />);
    expect(screen.getByText('radio')).toBeInTheDocument();
  });
});

describe('cloneRule', () => {
  it('should call moveRule with the right paths', async () => {
    const moveRule = jest.fn();
    render(<Rule {...getProps({ showCloneButtons: true }, { moveRule })} />);
    await user.click(screen.getByText(t.cloneRule.label));
    expect(moveRule).toHaveBeenCalledWith([0], [1], true);
  });
});

describe('removeRule', () => {
  it('should call onRuleRemove with the rule and path', async () => {
    const onRuleRemove = jest.fn();
    render(<Rule {...getProps({}, { onRuleRemove })} />);
    await user.click(screen.getByText(t.removeRule.label));
    expect(onRuleRemove).toHaveBeenCalledWith([0]);
  });
});

describe('validation', () => {
  it('should not validate if no validationMap[id] value exists and no validator function is provided', () => {
    render(<Rule {...getProps()} />);
    expect(screen.getByTestId(TestID.rule)).not.toHaveClass(sc.valid);
    expect(screen.getByTestId(TestID.rule)).not.toHaveClass(sc.invalid);
  });

  it('should validate to false if validationMap[id] = false even if a validator function is provided', () => {
    const validator = jest.fn(() => true);
    const fieldMap = { field1: { name: 'field1', label: 'Field 1', validator } };
    const validationMap = { id: false };
    render(<Rule {...getProps({ fieldMap, validationMap })} />);
    expect(screen.getByTestId(TestID.rule)).not.toHaveClass(sc.valid);
    expect(screen.getByTestId(TestID.rule)).toHaveClass(sc.invalid);
    expect(validator).not.toHaveBeenCalled();
  });

  it('should validate to true if validationMap[id] = true', () => {
    const validationMap = { id: true };
    render(<Rule {...getProps({ validationMap })} />);
    expect(screen.getByTestId(TestID.rule)).toHaveClass(sc.valid);
    expect(screen.getByTestId(TestID.rule)).not.toHaveClass(sc.invalid);
  });

  it('should validate if validationMap[id] does not exist and a validator function is provided', () => {
    const validator = jest.fn(() => true);
    const fieldMap = { field1: { name: 'field1', label: 'Field 1', validator } };
    const props = getProps({ fieldMap });
    render(<Rule {...props} rule={{ ...props.rule, field: 'field1' }} />);
    expect(screen.getByTestId(TestID.rule)).toHaveClass(sc.valid);
    expect(screen.getByTestId(TestID.rule)).not.toHaveClass(sc.invalid);
    expect(validator).toHaveBeenCalled();
  });

  it('should pass down validationResult as validation to children', () => {
    const valRes: ValidationResult = { valid: false, reasons: ['invalid'] };
    const defaultProps = getProps();
    const controls = {
      ...defaultProps.schema.controls,
      fieldSelector: ({ validation }: ValueSelectorProps) => (
        <div title="ValueSelector">{JSON.stringify(validation)}</div>
      ),
    };
    const validationMap = { id: valRes };
    render(<Rule {...getProps({ validationMap, controls })} />);
    expect(screen.getByTitle('ValueSelector').innerHTML).toEqual(JSON.stringify(valRes));
  });
});

describe('enableDragAndDrop', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not have the drag class if not dragging', () => {
    render(<Rule {...getProps()} />);
    const rule = screen.getByTestId(TestID.rule);
    expect(rule).not.toHaveClass(sc.dndDragging);
  });

  it('should have the drag class if dragging', () => {
    render(<Rule {...getProps()} />);
    const rule = screen.getByTestId(TestID.rule);
    simulateDrag(getHandlerId(rule, 'drag'), getDndBackend());
    expect(rule).toHaveClass(sc.dndDragging);
    act(() => {
      getDndBackend().simulateEndDrag();
    });
  });

  it('should have the over class if hovered', () => {
    render(
      <div>
        <Rule {...getProps()} path={[0]} />
        <Rule {...getProps()} path={[1]} />
      </div>
    );
    const rules = screen.getAllByTestId(TestID.rule);
    simulateDragHover(
      getHandlerId(rules[0], 'drag'),
      getHandlerId(rules[1], 'drop'),
      getDndBackend()
    );
    expect(rules[1]).toHaveClass(sc.dndOver);
    act(() => {
      getDndBackend().simulateEndDrag();
    });
  });

  it('should handle a dropped rule', () => {
    const moveRule = jest.fn();
    render(
      <div>
        <Rule {...getProps({}, { moveRule })} path={[0]} />
        <Rule {...getProps({}, { moveRule })} path={[1]} />
      </div>
    );
    const rules = screen.getAllByTestId(TestID.rule);
    simulateDragDrop(
      getHandlerId(rules[0], 'drag'),
      getHandlerId(rules[1], 'drop'),
      getDndBackend()
    );
    expect(rules[0]).not.toHaveClass(sc.dndDragging);
    expect(rules[1]).not.toHaveClass(sc.dndOver);
    expect(moveRule).toHaveBeenCalledWith([0], [2]);
  });

  it('should abort move if dropped on itself', () => {
    const moveRule = jest.fn();
    render(<Rule {...getProps({}, { moveRule })} />);
    const rule = screen.getByTestId(TestID.rule);
    simulateDragDrop(getHandlerId(rule, 'drag'), getHandlerId(rule, 'drop'), getDndBackend());
    expect(rule).not.toHaveClass(sc.dndDragging);
    expect(rule).not.toHaveClass(sc.dndOver);
    expect(moveRule).not.toHaveBeenCalled();
  });

  it('should not try to update query if disabled', () => {
    const moveRule = jest.fn();
    render(
      <div>
        <Rule {...getProps({}, { moveRule })} path={[0]} />
        <Rule {...getProps({}, { moveRule })} path={[1]} disabled />
      </div>
    );
    const rules = screen.getAllByTestId(TestID.rule);
    simulateDragDrop(
      getHandlerId(rules[0], 'drag'),
      getHandlerId(rules[1], 'drop'),
      getDndBackend()
    );
    expect(moveRule).not.toHaveBeenCalled();
  });
});

describe('disabled', () => {
  it('should have the correct classname', () => {
    render(<Rule {...getProps()} disabled />);
    expect(screen.getByTestId(TestID.rule)).toHaveClass(sc.disabled);
  });

  it('does not try to update the query', async () => {
    const onRuleRemove = jest.fn();
    const onPropChange = jest.fn();
    const moveRule = jest.fn();
    render(
      <Rule
        {...getProps(
          {
            showCloneButtons: true,
          },
          {
            onRuleRemove,
            onPropChange,
            moveRule,
          }
        )}
        disabled
      />
    );
    await user.selectOptions(screen.getByTestId(TestID.fields), 'any_field');
    await user.selectOptions(screen.getByTestId(TestID.operators), 'any_operator');
    await user.type(screen.getByTestId(TestID.valueEditor), 'Test');
    await user.click(screen.getByTestId(TestID.cloneRule));
    await user.click(screen.getByTestId(TestID.removeRule));
    expect(onRuleRemove).not.toHaveBeenCalled();
    expect(onPropChange).not.toHaveBeenCalled();
    expect(moveRule).not.toHaveBeenCalled();
  });
});

describe('locked rule', () => {
  it('does not disable the lock button if the parent group is not disabled', () => {
    render(<Rule {...getProps({ showLockButtons: true })} disabled />);
    expect(screen.getByTestId(TestID.lockRule)).toBeEnabled();
  });

  it('disables the lock button if the parent group is disabled even if the current rule is not', async () => {
    const onPropChange = jest.fn();
    render(<Rule {...getProps({ showLockButtons: true }, { onPropChange })} parentDisabled />);
    expect(screen.getByTestId(TestID.lockRule)).toBeDisabled();
    await user.click(screen.getByTestId(TestID.lockRule));
    expect(onPropChange).not.toHaveBeenCalled();
  });

  it('sets the disabled property', async () => {
    const onPropChange = jest.fn();
    render(<Rule {...getProps({ showLockButtons: true }, { onPropChange })} />);
    await user.click(screen.getByTestId(TestID.lockRule));
    expect(onPropChange).toHaveBeenCalledWith('disabled', true, [0]);
  });

  it('unsets the disabled property', async () => {
    const onPropChange = jest.fn();
    render(<Rule {...getProps({ showLockButtons: true }, { onPropChange })} disabled />);
    await user.click(screen.getByTestId(TestID.lockRule));
    expect(onPropChange).toHaveBeenCalledWith('disabled', false, [0]);
  });

  it('prevents drops', () => {
    const moveRule = jest.fn();
    render(
      <div>
        <Rule {...getProps({}, { moveRule })} path={[0]} disabled />
        <Rule {...getProps({}, { moveRule })} path={[1]} />
      </div>
    );
    const rules = screen.getAllByTestId(TestID.rule);
    simulateDragDrop(
      getHandlerId(rules[1], 'drag'),
      getHandlerId(rules[0], 'drop'),
      getDndBackend()
    );
    expect(moveRule).not.toHaveBeenCalled();
  });
});

describe('valueSource', () => {
  const valueSources: ValueSources = ['value', 'field'];
  const fields: Field[] = [
    {
      name: 'fvsa',
      label: 'Field w/ valueSources array',
      valueSources,
      comparator: f => f.label.includes('comparator'),
    },
    {
      name: 'fvsf',
      label: 'Field w/ valueSources function',
      valueSources: () => valueSources,
    },
    { name: 'fc1', label: 'Field for comparator 1', group: 'g1' },
    { name: 'fc2', label: 'Field for comparator 2', group: 'g1' },
  ];
  const fieldMap = getFieldMapFromArray(fields);
  const getValueSources = (): ValueSources => valueSources;

  it('does not display value source selector by default', () => {
    render(<Rule {...getProps()} />);
    expect(screen.queryByTestId(TestID.valueSourceSelector)).toBeNull();
  });

  it('sets the value source to "value" by default', () => {
    const controls = getProps().schema.controls;
    const props = getProps({
      getValueSources,
      controls: {
        ...controls,
        valueEditor: ({ valueSource }) => <button>{`vs=${valueSource}`}</button>,
      },
    });
    render(<Rule {...props} />);
    expect(screen.getByText('vs=value')).toBeInTheDocument();
  });

  it('valueSource "field"', () => {
    const props = getProps({ getValueSources });
    render(<Rule {...props} rule={{ ...props.rule, valueSource: 'field' }} />);
    expect(screen.getByDisplayValue('field')).toBeInTheDocument();
  });

  it('valueSources as array', () => {
    const props = getProps({ getValueSources: () => ['value'], fields, fieldMap });
    render(<Rule {...props} rule={{ ...props.rule, field: 'fvsa', valueSource: 'field' }} />);
    expect(
      screen.getByTestId(TestID.valueSourceSelector).getElementsByTagName('option')
    ).toHaveLength(2);
    expect(screen.getByTestId(TestID.valueSourceSelector)).toHaveValue('field');
  });

  it('valueSources as function', () => {
    const props = getProps({ getValueSources: () => ['value'], fields, fieldMap });
    render(<Rule {...props} rule={{ ...props.rule, field: 'fvsf', valueSource: 'field' }} />);
    expect(
      screen.getByTestId(TestID.valueSourceSelector).getElementsByTagName('option')
    ).toHaveLength(2);
    expect(screen.getByTestId(TestID.valueSourceSelector)).toHaveValue('field');
  });

  it('filters fields by comparator', () => {
    const controls = getProps().schema.controls;
    const props = getProps({
      fields,
      fieldMap,
      getValueSources,
      controls: {
        ...controls,
        valueEditor: ({ value, values }) => (
          <select value={value} onChange={() => {}}>
            {values?.map(v => (
              <option key={v.name} value={v.name}>
                {v.label}
              </option>
            ))}
          </select>
        ),
      },
    });
    render(
      <Rule
        {...props}
        rule={{ ...props.rule, field: 'fvsa', value: 'fc2', valueSource: 'field' }}
      />
    );
    expect(
      screen.getByDisplayValue(fieldMap['fc2'].label).getElementsByTagName('option')
    ).toHaveLength(2);
    expect(screen.getByDisplayValue(fieldMap['fc2'].label)).toBeInTheDocument();
  });
});

describe('deprecated props', () => {
  it('warns about deprecated props', () => {
    // @ts-expect-error rule prop is required
    render(<Rule {...getProps()} rule={undefined} field="f1" operator="=" value="v1" />);
    expect(consoleError).toHaveBeenCalledWith(errorDeprecatedRuleProps);
  });
});
