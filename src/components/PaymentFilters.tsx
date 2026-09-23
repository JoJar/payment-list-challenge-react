import { useEffect, useState } from "react";
import { ClearButton, SearchButton, SearchInput, FilterRow, FlexRow } from "./components";
import { I18N } from "../constants/i18n";
import { PaymentFilterValues } from "./PaymentsPage";

interface PaymentIdSearchInputProps {
    // onSearch: (value: string) => void;
    onChange: (changes: Partial<PaymentFilterValues>) => void;
    onClear: () => void;
    paymentFilters: PaymentFilterValues;
}

export const PaymentFilters = ({ onChange, onClear, paymentFilters }: PaymentIdSearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState(paymentFilters.search)
    const hasActiveFilters = paymentFilters.search !== ""

    useEffect(() => {
        setSearchTerm(paymentFilters.search)
    }, [paymentFilters.search])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onChange({ search: searchTerm.trim() })
    }

    return (
        <FilterRow>
            <form role="search" onSubmit={handleSearch}>
                <label htmlFor="payment-id-search" hidden >{I18N.SEARCH_LABEL}</label>
                <SearchInput
                    type="search"
                    id="payment-id-search"
                    name="payment-id-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={I18N.SEARCH_PLACEHOLDER}
                />
                <SearchButton type="submit" onClick={handleSearch}>{I18N.SEARCH_BUTTON}</SearchButton>
            </form>
            <ClearButton hidden={!hasActiveFilters} onClick={onClear}>{I18N.CLEAR_FILTERS}</ClearButton>
        </FilterRow>
    )
}