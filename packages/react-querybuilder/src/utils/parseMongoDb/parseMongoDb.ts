import hjson from 'hjson';
import type {
  DefaultCombinatorName,
  DefaultOperatorName,
  DefaultRuleGroupTypeAny,
  DefaultRuleType,
  RuleGroupType,
} from '../../types';
import { operatorToMongo } from '../formatQuery/utils';

type MongoDbQueryParserResultField = string | Record<string, unknown>;
type MongoDbQueryResultItem = MongoDbQueryParserResult[] | string;
type MongoDbQueryParserResult = Record<string, MongoDbQueryResultItem>;

function getOperator(mongoOperator: string): DefaultOperatorName {
  return operatorToMongo[`${mongoOperator}`];
}

function getCombinatorString(parsedMongoQuery: Record<string, unknown> | string): string | false {
  if (typeof parsedMongoQuery === 'string' && isCombinator(parsedMongoQuery)) {
    return parsedMongoQuery.replace('$', '');
  } else if (
    Object.keys(parsedMongoQuery).length > 0 &&
    Object.keys(parsedMongoQuery)[0] &&
    isCombinator(Object.keys(parsedMongoQuery)[0])
  ) {
    return Object.keys(parsedMongoQuery)[0].replace('$', '');
  } else {
    return false;
  }
}

function isCombinator(string: string): boolean {
  return ['$and', '$or'].includes(string);
}

function getValue(value: any) {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  if (value === null) {
    return '';
  }
  return value;
}

type RuleOparand = { field: string; value: string | null | Array<string>; operator: string };
const mapQueryPart = ({
  field,
  value,
  operator,
}: RuleOparand): DefaultRuleType | DefaultRuleGroupTypeAny => {
  return {
    field,
    value: getValue(value),
    operator: getOperator(operator),
  };
};

const isObject = (obj: any) => obj === Object(obj);

function parseMongoDb(mongoQuery: string): DefaultRuleGroupTypeAny {
  const parsedMongoQueryFromString = hjson.parse(mongoQuery);
  const rootCombinator = getCombinatorString(parsedMongoQueryFromString);

  const reduceRules = (
    acc: (DefaultRuleType | DefaultRuleGroupTypeAny)[] | RuleGroupType[],
    part: MongoDbQueryParserResultField
  ): (DefaultRuleType | DefaultRuleGroupTypeAny)[] => {
    if (typeof part === 'string') {
      if (isCombinator(part) && Array.isArray(parsedMongoQueryFromString[part])) {
        const rules1 = (parsedMongoQueryFromString[part] as MongoDbQueryParserResult[]).reduce(
          reduceRules,
          []
        );
        const combinator = getCombinatorString(part) as DefaultCombinatorName;
        acc.push({
          not: false,
          combinator,
          rules: rules1,
        } as any);
      } else if (Array.isArray(parsedMongoQueryFromString[part])) {
        (parsedMongoQueryFromString[part] as MongoDbQueryParserResult[]).forEach(fields => {
          for (const field in fields) {
            const fieldOperand = Object.entries(fields[field])[0];
            acc.push(
              mapQueryPart({ field, value: fieldOperand[1], operator: fieldOperand[0] }) as any
            );
          }
        });
      } else if (
        isObject(parsedMongoQueryFromString[part]) &&
        parsedMongoQueryFromString[part] != null
      ) {
        // acc.push(mapQueryPart(parsedMongoQueryFromString)
        for (const field in parsedMongoQueryFromString[part] as any) {
          let value = parsedMongoQueryFromString[part];
          let operator = '$eq';
          if (isObject(value)) {
            value = Object.values(value)[0] as string;
            operator = Object.keys(parsedMongoQueryFromString[part])[0];
            acc.push(mapQueryPart({ field: part, value: value, operator }) as any);
          } else {
            acc.push(mapQueryPart({ field, value: value as string, operator }) as any);
          }
        }
      } else {
        acc.push(
          mapQueryPart({
            field: part,
            value: parsedMongoQueryFromString[part] as string,
            operator: '$eq',
          }) as any
        );
      }
    } else if (isObject(part)) {
      for (const field in part) {
        let value = part[field] as string | null | Record<string, string>;
        let operator = '$eq';
        if (value === null) {
          operator = 'null';
          acc.push(mapQueryPart({ field, value, operator }) as any);
        } else if (isObject(value) && value != null) {
          value = Object.values(value)[0] as string;
          operator = Object.keys(part[field] as Record<string, string>)[0];
          acc.push(mapQueryPart({ field, value: value, operator }) as any);
        } else {
          acc.push(mapQueryPart({ field, value: value as string, operator }) as any);
        }
      }
    }
    return acc as any;
  };

  const rules = Object.keys(parsedMongoQueryFromString).reduce(reduceRules, []);
  if (rootCombinator) {
    return rules[0] as any;
  } else {
    return {
      rules,
      combinator: (rootCombinator || 'and') as DefaultCombinatorName,
      not: false,
    } as any;
  }
}

export { parseMongoDb };
