import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const SearchForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const InputGrid = styled.div`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: white;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    height: 56px;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        height: auto;
    }
`;

const SearchBarContainer = styled.div`
    background-color: transparent;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
`;

const SearchBarButton = styled(Button)`
    min-height: auto;
    height: 56px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.colors.primary};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        border-radius: 0;
    }
`;

const StyledInput = styled(Input)`
    .input-container {
        border: none !important;
        border-right: 1px solid ${({ theme }) => theme.colors.border} !important;
    }

    input {
        border: none !important;
        height: 56px;
        font-size: 1rem;
        padding: 0 1rem 0 3rem;
        color: ${({ theme }) => theme.colors.text};
    }

    svg {
        color: #aaa;
    }
`;

export default function SearchBar() {
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [travelers, setTravelers] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <SearchBarContainer>
            <SearchForm onSubmit={handleSubmit}>
                <InputGrid>
                    <StyledInput
                        placeholder="Where are you going?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        icon={<FaMapMarkerAlt />}
                        defaultValue="Uzbekistan"
                        inputConfig={{
                            noBorder: true,
                            variant: 'outlined',
                            size: 'md',
                            fullWidth: true,
                        }}
                    />

                    <StyledInput
                        placeholder="Select dates"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        icon={<FaCalendarAlt />}
                        defaultValue="02 Jan 2025 ~ 04 Jan 2025"
                        inputConfig={{
                            noBorder: true,
                            variant: 'outlined',
                            size: 'md',
                            fullWidth: true,
                        }}
                    />

                    <StyledInput
                        placeholder="Travelers"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        icon={<FaUser />}
                        defaultValue="2 adults, 2 children"
                        inputConfig={{
                            noBorder: true,
                            variant: 'outlined',
                            size: 'md',
                            fullWidth: true,
                        }}
                    />
                    <SearchBarButton variant="primary" type="submit">
                        <FaSearch size={20} />
                    </SearchBarButton>
                </InputGrid>
            </SearchForm>
        </SearchBarContainer>
    );
}
