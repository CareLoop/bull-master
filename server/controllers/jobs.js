const formatJob = require('./formatJob');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const { status, page: pageString, pageSize: pageSizeString } =
    req.query || {};
  const page = Math.max(parseInt(pageString || 0, 10), 0);
  const pageSize = parseInt(pageSizeString || 20, 10);
  const queue = bullMasterQueues[queueName];
  if (!queue) {
   console.error(queueName + ' does not have a queue');
   return res.status(400).send(queueName + ' does not have a queue');
  }
  const counts = await queue.getJobCounts(status);
  const start = page * pageSize;
  const end = start + pageSize - 1;
  let jobs = await queue.getJobs([status], start, end);
  jobs = jobs.filter(job => {
    if (!job) {
      console.debug("null job found");
      return false;
    }
    return job;
  });
  res.json({
    totalCount: Object.values(counts).reduce((acc, cur) => acc + cur, 0),
    pageSize,
    page,
    data: jobs.map(formatJob),
  });
};
