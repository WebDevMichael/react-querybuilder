import type { DragHandleProps } from '@frontlinetech/react-querybuilder';
import { forwardRef } from 'react';

export const BootstrapDragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  ({ className, title }, dragRef) => (
    <span ref={dragRef} className={className} title={title}>
      <i className="bi bi-grip-vertical"></i>
    </span>
  )
);

BootstrapDragHandle.displayName = 'BootstrapDragHandle';
