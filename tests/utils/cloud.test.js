let fs, getFilesFromCloud, uploadToCloud, deleteFromCloud;

const filename = 'test.pdf';
const filename2 = 'test2.pdf';
const dummyFilename = 'test.txt';
const url = `https://www.dropbox.com/s/${filename}?dl=0`;
const filePath = '/path/to/file';
const errorMessage = 'Error Occured';

describe('getFilesFromCloud function', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    describe('success scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesListFolder: jest.fn().mockResolvedValue({
                                result: {
                                    entries: [
                                        { name: 'test.pdf', path_lower: `/test.pdf` },
                                        { name: 'test2.pdf', path_lower: `/test2.pdf` },
                                        { name: 'test.txt', path_lower: `/test.txt` }
                                    ]
                                }
                            }),
                            sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
                                result: {
                                    url: 'https://www.dropbox.com/s/test.pdf?dl=0'
                                }
                            })
                        };
                    })
                };
            });

            getFilesFromCloud = require('../../utils/cloud').getFilesFromCloud;
        });

        it('should return pdfs with name and url', async () => {
            const pdfs = await getFilesFromCloud();
            expect(pdfs).toEqual([
                { success: true, name: filename, url },
                { success: true, name: filename2, url }
            ]);
        });

        it('should not include non-pdf files', async () => {
            const pdfs = await getFilesFromCloud();
            expect(pdfs).not.toContainEqual({ success: true, name: dummyFilename, url });
        });
    });

    describe('error scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesListFolder: jest.fn().mockRejectedValue(new Error('Error Occured')),
                            sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
                                result: {
                                    url: 'https://www.dropbox.com/s/test.pdf?dl=0'
                                }
                            })
                        };
                    })
                };
            });

            getFilesFromCloud = require('../../utils/cloud').getFilesFromCloud;
        });

        it('should return empty array if error occurs', async () => {
            const pdfs = await getFilesFromCloud();
            try {
                expect(pdfs).toEqual([
                    {
                        success: false,
                        name: '',
                        url: ''
                    }
                ]);
            } catch (err) {
                expect(err.message).toEqual(errorMessage);
            }
        });
    });
});

describe('uploadToCloud function', () => {
    beforeEach(() => {
        jest.resetModules();

        jest.mock('fs', () => {
            return {
                readFileSync: jest.fn().mockReturnValue(Buffer.from('test'))
            };
        });

        fs = require('fs');
    });

    describe('success scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesUpload: jest.fn().mockResolvedValue({
                                result: {
                                    name: 'test.pdf',
                                    path_lower: `/test.pdf`
                                }
                            }),
                            sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
                                result: {
                                    url: 'https://www.dropbox.com/s/test.pdf?dl=0'
                                }
                            })
                        };
                    })
                };
            });

            uploadToCloud = require('../../utils/cloud').uploadToCloud;
        });

        it('should upload file to cloud', async () => {
            const pdf = await uploadToCloud(filePath, filename);

            expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
            expect(pdf).toEqual({ success: true, name: filename, url });
        });
    });

    describe('error scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesUpload: jest.fn().mockRejectedValue(new Error('Error Occured'))
                        };
                    })
                };
            });

            uploadToCloud = require('../../utils/cloud').uploadToCloud;
        });

        it('should throw an error if uploading failed', async () => {
            const pdf = await uploadToCloud(filePath, filename);
            try {
                expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
                expect(pdf).toEqual({ success: false, name: filename, url: '' });
            } catch (err) {
                expect(err.message).toEqual(errorMessage);
            }
        });
    });
});

describe('deleteFromCloud function', () => {
    beforeEach(() => {
        jest.resetModules();

        jest.mock('path', () => {
            return {
                ...jest.requireActual('path'),
                basename: jest.fn().mockReturnValue('test.pdf')
            };
        });
    });

    describe('success scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesDeleteV2: jest.fn().mockResolvedValue({
                                result: {
                                    name: 'test.pdf',
                                    path_lower: `/test.pdf`
                                }
                            }),
                            sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
                                result: {
                                    url: 'https://www.dropbox.com/s/test.pdf?dl=0'
                                }
                            })
                        };
                    })
                };
            });

            deleteFromCloud = require('../../utils/cloud').deleteFromCloud;
        });

        it('should delete file from cloud', async () => {
            const pdf = await deleteFromCloud(filePath);

            expect(pdf).toEqual({ success: true, name: filename, url });
        });
    });

    describe('error scenario', () => {
        beforeEach(() => {
            jest.mock('dropbox', () => {
                return {
                    Dropbox: jest.fn().mockImplementation(() => {
                        return {
                            filesDeleteV2: jest.fn().mockRejectedValue(new Error('Error Occured'))
                        };
                    })
                };
            });

            deleteFromCloud = require('../../utils/cloud').deleteFromCloud;
        });

        it('should throw an error if uploading failed', async () => {
            const pdf = await deleteFromCloud(filePath);
            try {
                expect(pdf).toEqual({ success: false, name: filename, url: '' });
            } catch (err) {
                expect(err.message).toEqual(errorMessage);
            }
        });
    });
});
