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
    jest.spyOn(UploadedPDF, 'findAll').mockResolvedValue([mockUploadedPDF]);
    jest.spyOn(UploadedPDF, 'findOne').mockResolvedValue(mockUploadedPDF);
    jest.spyOn(UploadedPDF, 'update').mockResolvedValue([1]);
    jest.spyOn(UploadedPDF, 'destroy').mockResolvedValue(1);
});

afterAll(() => {
    jest.restoreAllMocks();
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
