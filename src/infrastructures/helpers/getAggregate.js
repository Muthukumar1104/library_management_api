module.exports.getAggregateParams = () => {
  const currentDate = new Date();
  // Get the first date of the month
  const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get the last date of the month
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return [
    {
      $match: {
        createdAt: {
          $gte: firstDate,
          $lte: lastDate,
        },
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: '$created_date',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        reports: {
          $push: {
            date: '$_id',
            totalCount: '$count',
          },
        },
      },
    },
  ];
};
