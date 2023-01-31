import {
  testActionElement,
  testNotToggle,
  testValueEditor,
  testValueSelector,
} from '@frontlinetech/react-querybuilder/genericTests';
import { BulmaActionElement, BulmaNotToggle, BulmaValueEditor, BulmaValueSelector } from '.';

testActionElement(BulmaActionElement);
testNotToggle(BulmaNotToggle);
testValueEditor(BulmaValueEditor);
testValueSelector(BulmaValueSelector);
