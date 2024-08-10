import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;

    if (!/^\d+(\s*[-+*/]\s*\d+)*$/.test(expression)) {
      throw new BadRequestException('Invalid expression provided');
    }

    const tokens = expression.split(/([+\-*/])/).map(token => token.trim());

    let intermediateTokens = [];
    let i = 0;
    while (i < tokens.length) {
      if (tokens[i] === '*' || tokens[i] === '/') {
        const operator = tokens[i];
        const prevValue = parseFloat(intermediateTokens.pop());
        const nextValue = parseFloat(tokens[++i]);
        if (isNaN(nextValue)) {
          throw new BadRequestException('Invalid expression provided');
        }
        const result = operator === '*' ? prevValue * nextValue : prevValue / nextValue;
        intermediateTokens.push(result.toString());
      } else {
        intermediateTokens.push(tokens[i]);
      }
      i++;
    }

    let result = parseFloat(intermediateTokens[0]);
    
    for (let j = 1; j < intermediateTokens.length; j += 2) {
      const operator = intermediateTokens[j];
      const nextValue = parseFloat(intermediateTokens[j + 1]);
      if (isNaN(nextValue)) {
        throw new BadRequestException('Invalid expression provided');
      }
      result = operator === '+' ? result + nextValue : result - nextValue;
    }

    return result;
  }
}
