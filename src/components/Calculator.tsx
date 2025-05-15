
import React, { useState } from 'react';
import { Display } from './Display';
import { Button } from './Button';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumberClick = (num: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperationClick = (operation: string) => {
    if (previousValue !== null && currentOperation !== null && !resetDisplay) {
      const result = calculateResult();
      setDisplay(result);
      setPreviousValue(result);
    } else {
      setPreviousValue(display);
    }
    setCurrentOperation(operation);
    setResetDisplay(true);
  };

  const calculateResult = () => {
    if (!previousValue || !currentOperation) return display;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    
    let result = 0;
    switch (currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return display;
    }
    
    return result.toString();
  };

  const handleEquals = () => {
    if (!previousValue || !currentOperation) return;
    
    const result = calculateResult();
    setDisplay(result);
    setPreviousValue(null);
    setCurrentOperation(null);
    setResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setCurrentOperation(null);
    setResetDisplay(false);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-2xl shadow-xl">
      <Display value={display} operation={currentOperation} previousValue={previousValue} />
      
      <div className="grid grid-cols-4 gap-2 mt-4">
        <Button onClick={handleClear} type="function" span={2}>
          AC
        </Button>
        <Button onClick={handleDelete} type="function">
          DEL
        </Button>
        <Button onClick={() => handleOperationClick('÷')} type="operation">
          ÷
        </Button>
        
        <Button onClick={() => handleNumberClick('7')}>7</Button>
        <Button onClick={() => handleNumberClick('8')}>8</Button>
        <Button onClick={() => handleNumberClick('9')}>9</Button>
        <Button onClick={() => handleOperationClick('×')} type="operation">
          ×
        </Button>
        
        <Button onClick={() => handleNumberClick('4')}>4</Button>
        <Button onClick={() => handleNumberClick('5')}>5</Button>
        <Button onClick={() => handleNumberClick('6')}>6</Button>
        <Button onClick={() => handleOperationClick('-')} type="operation">
          -
        </Button>
        
        <Button onClick={() => handleNumberClick('1')}>1</Button>
        <Button onClick={() => handleNumberClick('2')}>2</Button>
        <Button onClick={() => handleNumberClick('3')}>3</Button>
        <Button onClick={() => handleOperationClick('+')} type="operation">
          +
        </Button>
        
        <Button onClick={() => handleNumberClick('0')} span={2}>
          0
        </Button>
        <Button onClick={handleDecimal}>.</Button>
        <Button onClick={handleEquals} type="equals">
          =
        </Button>
      </div>
    </div>
  );
};
