import styled from 'styled-components';
import { FaBed, FaCalendarAlt, FaMapMarkerAlt, FaMountain, FaSearch, FaSuitcase, FaUser } from 'react-icons/fa';
import uzb1 from '@/assets/uzb.jpg';
import uzb2 from '@/assets/uzb2.jpg';
import uzb3 from '@/assets/uzb3.jpg';
import uzb4 from '@/assets/uzb4.jpg';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useEffect, useRef, useState } from 'react';

type IconBoxProps = {
    active?: boolean;
};

const HeroContainer = styled.div`
    position: relative;
    height: auto;
    padding: 4rem 2rem;
    background-color: ${({ theme }) => theme.colors.grayBackground};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 1;
    width: 50%;
    max-width: 600px;
    text-align: left;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        text-align: center;
    }
`;

const Title = styled.h1`
    font-size: 57px;
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: 1rem;
    color: black;
    line-height: 64px;
    letter-spacing: -0.25px;
`;

const ImagesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: 1fr;
    gap: 1rem;
    width: 45%;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        margin-top: 2rem;
    }
`;

const SearchBarWrapper = styled.div`
    width: 100%;
    margin-top: 2rem;
`;

const ImageContainer = styled.div`
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow: hidden;

    &:nth-child(1) {
        grid-column: 1;
        grid-row: 1;
        height: 140px;
    }

    &:nth-child(2) {
        grid-column: 2;
        grid-row: 1/3;
        height: 250px;
    }

    &:nth-child(3) {
        grid-column: 1;
        grid-row: 2/4;
        height: 250px;
    }

    &:nth-child(4) {
        grid-column: 2;
        grid-row: 3;
        height: 150px;
    }
`;

const CategoryIcons = styled.div`
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
`;

const CategoryItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
`;
const IconBox = styled.div<IconBoxProps>`
    width: 60px;
    height: 60px;
    background-color: ${(props) => (props.active ? props.theme.colors.primary : 'white')};
    color: ${(props) => (props.active ? 'white' : props.theme.colors.text)};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.default};
    box-shadow: ${(props) => (props.active ? 'none' : props.theme.shadows.sm)};
`;

const Subtitle = styled.p`
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    opacity: 0.9;
    color: black;
    text-align: left;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 1rem;
    }
`;

type SearchBarProps = {
    destination: string;
    dates: string;
    travelers: string;
    destinationRef: React.RefObject<HTMLDivElement | null>;
    datesRef: React.RefObject<HTMLDivElement | null>;
    travelersRef: React.RefObject<HTMLDivElement | null>;
    onDestinationClick: (e: React.MouseEvent) => void;
    onDatesClick: (e: React.MouseEvent) => void;
    onTravelersClick: (e: React.MouseEvent) => void;
    onSubmit: (values: { destination: string; dates: string; travelers: string }) => void;
};

const SearchForm = styled.form`
    display: flex;
    flex-direction: column;
    position: relative;
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
    flex-shrink: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        border-radius: 0;
    }
`;

const InputWrapper = styled.div`
    flex: 1;
    position: relative;

    &:not(:last-child) {
        border-right: 1px solid ${({ theme }) => theme.colors.border};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        border-right: none;

        &:not(:last-child) {
            border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        }
    }
`;

const StyledInputWrapper = styled(InputWrapper)`
    .input-container {
        background: transparent;
        border: none;
    }

    input {
        background: transparent;
        border: none !important;
        padding-left: 3rem;
    }
`;

const PopupContainer = styled.div<{
    $isOpen: boolean;
    $position?: { top: number; left: number; width: number };
    $isCalendar?: boolean;
}>`
    position: fixed; // Keep this as fixed
    top: ${(props) => (props.$position ? `${props.$position.top}px` : '56px')};
    left: ${(props) => (props.$position ? `${props.$position.left}px` : '0')};
    z-index: 9999;
    width: ${(props) => (props.$isCalendar ? '600px' : props.$position ? `${props.$position.width}px` : '300px')};
    max-height: 450px;
    overflow-y: auto;
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    padding: ${({ theme }) => theme.spacing.md};
`;

const RegionContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
        border-bottom: none;
    }
`;

const RegionTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LocationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const LocationItem = styled.li`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const LocationIcon = styled.span`
    display: flex;
    align-items: center;
    margin-right: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const LocationName = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
`;

const CalendarContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 16px;
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

const MonthContainer = styled.div`
    flex: 1;
    min-width: 250px;
    padding: 0 8px;
`;

const MonthHeader = styled.div`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const WeekdaysRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const DaysGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

const DayCell = styled.div<{ $isToday?: boolean; $isSelected?: boolean; $isInRange?: boolean; $isDisabled?: boolean }>`
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
    border-radius: 50%;
    background-color: ${(props) =>
        props.$isSelected
            ? props.theme.colors.primary
            : props.$isInRange
              ? props.theme.colors.lightBackground
              : 'transparent'};
    color: ${(props) =>
        props.$isSelected ? 'white' : props.$isDisabled ? props.theme.colors.border : props.theme.colors.text};
    font-weight: ${(props) => (props.$isToday ? props.theme.typography.fontWeight.bold : 'normal')};
    margin: 0 auto;

    &:hover {
        background-color: ${(props) =>
            props.$isDisabled
                ? 'transparent'
                : props.$isSelected
                  ? props.theme.colors.primary
                  : props.theme.colors.lightBackground};
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`;

const TravelerCategory = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`;

const CategoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CategoryTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
`;

const CategorySubtitle = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin: 0;
    color: ${({ theme }) => theme.colors.lightText};
`;

const CounterContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.sm};
    justify-content: space-between;
`;

const CounterButton = styled.button<{ $disabled?: boolean }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme, $disabled }) => ($disabled ? theme.colors.background : 'white')};
    border: 1px solid ${({ theme, $disabled }) => ($disabled ? theme.colors.border : theme.colors.primary)};
    color: ${({ theme, $disabled }) => ($disabled ? theme.colors.border : theme.colors.primary)};
    font-size: ${({ theme }) => theme.fontSizes.md};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background: ${({ theme, $disabled }) =>
            $disabled ? theme.colors.lightBackground : theme.colors.lightBackground};
    }
`;

const CounterValue = styled.span`
    margin: 0 ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    min-width: 30px;
    text-align: center;
`;

const CounterControls = styled.div`
    display: flex;
    align-items: center;
`;

