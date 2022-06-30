type AnyCase<T extends string> = string extends T
  ? string
  : T extends `${infer F1}${infer F2}${infer R}`
  ? `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
  : T extends `${infer F}${infer R}`
  ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
  : '';

type TokenType =
  | 'AndExpression'
  | 'BetweenPredicate'
  | 'BitExpression'
  | 'Boolean'
  | 'BooleanExtra'
  | 'CaseWhen'
  | 'ComparisonBooleanPrimary'
  | 'ComparisonSubQueryBooleanPrimary'
  | 'ContainsExpr'
  | 'EndsWithExpr'
  | 'ExpressionList'
  | 'ForceIndexHint'
  | 'ForOptIndexHint'
  | 'FunctionCall'
  | 'FunctionCallParam'
  | 'GroupBy'
  | 'GroupByOrderByItem'
  | 'Identifier'
  | 'IdentifierExpr'
  | 'IdentifierList'
  | 'IgnoreIndexHint'
  | 'IndexHintList'
  | 'InExpressionListPredicate'
  | 'InnerCrossJoinTable'
  | 'InSubQueryPredicate'
  | 'IsExpression'
  | 'IsNullBooleanPrimary'
  | 'LeftRightJoinTable'
  | 'LikePredicate'
  | 'Limit'
  | 'Main'
  | 'NaturalJoinTable'
  | 'NotExpression'
  | 'Null'
  | 'Number'
  | 'OnJoinCondition'
  | 'OrderBy'
  | 'OrExpression'
  | 'Partitions'
  | 'PlaceHolder'
  | 'Prefix'
  | 'RegexpPredicate'
  | 'Select'
  | 'SelectExpr'
  | 'SelectParenthesized'
  | 'SimpleExprParentheses'
  | 'SoundsLikePredicate'
  | 'StartsWithExpr'
  | 'StraightJoinTable'
  | 'String'
  | 'SubQuery'
  | 'TableFactor'
  | 'TableReference'
  | 'TableReferences'
  | 'Union'
  | 'UseIndexHint'
  | 'UsingJoinCondition'
  | 'WhenThenList'
  | 'XORExpression';

export type ComparisonOperator = '=' | '>=' | '>' | '<=' | '<' | '<>' | '!=';
export type NotOpt = AnyCase<'NOT'> | null;
export type AndOperator = AnyCase<'AND'>;
export type OrOperator = AnyCase<'OR'>;

export interface MongoDbWhereObject {
  type: TokenType;
}
export interface MongoDbIdentifier extends MongoDbWhereObject {
  type: 'Identifier';
  value: string;
}
export interface MongoDbWhereObjectAny extends MongoDbWhereObject {
  [k: string]: any;
}
export interface MongoDbStringValue extends MongoDbWhereObject {
  type: 'String';
  value: `'${string}'` | `"${string}"`;
}
export interface MongoDbNumberValue extends MongoDbWhereObject {
  type: 'Number';
  value: string;
}
export interface MongoDbBooleanValue extends MongoDbWhereObject {
  type: 'Boolean';
  value: AnyCase<'TRUE'> | AnyCase<'FALSE'>;
}
export interface MongoDbBooleanExtra extends MongoDbWhereObject {
  type: 'BooleanExtra';
  value: AnyCase<'UNKNOWN'>;
}
export interface MongoDbSimpleExprParentheses extends MongoDbWhereObject {
  type: 'SimpleExprParentheses';
  value: MongoDbExpressionList;
}
export interface MongoDbExpressionList extends MongoDbWhereObject {
  type: 'ExpressionList';
  value: MongoDbExpression[];
}
export interface MongoDbInExpressionListPredicate extends MongoDbWhereObject {
  type: 'InExpressionListPredicate';
  hasNot: NotOpt;
  left: MongoDbSimpleExpression;
  right: MongoDbExpressionList;
}
export interface MongoDbBetweenPredicate extends MongoDbWhereObject {
  type: 'BetweenPredicate';
  hasNot: NotOpt;
  left: MongoDbSimpleExpression;
  right: { left: MongoDbSimpleExpression; right: MongoDbPredicate };
}
export interface MongoDbLikePredicate extends MongoDbWhereObject {
  type: 'LikePredicate';
  hasNot: NotOpt;
  left: MongoDbSimpleExpression;
  right:
    | MongoDbSimpleExpression
    | MongoDbStartsWithExpr
    | MongoDbEndsWithExpr
    | MongoDbContainsExpr;
  escape: MongoDbStringValue | null;
}
export interface MongoDbStartsWithExpr extends MongoDbWhereObject {
  type: 'StartsWithExpr';
  value: MongoDbStringValue | MongoDbIdentifier;
}
export interface MongoDbEndsWithExpr extends MongoDbWhereObject {
  type: 'EndsWithExpr';
  value: MongoDbStringValue | MongoDbIdentifier;
}
export interface MongoDbContainsExpr extends MongoDbWhereObject {
  type: 'ContainsExpr';
  value: MongoDbStringValue | MongoDbIdentifier;
}
export interface MongoDbIsNullBooleanPrimary extends MongoDbWhereObject {
  type: 'IsNullBooleanPrimary';
  hasNot: NotOpt;
  value: MongoDbBooleanPrimary;
}
export interface MongoDbComparisonBooleanPrimary extends MongoDbWhereObject {
  type: 'ComparisonBooleanPrimary';
  left: MongoDbBooleanPrimary;
  operator: ComparisonOperator;
  right: MongoDbPredicate;
}
export interface MongoDbIsExpression extends MongoDbWhereObject {
  type: 'IsExpression';
  hasNot: NotOpt;
  left: MongoDbBooleanPrimary;
  right: MongoDbBooleanExtra;
}
export interface MongoDbNotExpression extends MongoDbWhereObject {
  type: 'NotExpression';
  value: MongoDbExpression;
}
export interface MongoDbAndExpression extends MongoDbWhereObject {
  type: 'AndExpression';
  operator: AndOperator;
  left: MongoDbExpression;
  right: MongoDbExpression;
}
export interface MongoDbOrExpression extends MongoDbWhereObject {
  type: 'OrExpression';
  operator: OrOperator;
  left: MongoDbExpression;
  right: MongoDbExpression;
}

// Interfaces that might show up but will be ignored
export interface MongoDbXORExpression extends MongoDbWhereObjectAny {
  type: 'XORExpression';
}
export interface MongoDbFunctionCall extends MongoDbWhereObjectAny {
  type: 'FunctionCall';
}
export interface MongoDbCaseWhen extends MongoDbWhereObjectAny {
  type: 'CaseWhen';
}
export interface MongoDbPrefix extends MongoDbWhereObjectAny {
  type: 'Prefix';
}
export interface MongoDbSubQuery extends MongoDbWhereObjectAny {
  type: 'SubQuery';
}
export interface MongoDbIdentifierExpr extends MongoDbWhereObjectAny {
  type: 'IdentifierExpr';
}
export interface MongoDbBitExpression extends MongoDbWhereObjectAny {
  type: 'BitExpression';
}
export interface MongoDbInSubQueryPredicate extends MongoDbWhereObjectAny {
  type: 'InSubQueryPredicate';
}
export interface MongoDbSoundsLikePredicate extends MongoDbWhereObjectAny {
  type: 'SoundsLikePredicate';
}
export interface MongoDbRegexpPredicate extends MongoDbWhereObjectAny {
  type: 'RegexpPredicate';
}
export interface MongoDbComparisonSubQueryBooleanPrimary extends MongoDbWhereObjectAny {
  type: 'ComparisonSubQueryBooleanPrimary';
}

// Types we'll actually use
export type MongoDbLiteralValue = MongoDbStringValue | MongoDbNumberValue | MongoDbBooleanValue;
export type MongoDbSimpleExpression =
  | MongoDbLiteralValue
  | MongoDbIdentifier
  | MongoDbFunctionCall
  | MongoDbCaseWhen
  | MongoDbPrefix
  | MongoDbSubQuery
  | MongoDbIdentifierExpr
  | MongoDbBitExpression
  | MongoDbSimpleExprParentheses;
export type MongoDbPredicate =
  | MongoDbSimpleExpression
  | MongoDbInExpressionListPredicate
  | MongoDbBetweenPredicate
  | MongoDbLikePredicate
  | MongoDbInSubQueryPredicate
  | MongoDbSoundsLikePredicate
  | MongoDbRegexpPredicate;
export type MongoDbBooleanPrimary =
  | MongoDbPredicate
  | MongoDbIsNullBooleanPrimary
  | MongoDbComparisonBooleanPrimary
  | MongoDbComparisonSubQueryBooleanPrimary;
export type MongoDbExpression =
  | MongoDbBooleanPrimary
  | MongoDbIsExpression
  | MongoDbNotExpression
  | MongoDbAndExpression
  | MongoDbOrExpression
  | MongoDbXORExpression;

export interface ParsedMongoDb {
  nodeType: 'Main';
  value: {
    type: 'Select';
    distinctOpt: string | null;
    highPriorityOpt: any;
    maxStateMentTimeOpt: any;
    straightJoinOpt: any;
    mongoDbSmallResultOpt: any;
    mongoDbBigResultOpt: any;
    mongoDbBufferResultOpt: any;
    mongoDbCacheOpt: any;
    mongoDbCalcFoundRowsOpt: any;
    selectItems: MongoDbWhereObjectAny;
    from: MongoDbWhereObjectAny;
    partition: any;
    where: MongoDbExpression;
    groupBy: MongoDbWhereObjectAny | null;
    having: MongoDbWhereObjectAny | null;
    orderBy: MongoDbWhereObjectAny | null;
    limit: MongoDbWhereObjectAny | null;
    procedure: MongoDbWhereObjectAny | null;
    updateLockMode: any;
  };
  hasSemicolon: boolean;
}
