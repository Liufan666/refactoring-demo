function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  ({ volumeCredits, result, totalAmount } = getTotalAmountAndResultAndVolumeCredits(invoice, plays, volumeCredits, result, format, totalAmount));
  result = getResultWithAmountAndCredits(result, format, totalAmount, volumeCredits);
  return result;
}

module.exports = {
  statement,
};
function getTotalAmountAndResultAndVolumeCredits(invoice, plays, volumeCredits, result, format, totalAmount) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    thisAmount = getThisAmount(play, thisAmount, perf);
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type)
      volumeCredits += Math.floor(perf.audience / 5);
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  return { volumeCredits, result, totalAmount };
}

function getResultWithAmountAndCredits(result, format, totalAmount, volumeCredits) {
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function getThisAmount(play, thisAmount, perf) {
  switch (play.type) {
    case 'tragedy':
      thisAmount = handleTragedy(thisAmount, perf);
      break;
    case 'comedy':
      thisAmount = getThisAmountCaseComedy(thisAmount, perf);
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function getThisAmountCaseComedy(thisAmount, perf) {
  thisAmount = 30000;
  if (perf.audience > 20) {
    thisAmount += 10000 + 500 * (perf.audience - 20);
  }
  thisAmount += 300 * perf.audience;
  return thisAmount;
}

function handleTragedy(thisAmount, perf) {
  thisAmount = 40000;
  if (perf.audience > 30) {
    thisAmount += 1000 * (perf.audience - 30);
  }
  return thisAmount;
}

