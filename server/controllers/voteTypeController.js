const { getAllVoteTypes } = require('../data/voteTypeRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function voteTypeController(router) {
  router.get(
    '/',
    handleErrors(async (req, res) => {
      const voteTypes = await getAllVoteTypes();
      res.send(voteTypes);
    })
  );
}

module.exports = { voteTypeController };
