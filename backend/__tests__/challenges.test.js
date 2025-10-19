describe('Escape Room Challenges', () => {
  
  test('Stage 1: Addition function should work', () => {
    const code = 'function add(a, b) { return a + b; }';
    const func = new Function(code + '; return add(3, 5);');
    const result = func();
    expect(result).toBe(8);
  });

  test('Stage 2: Array sorting should work', () => {
    const code = 'arr.sort((a, b) => a - b)';
    const func = new Function('arr', code + '; return arr;');
    const result = func([5, 2, 8, 1, 9]);
    expect(result).toEqual([1, 2, 5, 8, 9]);
  });

  test('Stage 3: Prime number check - 7 is prime', () => {
    const code = `
      function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i < num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      }
      return isPrime(7);
    `;
    const func = new Function(code);
    const result = func();
    expect(result).toBe(true);
  });

  test('Stage 3: Prime number check - 4 is not prime', () => {
    const code = `
      function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i < num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      }
      return isPrime(4);
    `;
    const func = new Function(code);
    const result = func();
    expect(result).toBe(false);
  });

  test('Stage 4: String reversal should work', () => {
    const code = 'return str.split(\'\').reverse().join(\'\')';
    const func = new Function('str', code);
    const result = func('hello');
    expect(result).toBe('olleh');
  });

  test('Stage 4: String reversal with "world"', () => {
    const code = 'return str.split(\'\').reverse().join(\'\')';
    const func = new Function('str', code);
    const result = func('world');
    expect(result).toBe('dlrow');
  });

  test('Empty array sorting', () => {
    const code = 'arr.sort((a, b) => a - b)';
    const func = new Function('arr', code + '; return arr;');
    const result = func([]);
    expect(result).toEqual([]);
  });

  test('Single element array sorting', () => {
    const code = 'arr.sort((a, b) => a - b)';
    const func = new Function('arr', code + '; return arr;');
    const result = func([42]);
    expect(result).toEqual([42]);
  });
});