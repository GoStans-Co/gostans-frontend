import { useQuery } from '@tanstack/react-query';
import { useApiServices } from '@/services/api';

export const USER_PROFILE_KEY = ['user', 'profile'];

export function useUserProfileQuery() {
    const { user: userService } = useApiServices();

    return useQuery({
        queryKey: USER_PROFILE_KEY,
        queryFn: async () => {
            const response = await userService.getUserProfile();
            return response;
        },
        /* we only fetch user profile if the user is authenticated */
        enabled: !!document.cookie.includes('authToken'),
    });
}
