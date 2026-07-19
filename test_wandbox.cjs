const https = require('https');

https.get('https://wandbox.org/api/list.json', (res) => {
  let output = '';
  res.on('data', d => { output += d; });
  res.on('end', () => {
    const list = JSON.parse(output);
    const javaCompilers = list.filter(c => c.language === 'Java').map(c => c.name);
    const pythonCompilers = list.filter(c => c.language === 'Python').map(c => c.name);
    console.log("Java compilers:", javaCompilers);
    console.log("Python compilers:", pythonCompilers);
  });
}).on('error', console.error);
