import { SearchButton, SearchInput } from "./components"
import { I18N } from "../constants/i18n"
import { useState } from "react";

interface PaymentIdSearchInputProps {
    onSearch: (value: string) => void;
}

export const PaymentIdSearchInput = ({ onSearch }: PaymentIdSearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(searchTerm.trim())
    }
    // err handling , on clear handling
    // auto complete?
    return (
        <form role="search" onSubmit={handleSubmit}>
            <label htmlFor="payment-id-search" hidden >{I18N.SEARCH_LABEL}</label>
            <SearchInput
                type="search"
                id="payment-id-search"
                name="payment-id-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={I18N.SEARCH_PLACEHOLDER}
            />
            <SearchButton type="submit" onClick={handleSubmit}>{I18N.SEARCH_BUTTON}</SearchButton>
        </form>
    )
}