// TEST

const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 5000});

test.on('data', data => {
  console.dir(data);
});

test.on('error', err => {
  console.error(err);
});
  