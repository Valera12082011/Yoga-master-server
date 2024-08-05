function containsSqlInjection(text) {
  const patterns = [
    /union.*select.*from/i,
    /select.*from.*where.*=/i,
    /select.*from.*--/i,
    /drop.*table.*;/i,
    /insert.*into.*values/i,
    /update.*set.*=/i,
    /delete.*from/i,
    /exec.*xp_cmdshell/i,
    /show.*tables/i,
    /alter.*table/i,
    /create.*table/i
  ];

  for (const pattern of patterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

module.exports = containsSqlInjection