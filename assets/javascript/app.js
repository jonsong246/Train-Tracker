// Initialize Firebase
var config = {
    apiKey: "AIzaSyDZYRgyXJhIoq6cALNJ2GnaRpGW9djSfYI",
    authDomain: "train-tracker-f02e4.firebaseapp.com",
    databaseURL: "https://train-tracker-f02e4.firebaseio.com",
    projectId: "train-tracker-f02e4",
    storageBucket: "train-tracker-f02e4.appspot.com",
    messagingSenderId: "19800148836"
    };
    firebase.initializeApp(config);

//create variable to reference firebase database
var database = firebase.database();

// get and display current time using momd ent.js
var currentTime = moment().format("h:mm A");
console.log("Current Time 1: " + currentTime);

// on click (submit button)
$("#submit").on("click", function() {

// Grab values from html inputs
    var trainName= $('#trainNameId').val().trim();
    var destination = $('#destinationId').val().trim();
    var trainTime = $('#firstTrainTimeId').val().trim();
    var frequency = $('#frequencyId').val().trim();

// push data to firebase 
  database.ref().push({
    trainName: trainName,
    destination: destination,
      trainTime: trainTime,
      frequency: frequency,
      timeAdded: firebase.database.ServerValue.TIMESTAMP
  });
//Server documentaion on google firebase for TIMESTAMP feature 
//var sessionsRef = firebase.database().ref("sessions"); sessionsRef.push({ startedAt: firebase.database.ServerValue.TIMESTAMP});

  $("input").val('');
    return false;
});

// References DB -- updates when child added
database.ref().on("child_added", function(childSnapshot){
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().trainTime;
  var frequency = childSnapshot.val().frequency;

  // console.log("Name: " + trainName);
  // console.log("Destination: " + destination);
  // console.log("Time: " + trainTime);
  // console.log("Frequency: " + frequency);

// Train Time Conversions
  var frequency = parseInt(frequency);
  var currentTime = moment().format('h:mm A');
  console.log("Current Time: " + moment().format('HH:mm'));
  var dateConvert = moment(childSnapshot.val().trainTime, 'HH:mm').subtract(1, 'years');
  console.log("Date Conversion: " + dateConvert);
  var trainTime = moment(dateConvert).format('HH:mm');
  console.log("First Train Time : " + trainTime);
  
  var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
  var tDifference = moment().diff(moment(tConverted), 'minutes');
  console.log("Difference: " + tDifference);
  var tRemainder = tDifference % frequency;
  console.log("Remainder: " + tRemainder);
  var minutesRemain = frequency - tRemainder;
  console.log("Min. remaining: " + minutesRemain);
  var nextArrival = moment().add(minutesRemain, 'minutes');
  console.log("Next Train: " + moment(nextArrival).format('HH:mm A'));

// Update html with train data
$('.timeCurrent').text("Current Time: " + currentTime + " (CST)");
$('#train-data').append(
    "<tr><td id='trainNameDisplay'>" + childSnapshot.val().trainName+
    "</td><td id='trainDestinationDisplay'>" + childSnapshot.val().destination +
    "</td><td id='trainFrequencyDisplay'>" + 'Every ' + childSnapshot.val().frequency + ' min' +
    "</td><td id='trainNextDisplay'>" + moment(nextArrival).format("h:mm A") +
    "</td><td id='trainMinutesDisplay'>" + minutesRemain  + ' min' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});