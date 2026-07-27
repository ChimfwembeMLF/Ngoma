const axios = require('axios');
const crypto = require('crypto');
const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE4MTU5IiwibWF2IjoiMSIsImV4cCI6MjA4OTcwMTkyNCwiaWF0IjoxNzc0MDgyNzI0LCJwbSI6IkRBRixQQUYiLCJqdGkiOiI0MDBkZmNkYi00YjY1LTQyNWMtODFiZS1hYzJhY2ZjN2Q5MDMifQ.W6EKUhuDybPMWfYGNzS7ZgUE-YSvNGcM4XQCjPBUkPi0Hr1lUFdVZTiAYAI9PVUrtsmOFLAsSBDDoG4Y4rv5dw';

async function test() {
  try {
    const res = await axios.post('https://api.sandbox.pawapay.io/v2/deposits', {
      depositId: crypto.randomUUID(),
      amount: '10.00',
      currency: 'ZMW',
      payer: {
        type: 'MMO',
        accountDetails: {
          provider: 'MTN_MOMO_ZMB',
          phoneNumber: '260960000000'
        }
      },
      customerMessage: 'Test deposit'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error status:', err.response?.status);
    console.log('Error data:', err.response?.data);
    console.log('Error message:', err.message);
  }
}
test();
