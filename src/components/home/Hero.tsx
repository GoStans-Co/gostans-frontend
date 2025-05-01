import styled from 'styled-components';
import SearchBar from './SearchBar';
import { FaBed, FaMountain, FaSuitcase } from 'react-icons/fa';

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

export default function Hero() {
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
                    <SearchBar />
                </SearchBarWrapper>
            </HeroContent>
            <ImagesGrid>
                <ImageContainer>
                    <img
                        src="/src/assets/uzb.jpg"
                        alt="Destination"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </ImageContainer>
                <ImageContainer>
                    <img
                        src="/src/assets/uzb2.jpg"
                        alt="Destination"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </ImageContainer>
                <ImageContainer>
                    <img
                        src="/src/assets/uzb3.jpg"
                        alt="Destination"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </ImageContainer>
                <ImageContainer>
                    <img
                        src="/src/assets/uzb4.jpg"
                        alt="Destination"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </ImageContainer>
            </ImagesGrid>
        </HeroContainer>
    );
}
