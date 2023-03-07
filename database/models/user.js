'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static async findByUsername(username) {
            return await this.findOne({ where: { username } });
        }

        static async generatePrivateKey(username) {
            const user = await this.findByUsername(username);
            return user.password.substring(0, 16);
        }
    }

    User.init(
        {
            username: DataTypes.STRING,
            password: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'User'
        }
    );
    return User;
};
