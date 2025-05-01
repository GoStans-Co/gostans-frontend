import { DestinationProps } from '@/components/Destinations/DestinationCard';
import { TourProps, AccommodationProps } from '../types';

export const tours: TourProps[] = [
    {
        id: 'tour-1',
        title: 'Turkmenistan Classic Tour',
        description:
            'Experience the rich cultural heritage and stunning landscapes of Turkmenistan on this immersive tour.',
        price: 89,
        image: 'https://plus.unsplash.com/premium_photo-1697730009726-4ddf244ff653?q=80&w=3176&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        country: 'Turkmenistan',
        days: 7,
        rating: 4.8,
    },
    {
        id: 'tour-2',
        title: 'Uzbekistan Silk Road Adventure',
        description:
            'Follow the ancient Silk Road through Uzbekistan, exploring historic cities and cultural landmarks.',
        price: 129,
        image: 'https://images.unsplash.com/photo-1671054522980-206498bf4ed6?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        country: 'Uzbekistan',
        days: 10,
        rating: 4.9,
    },
    {
        id: 'tour-3',
        title: 'Kazakhstan Nature Expedition',
        description: "Discover Kazakhstan's diverse natural beauty, from mountains to steppes to stunning lakes.",
        price: 149,
        image: 'https://images.unsplash.com/photo-1559586616-361e18714958?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        country: 'Kazakhstan',
        days: 8,
        rating: 4.7,
    },
    {
        id: 'tour-4',
        title: 'Kyrgyzstan Mountain Trek',
        description:
            "Trek through Kyrgyzstan's majestic mountains and experience nomadic culture in traditional yurts.",
        price: 159,
        image: 'https://images.unsplash.com/photo-1588405751085-2ee36bb4f3cf?q=80&w=3267&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        country: 'Kyrgyzstan',
        days: 12,
        rating: 4.9,
    },
    {
        id: 'tour-5',
        title: 'Tajikistan Alpine Adventure',
        description:
            "Explore Tajikistan's stunning mountain landscapes, remote villages, and vibrant cultural heritage.",
        price: 139,
        image: 'https://images.unsplash.com/photo-1559586616-361e18714958?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        country: 'Tajikistan',
        days: 9,
        rating: 4.6,
    },
    {
        id: 'tour-6',
        title: 'Central Asia Highlights',
        description: 'A comprehensive tour covering the highlights of Uzbekistan, Kazakhstan, and Kyrgyzstan.',
        price: 259,
        image: 'https://images.unsplash.com/photo-1669664321853-da5e271e7591?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        country: 'Multiple',
        days: 14,
        rating: 4.9,
    },
];

// Sample data for destinations
export const destinations: DestinationProps[] = [
    {
        id: 'uzbekistan-bukhara',
        name: 'Bukhara',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        toursCount: 25,
    },
    {
        id: 'uzbekistan-samarkand',
        name: 'Samarkand',
        image: 'https://images.unsplash.com/photo-1659651117607-d2b397cf100f?q=80&w=3046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        toursCount: 30,
    },
    {
        id: 'turkmenistan-ashgabat',
        name: 'Ashgabat',
        image: 'https://images.unsplash.com/photo-1572940734104-684309ed7ac9?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        toursCount: 15,
    },
    {
        id: 'kazakhstan-almaty',
        name: 'Almaty',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        toursCount: 22,
    },
    {
        id: 'kyrgyzstan-bishkek',
        name: 'Bishkek',
        image: 'https://images.unsplash.com/photo-1623661885790-67640e1e6b21?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        toursCount: 18,
    },
    {
        id: 'tajikistan-dushanbe',
        name: 'Dushanbe',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        toursCount: 12,
    },
];

// Sample data for accommodations
export const accommodations: AccommodationProps[] = [
    {
        id: 'acc-1',
        name: 'Silk Road Hotel',
        description:
            'Luxurious accommodation in the heart of Bukhara with traditional architecture and modern amenities.',
        price: 79,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Bukhara, Uzbekistan',
        rating: 4.8,
    },
    {
        id: 'acc-2',
        name: 'Registan Plaza',
        description: "Elegant hotel with stunning views of Samarkand's famous Registan Square and historic monuments.",
        price: 89,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Samarkand, Uzbekistan',
        rating: 4.9,
    },
    {
        id: 'acc-3',
        name: 'Ashgabat Grand Hotel',
        description:
            "Modern luxury hotel in Turkmenistan's capital with opulent marble interiors and excellent amenities.",
        price: 99,
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Ashgabat, Turkmenistan',
        rating: 4.7,
    },
    {
        id: 'acc-4',
        name: 'Almaty Mountain Lodge',
        description:
            'Cozy mountain retreat with stunning views of the Tian Shan mountains and easy access to hiking trails.',
        price: 89,
        image: 'https://images.unsplash.com/photo-1572940734104-684309ed7ac9?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'Almaty, Kazakhstan',
        rating: 4.6,
    },
];
