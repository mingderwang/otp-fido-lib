import { describe, it, expect } from 'bun:test'
import { one, two } from '../src'

import { MyClass } from '../src';

describe('should', () => {
  it('export 1', () => {
    let instance = new MyClass(42);
    expect(instance.getValue()).toBe(42)
  })
})
