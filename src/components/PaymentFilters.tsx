import { useEffect, useState } from "react";
import { ClearButton, SearchButton, SearchInput, FilterRow, Select } from "./components";
import { I18N } from "../constants/i18n";
import { CURRENCIES } from "../constants";
import { PAYMENT_FILTER_TRIGGER, type PaymentFilterValues } from './PaymentPage.types';

interface PaymentIdSearchInputProps {
    onChange: (changes: Partial<PaymentFilterValues>) => void;
    onClear: () => void;
    paymentFilters: PaymentFilterValues;
}

export const PaymentFilters = ({ onChange, onClear, paymentFilters }: PaymentIdSearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState(paymentFilters.search)
    const hasActiveFilters = paymentFilters.search !== "" || paymentFilters.currency !== ""

    useEffect(() => {
        setSearchTerm(paymentFilters.search)
    }, [paymentFilters.search])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onChange({ search: searchTerm.trim(), page: 1, trigger: PAYMENT_FILTER_TRIGGER.SEARCH })
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ currency: e.target.value, page: 1, trigger: PAYMENT_FILTER_TRIGGER.CURRENCY_CHANGE })
    }

    return (
        <FilterRow onSubmit={handleSearch}>
            <SearchInput
                    type="search"
                    id="payment-id-search"
                    name="payment-id-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={I18N.SEARCH_PLACEHOLDER}
                    aria-label={I18N.SEARCH_LABEL}
            />
            <SearchButton type="submit" onClick={handleSearch}>
                {I18N.SEARCH_BUTTON}
            </SearchButton>
            <Select 
                id="currency-filter" 
                value={paymentFilters.currency} 
                onChange={handleCurrencyChange} 
                aria-label={I18N.CURRENCY_FILTER_LABEL}
            >
                <option key="all-currencies" value="">{I18N.CURRENCIES_OPTION}</option>
                {
                    CURRENCIES.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))
                }
            </Select>
            <ClearButton type="button" hidden={!hasActiveFilters} onClick={onClear}>
                {I18N.CLEAR_FILTERS}
            </ClearButton>
            
        </FilterRow>
    )
}