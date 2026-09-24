import { useEffect, useState } from "react";
import { ClearButton, SearchButton, SearchInput, FilterRow, Select } from "./components";
import { I18N } from "../constants/i18n";
import { CURRENCIES } from "../constants";
import { PaymentFilterValues } from "./PaymentsPage";

interface PaymentIdSearchInputProps {
    // onSearch: (value: string) => void;
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
        onChange({ search: searchTerm.trim(), page: 1, trigger: 'search' })
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ currency: e.target.value, page: 1, trigger: 'currency_change' })
    }

    return (
        <FilterRow onSubmit={handleSearch}>
            <label htmlFor="payment-id-search" className="sr-only" >{I18N.SEARCH_LABEL}</label>
            
            <SearchInput
                    type="search"
                    id="payment-id-search"
                    name="payment-id-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={I18N.SEARCH_PLACEHOLDER}
            />
            <SearchButton type="submit" onClick={handleSearch}>{I18N.SEARCH_BUTTON}</SearchButton>
            <label htmlFor="currency-filter" className="sr-only">{I18N.CURRENCY_FILTER_LABEL}</label>
            <Select id="currency-filter" value={paymentFilters.currency} onChange={handleCurrencyChange}>
                <option key="all-currencies" aria-label="All currencies" value="">{I18N.EMPTY_CURRENCY}</option>
                {
                    CURRENCIES.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))
                }
            </Select>
            <ClearButton hidden={!hasActiveFilters} onClick={onClear}>{I18N.CLEAR_FILTERS}</ClearButton>
            
        </FilterRow>
    )
}