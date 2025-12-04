import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { fetchRates } from '@/lib/apis';

export default function Currency() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initCurrencies = async () => {
      try {
        const rates = await fetchRates('USD');
        const currencyList = Object.keys(rates).sort();
        setCurrencies(currencyList);
      } catch (error) {
        console.error('Error loading currencies:', error);
      }
    };

    initCurrencies();
  }, []);

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setResult('Введите корректную сумму');
      return;
    }

    setLoading(true);
    setResult('⏳ Загрузка...');

    try {
      const rates = await fetchRates(fromCurrency);
      const rate = rates[toCurrency];
      const converted = (numAmount * rate).toFixed(2);
      setResult(
        `<div class="conversion-result">${numAmount} ${fromCurrency} = <strong>${converted} ${toCurrency}</strong></div><div class="rate-info">Курс: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}</div>`
      );
    } catch (err) {
      setResult('Ошибка при получении данных 😢');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <div id="app">
      <Navigation />
      <main>
        <div className="hero">
          <h1>💱 Конвертер валют</h1>
          <p>Введите сумму и выберите валюты для конвертации</p>
        </div>

        <section className="currency-page">
          <div className="converter-container">
            <div className="input-group">
              <input
                type="number"
                placeholder="Сумма"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
              <span className="arrow">→</span>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
            <button id="convert-btn" className="btn" onClick={handleConvert} disabled={loading}>
              Конвертировать
            </button>
            <div id="result" className="result">
              {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
