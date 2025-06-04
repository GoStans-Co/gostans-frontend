import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import { DatePicker, Dropdown, Select } from 'antd';
import { DownOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Button from '@/components/Common/Button';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export type SearchBarData = {
    destination: string;
    dates: string;
    travelers: string;
    adults?: number;
    children?: number;
    infants?: number;
};

export type SearchBarHandlers = {
    onDestinationChange?: (value: string) => void;
    onDatesChange?: (value: string) => void;
    onTravelersChange?: (value: string) => void;
    onTravelerCountChange?: (adults: number, children: number, infants: number) => void;
    onSubmit?: (e: React.FormEvent) => void;
};

export type SearchBarProps = {
    data: SearchBarData;
    handlers?: SearchBarHandlers;
    showTravelersDropdown?: boolean;
    onTravelersDropdownToggle?: (show: boolean) => void;
};

const SearchForm = styled.form`
    display: flex;
    gap: 0;
    align-items: stretch;
    width: 100%;
    max-width: none;
    min-width: 800px;
    margin: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: white;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    height: 56px;
    position: relative;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        height: auto;
        min-width: auto;
        max-width: 100%;
    }
`;

const InputWrapper = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;

    &:not(:last-child) {
        border-right: 1px solid ${({ theme }) => theme.colors.border};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        border-right: none;

        &:not(:last-child) {
            border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        }
    }

    .input-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const StyledSelect = styled(Select)`
    width: 100%;
    height: 56px;

    .ant-select-selector {
        height: 56px !important;
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        padding-left: 3rem !important;
        padding-right: 3rem !important;
        display: flex;
        align-items: center;
    }

    .ant-select-selection-item {
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.colors.text};
        font-size: 14px;
    }

    .ant-select-selection-placeholder {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 14px;
    }

    .ant-select-arrow {
        color: ${({ theme }) => theme.colors.lightText};
        right: 1rem;
    }

    .ant-select-clear {
        right: 2.5rem;
        color: ${({ theme }) => theme.colors.lightText};
        background: transparent;

        &:hover {
            color: ${({ theme }) => theme.colors.text};
        }
    }

    &:hover .ant-select-selector {
        background: ${({ theme }) => theme.colors.lightBackground} !important;
    }

    &.ant-select-focused .ant-select-selector {
        background: ${({ theme }) => theme.colors.lightBackground} !important;
    }
`;

const StyledRangePicker = styled(RangePicker)`
    width: 100%;
    height: 56px;

    .ant-picker-input {
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        border: none;
        background: transparent;
        font-size: 14px;
    }

    &.ant-picker {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        height: 56px;
        display: flex;
        align-items: center;
        padding: 0 1rem 0 3rem !important;
    }

    .ant-picker-separator {
        color: ${({ theme }) => theme.colors.lightText};
        margin: 0 4px !important;
    }

    .ant-picker-range {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .ant-picker-input > input {
        font-size: 14px !important;
        padding: 0 !important;
    }

    .ant-picker-suffix,
    .ant-picker-clear {
        display: none !important;
    }

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground} !important;
    }

    &.ant-picker-focused {
        background: ${({ theme }) => theme.colors.lightBackground} !important;
    }
`;
const DropdownButton = styled.button`
    width: 100%;
    height: 56px;
    border: none;
    background: transparent;
    text-align: left;
    padding: 0 1rem;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground};
    }

    &:focus {
        outline: none;
    }

    .dropdown-icon {
        color: ${({ theme }) => theme.colors.lightText};
        font-size: 12px;
        transition: transform 0.2s;
    }

    &.active .dropdown-icon {
        transform: rotate(180deg);
    }
`;

const SearchButton = styled(Button)`
    min-height: auto;
    height: 56px;
    width: 50px;
    border-radius: 0;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 0;
    margin: 0;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        border-radius: 0;
    }
`;

const TravelerCategory = styled.div`
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;

    &:last-child {
        margin-bottom: 0;
    }
`;

const CategoryHeader = styled.div`
    margin-bottom: 0;
    flex: 1;
    margin-right: 24px;
`;

const CategoryTitle = styled.h4`
    margin: 0 0 4px 0;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
`;

const CategorySubtitle = styled.p`
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.lightText};
`;

const CounterContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: flex-end;
    min-width: 120px;
`;

const CounterControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    width: 100%;
`;

const CounterButton = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme, disabled }) => (disabled ? theme.colors.border : theme.colors.primary)};
    color: ${({ theme, disabled }) => (disabled ? theme.colors.border : theme.colors.primary)};
    background: white;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.lightBackground};
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const CounterValue = styled.span`
    min-width: 40px;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
`;

