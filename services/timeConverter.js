//v1.5

const moment = require("moment-timezone");

// Single function to format date and time
function singleCustomDateTime(data) {
  const dateTimeMoment = moment(data.dateTime).tz("Asia/Dubai");

  let createdDate = dateTimeMoment.format("DD/MM/YY");
  
  createdDate = createdDate.replace(/\//g, "/");

  const createdTime = dateTimeMoment.format('hh:mm:ss A');

  return {
    ...data,
    createdDate,
    createdTime
  };
}

// Multiple function to format date and time
function multiCustomDateTime(objects, dateFormat, timeZone, dateSplit) {
  if (!Array.isArray(objects)) {
    throw new Error("The first parameter must be an array of objects.");
  }

  return objects.map(obj => {    


    const formatted = singleCustomDateTime(obj);

    // Return a new object with the formatted data included
    return {
      ...obj,
      createdDate: formatted.createdDate,
      createdTime: formatted.createdTime,
    };
  });
}

module.exports = { singleCustomDateTime, multiCustomDateTime };
