//All functions for fetching data from the API are here. This is where we will fetch the stage list and other data from the API.

//import { Rotation, Stage, Splatfest, FestTeam } from './dataTypes.js';

const API_URL = 'https://splatoon3.ink/data/schedules.json';

//Fetches the scedule data from the API and returns it as a JSON object.
export async function fetchScedule() {
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


export function parseSceduleData(sceduleData, type) {
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

export function returnRotationByType(parsedData, type, index) {
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
                mode = parsedData.nodes[index].festMatchSettings[0].vsRule.name;
                console.log('Mode:', mode);
                startTime = parsedData.nodes[index].startTime;
                endTime = parsedData.nodes[index].endTime;
                
                //Iterating through the stage objects
                stages = parsedData.nodes[index].festMatchSettings[0].vsStages.map(stage => new Stage(stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
            default:
                console.error(`Unknown data type: ${type}`);
                return null;
        }
    }
}

export class Rotation {
    constructor(mode, startTime, endTime, stages) {
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.stages = stages;
    }
}

//Leaving images blank for now, but they can be added later when we have the data from the API
export class Stage {
    constructor(name) {
        this.name = name;
        this.image = "";
    }
}

//If there is a splatfest, splatoon3.ink will return a fest object
export class Splatfest {
    constructor(name, startTime, endTime, teams) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teams = teams;
    }
}

//Leaving images blank for now, but they can be added later when we have the data from the API
export class FestTeam {
    constructor(name) {
        this.name = name;
        this.image = "";
    }
}