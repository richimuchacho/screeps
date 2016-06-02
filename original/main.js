var harvester = require("harvester");
var harvestTruck = require("harvestTruck");
var guard = require("guard");
var healer = require("healer");
var builder = require("builder");
var fortifier = require("fortifier");
var controlUpgrader = require("controlUpgrader");
var redistributor = require("redistributor");
var scout = require("scout");
var assault = require("assault");
var claimer = require("claimer");
var remoteTruck = require("remoteTruck");

var creepManager = require("creepManager");
var ensureHome = require("actionEnsureHome");
var runTowers = require("runTowers");
var runLinks = require("runLinks");

module.exports.loop = function () {
  Memory.workingLinks = {};
  console.log("============= " + Game.time + " ==============");

  for(var spawnName in Game.spawns){
    creepManager(Game.spawns[spawnName]);
  }
  runTowers();
  runLinks();

  var rolenames = [
    "harvester","harvestTruck","guard","defender","healer","builder","fortifier",
    "controlUpgrader","redistributor","scout","assault","assaultRanger","claimer",
    "remoteTruck", "reserver","refiller"];
  var roles = {};

  for (var i = 0; i < rolenames.length; i++) {
     roles[rolenames[i]] = require(rolenames[i]);
  }

  //remember the idea of making rooms override decisions for creeps in defensive situations and such
  //  JSON.stringify(Game.rooms["W2S25"].find(FIND_MY_CREEPS))

  console.log("ticklimit is " + Game.cpu.tickLimit);
  for(var creepName in Game.creeps){
    var usedCpu = Game.cpu.getUsed();
    console.log("before running " + creepName + ", " + usedCpu + " ticks were spent");
    if(usedCpu > Game.cpu.tickLimit * 0.99){
      console.log("Quitting creep execution since used cpu time is " + usedCpu + " of " + Game.cpu.tickLimit);
      break;
    }
    var creep = Game.creeps[creepName];
    ensureHome(creep);

    var role = roles[creep.memory.role];
    if(role){
      role(creep);
    }
    else {
      console.log("No role called \"" + creep.memory.role + "\" found for " + creep.name);
    }
  }
}
