const { createUser } = require('../data/userRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function userController(router) {

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { upn } = req.body;
      const newUser = await createUser(upn);
      res.status(201).json(newUser);
    })
  );
}

module.exports = { userController };
