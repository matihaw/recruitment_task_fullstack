<?php

namespace App\Services;

class ExchangeRateCalculator
{
    protected $exchangeRates;

    public function __construct(array $exchangeRates)
    {
        $this->exchangeRates = $exchangeRates;
    }

    public function calculate(string $currencyCode, float $rate): array
    {
        if (!array_key_exists($currencyCode, $this->exchangeRates)) {
            throw new \InvalidArgumentException('Unsupported Currency: ' . $currencyCode);
        }

        ['buy' => $buy, 'sell' => $sell] = $this->exchangeRates[$currencyCode];

        return [
            'sell' => $sell ? $sell + $rate : null,
            'buy' => $buy ? $buy + $rate : null,
        ];
    }
}
