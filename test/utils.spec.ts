import { describe, expect, it } from 'vitest';
import {
  createInputsForField,
  formatName,
  joinPaths,
  split,
} from '../src/utils';

describe('joinPaths', () => {
  it('joins two paths adding a forward slash in the middle', () => {
    const result = joinPaths('left/path', 'right/path');
    expect(result).toBe('left/path/right/path');
  });

  it('joins two paths sanitising the left path first', () => {
    const result = joinPaths('left/path///', 'right/path');
    expect(result).toBe('left/path/right/path');
  });

  it('joins two paths sanitising the right path first', () => {
    const result = joinPaths('left/path', '///right/path');
    expect(result).toBe('left/path/right/path');
  });
});

describe('formatName', () => {
  it.each([
    { input: 'prop', output: 'prop' },
    { input: 'prop.subprop', output: 'prop[subprop]' },
    { input: 'prop.subprop.other', output: 'prop[subprop][other]' },
  ])('formats the property name ($input -> $output)', ({ input, output }) => {
    expect(formatName(input)).toBe(output);
  });
});

describe('split', () => {
  it.each([
    { input: '', output: [] },
    { input: 'poncho', output: ['poncho'] },
    { input: 'poncho pay', output: ['poncho', 'pay'] },
  ])('splits $input as $output', ({ input, output }) => {
    expect(split(input, ' ')).toEqual(output);
  });
});

describe('createInputsForField', () => {
  it('creates a single input for single field type', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'amount', '1234', 'single');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].type).toBe('hidden');
    expect(inputs[0].name).toBe('amount');
    expect(inputs[0].value).toBe('1234');
  });

  it('creates a single input for nested single field type', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'person.name', 'Alice', 'single');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].name).toBe('person[name]');
    expect(inputs[0].value).toBe('Alice');
  });

  it('creates no inputs for single field type with empty value', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'amount', '', 'single');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(0);
  });

  it('creates multiple inputs for multiple field type', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'weekdays', 'monday,wednesday', 'multiple');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].name).toBe('weekdays[]');
    expect(inputs[0].value).toBe('monday');
    expect(inputs[1].name).toBe('weekdays[]');
    expect(inputs[1].value).toBe('wednesday');
  });

  it('creates multiple inputs for nested multiple field type', () => {
    const form = document.createElement('form');
    createInputsForField(
      form,
      'person.0.hobbies',
      'reading,gaming',
      'multiple'
    );

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].name).toBe('person[0][hobbies][]');
    expect(inputs[0].value).toBe('reading');
    expect(inputs[1].name).toBe('person[0][hobbies][]');
    expect(inputs[1].value).toBe('gaming');
  });

  it('creates one input for multiple field type with single value', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'weekdays', 'monday', 'multiple');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].name).toBe('weekdays[]');
    expect(inputs[0].value).toBe('monday');
  });

  it('creates no inputs for multiple field type with empty value', () => {
    const form = document.createElement('form');
    createInputsForField(form, 'weekdays', '', 'multiple');

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(0);
  });
});
