import { Container, EmptyBox, ErrorBox, Spinner, Title } from './components'
import { I18N } from '../constants/i18n'
import { CURRENCIES } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from './PaymentsTable';
import { getPayments } from '../api';
import { useState } from 'react';
import { PaymentFilters } from './PaymentFilters';
import { PaginationControls } from './PaginationControls';

type Currency = (typeof CURRENCIES)[number];

export interface PaymentFilterValues {
  search: string;
  currency: Currency | "";
  page: number
}

// could add page size filter
const defaultFilters: PaymentFilterValues = {
  search: "",
  currency: "",
  page: 1
};

export const PaymentsPage = () => {
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilterValues>(defaultFilters)
  
  const { isFetching, isPending, error, data } = useQuery({
    queryKey: ['paymentData', paymentFilters],
    queryFn: () => getPayments({ searchTerm: paymentFilters.search, currency: paymentFilters.currency, page: paymentFilters.page }),
  })

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const handleClearFilters = () => {
    setPaymentFilters(defaultFilters)
  }

  const handleFilterChange = (newFilter: Partial<PaymentFilterValues>) => {
    setPaymentFilters((prevFilters) => ({ ...prevFilters, ...newFilter }));
  }

  return ( 
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentFilters onChange={handleFilterChange} onClear={handleClearFilters} paymentFilters={paymentFilters} />
      {error &&
        <EmptyBox>
          <ErrorBox role="alert">{error?.message}</ErrorBox>
        </EmptyBox>
      }
      {isPending &&
        <EmptyBox role="status" aria-label="Loading payments">
          <Spinner aria-hidden="true" />
        </EmptyBox>
      }
      {!error && data && data.pageSize > 0 && (
        <div aria-busy={isFetching}>
          <PaymentsTable data={data} />
          <PaginationControls currentPage={data.page} totalPages={totalPages} onChange={handleFilterChange} />
        </div>
      )}
    </Container>
  );
};
