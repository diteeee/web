module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mbiemri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Kid, {
            foreignKey: 'userID',
            onDelete: 'CASCADE'
        });
    };

    return User;
};