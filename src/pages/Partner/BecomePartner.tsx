import { useEffect, useState } from 'react';
import PartnerForm from '@/components/PartnerForm';
import { useNavigate } from 'react-router-dom';
import { useApiServices } from '@/services/api';
import { message } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useRecoilValue } from 'recoil';
import { countriesWithCitiesAtom, CountriesWithCitiesState } from '@/atoms/countryWithCities';
import { ModalAlert } from '@/components/ModalPopup';

const PageContainer = styled.div`
    min-height: 85vh;
    background: ${theme.colors.lightBackground};
    display: flex;
    justify-content: center;
    padding: ${theme.spacing['2xl']} ${theme.spacing.xl};

    ${theme.responsive.mobile} {
        padding: ${theme.spacing.lg} ${theme.spacing.md};
        flex-direction: column;
        align-items: center;
    }
`;

/**
 * BecomePartner - Page Component
 * @description This component allows users to become partners
 * by filling out a registration form and submitting their details.
 * @param {Object} props - The component props
 */
export default function BecomePartner() {
    const navigate = useNavigate();
    const { user: userApiService, tours: getCountriesWithCities } = useApiServices();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const countriesWithCities = useRecoilValue<CountriesWithCitiesState>(countriesWithCitiesAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (!countriesWithCities.data) {
                await getCountriesWithCities.getCountriesWithCities();
            }
        };
        fetchData();
    }, [countriesWithCities.data]);

    const handleClose = () => {
        navigate('/');
    };

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        try {
            const result = await userApiService.registerPartner(formData);

            if (result.success) {
                setIsSuccessModalOpen(true);
            } else {
                messageApi.error(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            messageApi.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        handleClose();
    };

    return (
        <>
            {contextHolder}
            <PageContainer>
                <PartnerForm onClose={handleClose} onSubmit={handleSubmit} loading={loading} />
            </PageContainer>

            <ModalAlert
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                onConfirm={handleSuccessModalClose}
                title="Registration Successful!"
                message="Thank you for joining our network. We will contact you soon through email. Please check your email inbox in the coming 10 working days."
                type="success"
                confirmText="OK"
                showCancel={false}
            />
        </>
    );
}
