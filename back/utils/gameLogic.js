// A simple shuffling algorithm
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[i], array[j]];
  }
  return array;
};

// Function to assign roles based on the number of players
const assignRoles = (playerIds) => {
  const numPlayers = playerIds.length;
  let roles = ['Mafia', 'Detective', 'Doctor'];

  // Add the remaining townsfolk roles to fill the player count
  while (roles.length < numPlayers) {
    roles.push('Townsfolk');
  }
  
  // Shuffle the roles to ensure random assignment
  const shuffledRoles = shuffle(roles);

  const assignedRoles = {};
  playerIds.forEach((id, index) => {
    assignedRoles[id] = shuffledRoles[index];
  });

  return assignedRoles;
};

module.exports = { assignRoles };