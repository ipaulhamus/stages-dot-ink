const { Rotation } = require("./dataTypes");

//All functions for fetching data from the API are here. This is where we will fetch the stage list and other data from the API.
module.exports = { fetchScedule, parseSceduleData };

const API_URL = 'https://splatoon3.ink/data/schedules.json';

//Fetches the scedule data from the API and returns it as a JSON object.
async function fetchScedule() {
    try{
        const response = await fetch (API_URL);

        console.log(response.status);

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    catch(error) {
        console.error('Error fetching scedule data:', error);
        return null;
    }
}


function parseSceduleData(sceduleData, type) {
    //truthy/falsy check for sceduleData and the type of data
    if(!sceduleData || !sceduleData.data) {
        console.error(`Invalid scedule data or type: ${type}`);
        return null;
    }
    else {
        //Switch case for each type of data we want to parse
        switch(type) {
            case 'regularSchedules':
                return sceduleData.data.regularSchedules || null;
            case 'bankaraSchedules':
                return sceduleData.data.bankaraSchedules || null;
            case 'xSchedules':
                return sceduleData.data.xSchedules || null;
            case 'festSchedules':
                return sceduleData.data.festSchedules || null;
            default:
                console.error(`Unknown data type: ${type}`);
                return null;
        }
        
    }
}

function returnRotationByType(parsedData, type, index) {
    if(!parsedData) {
        console.error(`No data to return for type: ${type}`);
        return null;
    }
    else {
        let mode, startTime, endTime, stages;

        switch(type) {
            //These are TODO until there isn't a splatgfest, but they will be used to return the correct data objects for each type of schedule
            case 'regularSchedules':
                //return new Rotation(parsedData[index].regularMatchSetting)
            case 'bankaraSchedules':
                //return new Rotation(parsedData[index].bankaraMatchSetting)
            case 'xSchedules':
                //return new Rotation(parsedData[index].xMatchSetting)
            case 'festSchedules':
                mode = parsedData[index].festMatchSettings.name;
                startTime = parsedData[index].startTime;
                endTime = parsedData[index].endTime;
                
                //Iterating through the stage objects
                stages = parsedData[index].festMatchSettings.vsStages.map(stage => new Stage(stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
            default:
                console.error(`Unknown data type: ${type}`);
                return null;
        }
    }
}