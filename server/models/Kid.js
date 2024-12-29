module.exports = (sequelize, DataTypes) => {

    const Kid = sequelize.define("Kid", {
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mbiemri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emriPrindit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailPrindit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nrKontaktues: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kidID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
    });

    Kid.associate = (models) => {
        Kid.belongsTo(models.Teacher, {
            foreignKey: {
                name: 'kidTeacherID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });

        Kid.belongsTo(models.User, {
            foreignKey: 'userID',
            onDelete: 'CASCADE'
        });
    };
    return Kid;
};