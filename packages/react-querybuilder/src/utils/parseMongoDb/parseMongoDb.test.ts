import { parseMongoDb } from '.';
import type { DefaultRuleGroupArray, DefaultRuleGroupType } from '../../types/index.noReact';

const wrapRules = (rules: DefaultRuleGroupArray): DefaultRuleGroupType => ({
  combinator: 'and',
  not: false,
  rules,
});

describe('import/parseMongoDb', () => {
  it('{}', () => {
    expect(parseMongoDb('{}')).toEqual(wrapRules([]));
  });
  it('{"_id":"someid"}', () => {
    expect(parseMongoDb('{"_id":"someid"}')).toEqual(
      wrapRules([{ field: '_id', operator: '=', value: 'someid' }])
    );
  });
  it('{"_id":"someid","boolfield":true}', () => {
    expect(parseMongoDb('{"_id":"someid","boolfield":true}')).toEqual(
      wrapRules([
        { field: '_id', operator: '=', value: 'someid' },
        { field: 'boolfield', operator: '=', value: true },
      ])
    );
  });
  it('complex 1', () => {
    const expectedRules: DefaultRuleGroupArray = [
      {
        field: '_id',
        operator: '=',
        value: 'asd',
      },
      {
        field: 'customMongoDbField',
        operator: '=',
        value: 'qwert',
      },
      {
        rules: [
          {
            field: 'customMongoDbField',
            operator: '=',
            value: 'orval',
          },
          {
            field: 'customMongoDbField',
            operator: '=',
            value: 'orval2',
          },
        ],
        combinator: 'or',
        not: false,
      },
      {
        rules: [
          {
            field: 'customMongoDbField',
            operator: '=',
            value: 'and111',
          },
          {
            field: 'customMongoDbField',
            operator: '=',
            value: 'and222',
          },
        ],
        combinator: 'and',
        not: false,
      },
    ];
    expect(
      parseMongoDb(
        '{"_id":"asd","customMongoDbField":"qwert","$or":[{"customMongoDbField":"orval"},{"customMongoDbField":"orval2"}],"$and":[{"customMongoDbField":"and111"},{"customMongoDbField":"and222"}]}'
      )
    ).toEqual(wrapRules(expectedRules));
  });
  it('complex 2', () => {
    const rules: DefaultRuleGroupArray = [
      {
        field: 'created',
        operator: '>',
        value: '27/01/2022 19:15:08',
      },
      {
        field: '_id',
        operator: '!=',
        value: true,
      },
    ];
    expect(
      parseMongoDb('{ "created" : { $gt : "27/01/2022 19:15:08" }, "_id" : { $ne : true } }')
    ).toEqual(wrapRules(rules));
  });
  it('complex 3', () => {
    const expected: DefaultRuleGroupType = {
      rules: [
        {
          field: 'created',
          operator: '>',
          value: '27/01/2022',
        },
        {
          field: '_id',
          operator: '!=',
          value: true,
        },
      ],
      combinator: 'or',
      not: false,
    };
    expect(
      parseMongoDb(
        '{ $or : [ { "created" : { $gt : "27/01/2022" } }, { "_id" : { $ne : true } } ] }'
      )
    ).toEqual(expected);
  });
  it('complex 4', () => {
    const expected: DefaultRuleGroupType = {
      rules: [
        {
          field: '_id',
          operator: '=',
          value: 'asd',
        },
        {
          field: 'arrayField',
          operator: 'in',
          value: 'asd,asd',
        },
        {
          rules: [
            {
              field: 'boolField',
              operator: 'null',
              value: '',
            },
          ],
          combinator: 'and',
          not: false,
        },
      ],
      combinator: 'and',
      not: false,
    };
    expect(
      parseMongoDb(
        '{ "_id" : "asd", "arrayField" : { $in : [ "asd", "asd" ] }, $and : [ { "boolField" : null } ] }'
      )
    ).toEqual(expected);
  });
});
