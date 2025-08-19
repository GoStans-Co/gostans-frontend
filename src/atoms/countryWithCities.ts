import { atom } from 'recoil';

export type City = {
    id: number;
    name: string;
    imageUrl?: string;
};

export type CountryWithCities = {
    id: number;
    name: string;
    cities: City[];
};

export type CountriesWithCitiesState = {
    data: CountryWithCities[] | null;
    lastFetch: number | null;
};

export const countriesWithCitiesAtom = atom<CountriesWithCitiesState>({
    key: 'countriesWithCitiesAtom',
    default: {
        data: null,
        lastFetch: null,
    },
});
