const { getAllUsers, updateUser, createUser, getUserById } = require('../data/userRepository');

function userController(router) {

  router.post('/user', async (req, res) => {
    const user = req.body;
    try {
      await updateUser(user);
      res.sendStatus(204);
    } catch (e) {
      console.error('Error in POST /user:', e);
       return res.sendStatus(400);
    }
  });

  router.get('/user', async (req, res) => {
    try {
      const users = await getAllUsers();
      res.send(users);
    } catch (e) {
      console.error('Error in GET /user:', e);
      return res.sendStatus(500);
    }
  });

  router.post('/user/create', async (req, res) => {
    const { upn } = req.body;
    try {
      const newUser = await createUser(upn);
      res.status(201).json(newUser);
    } catch (e) {
      console.error('Error in POST /user/create:', e);
      return res.sendStatus(400);
    }
  });

  router.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await getUserById(userId);
      res.json(user);
    } catch (e) {
      console.error('Error in GET /user/:id:', e);
      return res.status(404).send(e.message);
    }
  });
}

module.exports = {
  userController,
};