const ApplyButton = styled(Button)`
    margin-top: ${({ theme }) => theme.spacing.md};
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

export default function FirstHome() {
    const [destination, setDestination] = useState('Uzbekistan');
    const [dates, setDates] = useState('02 Jan 2025 ~ 04 Jan 2025');
    const [travelers, setTravelers] = useState('2 adults, 2 children');

    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(2);

    const [startDate, setStartDate] = useState<Date>(new Date(2025, 0, 2));
    const [endDate, setEndDate] = useState<Date>(new Date(2025, 0, 4));
    const [selectingStartDate, setSelectingStartDate] = useState(true);

    const [activePopup, setActivePopup] = useState<string | null>(null);

    const destinationRef = useRef<HTMLDivElement | null>(null);
    const datesRef = useRef<HTMLDivElement | null>(null);
    const travelersRef = useRef<HTMLDivElement | null>(null);

    const getPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            return {
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            };
        }
        return { top: 0, left: 0, width: 300 };
    };

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

    const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const generateCalendarForMonth = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        const totalCells = Math.ceil(days.length / 7) * 7;
        while (days.length < totalCells) {
            days.push(null);
        }

        return days;
    };
    const isDateInRange = (date: Date) => {
        return date >= startDate && date <= endDate;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handleDateClick = (date: Date) => {
        if (selectingStartDate) {
            setStartDate(date);
            setEndDate(date);
            setSelectingStartDate(false);
        } else {
            if (date < startDate) {
                setStartDate(date);
                setEndDate(startDate);
            } else {
                setEndDate(date);
                setSelectingStartDate(true);
                updateDateString(startDate, date);
            }
        }
    };

    const updateDateString = (start: Date, end: Date) => {
        const formatDate = (date: Date) => {
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${day < 10 ? '0' + day : day} ${month} ${year}`;
        };

        setDates(`${formatDate(start)} ~ ${formatDate(end)}`);
    };

    const handleAdultsChange = (amount: number) => {
        const newValue = adults + amount;
        if (newValue >= 1 && newValue <= 10) {
            setAdults(newValue);
            updateTravelersString(newValue, children);
        }
    };

    const handleChildrenChange = (amount: number) => {
        const newValue = children + amount;
        if (newValue >= 0 && newValue <= 6) {
            setChildren(newValue);
            updateTravelersString(adults, newValue);
        }
    };

    const updateTravelersString = (adultCount: number, childCount: number) => {
        let travelersStr = `${adultCount} adult${adultCount !== 1 ? 's' : ''}`;
        if (childCount > 0) {
            travelersStr += `, ${childCount} ${childCount === 1 ? 'child' : 'children'}`;
        }
        setTravelers(travelersStr);
    };

    const handleDestinationClick = () => {
        if (activePopup === 'destination') {
            setActivePopup(null);
        } else {
            // here we force the position recalculation on every open
            setActivePopup('destination');
        }
    };

    useEffect(() => {
        console.log('activePopup changed to:', activePopup);
    }, [activePopup]);

    const handleDatesClick = () => {
        if (activePopup === 'dates') {
            setActivePopup(null);
        } else {
            setActivePopup('dates');
        }
    };

    const handleTravelersClick = () => {
        if (activePopup === 'travelers') {
            setActivePopup(null);
        } else {
            setActivePopup('travelers');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            destination,
            dates,
            travelers,
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                activePopup === 'destination' &&
                destinationRef.current &&
                !destinationRef.current.contains(event.target as Node)
            ) {
                setActivePopup(null);
            } else if (
                activePopup === 'dates' &&
                datesRef.current &&
                !datesRef.current.contains(event.target as Node)
            ) {
                setActivePopup(null);
            } else if (
                activePopup === 'travelers' &&
                travelersRef.current &&
                !travelersRef.current.contains(event.target as Node)
            ) {
                setActivePopup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        const handleScroll = () => {
            if (activePopup) {
                setActivePopup(null);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activePopup]);

    const currentMonth = new Date(startDate).getMonth();
    const currentYear = new Date(startDate).getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    const daysInCurrentMonth = generateCalendarForMonth(currentYear, currentMonth);
    const daysInNextMonth = generateCalendarForMonth(nextMonthYear, nextMonth);

    return (
        <HeroContainer>
            <HeroContent>
                <Title>Discover The Best Lovely Places</Title>
                <Subtitle>
                    Let's find your dream destinations here we will recommend you a beautiful place and a cheap trip
                    with your beloved family.
                </Subtitle>
                <CategoryIcons>
                    <CategoryItem>
                        <IconBox active={true}>
                            <FaSuitcase size={24} />
                        </IconBox>
                        <span style={{ color: 'black', fontWeight: 500 }}>Tours</span>
                    </CategoryItem>
                    <CategoryItem>
                        <IconBox>
                            <FaBed size={24} />
                        </IconBox>
                        <span style={{ color: 'black' }}>Hotels</span>
                    </CategoryItem>
                    <CategoryItem>
                        <IconBox>
                            <FaMountain size={24} />
                        </IconBox>
                        <span style={{ color: 'black' }}>Activities</span>
                    </CategoryItem>
                </CategoryIcons>
                <SearchBarWrapper>
                    <SearchBarContainer>
                        <SearchForm onSubmit={handleSubmit}>
                            <InputGrid>
                                <StyledInputWrapper ref={destinationRef}>
                                    <Input
                                        placeholder="Where are you going?"
                                        value={destination}
                                        icon={<FaMapMarkerAlt />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDestinationClick();
                                        }}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            handleDestinationClick();
                                        }}
                                        inputConfig={{
                                            noBorder: true,
                                            variant: 'filled',
                                            size: 'md',
                                            fullWidth: true,
                                        }}
                                    />
                                    {activePopup === 'destination' && (
                                        <PopupContainer
                                            $isOpen={activePopup === 'destination'}
                                            $position={getPosition(destinationRef)}
                                        >
                                            {regions.map((region) => (
                                                <RegionContainer key={region.name}>
                                                    <RegionTitle>{region.name}</RegionTitle>
                                                    <LocationList>
                                                        {region.cities.map((city) => (
                                                            <LocationItem
                                                                key={city}
                                                                onClick={() => {
                                                                    setDestination(city);
                                                                    setActivePopup(null);
                                                                }}
                                                            >
                                                                <LocationIcon>
                                                                    <FaMapMarkerAlt size={14} />
                                                                </LocationIcon>
                                                                <LocationName>{city}</LocationName>
                                                            </LocationItem>
                                                        ))}
                                                    </LocationList>
                                                </RegionContainer>
                                            ))}
                                        </PopupContainer>
                                    )}
                                </StyledInputWrapper>

                                <StyledInputWrapper ref={datesRef}>
                                    <Input
                                        placeholder="Select dates"
                                        value={dates}
                                        icon={<FaCalendarAlt />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDatesClick();
                                        }}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            handleDatesClick();
                                        }}
                                        inputConfig={{
                                            noBorder: true,
                                            variant: 'outlined',
                                            size: 'md',
                                            fullWidth: true,
                                        }}
                                    />
                                    {activePopup === 'dates' && (
                                        <PopupContainer
                                            $isOpen={activePopup === 'dates'}
                                            $position={getPosition(datesRef)}
                                            $isCalendar={true}
                                        >
                                            <CalendarContainer>
                                                <MonthContainer>
                                                    <MonthHeader>
                                                        {MONTHS[currentMonth]} {currentYear}
                                                    </MonthHeader>
                                                    <WeekdaysRow>
                                                        {DAYS.map((day) => (
                                                            <div key={day}>{day}</div>
                                                        ))}
                                                    </WeekdaysRow>
                                                    <DaysGrid>
                                                        {daysInCurrentMonth.map((day, index) => (
                                                            <DayCell
                                                                key={index}
                                                                $isToday={day ? isToday(day) : false}
                                                                $isSelected={
                                                                    day
                                                                        ? day.getTime() === startDate.getTime() ||
                                                                          day.getTime() === endDate.getTime()
                                                                        : false
                                                                }
                                                                $isInRange={day ? isDateInRange(day) : false}
                                                                $isDisabled={!day}
                                                                onClick={() => day && handleDateClick(day)}
                                                            >
                                                                {day ? day.getDate() : ''}
                                                            </DayCell>
                                                        ))}
                                                    </DaysGrid>
                                                </MonthContainer>

                                                <MonthContainer>
                                                    <MonthHeader>
                                                        {MONTHS[nextMonth]} {nextMonthYear}
                                                    </MonthHeader>
                                                    <WeekdaysRow>
                                                        {DAYS.map((day) => (
                                                            <div key={day}>{day}</div>
                                                        ))}
                                                    </WeekdaysRow>
                                                    <DaysGrid>
                                                        {daysInNextMonth.map((day, index) => (
                                                            <DayCell
                                                                key={index}
                                                                $isToday={day ? isToday(day) : false}
                                                                $isSelected={
                                                                    day
                                                                        ? day.getTime() === startDate.getTime() ||
                                                                          day.getTime() === endDate.getTime()
                                                                        : false
                                                                }
                                                                $isInRange={day ? isDateInRange(day) : false}
                                                                $isDisabled={!day}
                                                                onClick={() => day && handleDateClick(day)}
                                                            >
                                                                {day ? day.getDate() : ''}
                                                            </DayCell>
                                                        ))}
                                                    </DaysGrid>
                                                </MonthContainer>
                                            </CalendarContainer>

                                            <ButtonsContainer>
                                                <Button variant="primary" onClick={() => setActivePopup(null)}>
                                                    Apply
                                                </Button>
                                            </ButtonsContainer>
                                        </PopupContainer>
                                    )}
                                </StyledInputWrapper>

                                <StyledInputWrapper ref={travelersRef}>
                                    <Input
                                        placeholder="Travelers"
                                        value={travelers}
                                        icon={<FaUser />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTravelersClick();
                                        }}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            handleTravelersClick();
                                        }}
                                        inputConfig={{
                                            noBorder: true,
                                            variant: 'outlined',
                                            size: 'md',
                                            fullWidth: true,
                                        }}
                                    />
                                    {activePopup === 'travelers' && (
                                        <PopupContainer
                                            $isOpen={activePopup === 'travelers'}
                                            $position={getPosition(travelersRef)}
                                        >
                                            <TravelerCategory>
                                                <CategoryHeader>
                                                    <div>
                                                        <CategoryTitle>Adults</CategoryTitle>
                                                        <CategorySubtitle>Ages 13 or above</CategorySubtitle>
                                                    </div>
                                                </CategoryHeader>
                                                <CounterContainer>
                                                    <CounterControls>
                                                        <CounterButton
                                                            onClick={() => handleAdultsChange(-1)}
                                                            $disabled={adults <= 1}
                                                        >
                                                            <div color="currentColor">-</div>
                                                        </CounterButton>
                                                        <CounterValue>{adults}</CounterValue>
                                                        <CounterButton
                                                            onClick={() => handleAdultsChange(1)}
                                                            $disabled={adults >= 10}
                                                        >
                                                            <div color="currentColor"> + </div>
                                                        </CounterButton>
                                                    </CounterControls>
                                                </CounterContainer>
                                            </TravelerCategory>

                                            <TravelerCategory>
                                                <CategoryHeader>
                                                    <div>
                                                        <CategoryTitle>Children</CategoryTitle>
                                                        <CategorySubtitle>Ages 2-12</CategorySubtitle>
                                                    </div>
                                                </CategoryHeader>
                                                <CounterContainer>
                                                    <CounterControls>
                                                        <CounterButton
                                                            onClick={() => handleChildrenChange(-1)}
                                                            $disabled={children <= 0}
                                                        >
                                                            <div color="currentColor">-</div>
                                                        </CounterButton>
                                                        <CounterValue>{children}</CounterValue>
                                                        <CounterButton
                                                            onClick={() => handleChildrenChange(1)}
                                                            $disabled={children >= 6}
                                                        >
                                                            <div color="currentColor">+</div>
                                                        </CounterButton>
                                                    </CounterControls>
                                                </CounterContainer>
                                            </TravelerCategory>

                                            <ApplyButton variant="primary" onClick={() => setActivePopup(null)}>
                                                Apply
                                            </ApplyButton>
                                        </PopupContainer>
                                    )}
                                </StyledInputWrapper>

                                <SearchBarButton variant="primary" type="submit">
                                    <FaSearch size={20} />
                                </SearchBarButton>
                            </InputGrid>
                        </SearchForm>
                    </SearchBarContainer>
                </SearchBarWrapper>
            </HeroContent>
            <ImagesGrid>
                <ImageContainer>
                    <img src={uzb1} alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </ImageContainer>
                <ImageContainer>
                    <img src={uzb2} alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </ImageContainer>
                <ImageContainer>
                    <img src={uzb3} alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </ImageContainer>
                <ImageContainer>
                    <img src={uzb4} alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </ImageContainer>
            </ImagesGrid>
        </HeroContainer>
    );
}
