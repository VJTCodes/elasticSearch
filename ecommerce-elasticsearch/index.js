const express = require('express');
const path = require('path');
const client = require('./elastic');

const app = express();
app.use(express.json());

const INDEX = 'products';

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send({
    message: 'E-commerce Elasticsearch API is running',
    routes: {
      createIndex: '/create-index',
      addProducts: '/add-products',
      search: '/search?q=iphone'
    }
  });
});


/**
 * Create index
 */
app.get('/create-index', async (req, res) => {
  const exists = await client.indices.exists({ index: INDEX });

  if (!exists) {
    await client.indices.create({
      index: INDEX,
      mappings: {
        properties: {
          name: { type: 'text' },
          description: { type: 'text' },
          price: { type: 'float' },
          category: { type: 'keyword' }
        }
      }
    });
  }

  res.send({ message: 'Index ready' });
});

/**
 * Add sample products
 */
app.get('/add-products', async (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Apple iPhone 15',
      description: 'Latest Apple smartphone',
      price: 999,
      category: 'electronics'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      description: 'Android flagship phone',
      price: 899,
      category: 'electronics'
    },
    {
      id: 3,
      name: 'Nike Running Shoes',
      description: 'Comfortable sports shoes',
      price: 120,
      category: 'fashion'
    }
  ];

  const body = products.flatMap(doc => [
    { index: { _index: INDEX, _id: doc.id } },
    doc
  ]);

  await client.bulk({ refresh: true, body });

  res.send({ message: 'Products added' });
});

/**
 * Search products
 */
app.get('/search', async (req, res) => {
  const { q } = req.query;

  const result = await client.search({
    index: INDEX,
    query: {
      multi_match: {
        query: q,
        fields: ['name', 'description'],
         fuzziness: 'AUTO'   // <-- This enables typo-tolerance
      }
    }
  });

  res.send(result.hits.hits.map(hit => hit._source));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
