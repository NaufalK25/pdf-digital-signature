'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UploadedPDFs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uploaderId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            isHashed: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            checksum: {
                allowNull: true,
                type: Sequelize.STRING,
                defaultValue: null
            },
            publicKey: {
                allowNull: true,
                type: Sequelize.STRING,
                defaultValue: null
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UploadedPDFs');
    }
};
