var ical = require('ical')
var axios = require('axios')

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

var units = {
	'21808' : ['https://www.airbnb.com/calendar/ical/25166525.ics?s=8178abe75f2a6e41e956b864e258bf32','http://www.homeaway.com/icalendar/c1f7c69dd45b4aa19c45bfe7d549f26f.ics?nonTentative'],
	
	'Maison Bois' : ['https://www.airbnb.com/calendar/ical/23023183.ics?s=26dfbbea5e31a7d95542906abd3449e1','http://www.homeaway.com/icalendar/30da0311bf014727a326cbf589e84659.ics?nonTentative']
}

function parseIcal(payload){
  let data = ical.parseICS(payload)
  console.log('data parsed')
  let a = []
  for(let k in data){
    if(data.hasOwnProperty(k)){
      let ev = data[k]
      let start = new Date(ev.start)
      let end = new Date(ev.end)
      let summary = (ev.summary+' ').split('\n').join(' ')
      a.push([start,end,summary,`${days[start.getDay()]}, ${months[start.getMonth()]} ${start.getDate()}, ${start.getYear()+1900} # ${days[end.getDay()]}, ${months[end.getMonth()]} ${end.getDate()}, ${end.getYear()+1900} # ${ summary }`] )
    }
  }
  return a
}

// takes an array of ical URLs and adds them to an array
async function processIcals(calList,place){
	a = []
	console.log('starting list ' + place)
	while(calList.length>0){
		let icalUrl = calList.pop()
		let b = await axios.get(icalUrl)
		  .then(function (response) {
			console.log('got data')
			return parseIcal(response.data)
		  })
		  .catch(function (error) {
			console.log(error);
		  });
		if(icalUrl.indexOf('airbnb.com')>-1)b.shift()
		console.log(`adding ${b.length} records`)
		a.push(...b)
	}
	console.log('sorting the data')
	a = a.sort((x,y)=> x[0].getTime() - y[0].getTime())
	a.map(x=>{ console.log(x[3]) })
	return a
}

async function processIcalsList(){
	let r = [...Object.keys(units)]
	for(let k in r){
		console.log(r[k])
		console.log('processing ' + r[k])
		await processIcals(units[r[k]],r[k])
		console.log('finished with ' + r[k])
	}
}

processIcalsList()
	
