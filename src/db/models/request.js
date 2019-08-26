module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                as: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        trip_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'trips',
                key: 'id',
                as: 'trip_id'
            },
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('accepted', 'rejected'),
            allowNull: false
        }
    }, {
        tableName: 'requests',
        underscored: true
    });
    Request.associate = () => {
           // associations can be defined here 
    };
    return Request;
};
