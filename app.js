var express = require('express'),
    cons = require('consolidate'),
    app = express(),
    mustacheRender = require("./lib/mustacheRender").mustacheRender,
    port = (process.env.PORT || 3000);

// Application settings
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Middleware to serve static assets
app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/govuk/public'));


app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// middleware to wrap mustache views in govuk template

app.use(mustacheRender);

//

var staticHead = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" /><link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">';

var commonHead = '<link href="/public/stylesheets/application.css" rel="stylesheet" type="text/css" /><link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">';

// routes

var dataSets = {
  'death_location' : [
    'England or Wales',
    'Scotland',
    'Northern Ireland',
  ],
  'death_occur' : [
    'home_or_hospital',
    'elsewhere' 
  ],
  'expected' : [
    'Yes',
    'No'
  ]
};

var setChecked = function (dataSetName, selectedName, reqData) {
  var results = [],
      dataSet = dataSets[dataSetName],
      i, j;

  for (i = 0, j = dataSet.length; i < j; i++) {
    if ((selectedName !== '') && dataSet[i] === selectedName) {
      reqData['choice_' + (i + 1)] = ' checked="checked"';
    } else {
      reqData['choice_' + (i + 1)] = '';
    }
  }
  return results;
};

function saveRequest(req){
  if(req.query.death_location){
    req.session.death_location = req.query.death_location;
  }
  if(req.query.death_occur){
    req.session.death_occur = req.query.death_occur;
  }
  if(req.query.expected){
    req.session.expected = req.query.expected;
  }
}

app.get('/', function (req, res) {

  var head = staticHead;
  req.session = null; // clear session
  res.render('index',
            {'pageTitle': 'index',
            'head' : head });
  
});

app.get('/diabetes-treatment', function (req, res) {
  console.log('page /diabetes-treatment');
  console.log('Initial session : ', req.session);
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/license-type'
  };
  if (req.session.death_location) {
    setChecked('death_location', req.session.death_location, reqData);
  } else {
    setChecked('death_location', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  res.render('diabetes-treatment', reqData);
});


app.get('/license-type', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/hypoglycaemia'
  };
  if (req.session.death_occur) {
    setChecked('death_occur', req.session.death_occur, reqData);
  } else {
    setChecked('death_occur', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /license-type');
  saveRequest(req);
  
  console.log('session : ', req.session);
  if (req.session.death_location == 'Northern Ireland') {
    res.render('finish5', reqData);
  } else if (req.session.death_location == 'Scotland') {
    res.render('finish4', reqData);
  } else {
    res.render('license-type', reqData);
  }
});


app.get('/hypoglycaemia', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/servere-hypoglycaemia'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/servere-hypoglycaemia'
  }
  console.log('page /hypoglycaemia');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('hypoglycaemia', reqData);
});

app.get('/servere-hypoglycaemia', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/warning-signs'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/warning-signs'
  }
  console.log('page /servere-hypoglycaemia');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('servere-hypoglycaemia', reqData);
});

app.get('/special-controls', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/finish'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /special-controls');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('special-controls', reqData);
});

app.get('/warning-signs', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/who-treats-you'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/who-treats-you'
  }
  console.log('page /warning-signs');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('warning-signs', reqData);
});

app.get('/drivers-number', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/drivers-details'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /drivers-number');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('drivers-number', reqData);
});

app.get('/drivers-details', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/hypoglycaemia'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /drivers-details');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('drivers-details', reqData);
});

app.get('/who-treats-you', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/doctors-details'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /who-treats-you');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('who-treats-you', reqData);
});

app.get('/consultants-details', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/vision'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/vision'
  }
  console.log('page /consultants-details');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('consultants-details', reqData);
});

app.get('/vision', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/vision2'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /vision');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('vision', reqData);
});

app.get('/vision2', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/finish'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /vision2');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('vision2', reqData);
});

app.get('/complete', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/finish'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /complete');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('complete', reqData);
});

app.get('/doctors-details', function (req, res) {
  
  var head = commonHead;

  var postcode = req.query.postcode;

  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/consultants-details'
  };
  var request = require('request');
  request('http://www.doctorsnear.org/'+postcode+'.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try{
        var data = JSON.parse(body);
        console.dir(data);
        reqData.postcode=data.location;
        reqData.doctors=data.doctors.slice(0,15);

      } catch (err){
        console.log(err);
      }

      if (req.session.expected) {
        setChecked('expected', req.session.expected, reqData);
      } else {
        setChecked('expected', '', reqData);
      }
      if (req.query.edit) {
        reqData.next = '/finish'
      }
      console.log('page /doctors-details');
      saveRequest(req);

      console.log('session : ', req.session); 

      res.render('doctors-details', reqData);

    }
  })
  
});

app.get('/finish', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/complete'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /finish');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('finish', reqData);
});


// app.get('/finish', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish1', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish1');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish1',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish2', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish2');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish2',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });

// app.get('/finish3', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish3');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish3',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish4', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish4');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish4',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });

// app.get('/finish5', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish5');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish5',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


app.get('/start', function (req, res) {
  
var head = staticHead;
 
 res.render('start',
              {'pageTitle': 'sample',
              'head' : head });
   
});

app.get('/finish', function (req, res) {


  console.log('page: /finish');
    saveRequest(req);

  
   console.log('session : ', req.session);
   for (param in dataSets) {
     if (req.query[param]) {
       req.session[param] = req.query[param];
     }
   }

  
  var head = commonHead;

  if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'home_or_hospital' && 
      req.session.expected == 'No'){
    res.render('finish1',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
    req.session.death_occur == 'home_or_hospital' && 
    req.session.expected == 'Yes'){
    res.render('finish',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'elsewhere' && 
      req.session.expected == 'Yes'){
    res.render('finish2',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'elsewhere' && 
      req.session.expected == 'No'){
    res.render('finish3',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'Northern Ireland') {
    res.render('finish5', {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'Scotland') {
    res.render('finish4', {'pageTitle': 'sample',
              'head' : head });
  } else {
    res.render('fail');
  }

});

// start the app

app.listen(port);
console.log('');
console.log('Listening on port 3000');
console.log('');
