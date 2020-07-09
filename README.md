# MobileAPP

## Project description   
The BuiltSpace Inspections app lets users explore building info and complete maintenance checklists and other procedures.  It’s a powerful data collection tool that is part of our commitment to generating detailed, real-time data about what happens in buildings.
 
### So what’s wrong with it?
We want a fresh start and to address some architectural shortcomings.  And, for our partners, we’re going to make it open-source so they can build and share the features they need, starting from an existing template (your work).
 
The existing app is available for reference.
 
### The app must:
-support working offline.  User’s work is stored while they are offline and is uploaded when reconnected.
-monitor the device’s network connection status to provide a seamless experience
-allow taking photos, resizing photos, and storing hundreds of photos
-support scanning QR codes and barcodes to select the item the user is working on
-use location services to record the user’s location while they work
-allow users to re-open and edit their work before uploading
-support iOS and Android on a single codebase
-conform to modern conventions for mobile app UI/UX
 
### The app should:
-support structured (database) storage
-support storing data for multiple buildings
-timestamp all datasets and prompt user to refresh
 
  
## Description of the current arrangement 
Our v2.x app (available now) is built with Cordova, which is a Javascript-based framework for building cross-platform apps.
There are architectural limitations to Cordova and it doesn’t achieve a the look and feel of a native app.
Our code base has grown over a few years and it’s time to start again from scratch.
Last term, a student team started the project and made good progress.  We need to continue to implement more features so it’s ready for release.  
 
## If coding is required, what programming language or languages would be used?
Mobile application development in React Native.  The React framework uses JavaScript.
Onboard data storage is in Realm.
Students may be asked to develop cloud services to process and store photos or other data, in which case Amazon AWS is preferred (e.g. S3 and Lambda). 
 
 
## Details of the work to-date:
The previous student team have achieved many of our core features – to read most types of data, store it offline in a robust data store, and allow users to complete work and save it on the device.  Hardware capabilities like camera access and QR code scanning appear to be working. 
We have a multi-phase project plan that is approximately halfway complete.  Outstanding items include progress tracking (“visits”), completing billed work (hours & materials), and submitting photos and completed work to an API endpoint.
