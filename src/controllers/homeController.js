import db from "../models/index";
import CRUDService from "../sevices/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (err) {
    console.log(err);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let crudPage = (req, res) => {
  return res.render("crud.ejs");
};

let postCrudPage = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("create success");
};

let getCrudPage = async (req, res) => {
  let data = await CRUDService.getAllUser();
  res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let editCrudPage = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserById(userId);
    return res.render("editCRUD.ejs", {
      userData: userData,
    });
  } else {
    return res.send("User not found");
  }
};

let putCrudPage = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
  });
};

let deleteCrudPage = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUser(id);
    return res.send("Delete user success");
  } else {
    return res.send("Delete user err");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  crudPage: crudPage,
  postCrudPage: postCrudPage,
  getCrudPage: getCrudPage,
  editCrudPage: editCrudPage,
  putCrudPage: putCrudPage,
  deleteCrudPage: deleteCrudPage,
};
