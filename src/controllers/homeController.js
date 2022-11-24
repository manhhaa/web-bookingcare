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
  return res.send("hello");
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  crudPage: crudPage,
  postCrudPage: postCrudPage,
};
