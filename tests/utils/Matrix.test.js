const Matrix = require('../../utils/Matrix');

test('constructor', () => {
    const matrix = new Matrix([
        [1, 2],
        [3, 4]
    ]);
    expect(matrix.matrix).toEqual([
        [1, 2],
        [3, 4]
    ]);
    expect(matrix.width).toBe(2);
    expect(matrix.height).toBe(2);
});

test('createFromText', () => {
    const matrix = Matrix.createFromText('abcdefgh');
    expect(matrix.matrix).toEqual([
        [97, 98, 99, 100],
        [101, 102, 103, 104]
    ]);
    expect(matrix.width).toBe(4);
    expect(matrix.height).toBe(2);
});

test('transpose', () => {
    const matrix = new Matrix([
        [1, 2],
        [3, 4]
    ]);
    matrix.transpose();
    expect(matrix.matrix).toEqual([
        [1, 3],
        [2, 4]
    ]);
});

test('flat', () => {
    const matrix = new Matrix([
        [1, 2],
        [3, 4]
    ]);
    matrix.flat();
    expect(matrix.matrix).toEqual([1, 2, 3, 4]);
});

test('convertValue', () => {
    const matrix = new Matrix([
        [1, 2],
        [3, 4]
    ]);
    matrix.convertValue('dec', 'hex');
    expect(matrix.matrix).toEqual([
        ['01', '02'],
        ['03', '04']
    ]);
});

test('xor', () => {
    const matrix = new Matrix([
        ['00000001', '00000010'],
        ['00000011', '00000100']
    ]);
    const otherMatrix = new Matrix([
        ['00000101', '00000111'],
        ['00000001', '00000010']
    ]);

    const result = matrix.xor(otherMatrix);
    expect(result.matrix).toEqual([
        ['00000100', '00000101'],
        ['00000010', '00000110']
    ]);
});
