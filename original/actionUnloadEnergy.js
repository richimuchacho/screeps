module.exports = function(creep){
  var dropPointsHere = creep.pos.findInRange(FIND_MY_STRUCTURES,1,{
    filter: function(structure){
      return structure.energyCapacity > structure.energy;
    }
  });
  if(dropPointsHere){
    creep.transfer(dropPointsHere[0], RESOURCE_ENERGY);
  }

  if(creep.carry.energy == 0){
    creep.memory.dropoff = false;
    creep.memory.dropoffWaitStart = 0;
  }
  else if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropoff = true;
  }
  else {
    if(!creep.memory.dropoffWaitStart){
      creep.memory.dropoffWaitStart = Game.time;
    }
    if ((creep.memory.dropoffWaitStart + 50) < Game.time) {
      //waited 50 ticks for a load, so drop whatever we have
      creep.memory.dropoff = true;
    }
  }

  if(creep.memory.dropoff == true){
    var dropoff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: function(structure){
        if (typeof(structure.energy) != "undefined" && structure.energyCapacity > structure.energy) {
          return true;
        };
        if(typeof(structure.storeCapacity) != "undefined" && structure.storeCapacity > 0 && _.sum(structure.store) < structure.storeCapacity) {
          return true;
        }
        return false;
      }
    });

    if (!dropoff) {
      dropoff = Game.getObjectById(creep.memory.home);
    }

    if(dropoff)
    {
      if(creep.transfer(dropoff, RESOURCE_ENERGY) != OK) {
        creep.moveTo(dropoff);
      }
      return true;
    }
  }
  return false;
}
