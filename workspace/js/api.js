//All functions for fetching data from the API are here. This is where we will fetch the stage list and other data from the API.

//import { Rotation, Stage, Splatfest, FestTeam } from './dataTypes.js';

const API_URL = 'https://splatoon3.ink/data/schedules.json';

// Define classes before they are used
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
            case 'bankaraSchedules-series':
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
            
            case 'regularSchedules':

                mode = parsedData.nodes[index].regularMatchSetting.vsRule.name;
                startTime = parsedData.nodes[index].startTime;
                endTime = parsedData.nodes[index].endTime;
                
                stages = parsedData.nodes[index].regularMatchSetting.vsStages.map(stage => new Stage(stage.name));

                return new Rotation(mode, startTime, endTime, stages);
                break;

            case 'bankaraSchedules':
                console.log('Bankara Match Settings:', parsedData.nodes[index].bankaraMatchSettings);
                console.log('Bankara Match Settings[0]:', parsedData.nodes[index].bankaraMatchSettings[0].vsRule);
                console.log('Bankara Match Settings[0].vsStages:', parsedData.nodes[index].bankaraMatchSettings[0].vsStages);
                mode = parsedData.nodes[index].bankaraMatchSettings[0].vsRule.name;
                console.log('Mode:', mode);
                startTime = parsedData.nodes[index].startTime;
                console.log('Start Time:', startTime);
                endTime = parsedData.nodes[index].endTime;
                console.log('End Time:', endTime);
                stages = parsedData.nodes[index].bankaraMatchSettings[0].vsStages.map(stage => new Stage(stage.name));
                console.log('Stages:', stages.map(stage => stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
                break;
            
            case  'bankaraSchedules-series':
                console.log('Bankara Series Match Settings:', parsedData.nodes[index].bankaraMatchSettings);
                console.log('Bankara Series Match Settings[1]:', parsedData.nodes[index].bankaraMatchSettings[1].vsRule);
                console.log('Bankara Series Match Settings[1].vsStages:', parsedData.nodes[index].bankaraMatchSettings[1].vsStages);
                mode = parsedData.nodes[index].bankaraMatchSettings[1].vsRule.name;
                startTime = parsedData.nodes[index].startTime;
                endTime = parsedData.nodes[index].endTime;
                stages = parsedData.nodes[index].bankaraMatchSettings[1].vsStages.map(stage => new Stage(stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
                break;

            case 'xSchedules':

                mode = parsedData.nodes[index].xMatchSetting.vsRule.name;
                startTime = parsedData.nodes[index].startTime;
                endTime = parsedData.nodes[index].endTime;
                
                stages = parsedData.nodes[index].xMatchSetting.vsStages.map(stage => new Stage(stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
                break;

            case 'festSchedules':

                mode = parsedData.nodes[index].festMatchSettings.vsRule.name;
                console.log('Mode:', mode);
                startTime = parsedData.nodes[index].startTime;
                endTime = parsedData.nodes[index].endTime;
                
                stages = parsedData.nodes[index].festMatchSettings.vsStages.map(stage => new Stage(stage.name));
                
                return new Rotation(mode, startTime, endTime, stages);
                break;
            default:
                console.error(`Unknown data type: ${type}`);
                return null;
        }
    }

}