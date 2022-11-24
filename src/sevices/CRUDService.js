import bcrypt from "bcryptjs";
import db from "../models/index";

var salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("create new user success");
    } catch (err) {
      reject(err);
    }
  });
};

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

let getAllUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserById = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });

      if (user) {
        resolve(user);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allUsers = await db.User.findAll({
          raw: true,
        });
        resolve(allUsers);
      } else {
        resolve();
      }
      await db.User.update();
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserById: getUserById,
  updateUserData: updateUserData,
  deleteUser: deleteUser,
};
