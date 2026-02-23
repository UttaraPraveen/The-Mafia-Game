export function assignRoles(playerNames, roleCounts) {
  const pool = [];
  Object.entries(roleCounts).forEach(([role, count]) => { for (let i=0;i<count;i++) pool.push(role); });
  while (pool.length < playerNames.length) pool.push("villager");
  for (let i = pool.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return playerNames.map((name,i) => ({ id:i, name, role:pool[i], alive:true }));
}

export function resolveNight(players, { mafiaTarget, doctorSave }) {
  let eliminated = null;
  const updatedPlayers = players.map(p => {
    if (p.id === mafiaTarget && p.id !== doctorSave) { eliminated = {...p}; return {...p, alive:false}; }
    return p;
  });
  return { updatedPlayers, eliminated };
}

export function resolveVotes(players, votes) {
  const tally = {};
  Object.values(votes).forEach(id => { tally[id] = (tally[id]||0)+1; });
  const max = Math.max(...Object.values(tally), 0);
  const tops = Object.keys(tally).filter(id => tally[id]===max);
  if (tops.length !== 1) return { updatedPlayers:players, eliminated:null, tie:true };
  const eid = parseInt(tops[0]);
  let eliminated = null;
  const updatedPlayers = players.map(p => { if(p.id===eid){eliminated={...p};return{...p,alive:false};}return p; });
  return { updatedPlayers, eliminated, tie:false };
}

export function checkWinCondition(players) {
  const alive = players.filter(p=>p.alive);
  const mafia = alive.filter(p=>p.role==="mafia").length;
  const town = alive.length - mafia;
  if (mafia===0) return "villagers";
  if (mafia>=town) return "mafia";
  return null;
}