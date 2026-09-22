import { Container, Title } from './components'
import { I18N } from '../constants/i18n'
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from './PaymentsTable';
import { getPayments } from '../api';
import { PaymentIdSearchInput } from './SearchInput';
import { useState } from 'react';

export const PaymentsPage = () => {
  const [idSearchTerm, setIdSearchTerm] = useState('')

  const { isPending, error, data } = useQuery({
    queryKey: ['paymentData', idSearchTerm],
    queryFn: () => getPayments({ searchTerm: idSearchTerm }),
  })

  return ( 
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <PaymentIdSearchInput onSearch={setIdSearchTerm} />

      { 
        data &&
        <PaymentsTable data={data} />
      }
      
    </Container>
  );
};
