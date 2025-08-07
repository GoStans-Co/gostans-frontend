import styled from 'styled-components';
import Input from '@/components/common/Input';

type ProfileContentProps = {
    userData: {
        name?: string;
        email?: string;
        phone?: string;
    };
};

const ProfileContentContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    width: 100%;
    max-width: 650px;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
        max-width: 100%;
    }
`;

const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    width: 100%;
    box-sizing: border-box;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: ${({ theme }) => theme.borderRadius.md};
    }
`;

const FieldsGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr 1fr;
    }

    & > div {
        width: 100%;
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 600;
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary};
    align-self: flex-start;
    width: 100%;
    text-align: left;
`;

export default function ProfileContent({ userData }: ProfileContentProps) {
    return (
        <ProfileContentContainer>
            <Card>
                <SectionTitle>Personal info</SectionTitle>
                <FieldsGrid>
                    <Input
                        label="Name"
                        value={userData.name}
                        readOnly
                        disabled={true}
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                    />

                    <Input
                        label="Email"
                        value={userData.email}
                        readOnly
                        disabled={true}
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                    />

                    <Input
                        label="Phone number"
                        value={userData.phone || 'Not provided'}
                        readOnly
                        disabled={true}
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        type="text"
                    />
                </FieldsGrid>
            </Card>
        </ProfileContentContainer>
    );
}
