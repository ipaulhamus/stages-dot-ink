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
    if(!sceduleData || !sceduleData.data.regularSchedules) {
        console.error(`Invalid scedule data or type: ${type}`);
        return null;
    }
    else {
        return sceduleData.data.regularSchedules;
    }
}