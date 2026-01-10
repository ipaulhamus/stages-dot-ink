//Contains data types
module.exports = { Rotation, Stage, Splatfest, FestTeam };

class Rotation {
    constructor(mode, startTime, endTime, stages) {
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.stages = stages;
    }
}

//Leaving images blank for now, but they can be added later when we have the data from the API
class Stage {
    constructor(name) {
        this.name = name;
        this.image = "";
    }
}

//If there is a splatfest, splatoon3.ink will return a fest object
class Splatfest {
    constructor(name, startTime, endTime, teams) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teams = teams;
    }
}

//Leaving images blank for now, but they can be added later when we have the data from the API
class FestTeam {
    constructor(name) {
        this.name = name;
        this.image = "";
    }
}