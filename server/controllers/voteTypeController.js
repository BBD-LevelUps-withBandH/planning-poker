const { getAllVoteTypes } = require('../data/voteTypeRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const verifyToken  = require('../middlewares/auth-middleware.js');

function voteTypeController(router) {
  router.get(
    '/', verifyToken,
    handleErrors(async (req, res) => {
      const voteTypes = await getAllVoteTypes();
      res.send(voteTypes);
    })
  );
}

module.exports = { voteTypeController };
