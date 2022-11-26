import userService from "../sevices/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  if (userData.errCode !== 0) {
    return res.status(500).json({
      errCode: userData.errCode,
      message: userData.message,
      user: userData.user ? userData.user : {},
    });
  } else {
    return res.status(200).json({
      errCode: userData.errCode,
      message: userData.message,
      user: userData.user ? userData.user : {},
    });
  }
};

let handleAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameter!",
      user: [],
    });
  }
  let user = await userService.hanldeGetAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    message: "ok",
    user,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleUpdateUser = async (req, res) => {
  if (req.body) {
    let message = await userService.updateUser(req.body);
    return res.status(200).json(message);
  } else {
    return res.status(500).json({
      errCode: 3,
      message: "Missing parameter!",
    });
  }
};
let handleDeleteUser = async (req, res) => {
  let userId = req.body.id;
  if (!userId) {
    return res.status(500).json({
      errCode: 2,
      message: "Missing parameter",
    });
  } else {
    let message = await userService.deleteUser(userId);
    return res.status(200).json(message);
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleAllUsers: handleAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleUpdateUser: handleUpdateUser,
  handleDeleteUser: handleDeleteUser,
};