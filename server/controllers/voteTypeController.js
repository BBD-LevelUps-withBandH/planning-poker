const { getAllVoteTypes, createVoteType } = require('../data/voteTypeRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function voteTypeController(router) {
  router.get(
    '/',
    handleErrors(async (req, res) => {
      const voteTypes = await getAllVoteTypes();
      res.send(voteTypes);
    })
  );

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { vote } = req.body;
      const newVoteType = await createVoteType(vote);
      res.status(201).json(newVoteType);
    })
  );
}

module.exports = { voteTypeController };
