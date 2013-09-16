eegexperiments
==============

This is a functional prototype of a visualizer responsive to Neurosky's home EEG. I made it for a party in about a day, so it's pretty dirty, but it works well. 

Neurosky provides a socket-based API producing json data like this:
{ eSense: { attention: 45, meditation: 83 },
  eegPower: 
   { delta: 298234,
     theta: 14937,
     lowAlpha: 13667,
     highAlpha: 4576,
     lowBeta: 18350,
     highBeta: 47221,
     lowGamma: 1259,
     highGamma: 853 },
  poorSignalLevel: 200 }

I used angular and a couple pre-existing libraries and wrote some glue to stick them together:
 - https://github.com/dluxemburg/node-neurosky -- a node package that accesses the EEG's API
 - http://www.chromeexperiments.com/detail/thats-swirly/ -- a canvas experiment

It probably would have been much easier to use socket.io; I fell pray to thinking that the node package was somehow worthwhile, but it wasn't. I also ran into CORS issues using angular to get data from my node server (they are fairly well documented) and lacking time went so far as to simply write the API data to a file and read it from the browser, which requires the browser to be stared with the security flags off (although I was starting it in kiosk mode anyway to avoid worrying about fullscreening).

How to use:
 - start the node server

So list of improvements:
drop 
