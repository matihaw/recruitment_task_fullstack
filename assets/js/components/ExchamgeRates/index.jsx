import React, {useEffect, useState} from 'react';
import axios from "axios";
import {capitalizeFirstLetter} from "../../utils";
import TableFilters from "./TableFilters";
import {useHistory, useLocation} from "react-router-dom";

const ExchangeRates = () => {
    const history = useHistory();
    const location = useLocation();
    const [exchangeRates, setExchangeRates] = useState([]);
    const [filters, setFilters] = useState({
        'date': new Date().toISOString().split('T')[0]
    })
    const tableHeader = ['Currency Code', 'Purchase Rate', 'Selling Rate'];
    const availableFilters = [{
        'name': 'date',
        'value': new Date().toISOString().split('T')[0]
    }]

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryFilters = {};

        availableFilters.forEach(({name, value}) => {
            console.log(name)
            if (!searchParams.get(name)) {
                queryFilters[name] = value
            } else {
                queryFilters[name] = searchParams.get(name)
            }
        })

        setFilters(queryFilters)
    }, []);

    useEffect(() => {
        axios.get(`/api/exchange-rates`, {
            params: filters
        })
            .then(response => response.data)
            .then(data => {
                console.log(data);
                setExchangeRates(data);
            })
            .catch(function (error) {
                console.log(error);
            });

        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(filters).toString(),
        })
    }, [filters]);

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-center">Exchange Rates</h2>
                    <hr/>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 offset-md-3">
                    <TableFilters filters={filters} setFilter={setFilters}/>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered table-striped">
                            <thead className="thead-dark">
                            <tr>
                                {tableHeader.map((header, key) => (
                                    <th scope="col" key={key} className="text-center">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {exchangeRates.length > 0 ? (
                                exchangeRates.map(({currency, code, prices}, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{capitalizeFirstLetter(currency)} ({code})</td>
                                        <td className="text-center">{prices.buy ? prices.buy.toFixed(4) : 'Not buying'}</td>
                                        <td className="text-center">{prices.sell ? prices.sell.toFixed(4) : 'Not selling'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">No exchange rates available.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangeRates;
