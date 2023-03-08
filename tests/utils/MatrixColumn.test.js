const MatrixColumn = require('../../utils/MatrixColumn');

test('constructor method should create new matrix column instance', () => {
    const column = new MatrixColumn([1, 2, 3]);
    expect(column.column).toEqual([1, 2, 3]);
});

test('shiftUp method should shift the column up by 1', () => {
    const column = new MatrixColumn([1, 2, 3]);
    column.shiftUp();
    expect(column.column).toEqual([2, 3, 1]);
});

test('convertValue method should convert the value of the column', () => {
    const column = new MatrixColumn([1, 2, 3]);
    column.convertValue('dec', 'hex');
    expect(column.column).toEqual(['01', '02', '03']);
});

test('xor method should xor the column with another column', () => {
    const column = new MatrixColumn(['00000001', '00000010', '00000011']);
    const otherColumn = new MatrixColumn(['00000101', '00000111', '00000001']);
    const result = column.xor([otherColumn]);
    expect(result.column).toEqual(['00000100', '00000101', '00000010']);
});

test('multiply method should multiply the column with another column', () => {
    const column = new MatrixColumn([1, 2, 3]);
    const otherColumn = new MatrixColumn([2, 3, 1]);
    const result = column.multiply(otherColumn);
    expect(result.column).toEqual([2, 6, 3]);
});

test('galoisMultiplication method should multiply the column with another column using galois multiplication', () => {
    const column = new MatrixColumn([1, 2, 3]);
    const result = column.galoisMultiplication(2, 3);
    expect(result).toEqual(6);
});
