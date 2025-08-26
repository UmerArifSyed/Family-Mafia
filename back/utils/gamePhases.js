const handleNightActions = (players, nightActions) => {
  const mafiaAction = nightActions.find(action => players[action.playerId].role === 'Mafia');
  const mafiaTargetId = mafiaAction ? mafiaAction.targetId : null;

  const doctorAction = nightActions.find(action => players[action.playerId].role === 'Doctor');
  const doctorSaveId = doctorAction ? doctorAction.targetId : null;
  
  const detectiveAction = nightActions.find(action => players[action.playerId].role === 'Detective');
  const detectiveTargetId = detectiveAction ? detectiveAction.targetId : null;

  let killedPlayerId = null;
  let detectiveResult = null;

  if (mafiaTargetId && mafiaTargetId !== doctorSaveId) {
    killedPlayerId = mafiaTargetId;
  }
  
  if (detectiveTargetId) {
    const targetRole = players[detectiveTargetId].role;
    detectiveResult = {
      playerId: detectiveAction.playerId,
      targetName: players[detectiveTargetId].name,
      isMafia: targetRole === 'Mafia'
    };
  }

  return { killedPlayerId, detectiveResult };
};

const handleDayVoting = (players, votes) => {
  const voteCounts = {};
  
  votes.forEach(vote => {
    // Ignore abstain votes
    if (vote.targetId !== 'ABSTAIN') {
      voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    }
  });

  let mostVotedPlayerId = null;
  let maxVotes = 0;
  let isTie = false;

  for (const playerId in voteCounts) {
    if (voteCounts[playerId] > maxVotes) {
      maxVotes = voteCounts[playerId];
      mostVotedPlayerId = playerId;
      isTie = false;
    } else if (voteCounts[playerId] === maxVotes) {
      isTie = true;
    }
  }

  if (isTie) {
    return null;
  }
  
  return mostVotedPlayerId;
};

module.exports = { handleNightActions, handleDayVoting };