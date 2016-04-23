/*
 * csv2json.js
 * Copyright (C) 2016 Eirik Birkeland
 */
'use strict';

const fs = require('fs')
const Papa = require('papaparse')

Papa.parse(fs.readFileSync(process.argv[2], 'utf8'), {
   complete: (res)=>{
      fs.writeFileSync('nob.json', JSON.stringify(res.data))
   }
})

