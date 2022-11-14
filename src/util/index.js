const randomNumber = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Math.floor(100000 + Math.random() * 900000);

const randomString = (length = 15) => {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result.push(
      characters.charAt(
        Math.floor(Math.random() * charactersLength),
      ),
    );
  }
  return result.join('');
};

const value = (obj, key) => {
  const keys = key.split('.');
  if (!keys.length || !keys[0]) {
    return '';
  }
  return keys.reduce((o, k) => {
    if (!o) {
      return undefined;
    }
    return o[k];
  }, obj);
};

const sort = ({
  items, field, desc, generator,
}) => {
  let res = Array.from(items);

  const cmp = (a, b) => {
    if (
      a === undefined
        || b === undefined
        || a === null
        || b === null
    ) {
      return 0;
    }
    if (typeof a === 'number') {
      if (a > b) {
        return 1;
      } if (a < b) {
        return -1;
      }
      return 0;
    } if (typeof a === 'string') {
      return a.localeCompare(b);
    }
    throw new Error('Unknown field type');
  };

  res.sort((a, b) => {
    let valueA; let
      valueB;

    if (generator) {
      valueA = generator(a);
      valueB = generator(b);
    } else if (field) {
      valueA = value(a, field);
      valueB = value(b, field);
    } else {
      valueA = a;
      valueB = b;
    }

    return cmp(valueA, valueB);
  });

  if (desc) {
    res = res.reverse();
  }

  return res;
};

export { randomNumber, sort, randomString };
