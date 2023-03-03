'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UploadedPDF extends Model {
        static async findByUploaderId(uploaderId) {
            return await this.findAll({ where: { uploaderId } });
        }

        static async getChecksumByPDFName(uploaderId, pdfName) {
            const pdf = await this.findOne({ where: { uploaderId, name: pdfName } });
            return pdf.checksum;
        }

        static async updateByPDFName(uploaderId, pdfName, data) {
            return await this.update(data, { where: { uploaderId, name: pdfName } });
        }

        static async deleteByUploaderId(uploaderId) {
            return await this.destroy({ where: { uploaderId } });
        }

        static async deleteByPDFName(uploaderId, pdfName) {
            return await this.destroy({ where: { uploaderId, name: pdfName } });
        }
    }

    UploadedPDF.init(
        {
            uploaderId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            url: DataTypes.STRING,
            isHashed: DataTypes.BOOLEAN,
            checksum: DataTypes.STRING,
            publicKey: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'UploadedPDF'
        }
    );
    return UploadedPDF;
};
