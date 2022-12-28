import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

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

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/update-user", userController.handleUpdateUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllcode);

  router.get("/api/top-doctor-home", doctorController.getHomeDoctor);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/infor-doctors", doctorController.getInforDoctors);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post(
    "/api/create-bulk",
    doctorController.handleCreateBulk
  );
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
