<?php

declare(strict_types=1);

namespace App\Services;

use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeManager
{
    private const CACHE_KEY = 'nbp_exchange_api_response_';

    protected $client;

    protected $currencies;

    protected $cache;

    protected $calculator;

    public function __construct(AdapterInterface $cache, HttpClientInterface $client, array $currencies, ExchangeRateCalculator $calculator)
    {
        $this->currencies = $currencies;
        $this->client = $client;
        $this->cache = $cache;
        $this->calculator = $calculator;
    }

    public function getExchangeRates(string $date): array
    {
        try {
            ['rates' => $rates] = $this->getData($date);
        } catch (\Throwable $e) {
            return [];
        }

        return array_values($this->processRates($rates));
    }

    public function getData(string $date): array
    {
        return $this->cache->get(self::CACHE_KEY . $date, function (ItemInterface $item) use ($date) {
            $item->expiresAt((new \DateTime())->setTime(23, 59, 59));
            $response = $this->client->request('GET', 'https://api.nbp.pl/api/exchangerates/tables/A/' . $date . '/?format=json');

            return json_decode($response->getContent(), TRUE)[0];
        });
    }

    private function processRates(array $rates): array
    {
        $filtered = $rates;

        foreach ($rates as $index => $rate) {
            if (!in_array($rate['code'], $this->currencies)) {
                unset($filtered[$index]);
                continue;
            }

            $filtered[$index]['prices'] = $this->calculator->calculate($rate['code'], $rate['mid']);
        }

        return $filtered;
    }
}
