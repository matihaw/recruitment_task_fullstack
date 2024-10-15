<?php

declare(strict_types=1);

namespace App\Controller;

use App\Services\ExchangeManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ExchangeRatesController extends AbstractController
{

    protected $exchangeManager;

    public function __construct(ExchangeManager $exchangeManager)
    {
        $this->exchangeManager = $exchangeManager;
    }

    public function index(Request $request): JsonResponse
    {

        return new JsonResponse($this->exchangeManager->getExchangeRates($request->get('date')));
    }
}
