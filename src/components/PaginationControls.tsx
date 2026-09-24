import { I18N } from "../constants/i18n";
import { PaginationButton, PaginationInfo, PaginationRow } from "./components";
import { PaymentFilterValues } from "./PaymentsPage";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onChange: (changes: Partial<PaymentFilterValues>) => void;
}

export const PaginationControls = ({ currentPage, totalPages, onChange }: PaginationControlsProps) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onChange({ page: currentPage - 1, trigger: 'pagination' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onChange({ page: currentPage + 1, trigger: 'pagination' });
        }
    };

    return (
        <nav role="navigation" aria-label={I18N.PAGINATION_NAVIGATION}>
            <PaginationRow>
                <PaginationButton onClick={handlePrevious} aria-label={I18N.PREVIOUS_BUTTON} disabled={currentPage === 1}>
                    {I18N.PREVIOUS_BUTTON}
                </PaginationButton>
                <PaginationInfo aria-live="polite">
                    {I18N.PAGE_LABEL} {currentPage} {I18N.PAGE_PREPOSITION} {totalPages}
                </PaginationInfo>
                <PaginationButton onClick={handleNext} aria-label={I18N.NEXT_BUTTON} disabled={currentPage === totalPages}>
                    {I18N.NEXT_BUTTON}
                </PaginationButton>
            </PaginationRow>
        </nav>
    )
}

