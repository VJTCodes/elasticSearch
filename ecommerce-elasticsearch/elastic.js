const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'p_KasPCxn3MjrDTXmZoh'
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = client;
