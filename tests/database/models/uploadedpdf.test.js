const { UploadedPDF } = require('../../../database/models');

const UploadedPDFMock = {
    uploaderId: 1,
    name: 'test',
    url: 'test',
    isHashed: true,
    checksum: 'test',
    publicKey: 'test'
};

beforeAll(() => {
    jest.spyOn(UploadedPDF, 'findAll').mockResolvedValue([UploadedPDFMock]);
    jest.spyOn(UploadedPDF, 'findOne').mockResolvedValue(UploadedPDFMock);
    jest.spyOn(UploadedPDF, 'update').mockResolvedValue([1]);
    jest.spyOn(UploadedPDF, 'destroy').mockResolvedValue(1);
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('findByUploaderId method should find pdfs data by given uploader id', async () => {
    expect(await UploadedPDF.findByUploaderId(UploadedPDFMock.uploaderId)).toEqual([UploadedPDFMock]);
});

test('getChecksumByPDFName method should get pdf checksum by given pdf name', async () => {
    expect(await UploadedPDF.getChecksumByPDFName(UploadedPDFMock.uploaderId, UploadedPDFMock.name)).toBe(UploadedPDFMock.checksum);
});

test('updateByPDFName method should update PDF data by given PDF name', async () => {
    expect(await UploadedPDF.updateByPDFName(UploadedPDFMock.uploaderId, UploadedPDFMock.name, UploadedPDFMock)).toEqual([1]);
});

test('deleteByUploaderId method should delete all pdfs data by given uploader id', async () => {
    expect(await UploadedPDF.deleteByUploaderId(UploadedPDFMock.uploaderId)).toBe(1);
});

test('deleteByPDFName method should delete pdf data by given pdf name', async () => {
    expect(await UploadedPDF.deleteByPDFName(UploadedPDFMock.uploaderId, UploadedPDFMock.name)).toBe(1);
});
