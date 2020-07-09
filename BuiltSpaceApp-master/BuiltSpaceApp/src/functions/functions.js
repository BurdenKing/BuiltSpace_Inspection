
import {findQR} from '../storage/schema/dbSchema'
import Geolocation from 'react-native-geolocation-service';
import {
  PermissionsAndroid,
} from 'react-native';
/**
 * getStartTime will create the current date and formats it into a readable time string and returns it.
 */
function getStartTime() {
    console.log("start");
    var date = new Date();
    var timeOffset = date.getTimezoneOffset() / 60;
    var localDate = new Date(date.getTime() - timeOffset * 3600 * 1000);
    return localDate.toISOString();
}
/**
 * calculateDurationInspection will take two arguments, starttime, and endtime. 
 * The function converts the two into a time object 
 * and calculates how long an inspection took to finish and returns the calculated value.
 * @param {*} starttime 
 * @param {*} endtime 
 */
function calculateDurationInspection(starttime, endtime) {
    var duration = (
        (Date.parse(endtime) - Date.parse(starttime)) /
        (1000 * 60)
    ).toFixed(2);
    return duration;
}
/**
 * formatInspectionObject is run in ExploreBuildingScreen.js. 
 * When the saveToDevice function is called it will also run this function to format a checklistObject to be saved into realm database. 
 * @param {*} building 
 * @param {*} asset 
 * @param {*} orgData 
 * @param {*} startDate 
 * @param {*} generalComments 
 * @param {*} checklistId 
 * @param {*} checklistTitle 
 * @param {*} questions 
 * @param {*} spaceSelected 
 * @param {*} selectedSpaceId 
 * @param {*} spaces 
 * @param {*} emails
 */
function formatInspectionObject(building, asset, orgData, startDate, generalComments,checklistId,checklistTitle, questions,DeviceNewGeolocation, spaceSelected = false, selectedSpaceId, spaces = [], emails) {
 
  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  const time = date.getTime();
  const duration = calculateDurationInspection(startDate, date);
  console.log(typeof(startDate))
  console.log(typeof(duration))
  const _filename =
    dateString + '-' + building.name.split(' ').join('-') + '-' + asset.name;
  //inspection for a space
  // _filename = isoDateString + "-" + buildingname + "-" + assetProperty.spacename;
  //inspection for an asset
  try {
    var checklist = {
      MyFields: {
        DemoUserName: 'demousername', // if the user comes fropm the button "try it out"
        DemoUserEmail: 'demouseremail', // if the user comes fropm the button "try it out"
        Date: dateString,
        StartTime: startDate,
        Duration: duration, //convert to string?
        Time: time,
        FileName: _filename,
        Address: building.address,
        GeneralComments: generalComments || '',
        flagedit: 'fl_edit', // flagedit not implemented
        Assetname: asset.name,
        Category: asset.categoryabbr,
        SpaceId: null, // if space is selected, space.id
        SpaceName: '', //if space is selected, space.suitenumber
        Floor: '', // if space is selected, space.floor
        SpaceUsage: '', //if space selected, space.usage
        Description: asset.description,
        Make: asset.make,
        Model: asset.model,
        Serial: asset.serial,
        Building: asset.buildingId,
        WorkOrderNumber: 'WorkOrderNumber', // WorOrderNumber not implemented
        ChecklistCategory: 'ChecklistCategory',
        QRcodeURL: 'qrcodeMapping',
        AssetLocations: {
          AssetLocation: 'allspaces',
        },
        NewSpaces: {
          Spaces: [],
        },
        Questions: {
          Question: [], // an array of questions
        },
        ParentTaskId: '', // Because there is no data in your app , leave it empty
        Task: '', // Because there is no data in your app , leave it empty
        ChecklistId: checklistId, //checklist.id
        ChecklistTitle: checklistTitle,
        EmailReport: emails, // Array of emails to send
        // DeviceGeolocation:DeviceNewGeolocation,
        DeviceGeolocation: {
          // Geolocation not implemented
          Longitude: DeviceNewGeolocation.longitude+'',
          Latitude: DeviceNewGeolocation.latitude+'',
          Altitude: DeviceNewGeolocation.altitude+'',
          Accuracy: DeviceNewGeolocation.accuracy+'',
          AltitudeAccuracy: '',
          Heading:'',
          Speed: '',
          Timestamp: dateString,
        },
      },
    };



        if (spaceSelected) {
            const space = spaces.filter((space) => space.id == selectedSpaceId);
            checklist.MyFields.SpaceId = space[0].id;
            checklist.MyFields.SpaceName = space[0].suitenumber; //if space is selected, space.name
            checklist.MyFields.Floor = space[0].floor; // if space is selected, space.floor
            checklist.MyFields.SpaceUsage = space[0].usage; //if space selected, space.usage
        }


         questions.forEach(question => {
      var formatQuestion = {
        QuestionId: question.id,
        QuestionNumber: question.number,
        TaskTitle: question.question,
        TaskDetails: question.TaskDetails || '',
        QuestionFormat: question.format,
        colorformat:question.colorformat,
        Photos: question.Photos, // an array of photo
        InspectionResult: question.InspectionResults || '',
        measurementLabel: question.measurementlabel || '',
        measurement: question.measurement || '',
        measurementUnit: question.measurementunit || '',
        Tool: '', // not implemented yet
        Supplier: '', // not implemented yet
        UnitCost: question.UnitCost || '',
        QuestionType: question.questiontype || '',
        SalesTax: question.salexaxformat || '',
        Markup: '', // not implemented yet
        AllowMultiple: question.allowmultiplechoices,
        Choices: question.Choices+''||'', // not implemented yet
        textOnly:question.textOnly||false,
        textOnlyForm: question.TextOnlyForm || '',
        showmeasurement:question.showmeasurement||false,
        measurementUnit2: question.measurement_label || '',
        measurementUnit3: question.type || '',
      };
      checklist.MyFields.Questions.Question.push(formatQuestion);
    });

        var checklistObject = {
            Id: dateString,
            Name: _filename,
            Content: checklist,
            buildingId: building.id,
            orgId: orgData.id,
            AssetId: asset.id,
        };

        return checklistObject;
    } catch (e) {
        console.log(e);
    }
}
/**
 * formatAddQuestion is called when the addQuestion function is called in ExploreBuildingScreen.js. 
 * This function checks the type of question and creates the object that will be pushed into setQuestions and returns the new list of question.
 * @param {*} type 
 * @param {*} questions 
 * @param {*} checklistTitle 
 * @param {*} checklistId 
 */
