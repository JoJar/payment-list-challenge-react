export interface Payment {
    amount: number;
    currency: string;
    customerAddress: string;
    customerName: string;
    date: string;
    description: string;
    id: string;
    status: Status;
}

export interface PaymentSearchResponse {
    page: number;
    pageSize: number;
    total: number;
    payments: Payment[];
}

type Status = "completed" | "pending" | "failed" | "refunded";