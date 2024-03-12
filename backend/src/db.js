require('dotenv').config();
const { Client } = require('pg');
const Sequelize = require('sequelize');

const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

async function createDatabase() {
    try {
        await client.connect();
        await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'cmpt372project'}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

createDatabase();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cmpt-372-project',
    retry: {
        max: 10,
        timeout: 60000
    }
});

// Models
const Message = require('./models/Message')(sequelize);
const User = require('./models/User')(sequelize);
const Chat = require('./models/Chat')(sequelize);
const Comment = require('./models/Comment')(sequelize);
const Project = require('./models/Project')(sequelize);
const List = require('./models/List')(sequelize);
const Task = require('./models/Task')(sequelize);
const File = require('./models/File')(sequelize);

// Define relationships
// Chat
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });
// UserChat junction
User.belongsToMany(Chat, { through: 'UserChat' });
Chat.belongsToMany(User, { through: 'UserChat' });
// ProjectChat junction
Project.belongsToMany(Chat, { through: 'ProjectChat' });
Chat.belongsToMany(Project, { through: 'ProjectChat' });

// Project
// UserProject junction
User.belongsToMany(Project, { through: 'UserProject' });
Project.belongsToMany(User, { through: 'UserProject' });
Project.hasMany(List, { foreignKey: 'projectId' });
List.belongsTo(Project, { foreignKey: 'projectId' });
List.hasMany(Task, { foreignKey: 'listId' });
Task.belongsTo(List, { foreignKey: 'listId' });
// UserTask junction
Task.belongsToMany(User, { through: 'UserTask' });
User.belongsToMany(Task, { through: 'UserTask' });
// TaskComment junction
Task.belongsToMany(Comment, { through: 'TaskComment' });
Comment.belongsToMany(Task, { through: 'TaskComment' });
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

// Files
// TaskFile junction
Task.belongsToMany(File, { through: 'TaskFile' });
File.belongsToMany(Task, { through: 'TaskFile' });
// ProjectFile junction
Project.belongsToMany(File, { through: 'ProjectFile' });
File.belongsToMany(Project, { through: 'ProjectFile' });

sequelize.sync({ alter: true });

module.exports = {
    Message,
    User,
    Chat,
    Comment,
    Project,
    List,
    Task,
    File
};