function formatAddQuestion(type,questions,checklistTitle,checklistId) {
    try{

        if (type == "labour"){
            let labourQuestion = {
                allowmultiplechoices: false,
                checklistid: checklistId,
                checklisttitle: checklistTitle,
                colorformat: "#98d9ea|#00a2e8|#3366cc|#232b85",
                displayproperty: false,
                format: "Regular|Overtime|Double Time|Other",
                id: 0,
                markupformat: "",
                measurementlabel: "Labour",
                measurementonly: false,
                measurementunit: "Hours",
                number: "",
                propertygroup: "",
                propertyname: "",
                question: "Enter hours",
                questiontype: "Labour",
                remarks: "",
                salestaxformat: "",
                showmeasurement: true,
                textonly: false,
                updateproperty: false,
                updatepropertyfromcurrent: false,
                validationpattern: "",
            };
            questions.push(labourQuestion);
        }
        if (type == "materials") {
            let materialQuestion = {
                allowmultiplechoices: false,
                checklistid: checklistId,
                checklisttitle: checklistTitle,
                colorformat: "#98d9ea|#00a2e8|#3366cc|#232b85|#151a51",
                displayproperty: false,
                format: "PO|Tools|Truck Stock|3rd Party|Other",
                id: 0,
                markupformat: "||||",
                measurementlabel: "Quantity",
                measurementonly: false,
                measurementunit: "",
                number: "",
                propertygroup: "",
                propertyname: "",
                question: "Enter Materials",
                questiontype: "Materials",
                remarks: "",
                salestaxformat: "||||",
                showmeasurement: true,
                textonly: false,
                updateproperty: false,
                updatepropertyfromcurrent: false,
                validationpattern: "",
            };
            questions.push(materialQuestion);
        }
        if (type == "issue") {
            let issueQuestion = {
                allowmultiplechoices: false,
                checklistid: checklistId,
                checklisttitle: checklistTitle,
                colorformat: "#00cc66|#00a2e8|#ff0000|#FFD700",
                displayproperty: false,
                format: "Good|Reparied|Quote|Monitor",
                id: 0,
                markupformat: "",
                measurementlabel: "",
                measurementonly: false,
                measurementunit: "",
                number: "",
                propertygroup: "",
                propertyname: "",
                question: "Issue found",
                questiontype: "",
                remarks: "",
                salestaxformat: "",
                showmeasurement: false,
                textonly: false,
                updateproperty: false,
                updatepropertyfromcurrent: false,
                validationpattern: "",
            };
            questions.push(issueQuestion);
        }
        return questions;
    } catch (e) {
        console.log(e);
    }
}

function loadQRMapping(qrcodes, _qrcodeurl) {
    var index = _qrcodeurl.lastIndexOf("/");
    var qrcodeurl = _qrcodeurl.substring(index + 1);
    for (var i = 0; i < qrcodes.length; i += 1) {
        const qr = qrcodes[i];
        if (qr.url == qrcodeurl){
          return qr;
        }
    }
    return false;
}




export {
    getStartTime,
    calculateDurationInspection,
    formatInspectionObject,
    formatAddQuestion,
    loadQRMapping,
};
