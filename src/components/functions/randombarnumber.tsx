export const getRandomBarNumber = (): number => {
    const min = 1.1;
    const max = 3.0;
    const step = 0.4;
    const steps = Math.round((max - min) / step) + 1; // Total de valores posibles (20)
    const randomIndex = Math.floor(Math.random() * steps);
    return parseFloat((min + randomIndex * step).toFixed(1));
  };
  