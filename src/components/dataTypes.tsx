import { NoDataType } from '@/components/common/NoDataFound';
import { FaSearch, FaExclamationTriangle, FaInbox, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function getDefaultContent(type: NoDataType) {
    const defaults = {
        search: {
            icon: <FaSearch />,
            title: 'No results found',
            message: 'No tours found matching your criteria. Try adjusting your filters or search terms.',
            buttonText: 'Clear Filters',
        },
        error: {
            icon: <FaExclamationTriangle />,
            title: 'Something went wrong',
            message: 'We encountered an error while loading your data. Please try again.',
            buttonText: 'Try Again',
        },
        empty: {
            icon: <FaInbox />,
            title: 'Nothing here yet',
            message: 'There are no items to display at the moment.',
            buttonText: 'Refresh',
        },
        location: {
            icon: <FaMapMarkerAlt />,
            title: 'No locations found',
            message: "We couldn't find any results for this location. Try searching for a different destination.",
            buttonText: 'Search Again',
        },
        date: {
            icon: <FaCalendarAlt />,
            title: 'No availability',
            message: 'There are no tours available for your selected dates. Try different dates or destinations.',
            buttonText: 'Change Dates',
        },
        general: {
            icon: <FaInbox />,
            title: 'No data available',
            message: 'There is no data to display at this time.',
            buttonText: 'Refresh',
        },
    };

    return defaults[type] || defaults.general;
}
