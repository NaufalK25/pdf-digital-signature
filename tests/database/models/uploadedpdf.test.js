const { UploadedPDF } = require('../../../database/models');

const mockUploadedPDF = {
    uploaderId: 1,
    name: 'test',
    url: 'test',
    isHashed: true,
    checksum: 'test',
    publicKey: 'test'
};

beforeAll(() => {
    UploadedPDF.findAll = jest.fn().mockReturnValue([mockUploadedPDF]);
    UploadedPDF.findOne = jest.fn().mockReturnValue(mockUploadedPDF);
    UploadedPDF.update = jest.fn().mockReturnValue([1]);
    UploadedPDF.destroy = jest.fn().mockReturnValue(1);
});

test('Find uploaded PDFs by uploader ID', async () => {
    const uploadedPDFs = await UploadedPDF.findByUploaderId(mockUploadedPDF.uploaderId);

    expect(uploadedPDFs).toEqual([mockUploadedPDF]);
});

test('Get checksum by PDF name', async () => {
    expect(await UploadedPDF.getChecksumByPDFName(mockUploadedPDF.uploaderId, mockUploadedPDF.name)).toBe(mockUploadedPDF.checksum);
});

test('Update by PDF name', async () => {
    expect(await UploadedPDF.updateByPDFName(mockUploadedPDF.uploaderId, mockUploadedPDF.name, mockUploadedPDF)).toEqual([1]);
});

test('Delete by uploader ID', async () => {
    expect(await UploadedPDF.deleteByUploaderId(mockUploadedPDF.uploaderId)).toBe(1);
});

test('Delete by PDF name', async () => {
    expect(await UploadedPDF.deleteByPDFName(mockUploadedPDF.uploaderId, mockUploadedPDF.name)).toBe(1);
});
