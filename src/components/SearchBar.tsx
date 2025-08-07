import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { DatePicker, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Button from '@/components/Common/Button';
import dayjs from 'dayjs';
import { COUNTRY_WITH_CITIES } from '@/constants/countryWithCities';

const { RangePicker } = DatePicker;

export type SearchBarData = {
    destination: string;
    dates: string;
    travelers: string;
};

export type SearchBarHandlers = {
    onDestinationChange?: (value: string) => void;
    onDatesChange?: (value: string) => void;
    onTravelersChange?: (value: string) => void;
    onSubmit?: (e: React.FormEvent) => void;
};

export type SearchBarProps = {
    data: SearchBarData;
    handlers?: SearchBarHandlers;
};

const SearchForm = styled.form`
    display: flex;
    gap: 0;
    align-items: stretch;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: white;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    height: 56px;
    position: relative;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        height: auto;
        min-width: auto;
        border-radius: ${({ theme }) => theme.borderRadius.md};
        width: calc(100vw - 2rem);
        max-width: calc(100vw - 2rem);
        box-sizing: border-box;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(10px);

        & > div {
            width: 100%;
            border-right: none !important;
            border-bottom: 1px solid ${({ theme }) => theme.colors.border};
            height: 48px;

            &:last-child {
                border-bottom: none;
            }
        }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        border-right: none;
        width: 100%;
        box-sizing: border-box;
        height: 48px;

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

        ${({ theme }) => theme.responsive.maxMobile} {
            left: 0.75rem;
            font-size: 14px;
        }
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

        ${({ theme }) => theme.responsive.maxMobile} {
            height: 48px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
        }
    }

    .ant-select-selection-item {
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.colors.text};
        font-size: 14px;

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: 13px;
        }
    }

    .ant-select-selection-placeholder {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 14px;

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: 13px;
        }
    }

    .ant-select-arrow {
        color: ${({ theme }) => theme.colors.lightText};
        right: 1rem;

        ${({ theme }) => theme.responsive.maxMobile} {
            right: 0.75rem;
        }
    }

    .ant-select-clear {
        right: 2.5rem;
        color: ${({ theme }) => theme.colors.lightText};
        background: transparent;

        &:hover {
            color: ${({ theme }) => theme.colors.text};
        }

        ${({ theme }) => theme.responsive.maxMobile} {
            right: 2rem;
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

        ${({ theme }) => theme.responsive.maxMobile} {
            height: 48px;
            padding: 0 0.75rem 0 2.5rem !important;
        }
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

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: 13px !important;
        }
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

const SearchButtonContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    span {
        display: none;

        ${({ theme }) => theme.responsive.maxMobile} {
            display: inline;
            font-size: ${({ theme }) => theme.fontSizes.md};
            font-weight: 500;
        }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        height: 48px;
        border-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        padding: 0 16px;
        background: linear-gradient(
            135deg,
            ${({ theme }) => theme.colors.primary},
            ${({ theme }) => theme.colors.secondary}
        );
        font-weight: 600;
    }
`;

const regions = COUNTRY_WITH_CITIES.map((region) => ({
    name: region.name,
    cities: region.cities.map((city) => city).sort((a, b) => a.localeCompare(b)),
}));

/**
 * SearchBar - Molecule Component
 * This component is used to search for tours based on destination and dates.
 * It includes a dropdown for selecting a destination, a date range picker, and a search button.
 * It also handles the submission of the search form and the selection of destination and dates.
 */
export default function SearchBar({ data, handlers = {} }: SearchBarProps) {
    const { destination, dates } = data;
    const { onDestinationChange, onDatesChange, onSubmit } = handlers;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    const handleDestinationChange = (value: unknown) => {
        onDestinationChange?.(value as string);
    };

    const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            const [start, end] = dates;
            const formatDate = (date: dayjs.Dayjs) => {
                return date.format('DD MMM YYYY');
            };
            const dateString = `${formatDate(start)} ~ ${formatDate(end)}`;
            onDatesChange?.(dateString);
        } else {
            onDatesChange?.('');
        }
    };

    const destinationOptions = [
        ...regions.map((region) => ({
            label: <span style={{ fontWeight: 600 }}>{region.name}</span>,
            title: region.name,
            options: region.cities.map((city) => ({
                label: city,
                value: city,
            })),
        })),
    ];

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
                        notFoundContent={null}
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

                <SearchButton variant="primary" type="submit" size="md">
                    <SearchButtonContent>
                        <FaSearch size={20} />
                        <span>Search Tours</span>
                    </SearchButtonContent>
                </SearchButton>
            </SearchForm>
        </>
    );
}
