import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";

interface GetPaymentsParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
}

export const getPayments = async ({ page, pageSize, searchTerm }: GetPaymentsParams): Promise<PaymentSearchResponse> => {
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
    if (searchTerm) {
        params.append('search', searchTerm);
    }
    const queryString = params.toString();
    console.log(queryString)
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        // Handle error response
        throw new Error('');
    }
    return response.json();
}