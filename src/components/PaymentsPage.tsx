import { withTrace } from '../telemetry/withTrace';
import { Container, EmptyBox, ErrorBox, Spinner, Title } from './components'
import { I18N } from '../constants/i18n'
import { useQuery } from '@tanstack/react-query';
import PaymentsTable from './PaymentsTable';
import { getPayments } from '../api';
import { useCallback, useState } from 'react';
import { PaymentFilters } from './PaymentFilters';
import { PaginationControls } from './PaginationControls';
import { PAYMENT_FILTER_TRIGGER, type PaymentFilterValues } from './PaymentsPage.types';

const defaultFilters: PaymentFilterValues = {
  search: "",
  currency: "",
  page: 1
};

export const PaymentsPage = () => {
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilterValues>(defaultFilters)
  
  const { isFetching, isPending, error, data } = useQuery({
    queryKey: ['paymentData', paymentFilters],
    queryFn: () => withTrace(
      'payment.search.fetch',
      {
        'payment.search.term': paymentFilters.search,
        'payment.currency': paymentFilters.currency,
        'payment.page': paymentFilters.page,
        'payment.trigger': paymentFilters.trigger ?? PAYMENT_FILTER_TRIGGER.INITIAL_LOAD,
      },
      async () => {
        const result = await getPayments({
          searchTerm: paymentFilters.search,
          currency: paymentFilters.currency,
          page: paymentFilters.page,
        })

        return result
      }
    )
  })

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const handleClearFilters = useCallback(() => {
    setPaymentFilters({...defaultFilters, trigger: PAYMENT_FILTER_TRIGGER.CLEAR });
  }, [])

  const handleFilterChange = useCallback((newFilter: Partial<PaymentFilterValues>) => {
    setPaymentFilters((prevFilters) => ({ ...prevFilters, ...newFilter }));
  }, [])

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
