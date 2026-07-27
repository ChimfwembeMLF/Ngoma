const axios = require('axios');
const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE4MTU5IiwibWF2IjoiMSIsImV4cCI6MjA4OTcwMTkyNCwiaWF0IjoxNzc0MDgyNzI0LCJwbSI6IkRBRixQQUYiLCJqdGkiOiI0MDBkZmNkYi00YjY1LTQyNWMtODFiZS1hYzJhY2ZjN2Q5MDMifQ.W6EKUhuDybPMWfYGNzS7ZgUE-YSvNGcM4XQCjPBUkPi0Hr1lUFdVZTiAYAI9PVUrtsmOFLAsSBDDoG4Y4rv5dw";
const payload = {
  depositId: "123e4567-e89b-12d3-a456-426614174000",
  amount: "10",
  currency: "ZMW",
  payer: {
    type: 'MMO',
    accountDetails: {
      provider: "MTN_MOMO_ZMB",
      phoneNumber: "260960000000",
    },
  },
  customerMessage: "test message"
};
axios.post('https://api.sandbox.pawapay.io/v2/deposits', payload, {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => console.log("SUCCESS:", res.data)).catch(err => {
  console.log("ERROR:", err.response ? err.response.data : err.message);
});
