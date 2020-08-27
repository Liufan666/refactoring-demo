const test = require('ava');
const {statement} = require('../src/statement');

test('Sample test', t => {
  t.true(true);
  t.is(1, 1);
  t.deepEqual({a: 1}, {a: 1});
});

// test('Sample test', t => {
//   //given
//   const invoice = {};
//   const plays = [];

//   const result = statement(invoice, plays);

//   t.is(result, '');
// });
test('statement case 1', t => {
  
  const invoice = {
    'customer': 'Kevin',
    'performances': [],
  }; 
  const result = statement(invoice,plays);
  const expectReault = `Statement for Kevin\n`+`Amount owed is $0.00\n`
  +`You earned 0 credits \n`;
  
  t.is(result,expectReault)

});

test('statement case 2', t => {
  
  const invoice = {
    'customer': 'Kevin',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
    ],
  };
  const result = statement(invoice,plays);
  const expectReault = `Statement for Kevin\n`
  +` Hamlet: $400.00 (30 seats)\n`
  +`Amount owed is $400.00\n`
  +`You earned 0 credits \n`;
  
  t.is(result,expectReault)

});


const invoice = {
  'customer': 'BigCo',
  'performances': [
    {
      'playID': 'hamlet',
      'audience': 55,
    },
    {
      'playID': 'as-like',
      'audience': 35,
    },
    {
      'playID': 'othello',
      'audience': 40,
    },
  ],
};


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};