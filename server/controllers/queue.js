const getCounts = require('./getCounts');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const queue = await bullMasterQueues[req.params.queueName];
  if (!queue) {
    console.error(req.params.queueName + ' does not have a queue');
    return res.status(400).send(req.params.queueName + ' does not have a queue');
  }
  const counts = await getCounts(queue);
  res.json({
    name: req.params.queueName,
    counts,
  });
};
