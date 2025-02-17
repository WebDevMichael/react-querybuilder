import type { NotToggleProps } from '@frontlinetech/react-querybuilder';
import { Switch } from 'antd';
import type { ComponentPropsWithoutRef } from 'react';

type AntDNotToggleProps = NotToggleProps & ComponentPropsWithoutRef<typeof Switch>;

export const AntDNotToggle = ({
  className,
  handleOnChange,
  label,
  checked,
  title,
  disabled,
  // Props that should not be in extraProps
  path: _path,
  context: _context,
  validation: _validation,
  testID: _testID,
  ...extraProps
}: AntDNotToggleProps) => (
  <Switch
    title={title}
    className={className}
    onChange={v => handleOnChange(v)}
    checked={!!checked}
    disabled={disabled}
    checkedChildren={label}
    unCheckedChildren="="
    {...extraProps}
  />
);

AntDNotToggle.displayName = 'AntDNotToggle';
