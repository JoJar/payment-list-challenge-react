import { Container, ErrorBox, Title } from './components'
import { I18N } from '../constants/i18n'
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from './PaymentsTable';
import { getPayments } from '../api';
import { useState } from 'react';
import { PaymentFilters } from './PaymentFilters';

export interface PaymentFilterValues {
  search: string;
}

const defaultFilters: PaymentFilterValues = {
  search: "",
};

export const PaymentsPage = () => {
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilterValues>(defaultFilters)

  const { isPending, error, data } = useQuery({
    queryKey: ['paymentData', paymentFilters],
    queryFn: () => getPayments({ searchTerm: paymentFilters.search }),
  })

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
      <PaymentsTable data={data} />
    </Container>
  );
};
