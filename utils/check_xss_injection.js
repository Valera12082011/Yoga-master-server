import containsSqlInjection from "./check_sql_injection";

function containsXssInjection(text) {
  const patterns = [
    /<script.*?>.*?<\/script>/i,
    /<iframe.*?>.*?<\/iframe>/i,
    /<img.*?src\s*=\s*["'].*?javascript:.*?["']/i,
    /<object.*?>.*?<\/object>/i,
    /<embed.*?>.*?<\/embed>/i,
    /<form.*?action\s*=\s*["']javascript:.*?["']/i,
    /<svg.*?>.*?<\/svg>/i,
    /<a.*?href\s*=\s*["']javascript:.*?["']/i
  ];

  for (const pattern of patterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

module.exports = containsXssInjection