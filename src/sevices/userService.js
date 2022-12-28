import bcrypt from "bcryptjs";
import db from "../models/index";

var salt = bcrypt.genSaltSync(10);

let hashUserPassword = async (password) => {
  return new Promise((resolve, reject) => {
    try {
      var hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await handleCheckEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = "ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = "Wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.message = "Can't find account";
        }
      } else {
        userData.errCode = 1;
        userData.message =
          "Your email isn't exist in your system. Plz try other email!";
      }
      resolve(userData);
    } catch (err) {
      reject(err);
    }
  });
};

let handleCheckEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let hanldeGetAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll();
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await handleCheckEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          message: "Your email is already in used. Plz try other email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          positionId: data.position,
          roleId: data.role,
          image: data.avatar,
        });
        resolve({
          errCode: 0,
          message: "Create user success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.roleId;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          errCode: 0,
          message: "update user success",
        });
      } else {
        resolve({
          errCode: 2,
          message: "User not found!",
        });
      }
      await db.User.update();
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      if (!user) {
        resolve({
          errCode: 2,
          message: "The user isn't exsit!",
        });
      }
      await user.destroy();

      resolve({
        errCode: 0,
        message: "Delete user success",
      });
    } catch (err) {
      reject(err);
    }
  });
};

let handleGetAllcode = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          message: "Missing required parametter!",
        });
      } else {
        console.log(typeInput)
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
          // raw: false,
        });
        console.log('check res: ', allcode)

        resolve({
          errCode: 0,
          data: allcode
        });
      }
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  hanldeGetAllUsers: hanldeGetAllUsers,
  createNewUser: createNewUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  handleGetAllcode: handleGetAllcode,
};
