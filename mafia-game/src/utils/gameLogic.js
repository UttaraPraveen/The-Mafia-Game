// Fisher-Yates shuffle
export function assignRoles(playerNames, roleCounts) {
  const rolePool = [];
  Object.entries(roleCounts).forEach(([role, count]) => {
    for (let i = 0; i < count; i++) rolePool.push(role);
  });

  while (rolePool.length < playerNames.length) rolePool.push("villager");

  for (let i = rolePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
  }

  return playerNames.map((name, i) => ({
    id: i,
    name,
    role: rolePool[i],
    alive: true,
    investigated: false,
  }));
}

export function resolveNight(players, nightActions) {
  const { mafiaTarget, doctorSave } = nightActions;
  let eliminated = null;

  const updatedPlayers = players.map((p) => {
    if (p.id === mafiaTarget && p.id !== doctorSave) {
      eliminated = { ...p };
      return { ...p, alive: false };
    }
    return p;
  });

  return { updatedPlayers, eliminated };
}

export function resolveVotes(players, votes) {
  const tally = {};
  Object.values(votes).forEach((targetId) => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  const maxVotes = Math.max(...Object.values(tally), 0);
  const topTargets = Object.keys(tally).filter((id) => tally[id] === maxVotes);

  if (topTargets.length !== 1) return { updatedPlayers: players, eliminated: null, tie: true };

  const eliminatedId = parseInt(topTargets[0]);
  let eliminated = null;
  const updatedPlayers = players.map((p) => {
    if (p.id === eliminatedId) {
      eliminated = { ...p };
      return { ...p, alive: false };
    }
    return p;
  });

  return { updatedPlayers, eliminated, tie: false };
}

export function checkWinCondition(players) {
  const alive = players.filter((p) => p.alive);
  const mafiaCount = alive.filter((p) => p.role === "mafia").length;
  const villagerCount = alive.length - mafiaCount;

  if (mafiaCount === 0) return "villagers";
  if (mafiaCount >= villagerCount) return "mafia";
  return null;
}