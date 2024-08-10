import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;

    if (!/^\d+(\s*[-+*/]\s*\d+)*$/.test(expression)) {
      throw new BadRequestException('Invalid expression provided');
    }

    const elements = expression.split(/([+\-*/])/).map(token => token.trim());

    let processedElements = [];
    let i = 0;

    while (i < elements.length) {
      if (elements[i] === '*' || elements[i] === '/') {
        const operator = elements[i];
        const prevValue = parseFloat(processedElements.pop());
        const nextValue = parseFloat(elements[++i]);
        if (isNaN(nextValue)) {
          throw new BadRequestException('Invalid expression provided');
        }
        const result = operator === '*' ? prevValue * nextValue : prevValue / nextValue;
        processedElements.push(result.toString());
      } else {
        processedElements.push(elements[i]);
      }
      i++;
    }

    let result = parseFloat(processedElements[0]);
    
    for (let j = 1; j < processedElements.length; j += 2) {
      const operator = processedElements[j];
      const nextValue = parseFloat(processedElements[j + 1]);
      if (isNaN(nextValue)) {
        throw new BadRequestException('Invalid expression provided');
      }
      result = operator === '+' ? result + nextValue : result - nextValue;
    }

    return result;
  }
}
