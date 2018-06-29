var ical = require('ical')
var axios = require('axios')

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

/*
ical.fromURL('https://www.airbnb.com/calendar/ical/22001663.ics?s=4c8508f14d925b926d547f1a29440491', {}, function(err, data) {
      //console.log(data)
      for(let k in data){
        if(data.hasOwnProperty(k)){
          let ev = data[k]
          let start = new Date(ev.start)
          let end = new Date(ev.end)
          let summary = ev.summary
          console.log(`${days[start.getDay()]}, ${months[start.getMonth()]} ${start.getDate()} # ${days[end.getDay()]}, ${months[end.getMonth()]} ${end.getDate()} # ${ summary }`)
        }
      }
});
*/

axios.get('https://www.airbnb.com/calendar/ical/22001663.ics?s=4c8508f14d925b926d547f1a29440491')
  .then(function (response) {
    console.log('got data')
    parseIcal(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });

function parseIcal(data){
  //var data = ical.parseFile('./data/listing-22001663.ics')
  //console.log(data)
  let data = ical.parseICS(data)
  console.log('data parsed')
  let a = []
  for(let k in data){
    if(data.hasOwnProperty(k)){
      let ev = data[k]
      let start = new Date(ev.start)
      let end = new Date(ev.end)
      let summary = (ev.summary+' ').split('\n').join(' ')
      //console.log(`${days[start.getDay()]}, ${months[start.getMonth()]} ${start.getDate()} # ${days[end.getDay()]}, ${months[end.getMonth()]} ${end.getDate()} # ${ summary }`)
      a.push([start,end,summary,`${days[start.getDay()]}, ${months[start.getMonth()]} ${start.getDate()}, ${start.getYear()+1900} # ${days[end.getDay()]}, ${months[end.getMonth()]} ${end.getDate()}, ${end.getYear()+1900} # ${ summary }`] )
    }
  }
  a.shift()
  a = a.sort((x,y)=> x[0].getTime() - y[0].getTime())
  a.map(x=>{
    console.log(x[3])
  })


}
