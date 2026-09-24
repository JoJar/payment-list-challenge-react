import { PaymentSearchResponse } from "../types/payment"
import { StatusBadge, Table, TableCell, TableHeader, TableRow, TableWrapper } from './components'
import { I18N } from '../constants/i18n'
import { formatDateTime } from "../helpers/formatDate"
import { memo } from "react"

const PaymentsTable = ({ data }: { data: PaymentSearchResponse | undefined }) => {
    return (
        <TableWrapper>
            <Table>
                <thead>
                    <TableRow>
                        <TableHeader>{I18N.TABLE_HEADER_PAYMENT_ID}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_DATE}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_AMOUNT}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_CUSTOMER}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_CURRENCY}</TableHeader>
                        <TableHeader>{I18N.TABLE_HEADER_STATUS}</TableHeader>
                    </TableRow>
                </thead>
                <tbody>
                    { data?.payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>{formatDateTime(payment.date)}</TableCell>
                            <TableCell>{payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.customerName}</TableCell>
                            <TableCell>{payment.currency}</TableCell>
                            <TableCell>
                                <StatusBadge status={payment.status}>
                                    {payment.status}
                                </StatusBadge>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TableWrapper>
    )
}

export default memo(PaymentsTable)