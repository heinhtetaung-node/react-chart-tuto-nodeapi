const bcrypt = require("bcryptjs");

module.exports = (sequelize, Model, DataTypes, db) => {

  class User extends Model {}
  
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING    
  }, { sequelize, modelName: 'users' });

  (async () => {
    await sequelize.sync();
    let password = "hein";
    const email = "hein@gmail.com";
    const data = await User.findOne({ where: { email : email } });
    if(!data){
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          password = hash;
          User.bulkCreate([{
            name: "Hein",
            email: email,
            password: password
          },
					{
            name: "Htet",
            email: 'htet@gmail.com',
            password: password
          },
					{
            name: "Aung",
            email: 'aung@gmail.com',
            password: password
          }]
					);
        });
      });
    }    
  })();
  return User
}