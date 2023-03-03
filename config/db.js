require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || null,
        database: process.env.DB_NAME || 'pdf_digital_signature',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    },
    test: {
        username: process.env.CI_DB_USER || 'root',
        password: process.env.CI_DB_PASS || null,
        database: process.env.CI_DB_NAME || 'pdf_digital_signature_test',
        host: process.env.CI_DB_HOST || '127.0.0.1',
        port: process.env.CI_DB_PORT || 3306,
        dialect: process.env.CI_DB_DIALECT || 'mysql',
        logging: false
    },
    production: {
        username: process.env.PROD_DB_USER || 'root',
        password: process.env.PROD_DB_PASS || null,
        database: process.env.PROD_DB_NAME || 'pdf_digital_signature',
        host: process.env.PROD_DB_HOST || '127.0.0.1',
        port: process.env.PROD_DB_PORT || 3306,
        dialect: process.env.PROD_DB_DIALECT || 'mysql',
        logging: false,
        ssl: {
            rejectUnauthorized: false
        }
    }
};
