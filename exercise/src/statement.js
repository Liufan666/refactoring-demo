function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = getResultWithCustomer(invoice);
  const format = getFormat();
  ({ volumeCredits, result, totalAmount } = getTotalAmountAndResultAndVolumeCredits(invoice, plays, volumeCredits, result, format, totalAmount));
  result = getResultWithAmountAndCredits(result, format, totalAmount, volumeCredits);
  return result;
}

function printHtml (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = getResultWithCustomerHtml(invoice);
  const format = getFormat();
  ({ volumeCredits, result, totalAmount } = getTotalAmountAndResultAndVolumeCreditsHtml(invoice, plays, volumeCredits, result, format, totalAmount));
  result = getResultWithAmountAndCreditsHtml(result, format, totalAmount, volumeCredits);
  return result;
}

module.exports = {
  statement,printHtml
};
function getFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function getResultWithCustomerHtml(invoice) {
  return `<h1>Statement for ${invoice.customer}</h1>\n`;
}

function getResultWithCustomer(invoice) {
  return `Statement for ${invoice.customer}\n`;
}

function getTotalAmountAndResultAndVolumeCreditsHtml(invoice, plays, volumeCredits, result, format, totalAmount) {
  result +=  '<table>\n' +'<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    thisAmount = getThisAmount(play, thisAmount, perf);
    // add volume credits
    volumeCredits = getVolumeCredits(volumeCredits, perf, play);
    //print line for this order
    result = getResultWithPerfHtml(result, play, format, thisAmount, perf);
    totalAmount += thisAmount;
  }
  result +=  '</table>\n';
  return { volumeCredits, result, totalAmount };
}

function getResultWithPerfHtml(result, play, format, thisAmount, perf) {
  result += ` <tr><td>${play.name}</td><td>${perf.audience}</td><td>${format(thisAmount / 100)}</td></tr>\n`;
  return result;
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

function getResultWithAmountAndCreditsHtml(result, format, totalAmount, volumeCredits) {
  result += `<p>Amount owed is <em>${format(totalAmount / 100)}</em></p>\n`;
  result += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
  return result;
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

