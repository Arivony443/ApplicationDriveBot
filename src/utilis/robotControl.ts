export const stopAllModes = async (ip: string) => {
  try {
    // Arrêter mode autonome
    await fetch(`http://${ip}/stopauto`);
    // Arrêter mode suiveur
    await fetch(`http://${ip}/stopFollow`);
    // Arrêter mode manuel
    await fetch(`http://${ip}/manual`, {
      method: 'POST',
      body: JSON.stringify({ direction: 'centre', vitesse: 0 }),
    });
  } catch (err) {
    console.log('Erreur arrêt des modes:', err);
  }
};
