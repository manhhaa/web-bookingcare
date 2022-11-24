import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.crudPage);
  router.post("/post-crud", homeController.postCrudPage);
  router.get("/get-crud", homeController.getCrudPage);
  router.get("/edit-crud", homeController.editCrudPage);
  router.post("/put-crud", homeController.putCrudPage);
  router.get("/delete-crud", homeController.deleteCrudPage);

  return app.use("/", router);
};

module.exports = initWebRoutes;
