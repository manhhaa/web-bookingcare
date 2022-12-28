import db from "../models/index";
import _, { reject } from "lodash";
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getHomeDoctor = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEN", "valueVI"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEN", "valueVI"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        message: doctors,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
        raw: false,
      });
      resolve({
        errCode: 0,
        message: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getInforDoctors = (dataInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !dataInput.doctorId ||
        !dataInput.contentHTML ||
        !dataInput.contentMarkdown ||
        !dataInput.action
      ) {
        reject({
          errCode: 1,
          message: "Missing required parameted!",
        });
      } else {
        if (dataInput.action === 'CREATE') {
          await db.Markdowns.create({
            contentHTML: dataInput.contentHTML,
            contentMarkdown: dataInput.contentMarkdown,
            description: dataInput.description,
            doctorId: dataInput.doctorId,
          });
        }
        else if (dataInput.action === 'EDIT') {
          let doctorMarkdown = await db.Markdowns.findOne({
            where: { doctorId: dataInput.doctorId },
            raw: false
          })

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = dataInput.contentHTML;
            doctorMarkdown.contentMarkdown = dataInput.contentMarkdown;
            doctorMarkdown.description = dataInput.description;
            await doctorMarkdown.save();
          }
        }
        resolve({
          errCode: 0,
          message: "Save infor doctor success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 3,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdowns,
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueEN", "valueVI"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEN", "valueVI"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          message: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleCreateBulks = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data)
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          message: 'Missing required parameter!'
        })
      }
      else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule.map(item => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          })
        }
        console.log("check schedule", schedule)

        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true

        })


        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        })

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }
      }
      resolve({
        errCode: 0,
        message: 'OK'
      })
    }
    catch (e) {
      reject(e);
    }
  })
}

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!"
        })
      }
      else {
        let existing = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          raw: false,
          nest: true,
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEN", "valueVI"],
            }
          ],
        })

        if (!existing) existing = []
        resolve({
          errCode: 0,
          message: existing
        })
      }
    }
    catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getHomeDoctor: getHomeDoctor,
  getAllDoctors: getAllDoctors,
  getInforDoctors: getInforDoctors,
  getDetailDoctorById: getDetailDoctorById,
  handleCreateBulks: handleCreateBulks,
  getScheduleByDate: getScheduleByDate
};
