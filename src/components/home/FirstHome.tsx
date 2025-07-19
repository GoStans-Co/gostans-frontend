import styled from 'styled-components';
import { FaBed, FaMountain, FaSuitcase } from 'react-icons/fa';
import uzb1 from '@/assets/uzb.jpg';
import uzb2 from '@/assets/uzb2.jpg';
import uzb3 from '@/assets/uzb3.jpg';
import uzb4 from '@/assets/uzb4.jpg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import {
    useDefaultSearchValues,
    useSearchActions,
    useSearchData,
    useSearchUIState,
} from '@/hooks/utils/useSearchActions';

type IconBoxProps = {
    active?: boolean;
};

const HeroContainer = styled.div`
    position: relative;
    height: auto;
    padding: 2rem 2rem;
    background-color: ${({ theme }) => theme.colors.grayBackground};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: visible;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        overflow: hidden;
    }
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    width: 50%;
    max-width: 600px;
    text-align: left;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        text-align: center;
        z-index: 1;
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
    grid-template-rows: repeat(3, auto);
    gap: 1rem;
    width: 45%;
    position: relative;
    z-index: 1;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        margin-top: 2rem;
        z-index: 1;
    }
`;

const ImageContainer = styled.div`
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:nth-child(1) {
        grid-column: 1;
        grid-row: 1;
        height: 160px;
    }

    &:nth-child(2) {
        grid-column: 2;
        grid-row: 1 / 3;
        height: 340px;
    }

    &:nth-child(3) {
        grid-column: 1;
        grid-row: 2 / 5;
        height: 340px;
    }

    &:nth-child(4) {
        grid-column: 2;
        grid-row: 3;
        height: 160px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

const SearchBarWrapper = styled.div`
    width: 100%;
    margin-top: 2rem;
    position: relative;
    z-index: 10;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 140%;
        transform: translateX(0);
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

export default function FirstHome() {
    const navigate = useNavigate();

    const searchData = useSearchData();
    const uiState = useSearchUIState();
    const { initializeDefaults } = useDefaultSearchValues();
    const searchActions = useSearchActions();

    useEffect(() => {
        if (!searchData.destination) {
            initializeDefaults();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (searchData.destination) searchParams.set('destination', searchData.destination);
        if (searchData.dates) searchParams.set('dates', searchData.dates);
        if (searchData.travelers) searchParams.set('travelers', searchData.travelers);

        navigate(`/searchTrips?${searchParams.toString()}`);
    };

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
                    <SearchBar
                        data={searchData}
                        handlers={{
                            onDestinationChange: searchActions.handleDestinationChange,
                            onDatesChange: searchActions.handleDatesChange,
                            onTravelersChange: searchActions.handleTravelersChange,
                            onTravelerCountChange: searchActions.handleTravelerCountChange,
                            onSubmit: handleSubmit,
                        }}
                        showTravelersDropdown={uiState.showTravelersDropdown}
                        onTravelersDropdownToggle={searchActions.handleTravelersDropdownToggle}
                    />
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
