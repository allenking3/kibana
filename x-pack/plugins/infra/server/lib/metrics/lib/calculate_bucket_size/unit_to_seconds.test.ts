/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  getUnitValue,
  parseInterval,
  convertIntervalToUnit,
  getSuitableUnit,
} from './unit_to_seconds';

describe('parseInterval()', () => {
  test('should parse "1m" interval (positive)', () =>
    expect(parseInterval('1m')).toEqual({
      value: 1,
      unit: 'm',
    }));

  test('should parse "134d" interval (positive)', () =>
    expect(parseInterval('134d')).toEqual({
      value: 134,
      unit: 'd',
    }));

  test('should parse "0.5d" interval (positive)', () =>
    expect(parseInterval('0.5d')).toEqual({
      value: 0.5,
      unit: 'd',
    }));

  test('should parse "30M" interval (positive)', () =>
    expect(parseInterval('30M')).toEqual({
      value: 30,
      unit: 'M',
    }));

  test('should not parse "gm" interval (negative)', () =>
    expect(parseInterval('gm')).toEqual({
      value: undefined,
      unit: undefined,
    }));

  test('should not parse "-1d" interval (negative)', () =>
    expect(parseInterval('-1d')).toEqual({
      value: undefined,
      unit: undefined,
    }));

  test('should not parse "M" interval (negative)', () =>
    expect(parseInterval('M')).toEqual({
      value: undefined,
      unit: undefined,
    }));
});

describe('convertIntervalToUnit()', () => {
  test('should convert "30m" interval to "h" unit (positive)', () =>
    expect(convertIntervalToUnit('30m', 'h')).toEqual({
      value: 0.5,
      unit: 'h',
    }));

  test('should convert "0.5h" interval to "m" unit (positive)', () =>
    expect(convertIntervalToUnit('0.5h', 'm')).toEqual({
      value: 30,
      unit: 'm',
    }));

  test('should convert "1h" interval to "m" unit (positive)', () =>
    expect(convertIntervalToUnit('1h', 'm')).toEqual({
      value: 60,
      unit: 'm',
    }));

  test('should convert "1h" interval to "ms" unit (positive)', () =>
    expect(convertIntervalToUnit('1h', 'ms')).toEqual({
      value: 3600000,
      unit: 'ms',
    }));

  test('should not convert "30m" interval to "0" unit (positive)', () =>
    expect(convertIntervalToUnit('30m', 'o')).toEqual({
      value: undefined,
      unit: undefined,
    }));

  test('should not  convert "m" interval to "s" unit (positive)', () =>
    expect(convertIntervalToUnit('m', 's')).toEqual({
      value: undefined,
      unit: undefined,
    }));
});

describe('getSuitableUnit()', () => {
  test('should return "d" unit for oneDayInSeconds (positive)', () => {
    const oneDayInSeconds = getUnitValue('d') * 1;

    expect(getSuitableUnit(oneDayInSeconds)).toBe('d');
  });

  test('should return "d" unit for twoDaysInSeconds (positive)', () => {
    const twoDaysInSeconds = getUnitValue('d') * 2;

    expect(getSuitableUnit(twoDaysInSeconds)).toBe('d');
  });

  test('should return "w" unit for threeWeeksInSeconds (positive)', () => {
    const threeWeeksInSeconds = getUnitValue('w') * 3;

    expect(getSuitableUnit(threeWeeksInSeconds)).toBe('w');
  });

  test('should return "y" unit for aroundOneYearInSeconds (positive)', () => {
    const aroundOneYearInSeconds = getUnitValue('d') * 370;

    expect(getSuitableUnit(aroundOneYearInSeconds)).toBe('y');
  });

  test('should return "y" unit for twoYearsInSeconds (positive)', () => {
    const twoYearsInSeconds = getUnitValue('y') * 2;

    expect(getSuitableUnit(twoYearsInSeconds)).toBe('y');
  });

  test('should return "undefined" unit for negativeNumber (negative)', () => {
    const negativeNumber = -12;

    expect(getSuitableUnit(negativeNumber)).toBeUndefined();
  });
});
