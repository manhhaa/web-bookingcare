import { query } from "express";
import db from "../models/index";
import homeDoctorService from "../sevices/homeDoctorService";

const getHomeDoctor = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let message = await homeDoctorService.getHomeDoctor(+limit);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: 1,
      message: "err from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await homeDoctorService.getAllDoctors();
    console.log(doctors);
    return res.status(200).json(doctors);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let getInforDoctors = async (req, res) => {
  try {
    console.log(req.body);
    let response = await homeDoctorService.getInforDoctors(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let detail = await homeDoctorService.getDetailDoctorById(req.query.id);
    console.log(req.query.id);
    return res.status(200).json(detail);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      message: "Error from server!",
    });
  }
};

let handleCreateBulk = async (req, res) => {
  try {
    let data = await homeDoctorService.handleCreateBulks(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      message: "Error from server!",
    });
  }
}

let getScheduleByDate = async (req, res) => {
  try {
    let data = await homeDoctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      message: "Error from server!",
    });
  }
}

module.exports = {
  getHomeDoctor: getHomeDoctor,
  getAllDoctors: getAllDoctors,
  getInforDoctors: getInforDoctors,
  getDetailDoctorById: getDetailDoctorById,
  handleCreateBulk: handleCreateBulk,
  getScheduleByDate: getScheduleByDate
};
