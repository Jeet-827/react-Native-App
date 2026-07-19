const http = require('http');

http.get('http://localhost:8082/api/productservice/getproduct', (res) => {
  console.log('Gateway status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Gateway body:', data));
}).on('error', err => console.error('Gateway error:', err));

http.get('http://127.0.0.1:5001/product/getproduct', (res) => {
  console.log('Product status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Product body:', data));
}).on('error', err => console.error('Product error:', err));
