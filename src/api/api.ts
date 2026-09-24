import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";
import { I18N } from "../constants/i18n"; 

interface GetPaymentsParams {
    page?: number;
    pageSize?: number;
    searchTerm: string;
    currency: string
}

export const getPayments = async ({ page, pageSize, searchTerm, currency }: GetPaymentsParams): Promise<PaymentSearchResponse> => {
    const params = new URLSearchParams();

    if (page !== undefined) {
        params.append('page', page.toString());
    } else {
        params.append('page', '1');
    }
    if (pageSize !== undefined) {
        params.append('pageSize', pageSize.toString());
    } else {
        params.append('pageSize', '5');
    }
    if (searchTerm.trim() !== '') {
        params.append('search', searchTerm);
    }
    if (currency.trim() !== '') {
        params.append('currency', currency);
    }
    const queryString = params.toString();
    console.log(queryString)
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url);

    if (response.status === 404) {
        throw new Error(I18N.PAYMENT_NOT_FOUND);
    }

    if (response.status === 500) {
        throw new Error(I18N.INTERNAL_SERVER_ERROR);
    }

    if (!response.ok) {
        // Handle error response observability
        throw new Error(I18N.SOMETHING_WENT_WRONG);
    }
    return response.json();
}