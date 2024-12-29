module.exports = (sequelize, DataTypes) => {
    
    const Meal = sequelize.define("Meal", {
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pershkrim: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dita: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orari: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mealID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

    });
    return Meal;
};