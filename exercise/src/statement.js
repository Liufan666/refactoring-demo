function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = getResultWithCustomer(invoice);
  const format = getFormat();
  ({ volumeCredits, result, totalAmount } = getTotalAmountAndResultAndVolumeCredits(invoice, plays, volumeCredits, result, format, totalAmount));
  result = getResultWithAmountAndCredits(result, format, totalAmount, volumeCredits);
  return result;
}

module.exports = {
  statement,
};
function getFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function getResultWithCustomer(invoice) {
  return `Statement for ${invoice.customer}\n`;
}

function getTotalAmountAndResultAndVolumeCredits(invoice, plays, volumeCredits, result, format, totalAmount) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    thisAmount = getThisAmount(play, thisAmount, perf);
    // add volume credits
    volumeCredits = getVolumeCredits(volumeCredits, perf, play);
    //print line for this order
    result = getResultWithPerf(result, play, format, thisAmount, perf);
    totalAmount += thisAmount;
  }
  return { volumeCredits, result, totalAmount };
}

function getResultWithPerf(result, play, format, thisAmount, perf) {
  result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  return result;
}

function getVolumeCredits(volumeCredits, perf, play) {
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function getResultWithAmountAndCredits(result, format, totalAmount, volumeCredits) {
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function getThisAmount(play, thisAmount, perf) {
  switch (play.type) {
    case 'tragedy':
      thisAmount = getThisAmountCaseTragedy(thisAmount, perf);
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

function getThisAmountCaseTragedy(thisAmount, perf) {
  thisAmount = 40000;
  if (perf.audience > 30) {
    thisAmount += 1000 * (perf.audience - 30);
  }
  return thisAmount;
}

