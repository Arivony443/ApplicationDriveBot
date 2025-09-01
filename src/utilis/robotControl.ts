export const stopAllModes = async (ip: string) => {
  try {
    // Arrêter mode autonome
    await fetch(`http://${ip}/stopauto`);
    // Arrêter le robot (toutes directions)
    await fetch(`http://${ip}/stop`);
  } catch (err) {
    console.log('Erreur arrêt des modes:', err);
  }
};
