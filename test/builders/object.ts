import { Chance } from 'chance';

export const anObject = () => {
  const obj = {};
  const fieldsCount = Chance().integer({ min: 0, max: 10 });
  for (let i = 0; i < fieldsCount; i += 1) {
    obj[Chance().string()] = Chance().pickone([Chance().string(), Chance().bool(), Chance().floating()]);
  }
  return obj;
};
