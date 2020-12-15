const formatJob = require('./formatJob');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];
  if (!queue) {
    return res.status(404).json({ message: 'queue is not defined' });
  }
  const job = await queue.getJob(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: 'Cant locate the job' });
  }
  const logs = await queue.getJobLogs(req.params.jobId);
  const status = await job.getState();

  const formattedJob = formatJob(job);
  if (status !== 'delayed') {
    formattedJob.delayedTo = null;
  }
  return res.json({
    ...formattedJob,
    ...job.toJSON(),
    status,
    logs: logs.logs,
  });
};