const regions = [
    {
        name: 'Uzbekistan',
        cities: ['Bukhara', 'Khiva', 'Samarkand', 'Tashkent'],
    },
    {
        name: 'Kazakhstan',
        cities: ['Aktau', 'Almaty', 'Astana', 'Shymkent'],
    },
    {
        name: 'Kyrgyzstan',
        cities: ['Dushanbe', 'Khorog', 'Khujand', 'Panjikend'],
    },
    {
        name: 'Turkmenistan',
        cities: ['Ashgabat'],
    },
];

export default function SearchBar({
    data,
    handlers = {},
    showTravelersDropdown = false,
    onTravelersDropdownToggle,
}: SearchBarProps) {
    const { destination, dates, travelers, adults = 0, children = 0, infants = 0 } = data;
    const { onDestinationChange, onDatesChange, onTravelersChange, onTravelerCountChange, onSubmit } = handlers;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onTravelersDropdownToggle?.(false);
        onSubmit?.(e);
    };

    const handleDestinationChange = (value: unknown) => {
        onDestinationChange?.(value as string);
    };

    const handleDateChange = (dates: any) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const formatDate = (date: any) => {
                return date.format('DD MMM YYYY');
            };
            const dateString = `${formatDate(start)} ~ ${formatDate(end)}`;
            onDatesChange?.(dateString);
        } else {
            onDatesChange?.('');
        }
    };

    const handleTravelerChange = (type: 'adults' | 'children' | 'infants', delta: number) => {
        let newAdults = adults;
        let newChildren = children;
        let newInfants = infants;

        if (type === 'adults') {
            newAdults = Math.max(0, adults + delta);
        } else if (type === 'children') {
            newChildren = Math.max(0, children + delta);
        } else if (type === 'infants') {
            newInfants = Math.max(0, infants + delta);
        }

        onTravelerCountChange?.(newAdults, newChildren, newInfants);

        const parts = [];
        if (newAdults > 0) {
            parts.push(`${newAdults} adult${newAdults !== 1 ? 's' : ''}`);
        }
        if (newChildren > 0) {
            parts.push(`${newChildren} ${newChildren === 1 ? 'child' : 'children'}`);
        }
        if (newInfants > 0) {
            parts.push(`${newInfants} infant${newInfants !== 1 ? 's' : ''}`);
        }
        onTravelersChange?.(parts.join(', ') || 'Travelers');
    };

    const destinationOptions = regions.map((region) => ({
        label: <span style={{ fontWeight: 600 }}>{region.name}</span>,
        title: region.name,
        options: region.cities.map((city) => ({
            label: city,
            value: city,
        })),
    }));

    const getDateValues = useMemo((): [dayjs.Dayjs, dayjs.Dayjs] | undefined => {
        if (!dates) return undefined;

        const dateRange = dates.split(' ~ ');
        if (dateRange.length === 2) {
            const startDate = dayjs(dateRange[0].trim(), 'DD MMM YYYY');
            const endDate = dayjs(dateRange[1].trim(), 'DD MMM YYYY');

            if (startDate.isValid() && endDate.isValid()) {
                return [startDate, endDate];
            }
        }
        return undefined;
    }, [dates]);

    const handleTravelersVisibleChange = (visible: boolean) => {
        onTravelersDropdownToggle?.(visible);
    };

    const travelersDropdownContent = (
        <div
            style={{
                padding: '20px',
                minWidth: '305px',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            <TravelerCategory>
                <CategoryHeader>
                    <CategoryTitle>Adults</CategoryTitle>
                    <CategorySubtitle>Ages 13 or above</CategorySubtitle>
                </CategoryHeader>
                <CounterContainer>
                    <CounterControls>
                        <CounterButton
                            type="button"
                            disabled={adults <= 0}
                            onClick={() => handleTravelerChange('adults', -1)}
                        >
                            <MinusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                        <CounterValue>{adults}</CounterValue>
                        <CounterButton
                            type="button"
                            disabled={adults >= 10}
                            onClick={() => handleTravelerChange('adults', 1)}
                        >
                            <PlusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                    </CounterControls>
                </CounterContainer>
            </TravelerCategory>

            <TravelerCategory>
                <CategoryHeader>
                    <CategoryTitle>Children</CategoryTitle>
                    <CategorySubtitle>Ages 2-12</CategorySubtitle>
                </CategoryHeader>
                <CounterContainer>
                    <CounterControls>
                        <CounterButton
                            type="button"
                            disabled={children <= 0}
                            onClick={() => handleTravelerChange('children', -1)}
                        >
                            <MinusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                        <CounterValue>{children}</CounterValue>
                        <CounterButton
                            type="button"
                            disabled={children >= 6}
                            onClick={() => handleTravelerChange('children', 1)}
                        >
                            <PlusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                    </CounterControls>
                </CounterContainer>
            </TravelerCategory>

            <TravelerCategory>
                <CategoryHeader>
                    <CategoryTitle>Infants</CategoryTitle>
                    <CategorySubtitle>Under 2</CategorySubtitle>
                </CategoryHeader>
                <CounterContainer>
                    <CounterControls>
                        <CounterButton
                            type="button"
                            disabled={infants <= 0}
                            onClick={() => handleTravelerChange('infants', -1)}
                        >
                            <MinusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                        <CounterValue>{infants}</CounterValue>
                        <CounterButton
                            type="button"
                            disabled={infants >= 4}
                            onClick={() => handleTravelerChange('infants', 1)}
                        >
                            <PlusOutlined style={{ fontSize: '14px' }} />
                        </CounterButton>
                    </CounterControls>
                </CounterContainer>
            </TravelerCategory>
        </div>
    );

    return (
        <>
            <SearchForm onSubmit={handleSubmit}>
                <InputWrapper>
                    <div className="input-icon">
                        <FaMapMarkerAlt />
                    </div>
                    <StyledSelect
                        value={destination || undefined}
                        placeholder="Where are you going?"
                        onChange={handleDestinationChange}
                        options={destinationOptions}
                        suffixIcon={<DownOutlined />}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase()) ||
                            (option?.value?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                        }
                    />
                </InputWrapper>

                <InputWrapper>
                    <div className="input-icon">
                        <FaCalendarAlt />
                    </div>
                    <StyledRangePicker
                        value={getDateValues}
                        format="DD MMM YYYY"
                        onChange={handleDateChange}
                        placeholder={['Start date', 'End date']}
                        size="large"
                    />
                </InputWrapper>

                <InputWrapper>
                    <div className="input-icon">
                        <FaUser />
                    </div>
                    <Dropdown
                        popupRender={() => travelersDropdownContent}
                        placement="bottomLeft"
                        trigger={['click']}
                        open={showTravelersDropdown}
                        onOpenChange={handleTravelersVisibleChange}
                        overlayStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 9999,
                        }}
                    >
                        <DropdownButton type="button" className={showTravelersDropdown ? 'active' : ''}>
                            <span style={{ color: travelers ? 'inherit' : '#999' }}>{travelers || 'Travelers'}</span>
                            <DownOutlined className="dropdown-icon" />
                        </DropdownButton>
                    </Dropdown>
                </InputWrapper>

                <SearchButton variant="primary" type="submit" size="md">
                    <FaSearch size={20} />
                </SearchButton>
            </SearchForm>
        </>
    );
}
