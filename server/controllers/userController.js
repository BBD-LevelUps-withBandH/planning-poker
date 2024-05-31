const { getAllUsers, updateUser, createUser, getUserById } = require('../data/userRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function userController(router) {
  router.post(
    '/',
    handleErrors(async (req, res) => {
      const user = req.body;
      await updateUser(user);
      res.sendStatus(204);
    })
  );

  router.get(
    '/',
    handleErrors(async (req, res) => {
      const users = await getAllUsers();
      res.send(users);
    })
  );

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { upn } = req.body;
      const newUser = await createUser(upn);
      res.status(201).json(newUser);
    })
  );

  router.get(
    '/:id',
    handleErrors(async (req, res) => {
      const userId = req.params.id;
      const user = await getUserById(userId);
      res.json(user);
    })
  );
}

module.exports = { userController };
