const SPREADSHEET_ID = '1M3A0Ndh2MwCXgu_rRM-npvN5fix4ZyZKIT3KsaKGoFY';


function doGet() {

  const access = checkAccess();

  if (access.granted) {

    const t = HtmlService.createTemplateFromFile("Index");

    t.sessionId = access.sessionId;

    return t.evaluate()
      .setTitle("AR Video Try-On")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  }

  return HtmlService.createHtmlOutput(
    "<h2>System Full</h2>"
  );

}



function checkAccess() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = ss.getSheetByName("AccessControl");

  if (!sheet) {

    sheet = ss.insertSheet("AccessControl");

    sheet.appendRow(["User ID","Timestamp"]);

  }

  const now = new Date().getTime();

  const limit = now - 30000;

  const data = sheet.getDataRange().getValues();

  let newList = [["User ID","Timestamp"]];

  let active = 0;


  for (let i = 1; i < data.length; i++) {

    if (data[i][1] > limit) {

      newList.push(data[i]);

      active++;

    }

  }


  if (active < 3) {

    const id = "User_" + Math.random().toString(36).substr(2,5);

    newList.push([id, now]);

    sheet.clear();

    sheet.getRange(1,1,newList.length,2).setValues(newList);

    return {
      granted: true,
      sessionId: id
    };

  }

  return { granted:false };

}



function heartbeat(id) {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = ss.getSheetByName("AccessControl");

  const data = sheet.getDataRange().getValues();

  const now = new Date().getTime();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] == id) {

      sheet.getRange(i+1,2).setValue(now);

    }

  }

}