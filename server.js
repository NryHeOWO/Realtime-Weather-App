const express = require('express');

const app = express();

app.get('/weather', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://xml.smg.gov.mo/c_actual_brief.xml');
    const xmlData = await response.text();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send(xmlData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching XML data');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});