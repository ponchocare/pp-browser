import { describe, expect, it } from 'vitest';
import { formatName, joinPaths, split } from '../src/utils';

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
