import React from 'react';

const TableFilters = ({ filters, setFilter }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container mt-3">
            <div className="mb-3">
                <label htmlFor="start" className="form-label">Date:</label>
                <input
                    type="date"
                    id="start"
                    className="form-control"
                    name="trip-start"
                    min="2023-01-01"
                    max={today}
                    value={filters.date}
                    onChange={(e) => setFilter({ ...filters, date: e.target.value })}
                />
            </div>
        </div>
    );
};

export default TableFilters;
