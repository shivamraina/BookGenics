const express = require('express');
const { StringDecoder } = require('string_decoder');
const spawn = require('child_process').spawn;

const router = express.Router();

router.post('/', async (req, res) =>{
  const myFile = req.files.file;
  const decoder = new StringDecoder('utf8');
  const content = Buffer.from(myFile.data);

  const py = spawn('python', ['predictor.py']);
  
  var ans;
  py.stdout.on('data', data => {
    ans = data.toString();
  });
  
  py.stdout.on('end', () => {
    res.json({'ans':ans, 'content':JSON.stringify(decoder.write(content))});
  });

  py.stdin.write(JSON.stringify(decoder.write(content)));
  py.stdin.end();
});

module.exports = router;