import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const SearchBarContainer = styled.div`
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 0;
    box-shadow: ${({ theme }) => theme.shadows.md};
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    overflow: hidden;
`;

const SearchForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const TabsContainer = styled.div`
    display: flex;
    margin-bottom: 0;
`;

const Tab = styled.button<{ active: boolean }>`
    background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'white')};
    color: ${({ active }) => (active ? 'white' : 'inherit')};
    padding: 1rem 2rem;
    border-radius: 0;
    font-weight: 500;
    border: none;
    cursor: pointer;
`;

const InputGrid = styled.div`
    display: flex;
    border-top: 0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;

const SearchBarButton = styled(Button)`
    min-height: auto;
    height: 56px;
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    padding: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
    }
`;

type SearchBarTab = 'tours' | 'hotels' | 'activities';

export default function SearchBar() {
    const [activeTab, setActiveTab] = useState<SearchBarTab>('tours');
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [travelers, setTravelers] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic
        console.log({
            type: activeTab,
            destination,
            dates,
            travelers,
        });
    };

    return (
        <SearchBarContainer>
            <SearchForm onSubmit={handleSubmit}>
                <TabsContainer>
                    {/* <Tab type="button" active={activeTab === 'tours'} onClick={() => setActiveTab('tours')}>
                        Tours
                    </Tab> */}
                </TabsContainer>

                <InputGrid>
                    <Input
                        placeholder="Where are you going?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        icon={<FaMapMarkerAlt />}
                        defaultValue="Uzbekistan"
                        noBorder
                    />

                    <Input
                        placeholder="Select dates"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        icon={<FaCalendarAlt />}
                        defaultValue="02 Jan 2025 ~ 04 Jan 2025"
                        noBorder={true}
                    />

                    <Input
                        placeholder="Travelers"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        icon={<FaUser />}
                        defaultValue="2 adults, 2 children"
                        noBorder
                    />

                    <SearchBarButton variant="primary" type="submit">
                        <FaSearch />
                    </SearchBarButton>
                </InputGrid>
            </SearchForm>
        </SearchBarContainer>
    );
}
